# Déploiement — dépôt, branches et CI/CD

> Document demandé par le guide EIP « Structure your project » (G-EIP-600) : comment le dépôt et
> la chaîne CI/CD sont organisés pour construire, tester et déployer Nexum.
> Il décrit **l'état réel** du dépôt ; ce qui reste à construire renvoie vers les issues GitHub.
> La stratégie cible détaillée (installeurs signés, hébergement du cloud) est dans
> [`rncp/DEPLOYMENT_CICD.md`](rncp/DEPLOYMENT_CICD.md).

## 1. Le dépôt

Un seul dépôt (monorepo) : [`TeamNexum/Nexum`](https://github.com/TeamNexum/Nexum), public, licence MIT.

| Dossier | Contenu | Outil de build |
|---|---|---|
| `crates/nexum-schema` | Schéma partagé des modes (source de vérité des types) | Cargo (workspace racine) |
| `crates/nexum-core` | Moteur : exécution des modes, bus d'événements, automatisations, marketplace, partage | Cargo |
| `crates/nexum-adapters` | Intégrations : volume, luminosité, applications, Steam, Philips Hue | Cargo |
| `crates/nexum-store` | Stockage des modes (mémoire, SQLite en option) | Cargo |
| `services/nexum-cloud` | API cloud (axum) : comptes, synchronisation | Cargo |
| `apps/desktop` | Application desktop Tauri 2 + React | npm + Cargo (**workspace Cargo séparé** dans `src-tauri`) |
| `apps/mobile` | Télécommande web (PWA) | npm |
| `packages/schema-ts` | Types TypeScript **générés** depuis le Rust avec ts-rs | npm |

L'application desktop a son propre workspace Cargo (`apps/desktop/src-tauri`), exclu du workspace
racine : la machinerie de Tauri ne ralentit pas le build et la CI du cœur.

## 2. Branches et revue

```
feat/xxx, fix/xxx  ──PR──▶  unstable  ──PR──▶  main
```

- **`main`** : version stable. Protégée : pas de push direct ni de force-push, **1 approbation
  obligatoire** sur chaque pull request.
- **`unstable`** : branche d'intégration. Les fonctionnalités y sont fusionnées puis testées
  ensemble avant de passer sur `main` par une PR `unstable → main`.
- **Branches de travail** : une branche par ticket (`feat/…`, `fix/…`, `docs/…`), fusionnée dans
  `unstable` par PR.
- Messages de commit au format [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat(adapters): …`, `fix(ci): …`, `docs(eip): …`), petits commits ciblés.
- Chaque ticket terminé passe en statut **Review** sur le board, relu par un autre membre.

Suivi : board GitHub Projects de l'organisation, milestones par phase EIP, gabarits d'issue et de
PR dans `.github/`. Règles de contribution : [`../CONTRIBUTING.md`](../CONTRIBUTING.md).

## 3. Intégration continue (`.github/workflows/ci.yml`)

Déclenchée sur chaque pull request et chaque push sur `main`.

| Job | Systèmes | Ce qu'il vérifie |
|---|---|---|
| Rust core | Ubuntu, Windows, macOS | `cargo fmt --check`, `cargo clippy -D warnings`, tests du workspace, tests SQLite |
| Desktop Tauri backend | Ubuntu, Windows, macOS | clippy `-D warnings` et `cargo check` de l'app desktop |
| TS bindings are up to date | Ubuntu | Régénère les types TypeScript et échoue s'ils diffèrent de ceux commités |
| Frontend workspaces | Ubuntu (Node 20) | Typecheck, tests Vitest, build de toutes les apps web |
| Desktop browser preview | Ubuntu | Tests de bout en bout Playwright sur l'interface |
| Desktop native smoke | Ubuntu (Xvfb) | Construit la vraie app Tauri, la lance, active un mode et lit le fil d'événements (WebDriver) |

Une PR ne se fusionne que si la CI est verte. Les caches Cargo (`Swatinem/rust-cache`) et npm
gardent les builds rapides.

## 4. Construire et lancer en local

Prérequis : Rust stable (fixé par `rust-toolchain.toml`), Node 20+, et les dépendances système de
Tauri (voir [`GETTING_STARTED.md`](GETTING_STARTED.md)).

```sh
npm install                          # dépendances de tous les workspaces npm
cargo test --workspace               # tests du cœur Rust
npm test                             # tests Vitest
npm run dev:desktop                  # app desktop en mode développement
npm run dev:cloud                    # API cloud en local (port 8787)
npm run gen:types                    # régénérer les types TypeScript après un changement du schéma
```

Build de l'app desktop sans installeur : `npm run tauri build --workspace=nexum-desktop -- --debug --no-bundle`.

## 5. Déploiement

| Livrable | Aujourd'hui | Prévu |
|---|---|---|
| App desktop | Construite par la CI (smoke test) ; pas encore distribuée | Installeurs Windows / Linux signés (#21), mises à jour automatiques (#50), désinstallation propre (#68) |
| API cloud | Lancée en local, stockage en mémoire | Base PostgreSQL (#14), hébergement + nom de domaine + HTTPS (#48) |
| App mobile | Télécommande web servie en local | App native Tauri 2 iOS / Android (#34, #35, #36) |

L'app fonctionne **hors ligne** (modes stockés en SQLite sur la machine) : une panne du cloud ou du
réseau ne bloque pas l'activation des modes, ce qui sécurise la démo live du Greenlight.
