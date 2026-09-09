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
| 🔒 Verrouillage des objectifs de track | **Octobre 2026** | Aucun changement possible après |
| 📄 BTP validé par le référent | **Janvier 2027** | Document central du Greenlight |
| 🎥 Greenlight blanc (visio, 1 h) | **Avril 2027** | Répétition générale notée |
| 🏆 Greenlight + jury RNCP (présentiel, Kremlin-Bicêtre) | **Juillet 2027** | **Démo live du projet déployé — vidéo interdite** |

## Cadence & contacts

- Suivis pédagogiques + mentor : **toutes les 6 semaines en PGE4**, **mensuels en PGE5**.
  Caméra obligatoire, chaque suivi doit montrer une progression.
- Coordinatrices : **Lisa Nay, Faizal Nguyen** — via **help.epitech.eu** (pas Teams).
- Rituel équipe conseillé : **stand-up hebdo (30 min)** + **revue de sprint toutes les 2 semaines**.

## Rôles (à assigner) ⚠️

| Rôle | Personne | Responsabilité principale |
|---|---|---|
| Lead produit / PM | ⚠️ | Roadmap, board, jalons, suivi intra |
| Dev / tech | ⚠️ | Build, déploiement, MVP, RNCP QA/déploiement |
| Marché / business | ⚠️ | Interviews, BMC, KPIs, modèle financier |
| Comms / image | ⚠️ | Réseaux sociaux, pitch, image de marque |

---

## Phase 0 — Fondations & validation marché · **Juil → Oct 2026**
*Objectif : preuve du besoin + scope figé + objectifs de track verrouillés.*

**Administratif EIP**
- [ ] Créer/valider le groupe projet sur l'**intra EIP** ⚠️
- [ ] Créer le **dépôt GitHub** (voir [GITHUB_SETUP](../GITHUB_SETUP.md)) + board (Projects) + issues des jalons
- [ ] Premier **suivi pédagogique** planifié (caméra ON)
- [ ] Choisir les **2 axes complémentaires** de la track (Stratégie & Vision / Image & Message)

**Validation marché** — cœur de la note
- [ ] Saisir le [questionnaire](QUESTIONNAIRE_INTERVIEWS.md) dans **Google Form** ([modèle](GOOGLE_FORM.md))
- [ ] Recruter et mener **15–20 interviews** utilisateurs (gamers, télétravailleurs, streamers)
- [ ] Synthétiser via le [gabarit d'analyse](INTERVIEW_SYNTHESIS_TEMPLATE.md) → **décision pivot / consolidation**
- [ ] Mettre à jour [étude de marché](ETUDE_DE_MARCHE.md) + [BMC](BUSINESS_MODEL_CANVAS.md) avec les vrais chiffres (remplacer les « Hypothèse »)

**Produit**
- [ ] Premier **build + run sur machine dev** (Fedora) : `cargo test`, app desktop, cloud (déjà vérifié — garder vert)
- [ ] Corriger le **bug volume Windows (Core Audio)** ⚠️
- [ ] Prioriser le **scope MVP** à partir des interviews

**🔒 Jalon Octobre 2026 — VERROUILLAGE des objectifs de track (irréversible)**
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
- [ ] **Faire valider le BTP par le référent EIP** ✅ *avant janvier 2027*

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

**🎥 Jalon Avril 2027 — Greenlight BLANC (visio 1 h)**
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

**🏆 Jalon Juillet 2027 — Greenlight + RNCP (présentiel, Kremlin-Bicêtre)**
- [ ] Matériel prêt (machine de démo, adaptateurs, connexion de secours)
- [ ] Répétition finale J-1

---

## Conditions de réussite (« definition of done » jury)

- **Marché** : 15–20 interviews synthétisées + décision pivot/consolidation argumentée.
- **MVP** : ≥ 20 bêta-testeurs, **2 cycles d'itération** tracés sur des retours réels.
- **Démo** : projet **déployé**, démontré **en live** (vidéo interdite), avec plan de secours.
- **Outils entrepreneuriat** : BMC, KPIs + projections financières, roadmap — maîtrisés à l'oral.
- **BTP** : validé par le référent **avant janvier 2027**.
- **RNCP** : blocs 5 (QA), 6 (déploiement), 7 (gestion de projet) démontrés.

## Risques à surveiller

| Risque | Parade |
|---|---|
| Interviews qui glissent → scope non validé à temps | Bloquer un créneau/semaine dès juillet ; viser 2 interviews/semaine |
| Démo live qui échoue le jour J | Environnement de secours + répétitions chronométrées dès juin 2027 |
| BTP non validé à temps | Soumettre une V1 au référent **dès novembre 2026** |
| Objectifs de track figés « au hasard » en octobre | Les dériver des interviews, relus par le référent avant de figer |
| Bêta-testeurs inactifs | Sur-recruter (viser 30 pour en garder 20 actifs) ; partenariats (assos gaming) |

---

*Voir aussi : [DELIVERABLES_TRACKER](DELIVERABLES_TRACKER.md) (état des livrables), [OBJECTIFS](OBJECTIFS.md), [ROADMAP_PRODUIT](ROADMAP_PRODUIT.md), et le plan technique racine `NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`.*
