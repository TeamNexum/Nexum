# ADR 0004 — Marketplace : validation déclarative plutôt que sandbox d'exécution

- **Statut** : Accepté
- **Date** : 2026-07-13
- **Décideurs** : équipe Nexum (EIP PROMO 2028)
- **Concerne** : `nexum-core::marketplace`, service cloud (modération), Marketplace
- **Dépend de** : [ADR 0001](./0001-modele-mode-action-declaratif.md) (DSL déclaratif), [ADR 0003](./0003-architecture-adapters.md) (allowlist dérivée du registry)

---

## Contexte

La **Marketplace** est une extension stratégique de Nexum : les utilisateurs partagent des modes, les importent, les notent (viralité via influenceurs = opportunité SWOT). Mais importer et exécuter le contenu d'un **inconnu** sur une machine qui a un **accès système** (tuer des process, lancer des binaires, piloter du matériel) est, en général, l'un des problèmes de sécurité les plus difficiles qui soient.

La question centrale : **comment rendre sûr l'import de modes tiers ?**

L'approche « industrielle » classique consiste à **exécuter le contenu tiers dans une sandbox** (machine virtuelle, conteneur, interpréteur restreint, WASM), en pariant sur l'isolation pour contenir les dégâts. C'est coûteux, faillible (les évasions de sandbox existent), et lourd à maintenir.

Or, grâce à [ADR 0001](./0001-modele-mode-action-declaratif.md), **un mode partagé n'est pas du code : c'est de la donnée déclarative** — une liste d'`action_type` connus avec des params. Cela ouvre une voie radicalement plus simple.

## Décision

Nous **n'exécutons jamais de code tiers**. La sécurité de la Marketplace repose sur une **validation déclarative statique** : **allowlist + score de risque**, implémentée et testée dans `crates/nexum-core/src/marketplace.rs`.

Le « sandbox » se réduit à deux vérifications sur de la donnée :

**1. Analyse statique / allowlist.** Chaque `action_type` d'un mode partagé doit appartenir à l'allowlist (dérivée de `ActionRegistry::known_action_types()`). Toute action inconnue fait passer le mode au niveau **`Rejected`** — il **ne peut pas être publié**.

**2. Score de risque pondéré.** Chaque action connue a un poids d'impact ; on somme les poids et on classe :

| Niveau | Condition |
|---|---|
| `Rejected` | ≥ 1 action hors allowlist |
| `High` | score ≥ 80 |
| `Medium` | score ≥ 40 |
| `Low` | sinon |

Poids implémentés (extrait) : `system.close_app` = 30 (peut tuer des process), `system.launch_app` = 25 (lance un binaire local), `system.open_url` = 10, `gaming.launch_steam` = 5, actions cosmétiques (`audio.set_volume`, `display.set_brightness`, `iot.hue.*`, `peripheral.*`) = 2, action connue mais non classée = 15 (prudence). Toute action de poids ≥ 30 génère un `issue` signalé à la modération.

Cette logique est couverte par tests unitaires (`safe_mode_is_low_risk`, `unknown_action_is_rejected`, `many_high_impact_actions_raise_the_level`).

**Pipeline complet cible** (voir [SECURITY_RGPD](../rncp/SECURITY_RGPD.md) §4.3) : analyse statique → score de risque → **modération** (`pending`/`approved`/`rejected`) → **réputation créateur** (ratings) → publication. Idem pour l'**IA Mode-as-Code** : le LLM produit du DSL, qui repasse par la **même** validation avant activation.

## Conséquences

### Positives
- **La classe de vulnérabilité « exécution de code arbitraire tiers » est éliminée par conception**, pas seulement atténuée — il n'y a pas de code à exécuter. C'est l'argument sécurité le plus fort de Nexum.
- **Simple, rapide, déterministe** : valider une liste d'actions contre une allowlist est trivial, s'exécute côté client **et** serveur, sans infrastructure d'isolation.
- **Déjà implémenté et testé** : le module existe et passe ses tests → démontrable en live devant le jury (montrer qu'un `evil.rm_rf` est rejeté automatiquement).
- **Transparence pour l'utilisateur** : on peut afficher exactement ce qu'un mode fera (liste d'actions + niveau de risque) **avant** import — impossible avec du code opaque.
- **Cohérence garantie** : l'allowlist **est** l'ensemble des capacités réelles du registry ([ADR 0003](./0003-architecture-adapters.md)) → pas de dérive.
- **Réutilisable** : la même fonction `assess()` sert la Marketplace, la modération et le garde-fou de l'IA.

### Négatives / coûts
- **La granularité de la sécurité s'arrête à l'`action_type` et à ses params** : deux modes utilisant `system.launch_app` sont scorés pareil même si l'un lance un binaire douteux. → nécessite une **validation fine des params** dans les adapters (`validate()`) et, à terme, une allowlist de chemins/process protégés.
- **Poids et seuils empiriques** : les pondérations (30/25/10…) et seuils (40/80) sont un jugement à calibrer avec l'usage réel. *(Hypothèse : à affiner en Phase 2 selon les faux positifs/négatifs observés.)*
- **Ne couvre pas l'abus « fonctionnel »** : un mode peut être techniquement sûr mais trompeur (mauvaise UX, contenu inapproprié) → d'où la couche **modération + réputation** au-dessus de l'analyse statique.
- **Contrainte d'expressivité** : toute capacité non modélisée en `action_type` ne peut pas transiter par la Marketplace — accepté, c'est le prix de la sûreté (et cohérent avec [ADR 0001](./0001-modele-mode-action-declaratif.md)).

## Alternatives

- **Sandbox d'exécution de code (VM / conteneur / WASM / interpréteur restreint)** — *rejeté*. Complexe, coûteux en ressources, faillible (évasions), et **inutile** puisqu'un mode n'est pas du code. Rajouterait une surface d'attaque au lieu d'en retirer.
- **Confiance + signature des créateurs seule** — *rejeté comme unique rempart*. Une signature prouve l'origine, pas l'innocuité ; un créateur réputé peut publier un mode dangereux. La signature/réputation vient **compléter**, pas remplacer, l'analyse statique.
- **Revue humaine manuelle de chaque mode** — *rejeté comme mécanisme principal*. Ne passe pas à l'échelle (viralité attendue) ; réservé à l'arbitrage des cas signalés (issues, score `High`).
- **Antivirus / analyse comportementale à l'exécution** — *rejeté*. Détection a posteriori, probabiliste, lourde ; sans objet quand la prévention statique est exhaustive sur un espace d'actions fini et connu.
