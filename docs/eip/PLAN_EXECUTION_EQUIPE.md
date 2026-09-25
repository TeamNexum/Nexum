# Nexum — Plan d'exécution équipe (checklist & calendrier)

> **But de ce document.** Le code et les documents sont prêts (voir
> [DELIVERABLES_TRACKER](DELIVERABLES_TRACKER.md)). Ce qui reste ne dépend plus
> que de **l'équipe** : validation marché, itérations MVP, jurys, administratif
> EIP. Ce plan liste **qui fait quoi, pour quand**, de maintenant (juillet 2026)
> au jury final (juillet 2027).
>
> Cocher au fil de l'eau. Mettre à jour à chaque suivi. Les ⚠️ = à compléter
> (noms, dates réelles, chiffres).

## Dates clés (non négociables)

| Échéance | Date | Enjeu |
|---|---|---|
| 🔒 Choix de la track + objectifs majeurs / mineurs sur l'intra | **Semaine du 19/10/2026** | Track **Entrepreneuriat** confirmée au suivi du 25/09 ; objectifs figés ensuite |
| 📄 BTP v1 | **07/02/2027** | Tout ce qui est dans le BTP doit être démontré et fonctionner |
| 📄 BTP version finale | **04/04/2027** | Document central du Greenlight |
| 🎥 Greenlight blanc | **05/04 → 16/04/2027** | Répétition générale notée |
| 🏆 Greenlight + jury RNCP (présentiel, Kremlin-Bicêtre) | **05/07 → 16/07/2027** | **Démo live du projet déployé — vidéo interdite** |

> Greenlight = go / no-go sur deux critères : un BTP assez conséquent pour 5 personnes sur un
> an, et un BTP entièrement réalisé. Un BTP trop léger mène au no-go même si l'équipe a fait
> plus que prévu (rappel du suivi du 25/09/2026).

## Cadence & contacts

- Suivis pédagogiques + mentor : **toutes les 6 semaines en PGE4**, **mensuels en PGE5**.
  Caméra obligatoire, chaque suivi doit montrer une progression.
- Coordinatrices : **Lisa Nay, Faizal Nguyen** — via **help.epitech.eu** (pas Teams).
- Rituel équipe conseillé : **stand-up hebdo (30 min)** + **revue de sprint toutes les 2 semaines**.

## Rôles

| Rôle | Personne | Responsabilité principale |
|---|---|---|
| Product owner / lead + Front (soutien) | Arnaud Jouan (`Arjouan`) | Roadmap, board, jalons, suivis ; compatibilité macOS / iOS |
| Front principal | Rares Dragomir (`RaresFZ`) | UI ; messagerie centralisée (Gmail, Outlook, Teams) |
| Back | Raphael Grissonnanche (`Raphie10`) | Installateur et mises à jour de l'app |
| Back | Max Epinat (`Max-Epinat`) | Architecture plugins ; app Android |
| Business / KPI + Database / CI-CD | Enzo (`MAD-TEK`) | Interviews, étude de marché, KPIs, modèle financier ; CI/CD |
| Comms / image | Arnaud + Rares | Réseaux sociaux (Instagram, LinkedIn, TikTok), logo et charte, pitch |

> Rôles décidés au suivi pédagogique du 25/09/2026. Détail des tickets GitHub par personne : voir
> [TASK_ASSIGNMENTS.md](TASK_ASSIGNMENTS.md).

---

## Phase 0 — Fondations & validation marché · **Juil → Oct 2026**
*Objectif : preuve du besoin + scope figé + objectifs de track verrouillés.*

**Administratif EIP**
- [ ] Créer/valider le groupe projet sur l'**intra EIP** ⚠️
- [x] Créer le **dépôt GitHub** (voir [GITHUB_SETUP](../GITHUB_SETUP.md)) + board (Projects) + issues des jalons
- [x] Premier **suivi pédagogique** (25/09/2026) — prochain à prendre entre le 26/09 et le 06/11
- [x] Choisir la **track** : Entrepreneuriat (confirmée le 25/09/2026)
- [ ] Choisir les **2 axes complémentaires** de la track (Stratégie & Vision / Image & Message)

**Validation marché** — cœur de la note
- [ ] Saisir le [questionnaire](QUESTIONNAIRE_INTERVIEWS.md) dans **Google Form** ([modèle](GOOGLE_FORM.md))
- [ ] Recruter et mener **15–20 interviews** utilisateurs (gamers, télétravailleurs, streamers)
- [ ] Synthétiser via le [gabarit d'analyse](INTERVIEW_SYNTHESIS_TEMPLATE.md) → **décision pivot / consolidation**
- [ ] Mettre à jour [étude de marché](ETUDE_DE_MARCHE.md) + [BMC](BUSINESS_MODEL_CANVAS.md) avec les vrais chiffres (remplacer les « Hypothèse »)

**Produit**
- [ ] Premier **build + run sur machine dev** (Fedora) : `cargo test`, app desktop, cloud (déjà vérifié — garder vert)
- [x] Corriger le **bug volume Windows (Core Audio)** (#1)
- [ ] Prioriser le **scope MVP** à partir des interviews

**🔒 Jalon semaine du 19/10/2026 — choix des objectifs de track sur l'intra (irréversible)**
- [ ] Objectifs de track rédigés, relus par le référent, **figés**

---

## Phase 1 — MVP & Beta Test Plan · **Oct 2026 → Jan 2027**
*Objectif : un MVP démontrable + le BTP validé.*

**Produit**
- [ ] Geler la liste des **fonctionnalités MVP démontrables** (pas le scope complet)
- [ ] MVP fonctionnel de bout en bout : modes, activation, automatisation, sync
- [ ] **Déploiement** d'une première version installable (installeur desktop)

**Livrable central — BTP**
- [ ] Finaliser le [Beta Test Plan](BTP_BETA_TEST_PLAN.md) (features beta, protocole de test, critères de succès)
- [ ] **Rendre le BTP v1** ✅ *le 07/02/2027*

**Entrepreneuriat**
- [ ] [KPIs & modèle financier](FINANCIAL_MODEL.md) : remplacer les hypothèses par des données réelles
- [ ] [Roadmap produit](ROADMAP_PRODUIT.md) mise à jour post-interviews

**RNCP (blocs 5/6/7)**
- [ ] Bloc 6 — **stratégie de déploiement / CI-CD** opérationnelle et documentée
- [ ] Bloc 5 — **QA** : plan de tests appliqué (Rust + Vitest + Playwright déjà en place → l'étoffer)
- [ ] Bloc 7 — **gestion de projet** : board à jour, comptes-rendus de suivi archivés

---

## Phase 2 — Bêta, itérations & Greenlight blanc · **Jan → Avr 2027**
*Objectif : ≥ 2 cycles d'itération sur retours réels + réussir la répétition.*

**Bêta-test**
- [ ] Recruter **≥ 20 bêta-testeurs actifs** ([plan de recrutement](BETA_RECRUITMENT_AND_PARTNERSHIPS.md))
- [ ] **Cycle d'itération 1** : release → collecte feedback → correctifs
- [ ] **Cycle d'itération 2** : release → collecte feedback → correctifs
- [ ] Documenter les décisions (ce qui a changé grâce aux retours) — attendu par le jury

**Comms / image**
- [ ] Lancer les **comptes réseaux** + [calendrier éditorial](SOCIAL_EDITORIAL_CALENDAR.md) (drafts [prêts](SOCIAL_POSTS_DRAFTS.md))
- [ ] Compléter le [pitch deck](PITCH_PRESENTATION.md) avec **noms d'équipe** ⚠️ et chiffres réels

**🎥 Jalon 05/04 → 16/04/2027 — Greenlight BLANC** (BTP final rendu le 04/04/2027)
- [ ] Répéter le **pitch + démo** en conditions réelles
- [ ] Intégrer le feedback du jury blanc dans un plan d'action jusqu'en juillet

---

## Phase 3 — Finalisation & jury final · **Avr → Juil 2027**
*Objectif : projet déployé + démo live impeccable.*

**Produit**
- [ ] **Version finale déployée** et installable (la démo se fait EN LIVE — aucune vidéo autorisée)
- [ ] **Plan B de démo** : environnement de secours testé (réseau, machine, comptes)
- [ ] Répétitions chronométrées de la démo (multiples passages)

**Dossiers jury**
- [ ] Dossier **Greenlight** finalisé (BTP, preuves marché, itérations, KPIs)
- [ ] Dossier **RNCP** (blocs 5/6/7) complet et relu
- [ ] Support de présentation figé (1 h Greenlight + 1 h RNCP, même journée)

**Administratif / légal**
- [ ] Faire **valider les documents légaux** (CGU, confidentialité, mentions) par un pro ⚠️
- [ ] Vérifier disponibilité + éventuel dépôt de la marque **« Nexum »** ⚠️
- [ ] Décision sur la **constitution juridique** si commercialisation visée ⚠️

**🏆 Jalon 05/07 → 16/07/2027 — Greenlight + RNCP (présentiel, Kremlin-Bicêtre)**
- [ ] Matériel prêt (machine de démo, adaptateurs, connexion de secours)
- [ ] Répétition finale J-1

---

## Conditions de réussite (« definition of done » jury)

- **Marché** : 15–20 interviews synthétisées + décision pivot/consolidation argumentée.
- **MVP** : ≥ 20 bêta-testeurs, **2 cycles d'itération** tracés sur des retours réels.
- **Démo** : projet **déployé**, démontré **en live** (vidéo interdite), avec plan de secours.
- **Outils entrepreneuriat** : BMC, KPIs + projections financières, roadmap — maîtrisés à l'oral.
- **BTP** : v1 rendue le **07/02/2027**, version finale le **04/04/2027**, entièrement réalisée.
- **RNCP** : blocs 5 (QA), 6 (déploiement), 7 (gestion de projet) démontrés.

## Risques à surveiller

| Risque | Parade |
|---|---|
| Interviews qui glissent → scope non validé à temps | Bloquer un créneau/semaine dès juillet ; viser 2 interviews/semaine |
| Démo live qui échoue le jour J | Environnement de secours + répétitions chronométrées dès juin 2027 |
| BTP trop léger → no-go | Viser large et honnête : chaque intégration de compte = une feature ; montrer une V1 au suivi dès novembre 2026 |
| Objectifs de track figés « au hasard » en octobre | Les dériver des interviews, relus par le référent avant de figer |
| Bêta-testeurs inactifs | Sur-recruter (viser 30 pour en garder 20 actifs) ; partenariats (assos gaming) |

---

*Voir aussi : [DELIVERABLES_TRACKER](DELIVERABLES_TRACKER.md) (état des livrables), [OBJECTIFS](OBJECTIFS.md), [ROADMAP_PRODUIT](ROADMAP_PRODUIT.md), et le plan technique racine `NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`.*
