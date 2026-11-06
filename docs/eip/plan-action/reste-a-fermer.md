# Ce qui reste ouvert dans le plan d'action

Rien n'est fermé par ce fichier. Les propositions de personnes et les durées sont **des estimations de l'auteur du plan**, à corriger par l'équipe. Dernière mise à jour : 06/11/2026, après les décisions de l'équipe du jour (famille Travail, plateforme PC Windows, responsable du cloud Raphaël : ces trois points ne figurent plus ici, sauf la validation par le mentor).

| # | Champ ouvert | Où dans le plan | Qui peut le fermer (proposition) | Comment | Durée estimée |
|---|---|---|---|---|---|
| 1 | Rôles d'Arnaud et de Rares : « coordination » figure chez les deux ; arbitrage à faire (aucune des deux lignes n'a été modifiée pour cela ; la ligne d'Arnaud reste à compléter par lui) | 1.1 | Rares, avec Arnaud | Décider qui coordonne quoi, puis réécrire les deux lignes | 15 min |
| 2 | Validation par le mentor du choix de l'équipe : Travail, version concentration, PC Windows (présenté en séance 4) | En-tête, 2.3 (J1), 3.1, R3 | Rares présente ; le mentor valide | Séance 4 du 09/11 à 19 h 30, avec la matrice de priorisation du pack du 07/11 | séance du 09/11 |
| 3 | Système d'exploitation des testeurs : le questionnaire contient la question « Quel système tu utilises le plus ? » (Windows, macOS, Linux, Plusieurs ; `docs/eip/questionnaire/build-form.gs`, `GOOGLE_FORM.md` Q6), mais son résultat n'est ni dans le plan ni dans le dépôt. Mesurer le système d'exploitation des testeurs dans le registre des testeurs | 3.1 (registre des testeurs), J1 | Enzo | Lire la réponse dans l'export des 13 réponses ; ajouter la colonne « système » au registre des testeurs | 15 min, puis au fil des inscriptions |
| 4 | Dépôt sur l'intra impossible à ce jour : demander à David ou au référent la procédure, l'échéance et si le plan peut être joint au pack du 07/11 | En-tête, #113 | Rares | Message au mentor ou au référent ; noter la réponse dans #113 | 10 min |
| 5 | État des CI de NexumIOS et NexumAndroid | 2.1 (Qualité), US-42 | Arnaud (iOS), Max (Android) | Ouvrir l'onglet Actions de chaque dépôt privé, noter le dernier run de `main` et son résultat | 15 min par dépôt |
| 6 | Inscriptions réelles à la bêta (aucune au 04/11, information de l'équipe) | 3.1, R4 | Enzo | Compter les lignes du tableau des inscriptions, hors lignes de test | 10 min |
| 7 | Date du Greenlight blanc : 04/04 ou 05 au 16/04 ; mock Greenlight ; phases de test de fin novembre et de début janvier | 2.3 | Rares | Calendrier officiel de l'intra ou coordinatrices Epitech (help.epitech.eu) | 30 min |
| 8 | Tickets GitHub à aligner sur le plan : #21, #50, #69, #95 à #97, #6 ; #48 (assigné à Enzo) à réaligner sur Raphaël ; MoSCoW #107 à terminer | 2.3, 2.4 | Rares, avec les responsables de chaque ticket | Replacer chaque ticket dans le jalon du plan ; terminer #107 | 1 à 2 h |
| 9 | Suppression de la file `/api/direct/*` (#136) : encore présente dans `unstable` (`direct.rs`) | US-41, bilan, R12 | Raphaël (auteur de #134) ou Max (a fusionné) | Supprimer côté cloud, desktop, PWA et apps mobiles ; ajouter le renouvellement des jetons dans les apps mobiles | environ une demi-journée |
| 10 | Classification exacte de `calendar.readonly` chez Google | 2.2 | Rares ou Raphaël | Console Google Cloud, écran de consentement OAuth (utile seulement si Google Agenda redevient le choix) | 30 min |
| 11 | Microsoft : comptes personnels pour `Calendars.Read`, consentement administrateur pour `ChannelMessage.Read.All`, restrictions de consentement par un locataire | 2.2, R6, 3.1 | Rares (messagerie unifiée) | Documentation Microsoft Graph, puis essai avec un compte personnel et un compte d'école | 2 à 3 h |
| 12 | Fournisseur d'agenda Microsoft : à confirmer ou corriger par les entretiens | US-47, 2.2 | Enzo et l'équipe | Demander l'agenda utilisé dans les entretiens | pendant les entretiens |
| 13 | Prix de Signal RGB Pro (45 €/an cité par le mentor, non revérifié) | 3.2 | Enzo | Lire la page de tarifs dans un navigateur, corriger la mention | 10 min |
| 14 | Devises dans `docs/eip/meetings/2026-10-19-suivi-mentor.md` : « 45 $ » et « 149 $ » alors que le compte rendu du mentor écrit des euros (hors plan) | hors plan | Arnaud ou Rares (auteur du compte rendu d'équipe) | Corriger le fichier après vérification avec le compte rendu du mentor | 10 min |
| 15 | Relecture du mapping US → capacités du catalogue | 2.2, `mapping-us-nx.md` | Raphaël ou Max | Relire les 68 US et les 171 capacités comptées | 2 à 3 h |
| 16 | Tailles S/M/L/XL de toutes les US | 2.2 | Raphaël et Max | Revue en réunion | 1 h |
| 17 | Reste de la répartition en R15 (installateur à Max, mises à jour à Rares ; le cloud à Raphaël est décidé) | 2.4 | Max et Rares, avec Raphaël | Discussion, puis validation par Rares | 30 min |
| 18 | Valeurs « proposé » : seuils et dates (voir le tableau plus bas) | 2.4, 3.1 | Rares avec l'équipe | Confirmer ou corriger chaque ligne | 30 min |
| 19 | Décisions restantes du 09/11 : (2) jeu d'intitulés des deux objectifs complémentaires, (4) budget et hébergeur, (6) report du modèle économique de la marketplace | En-tête, 1.5, 1.6, 2.2 | Rares présente ; mentor pour (2) et (6) ; Ruben pour (4) | Séance 4 du 09/11 à 19 h 30 | séance du 09/11 |
| 20 | Réexamen des 10 capacités passées en Stretch (NX-16, 18, 91, 93, 96, 98 à 102) | `reclassement-catalogue-propose.md` | Raphaël ou Max | Après les premiers entretiens : y a-t-il un besoin exprimé ? | 30 min |
| 21 | Alignement des fichiers que le plan ne modifie pas : `beta_test_plan.md` (ajouts F43 à F64, retraits F5, F19, F20, F21, critère de F40, Windows seul en J1) et `OBJECTIFS.md` (lettres et objectifs, cibles d'entretiens et de testeurs) | `btp-ajouts-proposes.md` | Rares et Max | Valider les propositions, puis modifier les deux fichiers (non fait) | 1 à 2 h |
| 22 | Pack de preuves du 07/11 (comparatif testé, matrice, notes d'entretiens, registre des testeurs, état d'Android, coûts, cartographie des données) | 2.3, 3.1 | Enzo et Rares, avec les membres concernés | Voir la liste « sans preuve » remise avec la v3 | avant le 07/11 à 19 h 30 |

## Valeurs marquées « proposé » dans le plan

| Où | Valeur | Contexte |
|---|---|---|
| 2.4 Risques | « proposé » | …4 dans `unstable` seulement) / Pas de serveur le 25/11 (proposé) |
| 2.4 Risques | « proposé » | …rs (US-01) / Rien de testé sur machine vierge le 25/11 (proposé) |
| 2.4 Risques | « proposé » | …télémétrie dans l'app) / Moins de 8 inscrits au 25/11 (proposé) |
| 2.4 Risques | « proposé » | …rits au 25/11 (proposé) / Cohorte restreinte de 8 à 10 (proposé) |
| 2.4 Risques | « proposé » | …icrosoft / Aucun prototype d'authentification au 15/12 (proposé) |
| 2.4 Risques | « proposé » | …J4 / Moins de 70 % des priorités faites à mi-parcours (proposé) |
| 2.4 Risques | « proposé » | …demandent un vrai pont / Pas de pont de test au 15/12 (proposé) |
| 2.4 Risques | « proposé » | …oud / Plus d'une de ces tâches en retard en même temps (proposé) |
| 3.1 Validation | « proposé » | …/ 15/11 (proposé) |
| 3.1 Validation | « proposé » | …/ 25/11 (proposé) |
| 3.1 Validation | « proposé » | …/ J1, début décembre (proposé) |
| 3.1 Validation | « proposé » | …/ J2, 07/02/2027 (proposé) |

12 mentions « (proposé) » dans le plan. Elles portent des dates et seuils : 25/11 (serveur, installateur, inscrits), 15/12 (authentification, pont Hue), 8 inscrits, cohorte de 8 à 10, 70 % des priorités, points d'étape des entretiens (5 au 15/11, 12 au 25/11, 15 entretiens et 35 réponses au jalon J1, 20 entretiens au jalon J2). S'y ajoutent les tailles S/M/L/XL, le poids S=1, M=2, L=4, XL=8, la date de J1 (« début décembre ») et la répartition du reste de R15.
