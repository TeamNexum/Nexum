# ADR 0001 — Modèle Mode/Action déclaratif (DSL partagé)

- **Statut** : Accepté
- **Date** : 2026-07-13
- **Décideurs** : équipe Nexum (EIP PROMO 2028)
- **Concerne** : `nexum-schema`, `nexum-core`, frontend, cloud, Marketplace, IA

---

## Contexte

Le prototype de Nexum souffrait de trois défauts structurels :

1. **Actions factices** — le front affichait 8 actions par mode, le back n'en exécutait que ~3 en dur.
2. **Front et back déconnectés** — `modes.ts` (TypeScript) et les commandes Rust étaient codés en dur, séparément, et se désynchronisaient.
3. **Rien de data-driven ni persistant** — impossible de créer ou d'éditer un mode ; tout était figé dans le code.

Or la promesse produit de Nexum est d'être **no-code, agnostique et extensible**, avec une **Marketplace** de modes partagés et une **IA Mode-as-Code** (langage naturel → mode). Ces quatre exigences — no-code, cross-platform, Marketplace sûre, IA — pointent toutes vers la même question fondatrice : **qu'est-ce qu'un « mode », concrètement, en mémoire et sur le fil ?**

Deux réponses possibles s'opposaient :
- un mode est un **script/programme** (du code exécutable) ;
- un mode est de la **donnée déclarative** (une description, interprétée par un moteur).

## Décision

**Un mode est de la donnée déclarative, jamais du code.** Nous définissons un **DSL interne** — un modèle **Mode / Action** sérialisé en **JSON** — qui est la **source de vérité unique** partagée par tous les composants.

Concrètement :

- Un **Mode** est une séquence ordonnée d'**`ActionStep`**. Chaque step porte un `action_type` **namespacé** (ex. `audio.set_volume`), des `params` typés, un `enabled` et une politique `on_error` (`continue` / `abort`).
- Le schéma est défini **une seule fois** dans la crate **`nexum-schema`**, puis décliné en **structs Rust** (`serde`) et en **types TypeScript** (`packages/schema-ts`).
- Le DSL ne contient **aucune primitive de code** : pas de boucle, pas de condition arbitraire, pas d'expression, pas de script. Uniquement « exécute telle action connue avec tels paramètres ».
- L'exécution est déléguée à un **Engine** qui résout chaque `action_type` vers un **Adapter** via un **registry** (voir [ADR 0003](./0003-architecture-adapters.md)).

Exemple (extrait du plan technique) :

```jsonc
{
  "id": "uuid", "name": "Ranked", "category": "gaming",
  "steps": [
    { "order": 1, "type": "audio.set_volume",      "params": { "percent": 70 }, "on_error": "continue" },
    { "order": 3, "type": "gaming.launch_steam",    "params": { "app_id": "1030300" }, "on_error": "abort" },
    { "order": 5, "type": "system.close_app",       "params": { "name": "Slack" }, "on_error": "continue" }
  ]
}
```

## Conséquences

### Positives
- **No-code réel** : l'éditeur visuel manipule ce JSON ; créer un mode = ajouter des steps depuis un catalogue. Zéro script pour l'utilisateur.
- **Fin de la désynchro front/back** : un schéma unique génère types TS et structs Rust. Le défaut n°2 du prototype disparaît par construction.
- **Cross-platform gratuit** : `audio.set_volume` est abstrait ; chaque OS l'implémente dans son Adapter. Le mode ignore l'OS sur lequel il tourne.
- **Sécurité par conception** : un mode partagé n'étant que des `action_type` d'une allowlist, il n'y a **aucun vecteur de code arbitraire** (voir [ADR 0004](./0004-marketplace-sandbox-declaratif.md) et [SECURITY_RGPD](../rncp/SECURITY_RGPD.md)).
- **IA Mode-as-Code trivialisée** : le LLM n'a qu'à produire ce JSON, ensuite revalidé. Il ne génère jamais de code.
- **Persistance & sync naturelles** : de la donnée JSON se stocke (SQLite), se synchronise et s'exporte (portabilité RGPD) directement.
- **Testabilité** : le cœur qui manipule le DSL est pur et testable en CI sans matériel (atout Bloc RNCP 5).

### Négatives / coûts
- **Expressivité bornée** : ce qui n'est pas modélisé comme `action_type` n'est pas réalisable par l'utilisateur. Il faut faire évoluer le DSL et les adapters pour chaque nouveau besoin (mitigé par l'architecture Adapters, [ADR 0003](./0003-architecture-adapters.md)).
- **Discipline de versionnement du schéma** : le DSL devient un contrat ; les évolutions doivent être rétrocompatibles ou versionnées (modes existants et modes partagés doivent continuer de charger).
- **Génération de types à outiller** : il faut une chaîne fiable schéma → TS/Rust (piste `ts-rs`) pour tenir la promesse « source unique ».

## Alternatives

- **Modes = scripts (Lua/JS embarqué, ou AutoHotkey-like)** — *rejeté*. Puissant, mais réintroduit exactement le problème que Nexum veut résoudre : c'est technique (contraire au no-code), et surtout **partager un script tiers = exécuter du code non fiable** → Marketplace dangereuse, incompatible avec la promesse de sécurité.
- **Modes codés en dur (statu quo du prototype)** — *rejeté*. Rend impossibles l'édition, le partage et l'IA. C'est le point de départ à corriger.
- **Moteur de workflow généraliste tiers (BPMN, node-based à la Node-RED)** — *rejeté* pour la V1. Trop lourd, surface d'attaque et complexité disproportionnées pour l'usage ; ré-implémente un langage. On garde un DSL minimal et spécifique au domaine.
- **Deux schémas séparés (un TS pour le front, un Rust pour le back), synchronisés à la main** — *rejeté*. C'est précisément la cause du défaut n°2 du prototype.
