# ADR 0003 — Architecture Adapters + registry

- **Statut** : Accepté
- **Date** : 2026-07-13
- **Décideurs** : équipe Nexum (EIP PROMO 2028)
- **Concerne** : `nexum-core` (trait `Adapter`, `ActionRegistry`), `nexum-adapters`

---

## Contexte

Nexum se veut **agnostique** et **extensible** : il doit orchestrer des marques concurrentes (Philips Hue, SteelSeries, Logitech, Corsair…), plusieurs OS (Windows, Linux, macOS bonus) et des domaines variés (système, audio, affichage, gaming, IoT, périphériques). Le brief l'annonce comme la base d'un futur **SDK public**.

Deux contraintes fortes s'ajoutent :

1. **Le cœur doit rester OS-agnostique et testable** — c'est là qu'est la valeur, et c'est un atout pour le Bloc RNCP 5 (QA en CI sans matériel).
2. **Ajouter une intégration ne doit pas déstabiliser le moteur** — le volume d'intégrations potentielles est énorme (centaines) ; on veut de l'ajout **incrémental**.

Comment introduire du **code spécifique OS/marque** sans le laisser contaminer le moteur, tout en gardant l'ensemble testable et ouvert à l'extension ?

## Décision

Nous adoptons le **pattern Adapter** couplé à un **registry** d'actions.

**1. Un trait `Adapter`** (dans `nexum-core`) est le contrat de toute intégration :

```rust
#[async_trait]
pub trait Adapter: Send + Sync {
    fn name(&self) -> &str;
    fn supported_actions(&self) -> Vec<String>;      // ex. ["audio.set_volume"]
    async fn is_available(&self) -> Capability;       // HW/API dispo maintenant ?
    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError>; // sans effet de bord
    async fn execute(&self, step: &ActionStep, ctx: &ExecContext)      // respecte ctx.dry_run
        -> Result<ActionOutcome, AdapterError>;
}
```

**2. Un `ActionRegistry`** mappe chaque `action_type` vers l'adapter qui le gère :

```rust
registry.register(adapter);                    // enregistre pour chaque supported_actions()
registry.resolve("audio.set_volume");          // -> Arc<dyn Adapter>
registry.known_action_types();                 // -> l'allowlist de la Marketplace
```

**3. L'Engine ne connaît que le registry**, jamais les intégrations concrètes. Il résout `action_type → handler` et appelle `execute`. **Ajouter une intégration = écrire un Adapter + l'enregistrer ; l'Engine ne change jamais.**

**4. Isolation OS** : `nexum-core` est pur (aucune I/O système) ; tout le code spécifique vit dans `nexum-adapters`, derrière `#[cfg(target_os = ...)]`. Un `MockAdapter` permet de tester le moteur et de simuler les intégrations non encore branchées.

## Conséquences

### Positives
- **Extensibilité incrémentale** : nouvelle intégration = un fichier d'adapter + un `register()`. Zéro modification du moteur → risque de régression minimal. C'est la **couture (seam) du futur SDK de plugins**.
- **Cœur testable en CI sans matériel** : le moteur se teste avec des `MockAdapter` ; pas besoin d'un pont Hue ou d'une carte son en CI. Atout direct Bloc RNCP 5.
- **Dégradation propre** : `is_available()` permet de détecter qu'un HW/API manque et d'ignorer/signaler le step au lieu de planter — mitigation du risque « dépendance API tierces ».
- **Validation & simulation gratuites** : `validate()` sans effet de bord alimente à la fois les previews, l'IA Mode-as-Code (simulation) et le **scoring Marketplace** ([ADR 0004](./0004-marketplace-sandbox-declaratif.md)).
- **Allowlist dérivée du réel** : `known_action_types()` **est** l'allowlist de sécurité → impossible d'avoir une allowlist désynchronisée des capacités réelles.
- **Cross-platform propre** : une action abstraite (`audio.set_volume`), plusieurs implémentations OS, invisibles pour le mode.

### Négatives / coûts
- **Indirection** : une couche d'abstraction de plus à comprendre ; pour un `action_type` trivial, cela peut sembler verbeux.
- **Cohérence à maintenir** : chaque adapter doit honorer scrupuleusement le contrat (`dry_run` respecté, `validate` sans effet de bord). Un adapter qui triche affaiblit la simulation et le scoring → à couvrir par revue et tests.
- **Granularité des `action_type`** : découper les actions ni trop fin ni trop gros est un travail de conception continu.
- **Résolution « dernier gagne »** : deux adapters déclarant le même `action_type` → le dernier enregistré l'emporte. Simple, mais impose une discipline d'enregistrement.

## Alternatives

- **Gros `match` central dans l'Engine (statu quo du prototype : actions codées en dur)** — *rejeté*. Chaque intégration modifie le cœur → couplage fort, régressions, non testable proprement, ne passe pas à l'échelle des centaines d'intégrations.
- **Plugins dynamiques tiers dès la V1 (`.dll`/`.so` chargées au runtime, ou WASM)** — *rejeté pour la V1*. Ouvre une surface d'exécution de code non fiable (contraire à la thèse de sécurité) et ajoute une complexité (ABI, isolation) prématurée. On garde le trait comme **couture** vers un futur SDK, mais tous les adapters V1 sont compilés par l'équipe.
- **Système d'événements/hooks générique sans typage d'action** — *rejeté*. Perd la validation typée des params, le scoring de risque fiable et l'auto-complétion no-code.
- **Une crate par intégration, sans trait commun** — *rejeté*. Pas de contrat uniforme → l'Engine devrait connaître chaque intégration ; on retombe sur le couplage.
