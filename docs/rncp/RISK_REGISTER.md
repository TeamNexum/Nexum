# Registre des risques — Nexum

> Document RNCP — **Bloc 7 (Gestion de projet)**.
> Projet EIP Epitech « Nexum » — PROMO 2028, Phase PGE4, campus Marseille.
> Langue des livrables : français.
> Dernière mise à jour : 2026-07-13.

---

## 1. Objet et méthode

Ce registre identifie, évalue et pilote les risques du projet Nexum sur la durée de l'EIP (juillet 2026 → juillet 2027). Il est mis à jour à chaque **rétrospective de sprint** et revu avant chaque **suivi EIP**.

### 1.1 Échelles d'évaluation

- **Probabilité (P)** : 1 = Rare, 2 = Peu probable, 3 = Possible, 4 = Probable, 5 = Quasi certain.
- **Impact (I)** : 1 = Négligeable, 2 = Mineur, 3 = Modéré, 4 = Majeur, 5 = Critique (met en péril le projet ou un jalon EIP).
- **Criticité = P × I** (de 1 à 25).

### 1.2 Seuils de criticité

| Criticité (P×I) | Niveau | Traitement |
|---|---|---|
| **1 – 4** | 🟢 Faible | Surveillance passive, revue périodique. |
| **5 – 9** | 🟡 Modéré | Mitigation planifiée, suivi à chaque sprint. |
| **10 – 14** | 🟠 Élevé | Mitigation active + plan de contingence prêt. |
| **15 – 25** | 🔴 Critique | Action prioritaire, arbitrage équipe + remontée au référent EIP. |

### 1.3 Catégories

`Technique` · `Marché` · `Équipe` · `Légal` · `Planning`

> ⚠️ **À compléter :** affecter un **responsable nommé** à chaque risque (les responsables ci-dessous sont des rôles, cf. `PROJECT_MANAGEMENT.md` §3). Réévaluer P et I en équipe à chaque rétro.

---

## 2. Registre des risques

| ID | Risque | Catégorie | P | I | Criticité | Niveau | Mitigation (réduire P/I) | Plan de contingence (si le risque survient) | Responsable |
|---|---|---|:--:|:--:|:--:|:--:|---|---|---|
| **R01** | **Dépendance aux API tierces** (Steam, Philips Hue, SDK périphériques) : rupture, changement ou fermeture d'une API. | Technique / Marché | 4 | 3 | **12** | 🟠 | Adapters isolés + dégradation propre (`on_error`, capacités) : si une API tombe, le reste du mode s'exécute. Épingler les versions de SDK. | Désactiver l'Adapter concerné, communiquer une limite connue au jury, prioriser une intégration de substitution. | Lead Technique |
| **R02** | **Réaction des OS** : Windows (ou autre) intègre nativement des profils/modes contextuels, rognant la valeur de Nexum. | Marché | 3 | 4 | **12** | 🟠 | Différenciation par l'**agnosticité multi-marques + IoT + IA no-code** qu'un OS ne couvre pas. Veille concurrentielle. | Repositionner le pitch sur l'orchestration universelle et la Marketplace ; recentrer la démo sur ces axes. | Réf. Entrepreneuriat |
| **R03** | **Concurrence hardware** : Elgato/Logitech/Razer/Corsair ouvrent leurs logiciels au-delà de leur marque. | Marché | 3 | 4 | **12** | 🟠 | Avance sur l'**interopérabilité réelle** entre marques concurrentes + no-code + IA Mode-as-Code. Effet Marketplace/communauté. | Accélérer les partenariats/intégrations différenciantes ; insister sur l'indépendance vis-à-vis d'un constructeur. | Réf. Entrepreneuriat |
| **R04** | **Détection anti-cheat** : Nexum perçu/détecté comme un outil de triche par les jeux compétitifs. | Technique / Légal | 3 | 5 | **15** | 🔴 | **Ne jamais injecter** dans les jeux ; uniquement API officielles (SDK, `steam://`). Aucune manipulation mémoire. Documenter pour rassurer le jury. | Retirer immédiatement toute action litigieuse, publier une note de conformité, contacter l'éditeur anti-cheat si nécessaire. | Lead Technique |
| **R05** | **Dette technique** : accumulation sous pression des jalons, dégradant la maintenabilité et la démo. | Technique | 3 | 3 | **9** | 🟡 | Definition of Done stricte, revues de code obligatoires, CI (tests + lint), `nexum-core` 100% testé sans matériel. | Sprint de stabilisation dédié avant BTP et avant Greenlight ; geler les features non essentielles. | Réf. QA |
| **R06** | **Coût du cross-platform** : maintenir Windows + Linux (+ macOS bonus) double la charge d'intégration. | Technique | 3 | 3 | **9** | 🟡 | Core **OS-agnostique** ; seul un Adapter par OS porte du code `#[cfg]`, testé en CI. Windows priorisé. | Réduire la cible au seul Windows pour le BTP si la charge dérape ; Linux repoussé en post-BTP. | Lead Technique |
| **R07** | **Performance CPU/RAM** : l'empreinte système contredit l'argument « léger » du cahier des charges. | Technique | 2 | 3 | **6** | 🟡 | Core Rust event-driven (pas de polling), mesures de conso régulières, budget perf. | Profilage ciblé, suppression du polling résiduel, publication des chiffres de conso au jury. | Lead Technique |
| **R08** | **Bug volume Windows hérité du prototype** (stub PowerShell non fonctionnel). | Technique | 4 | 2 | **8** | 🟡 | Correctif prioritaire en Phase 0 via Core Audio (crate `windows`, IAudioEndpointVolume). | Fallback documenté, action `audio.set_volume` marquée indisponible tant que non corrigée. | Lead Technique |
| **R09** | **Glissement du planning EIP** : retard sur BTP (jan. 2027) ou Greenlight (juil. 2027). | Planning | 3 | 5 | **15** | 🔴 | Roadmap par phases, milestones GitHub = jalons EIP, priorisation P1 protégeant les livrables démontrables. | Réduire le scope à la liste BTP minimale démontrable ; arbitrage avec le référent EIP au suivi le plus proche. | Chef de projet |
| **R10** | **Disponibilité de l'équipe** : cours, stages, examens réduisent la capacité réelle par sprint. | Équipe / Planning | 4 | 3 | **12** | 🟠 | Sprints planifiés sur **capacité réelle** (disponibilités ⚠️), daily async, rôles tournants, matrice RACI claire. | Re-prioriser le sprint, décaler les features P3, redistribuer via la RACI si un membre est indisponible. | Chef de projet |
| **R11** | **Scope creep** : ambition d'exhaustivité (centaines d'intégrations, features hors cœur). | Planning / Équipe | 4 | 4 | **16** | 🔴 | Toute idée passe par une issue en backlog, jamais insérée en cours de sprint (hors urgence P1). Cible BTP = 4-5 intégrations démontrables, pas l'exhaustivité. | Recentrage explicite sur la cartographie BTP ; gel de fonctionnalités décidé en review. | Chef de projet |
| **R12** | **Départ / désengagement d'un membre** de l'équipe. | Équipe | 2 | 4 | **8** | 🟡 | Documentation vivante (`docs/`), revues croisées (bus factor réduit), rôles documentés. | Redistribuer les rôles via la RACI, prévenir le référent EIP, re-prioriser la roadmap. | Chef de projet |
| **R13** | **Non-conformité RGPD** : consentement, export et suppression des données (comptes, sync cloud). | Légal | 3 | 4 | **12** | 🟠 | Privacy by design : consentement explicite, export/suppression prévus, minimisation des données, auth JWT + OAuth. | Restreindre la collecte, corriger avant toute mise en ligne publique, documenter la conformité pour le jury. | Lead Cloud |
| **R14** | **Conflit de marques / propriété intellectuelle** : usage de noms/logos (Steam, Philips Hue, Razer…) et nom « Nexum ». | Légal | 2 | 3 | **6** | 🟡 | Respect des chartes de marque et des CGU des SDK ; vérifier la disponibilité du nom « Nexum ». Mentions « compatibilité » et non affiliation. | Renommer/retirer les visuels litigieux, adapter la communication, recherche d'antériorité de marque. | Réf. Entrepreneuriat |
| **R15** | **Sécurité de la Marketplace** : un mode partagé malveillant ou dangereux (ex. `system.close_app` sur process sensible). | Technique / Légal | 3 | 4 | **12** | 🟠 | Modes = **JSON déclaratif sans code arbitraire** ; validation d'allowlist + `validate()` des Adapters + score de risque IA + modération + réputation créateur. | Retirer le mode, statut `rejected`, durcir l'allowlist et le scoring, notifier les utilisateurs impactés. | Lead Cloud |
| **R16** | **Échec de la validation marché** : interviews/MVP invalident les hypothèses produit. | Marché | 2 | 4 | **8** | 🟡 | 15-20 interviews utilisateurs + 2 cycles d'itération MVP (objectifs EIP obligatoires) pour détecter tôt. | **Pivot argumenté** (autorisé par l'EIP) ou consolidation documentée ; ajuster le BMC et la roadmap. | Réf. Entrepreneuriat |
| **R17** | **Échec de la démo LIVE** au Greenlight (aucune vidéo autorisée) : panne matérielle/réseau le jour J. | Planning / Technique | 3 | 5 | **15** | 🔴 | Répétitions générales (Greenlight blanc avr. 2027), mode offline-first, matériel de démo maîtrisé (lampe Hue, machine), plan B réseau. | Bascule sur environnement de secours préparé (2e machine, hotspot), scénario de démo dégradé documenté. | Chef de projet |
| **R18** | **Fiabilité de l'IA Mode-as-Code** : le LLM génère un DSL invalide ou inattendu. | Technique | 3 | 2 | **6** | 🟡 | Le LLM ne produit **que du JSON déclaratif** validé par `validate()` + capacités **avant** exécution ; jamais de code exécutable. | Rejet du mode généré + message utilisateur ; feature marquée « démonstrateur » si instable au jury. | Lead Technique |

---

## 3. Matrice de criticité (heatmap)

Chaque cellule indique les **IDs de risques** dont la position (Probabilité × Impact) tombe dans la case. Couleur = niveau de criticité.

| Prob. ↓ / Impact → | **1 — Négligeable** | **2 — Mineur** | **3 — Modéré** | **4 — Majeur** | **5 — Critique** |
|---|---|---|---|---|---|
| **5 — Quasi certain** | 🟢 (5) | 🟡 (10) | 🟠 (15) | 🔴 (20) | 🔴 (25) |
| **4 — Probable** | 🟢 (4) | 🟡 (8) · **R08** | 🟠 (12) · **R01, R10** | 🔴 (16) · **R11** | 🔴 (20) |
| **3 — Possible** | 🟢 (3) | 🟡 (6) · **R18** | 🟡 (9) · **R05, R06** | 🟠 (12) · **R02, R03, R13, R15** | 🔴 (15) · **R04, R09, R17** |
| **2 — Peu probable** | 🟢 (2) | 🟡 (6) · **R07, R14** | 🟡 (6) — | 🟡 (8) · **R12, R16** | 🔴 (10) |
| **1 — Rare** | 🟢 (1) | 🟢 (2) | 🟢 (3) | 🟢 (4) | 🟡 (5) |

> Note de lecture : la valeur entre parenthèses est la criticité P×I de la case. Un risque peut donc apparaître sur une case dont le nombre correspond à sa criticité.
> **Hypothèse :** R07 (P2×I3=6) est placé dans la ligne P2 ; la colonne exacte suit son impact (I3). Les cases sans risque affiché sont vides pour Nexum à date.

### 3.1 Risques prioritaires (🔴 Critique, P×I ≥ 15)

| ID | Risque | Criticité |
|---|---|:--:|
| **R11** | Scope creep | **16** |
| **R04** | Détection anti-cheat | **15** |
| **R09** | Glissement du planning EIP | **15** |
| **R17** | Échec de la démo live au Greenlight | **15** |

Ces quatre risques sont revus **à chaque sprint** et systématiquement au point de suivi EIP.

---

## 4. Gouvernance du registre

- **Fréquence de revue :** à chaque rétrospective de sprint (mise à jour P/I, statut), et revue complète avant chaque jalon EIP (BTP, Greenlight blanc, Greenlight/RNCP).
- **Ajout de risque :** tout membre peut ouvrir une issue GitHub `type:risk` ; le chef de projet l'intègre au registre.
- **Traçabilité :** ce fichier est versionné dans `docs/rncp/` ; l'historique Git sert de journal d'évolution des risques (utile pour la défense RNCP Bloc 7).

> ⚠️ **À compléter :** responsables nommés, réévaluation collective des P/I, et ajout des risques spécifiques qui émergeront des interviews utilisateurs et des premiers sprints.
