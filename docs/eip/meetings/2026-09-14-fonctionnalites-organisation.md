# Réunion du 2026-09-14 — Fonctionnalités, organisation du code, réseaux sociaux

> Compte-rendu brut de réunion, conservé tel quel pour traçabilité. Les décisions actionnables
> ont été transformées en issues GitHub (voir liens ci-dessous) ou reflétées dans les docs
> existants (`docs/eip/ROADMAP_PRODUIT.md`, `docs/eip/PLAN_EXECUTION_EQUIPE.md`,
> `docs/brand/`).

## Fonctionnalités retenues

- Hub centralisé pour gérer les différents modes (messagerie, jeux, travail, etc.).
- Gestion granulaire des éléments dans un mode — pas de bouton "enlever le mode" global :
  une fenêtre de gestion par élément.
- Inspiré du Task Manager, avec contrôle par app (volume, notifications, etc.).
- Notifications contextuelles selon le mode actif (ex : WhatsApp visible si mode travail
  lancé avec WhatsApp).
- Produit de base = contrôles PC natifs (volume, luminosité, etc.).
- Extensions optionnelles via setup wizard (Steam, WhatsApp, Outlook, etc.).
- Modèle "DLC" : on n'installe que ce qu'on utilise.

→ Transformé en issues #7–#11 (voir section Suivi ci-dessous).

## Organisation du code et des tâches

- Répartition des rôles évoquée :
  - Front : Arnaud + un autre membre.
  - Front/Back : deux autres membres.
  - Back : Raph (avec Max).
  - Database + CI/CD : Enzo.
  - (Noms complets pas encore saisis dans `docs/eip/PLAN_EXECUTION_EQUIPE.md` — à compléter
    quand la liste nominative sera figée.)
- Workflow GitHub déjà en place (milestones, phases 0 à 3, tickets, assignees) —
  voir `docs/GITHUB_SETUP.md`.
- Chaque tâche = une branche dédiée, merge dans `unstable`, puis merge vers `main`.
- Ticket terminé → statut "review" → relecture par un autre membre → merge.
- Objectif : tester avant de push pour éviter les régressions.
- Plan : passer toutes les fonctionnalités à ChatGPT pour générer une liste détaillée, afin de
  présenter un volume convaincant à la prochaine réunion, puis attribuer les tickets GitHub à
  chacun.

## Réseaux sociaux et design

- Plateformes : Instagram + LinkedIn.
  - Instagram : ton décalé/fun, contenu varié pour coller à la DA des autres startups.
  - LinkedIn : posts sérieux, annonces de fonctionnalités.
- Organisation du contenu : un membre pour les designs, un pour les textes.
- Workflow design : Gemini pour le background/inspiration, puis retravail sur Figma.
- Logo et identité visuelle à finaliser avant de lancer les posts :
  - Option 1 : générer avec Gemini.
  - Option 2 : contacter une connaissance en école d'art (Arnaud).
- Document de DA à rédiger : style visuel souhaité, description du produit, logos de
  référence.

**Note (2026-09-14) :** ce chantier est déjà largement couvert par
`docs/brand/BRAND_GUIDELINES.md` (charte complète : mission, positionnement, logo, palette,
typo, iconographie, accessibilité), `docs/brand/PALETTE.md`, `docs/brand/DESIGN_PROMPTS.md`
(prompts IA prêts à l'emploi pour le logo et l'UI) et les fichiers `docs/brand/logo-mark.svg`
/ `logo-wordmark.svg` déjà présents dans le repo. Reste réellement ouvert : la **décision**
entre Option 1 (Gemini) et Option 2 (contact école d'art) pour un éventuel refresh du logo,
et le calendrier éditorial (`docs/eip/SOCIAL_EDITORIAL_CALENDAR.md`,
`docs/eip/SOCIAL_POSTS_DRAFTS.md` existent déjà en draft).

## Prochaines étapes

- [ ] Générer la liste complète des fonctionnalités via ChatGPT (volume pour la prochaine
      réunion).
- [x] Attribuer les tickets GitHub à chaque membre (Arnaud) — fait le 2026-09-22, voir `docs/eip/TASK_ASSIGNMENTS.md`.
- [ ] Rédiger le document de DA — *déjà fait pour l'essentiel, voir note ci-dessus ; reste la
      décision logo.*
- [ ] Contacter la connaissance en école d'art pour le logo (Arnaud).

## Suivi — issues créées depuis cette réunion

- #7 `feat(ui): hub centralisé de gestion des modes`
- #8 `feat(ui): gestion granulaire par élément dans un mode`
- #9 `feat(ui): panneau de contrôle par app façon Task Manager`
- #10 `feat(core): notifications contextuelles selon le mode actif`
- #11 `feat(setup): wizard d'installation d'extensions optionnelles ("modèle DLC")` — recadré le 2026-09-25 en onboarding + appairage Hue ; le vrai modèle DLC est dans #23
