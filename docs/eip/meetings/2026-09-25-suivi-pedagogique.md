# Réunion du 2026-09-25 — Premier suivi pédagogique EIP

> Compte-rendu de réunion, conservé pour traçabilité. Les décisions actionnables ont été
> reportées dans les issues GitHub (voir « Suivi » en bas de page).

## Présentation du projet (tour de table)

- App de contrôle centralisé : connecte logiciels et matériel via des profils / modes.
  - UI style PS5, démo fonctionnelle montrée (volume, luminosité, Steam).
  - Marketplace et sync cloud encore en maquette.
  - Connexion des messageries (Teams, Outlook, Gmail) en cours de réflexion.
- Répartition des rôles :
  - Back : Raphaël et Max (architecture, système de plugins).
  - Front : Rares (principal), Arnaud (support + compatibilité macOS / iOS).
  - Business / KPI / CI-CD : Enzo.
- Mentor (première réunion) : a poussé vers une IA centralisée type « Jarvis ».
  - L'équipe a du mal à aligner cette vision avec le coût des API.
  - Commande vocale envisagée, à intégrer dans le BTP.

## Suivi pédagogique

- Premier suivi EIP. Prochain rendez-vous à prendre entre le 26/09 et le 06/11.
- Semaine du 19/10 : choisir la track EIP (**Entrepreneuriat confirmée**) et les objectifs
  majeurs / mineurs.
- BTP (Beta Test Plan) : fichier listant toutes les fonctionnalités à réaliser.
  - Rendu intermédiaire en février, rendu final en avril.
  - Greenlight en juillet : go / no-go sur deux critères :
    1. BTP suffisamment conséquent (quantité de travail pour 5 personnes sur un an) ;
    2. BTP entièrement réalisé (toutes les features validées).
  - Risque de no-go si le BTP est trop léger ou partiellement réalisé.
- Budget EIP disponible : matériel (Philips Hue, etc.) et abonnements API finançables s'ils
  sont justifiés.

## Avertissements sur la track Entrepreneuriat

- Le Greenlight exige des résultats concrets : testeurs, clients, retours, partenariats.
- Réseaux sociaux à lancer immédiatement : Instagram, TikTok, LinkedIn (et potentiellement X).
  - Poster régulièrement, partager l'aventure du projet.
  - Objectif : followers, Discord, partenariats visibles au Greenlight.
- BTP : viser large et honnête, ne pas sous-estimer le nombre de features.
  - Ajouter un compte Google et un compte Outlook = deux features distinctes.
  - Des équipes ont eu un no-go avec un BTP trop léger, même en ayant fait plus que prévu.

## À faire d'ici la prochaine réunion

- [ ] Créer les comptes Instagram, LinkedIn, TikTok (Arnaud + Rares, avant mi-octobre) — #28
- [ ] Finaliser la charte graphique et le logo avant de publier (Arnaud + Rares) — #27
- [ ] Choisir les objectifs de track sur l'intra (semaine du 19/10, tout le groupe) — #26
- [ ] Étude de marché : chiffres clés + interviews utilisateurs (Enzo) — #25, #24
- [ ] Installateur et updater fonctionnels (Raphaël) — #21, #50
- [ ] Architecture plugins (Max, avec Raphaël) + début Android (Max) — #23, #36
- [ ] Commencer l'intégration des messageries (Rares) — #6, #95, #96, #97
- [ ] Acheter un kit Philips Hue + pont pour tester le matériel (Rares) — #98
- [ ] Reprendre rendez-vous pour le prochain suivi — #46

## Suivi — changements sur GitHub

- Business / KPI : #24, #25, #29, #37 attribuées à Enzo seul ; Enzo retiré de #27 (la comms
  reste à Arnaud + Rares).
- #23 (plugins) → Max + Raphaël, passée en Phase 1.
- #21 (installateurs) et #50 (updater) passées en Phase 1.
- #6 (messagerie centralisée) → Rares, passée en Phase 1, découpée en sous-tickets
  #95 Gmail, #96 Outlook, #97 Teams.
- Nouvelles issues : #94 commande vocale pour lancer un mode (Phase 2, dans le BTP ; la
  version « Jarvis » complète reste dans #59), #98 achat du kit Philips Hue.
- Commentaires ajoutés avec les décisions sur #26, #28, #30, #46, #59.
