# Nexum — Attribution des tâches par membre

> Suite à la réunion du 2026-09-14 (`docs/eip/meetings/2026-09-14-fonctionnalites-organisation.md`),
> prochaine étape actée : *« Attribuer les tickets GitHub à chaque membre »*. Ce document liste
> les 21 issues déjà créées (voir `docs/GITHUB_SETUP.md` et le board
> https://github.com/orgs/TeamNexum/projects/1) regroupées par zone technique, plus les tâches
> non-techniques du plan d'exécution (`PLAN_EXECUTION_EQUIPE.md`), pour pouvoir les assigner.
>
> **Mise à jour 2026-09-22 :** roster confirmé par Arnaud, assignation faite sur GitHub via
> `gh issue edit <n> --add-assignee <user>` (vérifié avec `gh issue list --json
> number,assignees`).

## Roster (confirmé 2026-09-22)

| Prénom | Nom complet | Compte GitHub | Rôle | Statut |
|---|---|---|---|---|
| Arnaud | Arnaud Jouan | `Arjouan` | Généraliste (un peu de tout, front + back) + PM/lead | ✅ confirmé |
| Rares | Rares Dragomir | `RaresFZ` | Généraliste (un peu de tout) + **main dev Front** | ✅ confirmé |
| Max | Max Epinat | `Max-Epinat` (= `MaxCrimson`, même personne/compte) | **Main dev Back** | ✅ confirmé |
| Raph | Raphael Grissonnanche | `Raphie10` | Back (aide Max) + Database/CI-CD (intérim, voir Enzo) | ✅ confirmé |
| Enzo | ? | — | Database + CI/CD | ⚠️ n'a pas encore rejoint le repo GitHub — Raph couvre en attendant |
| — (Comms/image) | ? | ? | Réseaux sociaux + design | ⚠️ non réparti (voir plus bas) |
| — (Marché/business) | ? | ? | Interviews, BMC, KPIs | ⚠️ non réparti (voir plus bas) |

Pas de membres dédiés "Front/Back" séparés : Arnaud et Rares touchent un peu de tout, donc les
tickets qui mélangent front et back leur reviennent en binôme.

## Tickets GitHub — Phase 0 (Fondations, à faire en premier)

| # | Titre | Zone | Assigné |
|---|---|---|---|
| [#1](../../../issues/1) | feat(adapters): Windows volume via Core Audio | Back | Max |
| [#2](../../../issues/2) | chore(schema): wire ts-rs → packages/schema-ts | Database/CI-CD | Raph *(intérim — Enzo pas encore sur le repo)* |
| [#3](../../../issues/3) | feat(store): SqliteStore dans l'app desktop | Back | Max |
| [#4](../../../issues/4) | feat(adapters): Philips Hue scene lookup réel | Back | Raph |
| [#5](../../../issues/5) | test(e2e): Tauri end-to-end smoke test | Database/CI-CD | Raph *(intérim — Enzo pas encore sur le repo)* |
| [#12](../../../issues/12) | feat(adapters): display/brightness réel | Back | Max |

## Tickets GitHub — Phase 1 (MVP + BTP)

| # | Titre | Zone | Assigné |
|---|---|---|---|
| [#7](../../../issues/7) | feat(ui): hub centralisé de gestion des modes | Front | Rares |
| [#8](../../../issues/8) | feat(ui): gestion granulaire par élément dans un mode | Front | Rares |
| [#9](../../../issues/9) | feat(ui): panneau de contrôle par app (Task Manager) | Front | Rares |
| [#10](../../../issues/10) | feat(core): notifications contextuelles selon le mode | Back | Max |
| [#11](../../../issues/11) | feat(setup): onboarding premier lancement — détection des intégrations + appairage Hue | Front + Back | Arnaud + Rares |
| [#13](../../../issues/13) | feat(ui): éditeur no-code pour créer un mode | Front | Rares |
| [#14](../../../issues/14) | feat(cloud): auth + sync cloud minimale (axum/PostgreSQL) | Database/CI-CD | Raph *(intérim — Enzo pas encore sur le repo)* |

## Tickets GitHub — Phase 2 (Bêta, itérations, Greenlight blanc)

| # | Titre | Zone | Assigné |
|---|---|---|---|
| [#6](../../../issues/6) | feat: Unified inbox (messages/emails agrégés) | Front + Back | Arnaud + Rares |
| [#15](../../../issues/15) | feat(core): moteur d'automatisation SI/ALORS | Back | Raph |
| [#16](../../../issues/16) | feat(marketplace): partage + import de modes (v1) | Front + Back | Arnaud + Rares |
| [#17](../../../issues/17) | feat(marketplace): allowlist + score de risque IA + modération | Front + Back | Arnaud + Rares |
| [#18](../../../issues/18) | feat(mobile): télécommande — activer un mode à distance | Front + Back | Arnaud + Rares |
| [#23](../../../issues/23) | feat(extensions): extensions installables à la demande (« modèle DLC », scindé de #11) | Front + Back | Arnaud + Rares |

## Tickets GitHub — Phase 3 (Finalisation & jury)

| # | Titre | Zone | Assigné |
|---|---|---|---|
| [#19](../../../issues/19) | feat(ai): démonstrateur Mode-as-Code (NL → LLM → DSL) | Back | Max |
| [#20](../../../issues/20) | chore(hardening): gestion d'erreurs / dégradation adapters | Back | Max |
| [#21](../../../issues/21) | chore(release): installeurs Windows/Linux signés | Database/CI-CD | Raph *(intérim — Enzo pas encore sur le repo)* |

*Max porte le gros du Back (6 tickets solo) puisqu'il en est le main dev ; Raph l'aide sur 2
tickets Back en plus de couvrir tout le Database/CI-CD en intérim. Rares porte tout le Front (4
tickets solo) en plus des 5 tickets mixtes Front+Back avec Arnaud. À rééquilibrer librement selon
la charge réelle.*

## Tâches non-techniques (pas de ticket GitHub — voir `PLAN_EXECUTION_EQUIPE.md`)

Ces tâches n'ont pas encore de ticket GitHub (elles ne sont pas du code) mais font partie de la
« définition of done » du jury EIP. Rôles du CR : « un membre pour les designs, un pour les
textes » (réseaux sociaux), et un rôle Marché/business globalement non nommé.

| Tâche | Rôle (PLAN_EXECUTION_EQUIPE) | Assigné proposé | Échéance |
|---|---|---|---|
| 15–20 interviews utilisateurs + synthèse | Marché/business | ⚠️ non nommé | Avant verrouillage (oct. 2026) |
| BMC + étude de marché (remplacer les hypothèses) | Marché/business | ⚠️ non nommé | Phase 0/1 |
| KPIs & modèle financier (chiffres réels) | Marché/business | ⚠️ non nommé | Phase 1 |
| Décision logo : Gemini vs. contact école d'art | Comms/image | Arnaud (a le contact) | Avant lancement des posts |
| Lancer comptes Instagram + LinkedIn, calendrier éditorial | Comms/image — designs | ⚠️ non nommé | Phase 2 |
| Rédaction des textes (posts, annonces) | Comms/image — textes | ⚠️ non nommé | Phase 2 |
| Pitch deck : compléter noms d'équipe + chiffres réels | Lead produit/PM | Arnaud | Phase 2 |
| BTP : faire valider par le référent EIP | Lead produit/PM | Arnaud | Avant janvier 2027 |

## Prochaine étape

1. ✅ Roster confirmé et assignation réelle faite sur GitHub pour les 21 tickets (Database/CI-CD
   couvert en intérim par Raph, à transférer à Enzo une fois qu'il rejoint le repo).
2. ✅ Tableau « Rôles » de `PLAN_EXECUTION_EQUIPE.md` mis à jour avec les mêmes noms.
3. Restant à faire :
   - Inviter Enzo sur `TeamNexum/Nexum` (GitHub → Settings → Collaborators), puis décider avec
     Raph comment se répartir #2, #5, #14, #21 à ce moment-là.
   - Nommer qui prend Marché/business et Comms/image (designs vs. textes) — toujours ⚠️ dans le
     tableau des tâches non-techniques plus haut.
