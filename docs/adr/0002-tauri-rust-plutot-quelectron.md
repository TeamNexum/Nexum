# ADR 0002 — Tauri/Rust plutôt qu'Electron

- **Statut** : Accepté
- **Date** : 2026-07-13
- **Décideurs** : équipe Nexum (EIP PROMO 2028)
- **Concerne** : `apps/desktop`, tout le cœur Rust (`crates/*`, `services/*`)

---

## Contexte

Nexum est une **application de bureau** qui doit :

- agir sur le **système** (processus, audio, affichage) et piloter du **matériel** (périphériques, IoT) → besoin d'un accès natif fiable et performant ;
- afficher une **UI riche** (dashboard, éditeur de modes no-code, feed temps réel) → besoin d'un socle UI moderne ;
- rester **légère** en CPU/RAM — c'est un argument de vente explicite (« Performance système 4/5 », « empreinte minimale ») et une faiblesse identifiée au SWOT (conso potentielle) ;
- tourner sur **Windows (prioritaire) + Linux**, avec mobile en Phase 2 ;
- **rassurer sur la sécurité** (accès système + compatibilité anti-cheat).

Le choix du socle desktop conditionne la perf, la sécurité, la taille des binaires et la cohérence du code. Deux familles dominent : **Electron** (Chromium + Node.js embarqués) et **Tauri** (WebView système + backend **Rust**).

## Décision

Nous construisons le desktop avec **Tauri 2**, backend en **Rust**, frontend **React + TypeScript + Vite**.

Ce choix s'inscrit dans une décision plus large : **Rust partout dans le cœur métier** — le cœur desktop (`nexum-core`, `nexum-adapters`, `nexum-store`) **et** le service cloud (`nexum-cloud`, axum). Un seul langage métier de bout en bout.

- Le **frontend** (React/TS) parle au cœur via le **bridge Tauri** : commandes explicites + événements, encadrés par des *capabilities* déclarées.
- Le **cœur** (`nexum-core`) est OS-agnostique et sans I/O système ; seuls les **adapters** portent du code spécifique OS derrière `#[cfg(target_os = ...)]`.
- `apps/desktop/src-tauri` est un **workspace Cargo séparé** pour que la machinerie de build Tauri n'affecte jamais le build/CI du cœur.

## Conséquences

### Positives
- **Empreinte réduite** : Tauri utilise la WebView du système (WebView2/WebKitGTK) au lieu d'embarquer Chromium → binaires de quelques Mo (vs ~100+ Mo pour Electron) et RAM moindre. Répond directement à la faiblesse SWOT « conso CPU/RAM ».
- **Performance & sûreté mémoire** : Rust apporte perf native et absence de classes entières de bugs mémoire — argument sécurité fort pour une app à accès système.
- **Un seul langage métier** : le code (modèle Mode/Action, moteur, validation, scoring Marketplace) est **partagé** entre desktop et cloud. Moins de duplication, moins de désynchro, montée en compétence concentrée.
- **Surface d'attaque plus petite** : pas de runtime Node.js complet exposé ; le bridge Tauri n'expose que des commandes déclarées (voir [SECURITY_RGPD](../rncp/SECURITY_RGPD.md) §3.1).
- **Cross-platform** : Tauri cible Windows/Linux/macOS et **mobile (Tauri 2)** — cohérent avec la stratégie mobile de Phase 2 qui réutilise le cœur.
- **Écosystème natif Rust** : crates matures pour l'accès système (`windows`, `sysinfo`, audio Linux via `pactl`/PipeWire), utiles aux adapters.

### Négatives / coûts
- **Écosystème plus jeune qu'Electron** : moins de plugins clés-en-main, documentation moins fournie sur certains cas limites.
- **Disparités de WebView** : rendu selon la WebView de l'OS (WebView2 vs WebKitGTK) → tests cross-platform nécessaires sur le front.
- **Courbe d'apprentissage Rust** : plus raide que Node.js pour une équipe étudiante — assumée car c'est aussi un atout pédagogique et un différenciateur.
- **Certaines intégrations bas niveau** demandent du code natif par OS (mitigé par l'architecture Adapters, [ADR 0003](./0003-architecture-adapters.md)).

## Alternatives

- **Electron** — *rejeté*. Embarque Chromium + Node.js : binaires lourds et conso mémoire élevée, à rebours de l'argument « empreinte minimale ». Backend JS moins adapté à l'accès système bas niveau ; imposerait un **deuxième langage** (le cloud restant idéalement typé/perf), cassant le « un seul langage métier ».
- **Application native pure par OS (WinUI / Qt / GTK)** — *rejeté*. Meilleure intégration OS mais **coût cross-platform prohibitif** (UI à réécrire par plateforme) pour une équipe EIP, et pas de réutilisation directe du front web.
- **Flutter Desktop** — *rejeté*. UI unifiée correcte, mais accès système/hardware moins mûr sur desktop, et introduit **Dart** comme langage supplémentaire sans réutilisation du cœur Rust ni du cloud.
- **Tout-web / PWA** — *rejeté d'emblée*. Impossible d'agir sur les processus, le matériel et l'IoT local depuis un navigateur sandboxé : incompatible avec la nature même du produit.
