# Environnement technologique

> Document demandé par le guide EIP « Structure your project » (G-EIP-600) : technologies et
> bibliothèques, infrastructure et matériel nécessaires. Architecture détaillée :
> [`ARCHITECTURE.md`](ARCHITECTURE.md) ; décisions justifiées : [`adr/`](adr/).

## 1. Technologies et bibliothèques

| Domaine | Choix | Pourquoi |
|---|---|---|
| Cœur et intégrations | **Rust** (stable, édition 2021) | Rapide et léger en tâche de fond, accès direct aux API système (Core Audio sous Windows, DisplayServices sous macOS), sûreté mémoire |
| App desktop | **Tauri 2** | Binaire bien plus léger qu'Electron, backend en Rust partagé avec le cœur, compatible Windows / macOS / Linux et mobile |
| Interface | **React 18 + TypeScript 5.6 + Vite 6** | Compétences de l'équipe, écosystème, même code pour le desktop et le web |
| Types partagés | **ts-rs 10** | Les types TypeScript sont générés depuis le Rust : le front et le back ne peuvent pas diverger |
| API cloud | **axum 0.7 + Tokio** | Même langage que le cœur, asynchrone, performant |
| Stockage local | **SQLite** via rusqlite 0.31 (compilé avec l'app) | Aucun serveur à installer, l'app marche hors ligne |
| Réseau | **reqwest 0.12 + rustls** | Pont Philips Hue sans dépendre d'OpenSSL |
| Tests | cargo test, **Vitest 2**, **Playwright 1.48**, tauri-driver | Voir [`testing_policy.md`](testing_policy.md) |
| CI | **GitHub Actions** | Gratuit sur un dépôt public, y compris macOS |

Toutes ces briques sont maintenues activement et documentées. Leur mise à jour sera surveillée par
Dependabot et un audit de sécurité (#66). Les versions exactes sont figées dans `Cargo.lock` et
`package-lock.json`.

### Spécificités par système

| Fonction | Windows | macOS | Linux |
|---|---|---|---|
| Volume | Core Audio (crate `windows`) | `osascript` | `wpctl` (PipeWire) ou `pactl` |
| Luminosité | crate `brightness` | framework DisplayServices (écran intégré) | crate `brightness` |
| Lancer une app / une URL | crate `open` | crate `open` | crate `open` |

## 2. Infrastructure et déploiement

| Élément | Aujourd'hui | Prévu |
|---|---|---|
| Données des utilisateurs | SQLite local + `integrations.json` dans le dossier de données de l'app | Inchangé : l'app reste utilisable hors ligne |
| API cloud | Locale, stockage en mémoire | PostgreSQL (#14), hébergement européen pour le RGPD + domaine + HTTPS (#48) ; comparatif des hébergeurs et coûts dans #111 |
| Distribution | Build CI | Installeurs signés (#21) et mises à jour automatiques (#50) |
| Secrets (jetons Hue, comptes de messagerie) | Fichier de réglages local | Trousseau du système (#51) |

Détail du pipeline : [`deployment.md`](deployment.md).

## 3. Matériel

| Matériel | Usage | Justification |
|---|---|---|
| PC Windows, Mac (Apple Silicon), PC Linux | Développement et tests sur les trois systèmes ciblés | Les intégrations (volume, luminosité) utilisent une API différente par système |
| Kit **Philips Hue** + pont (#98) | Tester l'éclairage connecté (appairage, scènes) | Écosystème domotique le plus répandu, API locale documentée ; financé par le budget EIP |
| Smartphones iOS et Android | App mobile / télécommande (#34–#36) | Deux plateformes cibles de l'app mobile |
| Objets connectés de l'équipe (#52) | Intégrations suivantes (Govee, Elgato…) | Tester sur de vrais appareils plutôt que des simulateurs |
