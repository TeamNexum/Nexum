# Cartographie des compétences RNCP — Nexum

> **Document jury-ready — RNCP. Traçabilité compétence → preuve concrète → statut.**
> Projet EIP Epitech « Nexum » — PROMO 2028. Intra : eip.epitech.eu/project/1035.
> Blocs couverts par l'EIP Nexum : **Bloc 5 (Assurance qualité)**, **Bloc 6 (Déploiement)**,
> **Bloc 7 (Gestion de projet)** (source : `docs/eip/_BRIEF_PROJET.md`).
>
> Langue : français. Dernière mise à jour : 2026-07-13. Cible : défense au **Greenlight + Jury RNCP de juillet 2027**.

---

## 0. Mode d'emploi de ce document

Ce document **relie chaque compétence RNCP à une preuve concrète et vérifiable** dans le projet
(fichier, document, ligne de CI, fonctionnalité démontrable en live) et donne son **statut** :

| Symbole | Signification |
|:--:|---|
| ✅ | **Fait / en place** : preuve existante et vérifiable aujourd'hui (doc rédigé, code présent, CI opérationnelle). |
| 🎯 | **À produire** : planifié, tracé dans la roadmap, cible juillet 2027 (implémentation ou instrumentation restante). |
| 🔸 | **Partiel** : amorcé, à compléter. |

> ⚠️ **Note référentiel :** les **intitulés exacts** des compétences/observables officiels doivent être
> repris mot pour mot du **référentiel RNCP Epitech** en vigueur. Les libellés ci-dessous sont formulés
> au plus près des attendus des trois blocs ; à **vérifier/aligner** sur la fiche officielle avant dépôt. ⚠️
>
> **Principe de preuve :** un document rédigé et versionné dans `docs/` est une preuve ✅ de la
> **démarche** (attendu RNCP « défendre une méthode »). Lorsque l'**exécution technique** correspondante
> reste à livrer, la ligne le distingue par un 🎯 dans une colonne dédiée.

---

## 1. Bloc 5 — Assurer la qualité d'un projet de développement

**Preuve maîtresse du bloc :** `docs/rncp/QA_TEST_STRATEGY.md` (stratégie QA complète) +
`.github/workflows/ci.yml` (CI **déjà opérationnelle et bloquante**).

| # | Compétence / observable | Preuve concrète dans Nexum | Statut |
|---|---|---|:--:|
| 5.1 | **Définir une politique / stratégie qualité** (objectifs, exigences non fonctionnelles) | `QA_TEST_STRATEGY.md` §1 (politique, principes hérités de l'architecture, exigences fiabilité/sécurité/perf/portabilité) | ✅ |
| 5.2 | **Concevoir une stratégie de tests multi-niveaux** (pyramide : unitaire / intégration / e2e) | `QA_TEST_STRATEGY.md` §2 (pyramide + diagramme Mermaid) ; niveaux détaillés §2.1–2.3 | ✅ |
| 5.3 | **Écrire et exécuter des tests unitaires** | Tests `#[test]`/`#[tokio::test]` colocalisés dans `nexum-core`, `nexum-schema`, `nexum-store` ; exécutés par `cargo test --workspace` en CI (job `core`) | ✅ |
| 5.4 | **Tester la logique métier critique** (moteur, registry, règles, scoring de sécurité) | `nexum-core` : Engine (ordre + `on_error` + events), Action Registry, Automation (règles SI/ALORS), **Marketplace safety** (allowlist + score de risque) ; matrice §3 | ✅ |
| 5.5 | **Tester la persistance** (contrat de stockage + backend réel) | `nexum-store` : contrat `ModeStore` in-memory **et** SQLite ; job CI dédié `cargo test -p nexum-store --features sqlite` | ✅ |
| 5.6 | **Mettre en place des tests d'intégration** (collaboration des composants) | `QA_TEST_STRATEGY.md` §2.2 : cycle d'exécution complet Engine+Registry+Adapters(Mock)+Store | 🔸 |
| 5.7 | **Mettre en place des tests end-to-end** (parcours utilisateur) | `QA_TEST_STRATEGY.md` §2.3 : Vitest (front) + Playwright/`tauri-driver` couvrant les scénarios BTP | 🎯 |
| 5.8 | **Automatiser les tests en intégration continue** | `.github/workflows/ci.yml` : jobs `core` + `frontend` sur **chaque push/PR** ; `QA_TEST_STRATEGY.md` §5 | ✅ |
| 5.9 | **Imposer des standards de code** (lint, formatage) | CI : `cargo fmt --all -- --check` + `cargo clippy --workspace --all-targets -- -D warnings` (**zéro warning toléré**) ; `QA_TEST_STRATEGY.md` §4 | ✅ |
| 5.10 | **Mesurer la couverture de code** (métriques qualité) | `cargo-llvm-cov` prévu ; objectifs chiffrés (>80 % `nexum-core`, >90 % sécurité) `QA_TEST_STRATEGY.md` §3–4 ; job couverture à brancher + seuil bloquant | 🎯 |
| 5.11 | **Valider la portabilité** (parité multi-OS) | CI multi-OS `ubuntu-latest` + `windows-latest` planifiée ; `QA_TEST_STRATEGY.md` §5 (évolutions) | 🎯 |
| 5.12 | **Gérer les anomalies** (workflow, sévérité, priorisation) | `QA_TEST_STRATEGY.md` §6 : workflow GitHub Issues (`bug`) + cycle de vie + grille de sévérité S1–S4 | ✅ |
| 5.13 | **Garantir la non-régression** | `QA_TEST_STRATEGY.md` §6.1 : règle « tout bug corrigé = un test qui échouait avant le fix » | ✅ |
| 5.14 | **Définir une Definition of Done qualité** | `QA_TEST_STRATEGY.md` §7 (DoD par PR) ; BTP §8.2 (DoD qualité bêta) ; `PROJECT_MANAGEMENT.md` §5.4 | ✅ |
| 5.15 | **Organiser la revue de code** | `QA_TEST_STRATEGY.md` §8 : PR obligatoire, CI bloquante, ≥ 1 relecteur, checklist = DoD, branches protégées | ✅ |
| 5.16 | **Sécurité par conception & audit de dépendances** | Modes = données (pas de code arbitraire) + allowlist ; `cargo audit`/`npm audit` planifiés `QA_TEST_STRATEGY.md` §4 ; `SECURITY_RGPD.md` | 🔸 |
| 5.17 | **Plan de test produit vérifiable en conditions réelles** | `BTP_BETA_TEST_PLAN.md` : 19 fonctionnalités + 12 scénarios ST + critères d'acceptation binaires + métriques (SUS ≥ 75, crash-free ≥ 99 %) | ✅ |

**Démontrable en live (juillet 2027) :** CI verte bloquante affichée sur une PR ; exécution de
`cargo test --workspace` ; feedback temps réel par step (LiveActionsPanel) prouvant la fiabilité.

---

## 2. Bloc 6 — Déployer un projet de développement

**Preuve maîtresse du bloc :** `docs/rncp/DEPLOYMENT_CICD.md` (chaîne de déploiement complète) +
`.github/workflows/ci.yml` (CI en place, socle du CD) + contrainte **« projet déployé »** du Greenlight.

| # | Compétence / observable | Preuve concrète dans Nexum | Statut |
|---|---|---|:--:|
| 6.1 | **Définir une architecture de déploiement** | `DEPLOYMENT_CICD.md` §1 : 2 artefacts (desktop installeurs + cloud conteneurisé), offline-first, diagramme | ✅ |
| 6.2 | **Gérer des environnements séparés** (dev / staging / prod) | `DEPLOYMENT_CICD.md` §2 : tableau env + secrets/URLs distincts + canaux `beta`/`stable` | ✅ (doc) / 🎯 (prod) |
| 6.3 | **Définir une stratégie de release & versionnage** | `DEPLOYMENT_CICD.md` §3 : SemVer, versionnage du DSL `nexum-schema`, modèle de branches, tag → release | ✅ |
| 6.4 | **Packager l'application** (installeurs multi-plateformes) | `DEPLOYMENT_CICD.md` §4 : Tauri `tauri-action`, Windows `.msi`/`.exe`, Linux AppImage/`.deb` ; BTP F-19 | 🎯 |
| 6.5 | **Signer les livrables** (confiance / anti-SmartScreen) | `DEPLOYMENT_CICD.md` §4 : Authenticode Windows + signature updater ; fallback documenté | 🎯 |
| 6.6 | **Mettre en place l'auto-update** | `DEPLOYMENT_CICD.md` §5 : plugin `updater` Tauri 2, `latest.json` signé, vérification cryptographique, 2 canaux ; diagramme séquence | 🎯 |
| 6.7 | **Conteneuriser un service** | `DEPLOYMENT_CICD.md` §6.1 : Dockerfile multi-stage `nexum-cloud` (axum) + `GET /health` | 🔸 |
| 6.8 | **Déployer sur un hébergeur & base managée** | `DEPLOYMENT_CICD.md` §6.2–6.3 : Fly.io/Railway (région UE), PostgreSQL managé, migrations `sqlx migrate` | 🎯 |
| 6.9 | **Construire un pipeline CI/CD** | `.github/workflows/ci.yml` (CI ✅) + `DEPLOYMENT_CICD.md` §7 : CD déclenché par tag (build multi-OS → sign → Release → Docker push → deploy) | ✅ (CI) / 🎯 (CD) |
| 6.10 | **Gouverner les déploiements** (approbations, smoke tests) | `DEPLOYMENT_CICD.md` §7 : approbation manuelle prod (GitHub Environments) + smoke test `GET /health` post-staging | 🎯 |
| 6.11 | **Définir une stratégie de rollback** | `DEPLOYMENT_CICD.md` §8 : images immuables taguées, migrations réversibles + backup, feature flags | ✅ (doc) / 🎯 (exéc.) |
| 6.12 | **Gérer les secrets** | `DEPLOYMENT_CICD.md` §9 : `.env` non commités, GitHub Actions Secrets/Environments, secrets runtime injectés, portée minimale | ✅ (doc) / 🔸 (exéc.) |
| 6.13 | **Mettre en place monitoring & observabilité** | `DEPLOYMENT_CICD.md` §10 : `tracing` structuré, sonde uptime sur `/health`, `/metrics` Prometheus, remontée crash opt-in | 🎯 |
| 6.14 | **Assurer la conformité du déploiement** (RGPD, hébergement UE) | `DEPLOYMENT_CICD.md` §6.3 + `SECURITY_RGPD.md` : hébergement UE, chiffrement au repos, export/suppression ; BTP F-18 | 🔸 |
| 6.15 | **Livrer un « projet déployé » démontrable en live** | `DEPLOYMENT_CICD.md` §11–12 : prod supervisée juillet 2027 (installeurs signés + cloud + PostgreSQL + monitoring) ; `DEMO_RUNBOOK.md` scène 0 (`/health` vert) | 🎯 |

**Démontrable en live (juillet 2027) :** installation depuis un installeur signé sur machine vierge ;
dashboard uptime + `GET /health` vert prouvant un cloud **réellement déployé et supervisé** (pas un localhost).

---

## 3. Bloc 7 — Gérer un projet de développement

**Preuve maîtresse du bloc :** `docs/rncp/PROJECT_MANAGEMENT.md` (organisation & méthodo) +
`docs/rncp/RISK_REGISTER.md` (18 risques pilotés) + livrables entrepreneuriaux `docs/eip/`.

| # | Compétence / observable | Preuve concrète dans Nexum | Statut |
|---|---|---|:--:|
| 7.1 | **Choisir et adapter une méthodologie** (Agile) | `PROJECT_MANAGEMENT.md` §2 : Scrum-lite (sprints 2 sem., daily async, review/rétro) justifié pour équipe étudiante | ✅ |
| 7.2 | **Définir les rôles & responsabilités** | `PROJECT_MANAGEMENT.md` §3 : rôles projet + **matrice RACI** complète | ✅ (⚠️ noms à compléter) |
| 7.3 | **Outiller le pilotage** (backlog, board, traçabilité) | `PROJECT_MANAGEMENT.md` §4 : GitHub Projects/Issues/Milestones, labels (`bloc:5/6/7`, `prio`, `size`), §9 flux | ✅ (doc) / 🎯 (board réel) |
| 7.4 | **Planifier & jalonner** (roadmap alignée EIP) | `PROJECT_MANAGEMENT.md` §8 : jalons M0→M3 (Track lock, BTP, Greenlight blanc, Greenlight/RNCP) ; `docs/eip/ROADMAP_PRODUIT.md` | ✅ |
| 7.5 | **Gérer le backlog & prioriser** (anti-scope-creep) | `PROJECT_MANAGEMENT.md` §6 : priorisation P1/P2/P3, protection des features BTP ; MoSCoW du BTP §5 | ✅ |
| 7.6 | **Animer les rituels d'équipe** | `PROJECT_MANAGEMENT.md` §5 : daily async, planning, review+rétro, DoD | ✅ (doc) / 🎯 (tenue réelle) |
| 7.7 | **Identifier, évaluer et piloter les risques** | `RISK_REGISTER.md` : 18 risques, échelles P×I, heatmap, 4 risques critiques (R04, R09, R11, R17), gouvernance | ✅ (⚠️ responsables à nommer) |
| 7.8 | **Définir des plans de contingence** | `RISK_REGISTER.md` §2 (colonne contingence) + `DEMO_RUNBOOK.md` §3 (plan B par risque de démo) | ✅ |
| 7.9 | **Gérer la communication** (interne + parties prenantes) | `PROJECT_MANAGEMENT.md` §7 : décisions écrites (ADR), escalade, suivi référent/mentor (6 sem. PGE4 / mensuel PGE5), CR archivés | ✅ (doc) / 🔸 (exéc.) |
| 7.10 | **Suivre l'avancement par des indicateurs** | KPIs bêta `BTP_BETA_TEST_PLAN.md` §7.5 (SUS, NPS, rétention, taux de succès) ; `docs/eip/KPIS_ET_PROJECTIONS.md`, `FINANCIAL_MODEL.md` | ✅ (cadre) / 🎯 (mesures) |
| 7.11 | **Piloter la validation marché & l'itération** (attendu track entrepreneuriat) | 15-20 interviews (`docs/eip/QUESTIONNAIRE_INTERVIEWS.md`, `INTERVIEW_SYNTHESIS_TEMPLATE.md`) + 2 cycles d'itération (BTP §7.4) + pivot/consolidation argumenté | 🎯 |
| 7.12 | **Maîtriser les outils entrepreneuriaux** | `docs/eip/BUSINESS_MODEL_CANVAS.md`, `ETUDE_DE_MARCHE.md`, `ANALYSE_CONCURRENTIELLE.md`, `KPIS_ET_PROJECTIONS.md`, `ROADMAP_PRODUIT.md` | ✅ |
| 7.13 | **Tracer les décisions d'architecture** | `docs/adr/` : ADR 0001 (modèle Mode/Action déclaratif), 0002 (Tauri/Rust), 0003 (architecture Adapters), 0004 (Marketplace sandbox) | ✅ |
| 7.14 | **Organiser la campagne de test utilisateur** | `BTP_BETA_TEST_PLAN.md` §7 (recrutement ≥ 20 actifs, protocole, durée) ; `docs/eip/BETA_RECRUITMENT_AND_PARTNERSHIPS.md` | ✅ (plan) / 🎯 (exéc.) |
| 7.15 | **Préparer et sécuriser la livraison au jury** | `DEMO_RUNBOOK.md` : checklist matérielle, plans B, déroulé minute par minute, rôles, checks J-1/J-0 | ✅ |

**Démontrable en live (juillet 2027) :** historique Git (commits Conventional, PR relues), board GitHub
Projects avec milestones = jalons EIP, registre des risques versionné (journal Git = preuve de pilotage Bloc 7).

---

## 4. Synthèse transversale — les preuves clés par bloc

| Bloc | Preuve documentaire maîtresse | Preuve technique / live | Statut global |
|---|---|---|:--:|
| **Bloc 5 — Qualité** | `QA_TEST_STRATEGY.md` | `.github/workflows/ci.yml` (bloquante) + tests `nexum-core`/`schema`/`store` | ✅ socle en place, e2e & couverture 🎯 |
| **Bloc 6 — Déploiement** | `DEPLOYMENT_CICD.md` | CI ✅ ; CD + prod déployée (installeurs signés + cloud + PostgreSQL + monitoring) | 🎯 cible juillet 2027 |
| **Bloc 7 — Gestion de projet** | `PROJECT_MANAGEMENT.md` + `RISK_REGISTER.md` | GitHub (Projects/Issues/PR/Milestones) + ADR + livrables EIP | ✅ cadre complet, exécution 🎯 |

> **Lecture jury :** la **démarche** des trois blocs est documentée et défendable **dès aujourd'hui**
> (✅). Ce qui reste (🎯) est l'**exécution technique restante** (tests e2e, couverture mesurée, CD et
> prod déployée, tenue de la campagne bêta), planifiée et jalonnée dans la roadmap EIP jusqu'à la
> **démo live de juillet 2027**.

---

## 5. Références

- `docs/rncp/QA_TEST_STRATEGY.md` — Bloc 5 (stratégie qualité & tests).
- `docs/rncp/DEPLOYMENT_CICD.md` — Bloc 6 (déploiement & CI/CD).
- `docs/rncp/PROJECT_MANAGEMENT.md` — Bloc 7 (gestion de projet & équipe).
- `docs/rncp/RISK_REGISTER.md` — Bloc 7 (registre des risques).
- `docs/rncp/SECURITY_RGPD.md` — sécurité & conformité RGPD (Blocs 5/6).
- `docs/eip/BTP_BETA_TEST_PLAN.md` — plan de test bêta (F-01→F-19, ST-01→ST-12, DoD, métriques).
- `docs/DEMO_RUNBOOK.md` — runbook de démonstration live (Blocs 5/6/7 en action).
- `docs/adr/` — décisions d'architecture (ADR 0001–0004).
- `.github/workflows/ci.yml` — pipeline CI opérationnel.
- `docs/eip/` — livrables entrepreneuriaux (BMC, étude de marché, KPIs, roadmap, interviews).
- `docs/eip/_BRIEF_PROJET.md` — référence factuelle partagée.

---

> **Statut du document :** v1, prêt pour revue équipe + référent EIP. ⚠️ Aligner les **intitulés exacts**
> des compétences sur le référentiel RNCP Epitech officiel avant dépôt. À réviser à chaque jalon (BTP,
> Greenlight blanc, Greenlight/RNCP) au fur et à mesure que les 🎯 passent en ✅.
