# Documents EIP — Nexum

Livrables pour le jury EIP (piste Entrepreneuriat). Tous rédigés en français,
cohérents avec **`_BRIEF_PROJET.md`** (source de vérité factuelle — à mettre à
jour en premier si un chiffre/persona change).

## Livrables officiels EIP

Ce qu'Epitech demande dans les documents G-EIP-600, où le trouver dans le dépôt et où le rendre.
Le dépôt n'a pas de dossier imposé : les livrables jury vivent dans `docs/eip/`, les documents
« Structure » dans `docs/`. État au 20/10/2026, à mettre à jour à chaque rendu.

| Livrable officiel | Fichiers dans le dépôt | Où le rendre | Échéance | Ticket | État |
|---|---|---|---|---|---|
| **Plan d'action** « Highway to Tech4 » : contexte, spécifications techniques, notes d'intention | [`plan-action/`](./plan-action/) (partie 2 faite) | Plateforme EIP | **23/10/2026** (équipe) | #113 | En cours : parties 1 et 3 à écrire |
| **Structure** : `deployment.md`, `testing_policy.md`, `technology_environment.md`, stratégie de branches, CI/CD | [`../deployment.md`](../deployment.md), [`../testing_policy.md`](../testing_policy.md), [`../technology_environment.md`](../technology_environment.md) | Dans le dépôt | aucune | | Rédigés ; la CI build et teste, le déploiement reste à faire (#48, #21) |
| **Workshop Client needs** : 2-3 personas, user stories, backlog MoSCoW | [`USER_JOURNEYS.md`](./USER_JOURNEYS.md), user stories dans [`plan-action/2-specs-techniques.md`](./plan-action/2-specs-techniques.md) | Support de présentation | Phase 1 | #102, #107 | En cours : priorisation MoSCoW à faire |
| **Workshop Context, audit & compliance** : benchmark concurrentiel, état de l'art, rapport de conformité (RGPD, OWASP, accessibilité), matrice des compétences | [`ANALYSE_CONCURRENTIELLE.md`](./ANALYSE_CONCURRENTIELLE.md), [`MATRICE_COMPETENCES.md`](./MATRICE_COMPETENCES.md) | Support de présentation | **06/11/2026** (matrice), 30/11/2026 (conformité) | #110, #131, #132, #64 | En cours : matrice à remplir ; état de l'art (#131) et rapport de conformité (#132) à faire |
| **Workshop Costs** : ressources, comparatif de 2-3 fournisseurs, CAPEX/OPEX, coût à 1k et 10k utilisateurs | [`FINANCIAL_MODEL.md`](./FINANCIAL_MODEL.md) (en partie) | Support de présentation | Phase 1 | #111 | À faire |
| **Workshop Tech & func specs** : architecture C4 niveau 2, decision record, modèle de données, contrat d'API, maquettes Figma | [`../ARCHITECTURE.md`](../ARCHITECTURE.md), [`../adr/`](../adr/) | Support de présentation | Phase 1 | #108, #109 | En cours |
| **Workshop Impacts & risks** : matrice de 3 risques ou plus, GreenIT, résilience | [`../rncp/RISK_REGISTER.md`](../rncp/RISK_REGISTER.md) | Support de présentation | Phase 1 | #112 | En cours |
| **Workshops Diversifiers et Time Machine** : exercices d'idéation | | Atelier | début d'année | | À vérifier : sans doute déjà faits |
| **Objectifs de la track Entrepreneuriat** : validation marché, outils entrepreneuriaux, objectifs B et C | [`OBJECTIFS.md`](./OBJECTIFS.md) | Suivis et Greenlight | Greenlight | #24, #25, #101 | En cours |
| **Comptes rendus de suivi** : envoyés au mentor 48 à 72 h avant chaque séance | [`meetings/`](./meetings/) | Mentor | **06/11/2026** (suivi du 09/11) | #120 | En continu |
| **Beta Test Plan** : rôles, fonctionnalités par parcours, critères de réussite, 1-2 pages | [`beta_test_plan.md`](./beta_test_plan.md) (annexe : [`BTP_BETA_TEST_PLAN.md`](./BTP_BETA_TEST_PLAN.md)) | Section documents du projet sur eip.epitech.eu | **07/02/2027** | | Brouillon à valider en équipe |
| **Greenlight blanc** : démo en direct + présentation | [`PITCH_PRESENTATION.md`](./PITCH_PRESENTATION.md) | Jury, en visio | **04/04/2027** | | À venir |
| **Greenlight + RNCP** : démo en direct sans vidéo, présentation, livrables entrepreneuriaux | [`PITCH_PRESENTATION.md`](./PITCH_PRESENTATION.md) | Jury, en présentiel | **05/07/2027** | | À venir |

## Tous les documents

| Document | Contenu | Usage jury |
|---|---|---|
| [`_BRIEF_PROJET.md`](./_BRIEF_PROJET.md) | Référence factuelle partagée (personas, chiffres, dates). | Interne |
| [`PLAN_EXECUTION_EQUIPE.md`](./PLAN_EXECUTION_EQUIPE.md) | **Checklist & calendrier d'exécution** (Juil 2026 → Juil 2027) : qui fait quoi, pour quand, par phase + jalons. | **Pilotage équipe** |
| [`DELIVERABLES_TRACKER.md`](./DELIVERABLES_TRACKER.md) | État honnête de chaque livrable (✅ / 📝 / 🎯). | Pilotage équipe |
| [`BTP_BETA_TEST_PLAN.md`](./BTP_BETA_TEST_PLAN.md) | **Beta Test Plan** — 19 fonctionnalités, 12 scénarios de test, plan bêta, DoD. | **Rendu janvier 2027 · doc central du Greenlight** |
| [`ETUDE_DE_MARCHE.md`](./ETUDE_DE_MARCHE.md) | Étude de marché + plan marketing (TAM/SAM/SOM, canaux, AARRR). | Validation marché |
| [`ANALYSE_CONCURRENTIELLE.md`](./ANALYSE_CONCURRENTIELLE.md) | Mapping concurrentiel + positionnement + réponses aux menaces. | Stratégie & vision |
| [`BUSINESS_MODEL_CANVAS.md`](./BUSINESS_MODEL_CANVAS.md) | Les 9 blocs du BMC + tarification. | Outils entrepreneuriaux |
| [`KPIS_ET_PROJECTIONS.md`](./KPIS_ET_PROJECTIONS.md) | KPIs produit/business + modèle financier 3 ans + point mort. | Outils entrepreneuriaux |
| [`QUESTIONNAIRE_INTERVIEWS.md`](./QUESTIONNAIRE_INTERVIEWS.md) | Guide d'entretien (style Mom Test) + Google Form + grille d'analyse. | 15-20 interviews (obligatoire) |
| [`USER_JOURNEYS.md`](./USER_JOURNEYS.md) | Personas détaillés + journey maps + empathy map. | UX / validation |
| [`PITCH_PRESENTATION.md`](./PITCH_PRESENTATION.md) | Deck 18 slides + script de démo live + FAQ jury. | Soutenance |
| [`ROADMAP_PRODUIT.md`](./ROADMAP_PRODUIT.md) | Roadmap produit (gantt) alignée calendrier EIP + vision post-EIP. | Vision |
| [`GOOGLE_FORM.md`](./GOOGLE_FORM.md) | Questionnaire quantitatif prêt à saisir dans Google Forms (32 items, logique, RGPD). | Validation marché |
| [`INTERVIEW_SYNTHESIS_TEMPLATE.md`](./INTERVIEW_SYNTHESIS_TEMPLATE.md) | Gabarit de dépouillement des 15-20 entretiens (+ 2 fiches exemple). | Validation marché |
| [`FINANCIAL_MODEL.md`](./FINANCIAL_MODEL.md) | Modèle financier 3 ans détaillé (MRR/coûts/point mort, 3 scénarios). | Outils entrepreneuriaux |
| [`SOCIAL_EDITORIAL_CALENDAR.md`](./SOCIAL_EDITORIAL_CALENDAR.md) | Plan de contenu & calendrier éditorial (IG/LinkedIn), 10 semaines. | Image & message |
| [`BETA_RECRUITMENT_AND_PARTNERSHIPS.md`](./BETA_RECRUITMENT_AND_PARTNERSHIPS.md) | Recrutement 20+ bêta-testeurs + partenaires + templates d'email. | Traction |
| [`ONE_PAGER.md`](./ONE_PAGER.md) | Fiche projet une page (résumé exécutif). | Pitch / mentors |
| [`plan-action/2-specs-techniques.md`](./plan-action/2-specs-techniques.md) | Partie 2 du plan d'action « Highway to Tech4 » : stack, 46 user stories avec critère et état, 4 jalons datés. | **Plan d'action à déposer sur la plateforme EIP (#113)** |
| [`MATRICE_COMPETENCES.md`](./MATRICE_COMPETENCES.md) | Matrice des compétences (techniques et humaines), analyses individuelles, points forts, manques et plan pour les combler. | **Workshop « Context, audit & compliance » (#110)** |
| [`OBJECTIFS.md`](./OBJECTIFS.md) | Fiches des 4 objectifs de track (déf. → preuves → statut → à faire) + comptes/liens à créer. | Suivi objectifs |
| [`SOCIAL_POSTS_DRAFTS.md`](./SOCIAL_POSTS_DRAFTS.md) | Brouillons de posts (IG + LinkedIn) prêts à publier, avec visuels dans `../brand/social/`. | Image & message |

> ⚠️ Certains documents contiennent des marqueurs « Hypothèse » ou ⚠️ : ce sont
> des valeurs à confirmer avec les données réelles (interviews, bêta) avant la
> soutenance. Le plan technique global est à la racine :
> [`../../../NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`](../../../NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md).
