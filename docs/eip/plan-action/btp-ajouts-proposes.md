# Ajouts proposés au Beta Test Plan

**Proposition, non appliquée : `beta_test_plan.md` n'est pas modifié.** Le plus grand identifiant existant est **F42**. Les 22 nouvelles user stories (US-47 à US-68) reçoivent F43 à F64, dans l'ordre des US. Le critère de réussite est le « Terminé quand » de l'US, et ce sont des cibles proposées. Les lignes dont l'état est « si le temps le permet » ou « Could » sont marquées : le BTP ne doit contenir que ce que l'équipe accepte de devoir faire fonctionner (document mentor, §12).

## Lignes à ajouter à la section 3 (fonctionnalités)

| ID | Rôle | Fonctionnalité | Description (énoncé de l'US) | US | Jalon |
|---|---|---|---|---|---|
| F43 | Utilisateur | Connecter son agenda Microsoft (lecture seule) | En tant qu'utilisateur, je veux connecter mon agenda Microsoft (Outlook / Microsoft 365) en lecture seule, afin que Nexum connaisse mes réunions | US-47 | J3 |
| F44 | Utilisateur | Restaurer l'état d'avant à la fin d'un mode | En tant qu'utilisateur, je veux que Nexum restaure l'état d'avant (volume, luminosité) à la fin d'un mode, afin de retrouver mon poste comme je l'avais laissé | US-48 | J2 |
| F45 | Utilisateur | Régler les nouvelles tentatives et le délai maximal d'une action | En tant qu'utilisateur, je veux fixer pour une action un nombre de nouvelles tentatives et un délai maximal, afin qu'une action lente ou capricieuse ne bloque pas tout le mode | US-49 | J2 |
| F46 | Utilisateur | Annuler les actions déjà faites quand un mode « tout ou rien » échoue | En tant qu'utilisateur, je veux qu'un mode « tout ou rien » annule les actions déjà faites quand une action échoue, afin de ne pas rester dans un état à moitié appliqué | US-50 | J3 |
| F47 | Utilisateur | Consulter l'historique des exécutions | En tant qu'utilisateur, je veux consulter l'historique des exécutions (mode, action, heure, résultat, durée), afin de savoir ce que Nexum a fait et quand | US-51 | J2 |
| F48 | Utilisateur | Expliquer une exécution et simuler un mode | En tant qu'utilisateur, je veux savoir pourquoi une action a tourné, a été ignorée ou a échoué, et simuler un mode sans rien modifier, afin de faire confiance à l'automatisation | US-52 | J3 |
| F49 | Utilisateur | Appeler une adresse web ou recevoir un webhook | En tant qu'utilisateur, je veux qu'un mode appelle une adresse web (HTTP) ou démarre sur réception d'un webhook, afin de piloter un service sans intégration dédiée | US-53 | J3 |
| F50 | Utilisateur | Lancer un script local après permission | En tant qu'utilisateur, je veux qu'un mode lance un script local déjà présent sur mon poste, après permission explicite, afin d'automatiser ce que Nexum ne sait pas encore faire | US-54 | J3 |
| F51 | Utilisateur | Lancer un jeu avec plusieurs fournisseurs | En tant qu'utilisateur, je veux qu'une action (par exemple « lancer un jeu ») fonctionne avec plusieurs fournisseurs et que Nexum utilise celui que j'ai, afin de ne pas dépendre d'une marque | US-55 | J3 |
| F52 | Utilisateur | Palette de commandes globale | En tant qu'utilisateur, je veux une palette de commandes accessible de partout (raccourci système), afin d'activer un mode ou de changer d'écran sans ouvrir l'app | US-56 | J2 |
| F53 | Utilisateur | Capturer et restaurer un espace de travail | En tant qu'utilisateur, je veux capturer puis restaurer mon espace de travail (applications ouvertes, position des fenêtres), afin de retrouver tout mon contexte en un clic | US-57 | J3 |
| F54 | Créateur | Format d'extension minimal et politique de validation | En tant que créateur, je veux un format d'extension minimal et une politique de validation écrite, afin de savoir ce qui peut être publié et comment c'est vérifié | US-58 | J2 (document), J3 (prototype) |
| F55 | Utilisateur | Connaître le mode actif et en faire dépendre des règles | En tant qu'utilisateur, je veux que Nexum sache quel mode est actif et que mes règles puissent en dépendre, afin que « fin de journée » ne se déclenche que si le mode Travail est actif | US-59 | J3 |
| F56 | Utilisateur | Déclencher un mode sur arrêt d'application, verrouillage ou Wi-Fi **(si le temps le permet)** | En tant qu'utilisateur, je veux déclencher ou terminer un mode quand une application se ferme, quand je verrouille ma session ou quand je rejoins un Wi-Fi donné, afin que Nexum suive ma journée de travail | US-60 | J4 (si le temps) |
| F57 | Utilisateur | Exécuter un seul mode à la fois | En tant qu'utilisateur, je veux qu'un seul mode s'exécute à la fois et décider ce qui se passe si j'en lance un second, afin d'éviter deux modes qui se contredisent | US-61 | J3 |
| F58 | Utilisateur | Voir la santé des intégrations | En tant qu'utilisateur, je veux voir en permanence quelles intégrations fonctionnent et pourquoi les autres ne fonctionnent pas, afin de ne pas découvrir une panne en plein mode | US-62 | J3 |
| F59 | Utilisateur | Exporter ses données et supprimer son compte | En tant qu'utilisateur, je veux exporter toutes mes données et supprimer mon compte et mes données en ligne, afin de garder la main sur mes données personnelles | US-63 | J3 |
| F60 | Utilisateur | Mesure d'usage avec consentement | En tant qu'utilisateur, je veux n'envoyer de mesures d'usage qu'après un consentement explicite et pouvoir le retirer, afin que la mesure demandée aux testeurs respecte ma vie privée | US-64 | J3 |
| F61 | Utilisateur | Tableau de bord de fiabilité des modes **(si le temps le permet)** | En tant qu'utilisateur, je veux voir pour chaque mode le nombre d'activations, le taux de réussite des actions et la durée moyenne, afin de savoir quels modes sont fiables | US-65 | J4 (si le temps) |
| F62 | à définir (développeur de Nexum : hors des trois rôles du BTP) | Rejouer un mode sur un environnement simulé **(si le temps le permet)** | En tant que développeur de Nexum, je veux rejouer un mode sur des intégrations et une horloge simulées et vérifier le résultat, afin de ne pas casser un scénario validé | US-66 | J4 (si le temps) |
| F63 | Utilisateur | Reprendre après un arrêt brutal **(si le temps le permet)** | En tant qu'utilisateur, je veux que Nexum reprenne proprement après un arrêt brutal au milieu d'un mode, afin de ne pas rester avec un poste à moitié modifié | US-67 | J4 (si le temps) |
| F64 | Utilisateur | Confirmer avant une action destructrice **(si le temps le permet)** | En tant qu'utilisateur, je veux confirmer avant qu'un mode ferme une application ou lance un script, afin de ne pas perdre un travail non enregistré | US-68 | J3 (Could) |

## Lignes à ajouter à la section 4 (critères de réussite)

| ID | Critère de réussite (= « Terminé quand » de l'US) | Résultat |
|---|---|---|
| F43 | 3 connexions réussies, les événements des 7 prochains jours affichés, 0 échec ; aucune écriture dans l'agenda | |
| F44 | 20 essais sur volume et luminosité : valeur restaurée à l'identique (volume exact, luminosité à 5 % près), 0 oubli, y compris si le mode est interrompu | |
| F45 | 20 modes d'essai avec une action qui échoue ou dépasse le délai : tentatives et délai respectés, résultat réel affiché à chaque tentative | |
| F46 | 10 modes d'essai avec un échec au milieu : les actions réversibles déjà faites sont annulées, le rapport indique ce qui a été annulé et ce qui ne pouvait pas l'être | |
| F47 | 20 activations : 100 % retrouvées dans l'historique après redémarrage de l'app, avec résultat et durée | |
| F48 | 10 exécutions : la raison de chaque action (lancée, ignorée, échouée) est affichée ; 10 simulations : aucune modification du poste, liste des changements prévus affichée | |
| F49 | 10 appels (GET et POST) avec en-têtes, résultat réel affiché ; 10 webhooks reçus : mode déclenché à chaque fois ; secrets non journalisés | |
| F50 | 10 essais : permission demandée avant la première exécution, chaque exécution inscrite au journal (script, heure, résultat), refus sans permission ; aucun script écrit ou modifié par Nexum | |
| F51 | Une capacité « lancer un jeu » résolue sur 3 fournisseurs (Steam, Epic, GOG) à partir d'un même mode ; ajout d'un fournisseur sans modifier le moteur | |
| F52 | 20 essais depuis une autre application au premier plan : palette ouverte par raccourci, mode activé sans ouvrir la fenêtre, 0 échec | |
| F53 | 10 espaces capturés puis restaurés : applications relancées à 100 %, fenêtres replacées sur leur écran ; onglets du navigateur seulement si le temps le permet | |
| F54 | Format documenté (manifeste, permissions) ; politique écrite ; 10 extensions d'essai passées dans la politique, chacune acceptée ou refusée pour une raison écrite | |
| F55 | 10 essais : le mode actif est affiché ; une règle conditionnée à « mode Travail actif » se déclenche quand il l'est et jamais sinon ; l'état survit au redémarrage | |
| F56 | 10 essais par déclencheur (arrêt d'application, verrouillage, déverrouillage, Wi-Fi donné) : mode déclenché à chaque fois, moins de 5 s | |
| F57 | 10 activations rapprochées de deux modes : un seul s'exécute à la fois, le second attend ou remplace selon la règle choisie, le résultat est affiché, 0 état incohérent | |
| F58 | 5 intégrations (audio, écran, Hue, jeux, cloud) : chacune affiche un état et une raison, rafraîchis automatiquement ; 10 pannes provoquées, 10 signalées | |
| F59 | 5 essais : export complet (modes, réglages) en un fichier ; suppression du compte et des données en ligne en un geste, confirmée par le serveur ; rien ne reste côté serveur | |
| F60 | Aucune requête d'usage avant consentement (vérifié sur 5 installations propres) ; consentement révocable ; liste des événements envoyés visible dans l'app ; cible : 10 testeurs consentants | |
| F61 | 20 activations : nombre, taux de réussite et durée moyenne exacts pour chaque mode, calculés depuis l'historique (US-51) | |
| F62 | 10 modes de référence rejoués en CI sur un environnement simulé : actions attendues exécutées, état attendu atteint, 0 écart | |
| F63 | 10 arrêts brutaux en cours de mode : au redémarrage, l'état d'avant est restauré ou l'utilisateur voit la liste des actions déjà faites, 0 état perdu | |
| F64 | 10 essais : la confirmation apparaît avant la fermeture d'une application ou le lancement d'un script non encore autorisés ; un refus ne ferme ni ne lance rien | |

## Lignes à retirer ou à marquer « abandonnée » (US passées en Won't)

| ID | Fonctionnalité actuelle (sections 3 et 4) | US | Raison |
|---|---|---|---|
| F5 | Installer une extension (« 5 installations, 0 échec ») | US-05 | Extensions arbitraires retirées du périmètre ; seul le format minimal est engagé (F58 / US-58) |
| F19 | Changer de scène OBS (« 20 essais, 0 échec, < 1 s ») | US-19 | Retiré ; couvert sans intégration dédiée par F53 et F54 (HTTP, webhook, script local) |
| F20 | Afficher son activité sur Discord (« 10 activations, statut visible à chaque fois ») | US-20 | Retiré ; couvert sans intégration dédiée par F53 et F54 |
| F21 | Filtrer les notifications selon le mode (« 10 sessions, 0 notification hors mode ») | US-21 | Retiré : dépend du système d'exploitation, faisabilité non établie |

L'US-29 (géolocalisation) n'a pas de ligne F dans le BTP (sa colonne BTP renvoie à l'issue #18) : rien à retirer.

## Lignes existantes dont le critère change (à valider)

| ID | Critère actuel | Critère proposé | Raison |
|---|---|---|---|
| F40 | « 20 essais, 0 échec, < 3 s » | « 20 essais via le serveur en ligne et le compte authentifié, 0 échec, moins de 5 s ; aucune activation possible sans compte » | US-41 : le PC sonde la file toutes les 2,5 s ; la file sans compte est supprimée (issue #136) |
| F29 à F32 | critères de connexion et de fil unifié | inchangés, mais à marquer « si le temps le permet » (J4) | US-30 à US-33 ; l'agenda (F43) passe avant |
| F28 | « 10 réunions, écart < 1 min » | inchangé ; dépend de F43 (agenda Microsoft) | US-28 |

## Constat sans ajout proposé

Les US-42 (colonne BTP « #34 »), US-45 (« 19/10 ») et US-46 (« #64 ») n'ont pas de ligne F : la règle du plan (« toute fonctionnalité à montrer au Greenlight est dans le BTP ») demanderait d'en créer une pour chacune. Je ne propose pas d'identifiant sans votre accord, parce que la liste des identifiants F est déjà proposée ci-dessus pour les seules nouvelles US.
