# Architecture Decision Records (ADR) — Nexum

Ce dossier consigne les **décisions d'architecture structurantes** de Nexum : quoi, pourquoi, et quelles conséquences. L'objectif est de rendre le raisonnement traçable et défendable devant le jury EIP / RNCP (Bloc 6 — déploiement, Bloc 7 — gestion de projet).

## Qu'est-ce qu'un ADR ?

Un **Architecture Decision Record** est un document court qui capture **une** décision architecturale importante, son contexte et ses conséquences, à un instant donné. C'est un format popularisé par Michael Nygard. Un ADR n'est **jamais réécrit** une fois accepté : si une décision change, on crée un **nouvel** ADR qui **remplace** (`Superseded by`) l'ancien. On conserve ainsi l'historique du raisonnement.

## Format utilisé

Chaque ADR suit la structure standard :

- **Titre** — numéroté (`NNNN-titre-court.md`).
- **Statut** — `Proposé` · `Accepté` · `Rejeté` · `Déprécié` · `Remplacé par NNNN`.
- **Contexte** — la situation, les contraintes, les forces en présence.
- **Décision** — ce qui a été décidé, formulé à la voix active.
- **Conséquences** — les effets positifs **et** négatifs, ce que la décision facilite ou complique.
- **Alternatives** — les options envisagées puis écartées, avec la raison du rejet.

## Index des ADR

| # | Titre | Statut | Résumé |
|---|---|---|---|
| [0001](./0001-modele-mode-action-declaratif.md) | Modèle Mode/Action déclaratif (DSL partagé) | Accepté | Un mode est de la **donnée** (DSL JSON), jamais du code. |
| [0002](./0002-tauri-rust-plutot-quelectron.md) | Tauri/Rust plutôt qu'Electron | Accepté | Desktop en Tauri 2 + Rust pour la perf, la sécurité et le partage de langage. |
| [0003](./0003-architecture-adapters.md) | Architecture Adapters + registry | Accepté | Chaque intégration = un Adapter enregistré ; l'Engine ne change jamais. |
| [0004](./0004-marketplace-sandbox-declaratif.md) | Marketplace : validation déclarative plutôt que sandbox d'exécution | Accepté | Sécurité par **analyse statique** (allowlist + score), pas par exécution sandboxée. |

## Liens utiles

- Plan technique global : [`NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`](../../../NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md)
- Sécurité & RGPD : [`docs/rncp/SECURITY_RGPD.md`](../rncp/SECURITY_RGPD.md)
- Documents EIP : [`docs/eip/README.md`](../eip/README.md)
