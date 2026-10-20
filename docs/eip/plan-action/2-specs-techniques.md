# Plan d'action — 2. Spécifications techniques

> Partie 2 du plan d'action « Highway to Tech4 » (G-EIP-600) à déposer sur la plateforme EIP (#113).
> Rédigée par Arnaud ; Enzo assemble le plan complet (1. Contexte, 2. Spécifications techniques,
> 3. Spécifications non techniques). Sources : `docs/technology_environment.md`,
> `docs/ARCHITECTURE.md`, `docs/eip/beta_test_plan.md`, compte-rendu du suivi du 19/10/2026.
> État des fonctionnalités au **20/10/2026** ; ce document est mis à jour à chaque jalon.

## 2.1 Stack technique

Le prototype (une app web avec des actions simulées) a montré trois limites : des actions qui ne
faisaient rien de réel, un front et un back désynchronisés, des modes écrits en dur. La stack
ci-dessous répond à ces trois points.

| Brique | Technologie | Rôle | Pourquoi ce choix |
|---|---|---|---|
| Application desktop | **Tauri 2** (Windows, macOS, Linux) | Fenêtre native de l'app | Binaire bien plus léger qu'Electron, backend en Rust, même outil pour le mobile |
| Interface | **React 18 + TypeScript + Vite** | Écrans desktop et mobile | Compétences de l'équipe, un seul code pour toutes les interfaces |
| Cœur | **Rust** : `nexum-schema`, `nexum-core` | Format des modes, moteur qui exécute les actions, bus d'événements | Un mode est une **donnée JSON, jamais du code** : il se valide, se partage et se génère sans risque |
| Intégrations | **Rust** : `nexum-adapters`, une implémentation par système | Volume, luminosité, applications, liens, Steam, Philips Hue | Accès direct aux API système (Core Audio, DisplayServices, PipeWire) : des actions réelles |
| Stockage local | **SQLite** (`nexum-store`) | Modes et réglages sur la machine | Aucun serveur à installer, l'app marche hors ligne |
| Commande vocale | **whisper.cpp** via `whisper-rs` (`nexum-voice`) | Reconnaissance vocale | Locale : aucune voix envoyée sur Internet |
| API cloud | **Rust, axum + Tokio** (`nexum-cloud`) + **PostgreSQL** | Comptes, synchronisation, télécommande, marketplace | Même langage que le cœur, types partagés |
| Hébergement | **OVH** (France) | API cloud et base de données | Choisi le 19/10/2026 : hébergeur français, données en Europe (RGPD) |
| Apps mobiles | **Tauri 2 mobile** : iOS (plugin **Swift**) et Android | Télécommande du PC, modes sur le téléphone | Réutilise l'interface React et le moteur Rust du desktop |
| IA | API **Claude** (option) + règles locales | Transformer une phrase en mode | L'IA ne produit qu'un mode JSON, validé avant toute exécution |
| Types partagés | **ts-rs** | Types TypeScript générés depuis le Rust | Front et back ne peuvent plus diverger |
| Qualité | cargo test, **Vitest**, **Playwright**, **GitHub Actions** | Tests et build à chaque push | Vérifie chaque système (Windows, macOS, Linux, iOS) automatiquement |

**Architecture en une phrase.** L'interface envoie un mode au moteur Rust, qui exécute ses actions
une par une à travers l'intégration du système (une par OS ou appareil) et renvoie le résultat
réel de chaque action ; le cloud ne sert qu'aux comptes, à la synchronisation et au pilotage à
distance.

## 2.2 Ce que fera Nexum : user stories

Nexum s'organise en **5 familles de fonctionnalités** (suivi du 19/10/2026) : **Jeu** (sessions
de jeu), **Réunions** (réunions et concentration), **Travail** (espaces de travail),
**Messages** (communications centralisées), **Multi-app.** (multi-appareils et maison connectée).
Le **Socle** regroupe ce qui sert à toutes les familles.

Rôles : **Utilisateur** (installe et utilise Nexum), **Créateur** (publie ses modes sur la
marketplace), **Modérateur** (membre de l'équipe qui valide les modes publiés).

- **Terminé quand** : le critère mesurable qui dit que la fonctionnalité est livrée (repris du
  Beta Test Plan, `docs/eip/beta_test_plan.md`, colonne BTP).
- **État au 20/10/2026** : **Fait** (marche dans l'app) · **En cours** (code commencé, pas fini
  ou pas déployé) · **À faire**.

### Installer et configurer

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-01 | Socle | En tant qu'utilisateur, je veux installer Nexum sur Windows, macOS ou Linux, afin de l'utiliser sans outil technique | L'app s'installe et démarre sur une machine vierge : 3 systèmes × 3 machines, 0 échec | À faire | F1 |
| US-02 | Socle | En tant qu'utilisateur, je veux voir au premier lancement les intégrations disponibles sur ma machine, afin de savoir ce que Nexum peut piloter | 10 lancements, 100 % des intégrations disponibles détectées | En cours | F2 |
| US-03 | Multi-app. | En tant qu'utilisateur, je veux appairer mon pont Philips Hue depuis l'app, afin de piloter mes lampes sans éditer de fichier | 5 appairages réussis, moins d'1 min chacun | En cours | F3 |
| US-04 | Socle | En tant qu'utilisateur, je veux activer ou désactiver une intégration, afin de garder la main sur ce que Nexum touche | Une intégration désactivée n'exécute plus rien : 10 essais, 0 action | En cours | F4 |
| US-05 | Socle | En tant qu'utilisateur, je veux installer une extension depuis l'app, afin d'ajouter une intégration sans réinstaller Nexum | 5 installations utilisables tout de suite, 0 échec | À faire | F5 |

### Créer un mode

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-06 | Socle | En tant qu'utilisateur, je veux créer un mode dans un éditeur visuel (nom, catégorie, actions), afin de régler mon environnement sans écrire de code | 20 modes créés, tous retrouvés après redémarrage | En cours | F6 |
| US-07 | Socle | En tant qu'utilisateur, je veux ajouter, réordonner ou désactiver les actions d'un mode et choisir quoi faire si l'une échoue, afin d'obtenir exactement le comportement voulu | 20 modes, ordre et réglages respectés à l'exécution, 0 écart | En cours | F7 |
| US-08 | Socle | En tant qu'utilisateur, je veux décrire un mode en une phrase (« prépare-moi une soirée ranked »), afin d'obtenir un mode prêt à ajuster | 20 phrases, au moins 16 modes valides et jugés corrects | En cours | F8 |
| US-09 | Socle | En tant qu'utilisateur, je veux voir avant l'exécution les actions impossibles sur ma machine, afin de ne pas être surpris par un échec | 10 cas, 10 actions indisponibles signalées avant l'exécution | À faire | F9 |

### Activer un mode

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-10 | Socle | En tant qu'utilisateur, je veux activer un mode en un clic, afin de passer d'une activité à l'autre instantanément | 50 activations, 0 échec dû à l'app, moins de 3 s pour 5 actions | Fait | F10 |
| US-11 | Socle | En tant qu'utilisateur, je veux qu'un mode règle le volume, afin d'avoir le bon son pour chaque activité | 20 essais par système, volume exact | Fait | F11 |
| US-12 | Socle | En tant qu'utilisateur, je veux qu'un mode règle la luminosité de l'écran, afin de ménager mes yeux selon l'activité | 20 essais, écart de 5 % au plus | Fait | F12 |
| US-13 | Travail | En tant qu'utilisateur, je veux qu'un mode lance mes applications, afin de retrouver mon espace de travail prêt | 20 essais, 0 échec | Fait | F13 |
| US-14 | Jeu | En tant qu'utilisateur, je veux qu'un mode ferme les applications inutiles (Discord, navigateur), afin de libérer la machine | 20 essais, 0 échec | Fait | F14 |
| US-15 | Travail | En tant qu'utilisateur, je veux qu'un mode ouvre des pages web ou des liens d'application, afin d'avoir mes outils en ligne ouverts | 20 essais, ouverture dans l'app par défaut, 0 échec | Fait | F15 |
| US-16 | Jeu | En tant qu'utilisateur, je veux qu'un mode lance un jeu Steam, afin de démarrer ma session en un geste | 10 essais, 0 échec | Fait | F16 |
| US-17 | Multi-app. | En tant qu'utilisateur, je veux qu'un mode applique une scène Philips Hue, afin d'adapter l'éclairage de la pièce | 20 essais sur un vrai pont, 0 échec, moins de 2 s | En cours | F17 |
| US-18 | Jeu | En tant qu'utilisateur, je veux qu'un mode lance ou mette en pause ma musique Spotify, afin d'avoir l'ambiance de l'activité | 20 essais, 0 échec (compte Spotify Premium) | À faire | F18 |
| US-19 | Jeu | En tant que streamer, je veux qu'un mode change de scène OBS, afin de passer en direct sans manipulation | 20 essais, 0 échec, moins d'1 s | À faire | F19 |
| US-20 | Messages | En tant qu'utilisateur, je veux qu'un mode affiche mon activité sur Discord, afin que mes amis sachent ce que je fais | 10 activations, statut visible par les amis à chaque fois | À faire | F20 |
| US-21 | Réunions | En tant qu'utilisateur, je veux ne recevoir que les notifications des apps du mode actif, afin de ne pas être dérangé | 10 sessions, 0 notification hors mode | À faire | F21 |
| US-22 | Socle | En tant qu'utilisateur, je veux lancer un mode à la voix, afin de changer de mode sans quitter mon activité | 50 commandes, au moins 45 correctes, moins de 2 s | Fait | F22 |
| US-23 | Socle | En tant qu'utilisateur, je veux lancer un mode par un raccourci clavier, afin de changer de mode même quand l'app est en arrière-plan | 20 essais app en arrière-plan, 0 échec | À faire | F23 |
| US-24 | Socle | En tant qu'utilisateur, je veux suivre l'exécution action par action, afin de voir ce que Nexum a vraiment fait | 20 activations, 100 % des actions affichées avec leur résultat | Fait | F24 |
| US-25 | Socle | En tant qu'utilisateur, je veux comprendre pourquoi une action a échoué, afin de corriger le problème moi-même | 10 testeurs, au moins 8 retrouvent la cause sans aide | En cours | F25 |

### Automatiser

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-26 | Socle | En tant qu'utilisateur, je veux programmer un mode à une heure et des jours choisis, afin que mon environnement change sans y penser | 10 programmations, déclenchement à moins d'1 min de l'heure | En cours | F26 |
| US-27 | Jeu | En tant qu'utilisateur, je veux qu'un mode se déclenche quand je lance un jeu, afin d'être prêt dès le lancement | 20 lancements, 0 oubli, moins de 3 s | À faire | F27 |
| US-28 | Réunions | En tant qu'utilisateur, je veux qu'un mode se déclenche au début d'une réunion de mon agenda Outlook ou Google, afin d'être prêt sans rien faire | 10 réunions, déclenchement à moins d'1 min | À faire | F28 |
| US-29 | Multi-app. | En tant qu'utilisateur, je veux qu'un mode se déclenche quand j'arrive à un lieu (maison, bureau), d'après la position de mon téléphone, afin que mon poste soit prêt à mon arrivée | 10 arrivées, mode déclenché à chaque fois, position jamais envoyée hors de mon compte | À faire | (#18) |

### Centraliser ses messages

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-30 | Messages | En tant qu'utilisateur, je veux connecter mon compte Gmail en lecture seule (OAuth), afin de voir mes e-mails dans Nexum | 5 connexions, messages récents affichés, 0 échec | À faire | F29 |
| US-31 | Messages | En tant qu'utilisateur, je veux connecter mon compte Outlook en lecture seule (OAuth), afin de voir mes e-mails et mon agenda | 5 connexions, 0 échec | À faire | F30 |
| US-32 | Messages | En tant qu'utilisateur, je veux connecter Microsoft Teams en lecture seule (OAuth), afin de voir mes messages de travail | 5 connexions, 0 échec | À faire | F31 |
| US-33 | Messages | En tant qu'utilisateur, je veux lire tous mes messages dans un seul fil trié, afin de ne plus passer d'une app à l'autre | 3 comptes connectés, 0 message manquant sur 50 | À faire | F32 |

### Partager

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-34 | Socle | En tant qu'utilisateur, je veux exporter un mode dans un fichier `.nexum.json`, afin de l'envoyer à quelqu'un | 20 allers-retours export puis import, 0 différence | Fait | F33 |
| US-35 | Socle | En tant qu'utilisateur, je veux importer un mode reçu après une analyse de risque, afin de ne rien exécuter de dangereux | 10 fichiers piégés refusés, 10 fichiers sains importés | Fait | F34 |
| US-36 | Socle | En tant qu'utilisateur, je veux parcourir la marketplace, prévisualiser les actions d'un mode et l'installer, afin de profiter des modes de la communauté | 10 installations utilisables tout de suite, 0 échec | En cours | F35 |
| US-37 | Socle | En tant que créateur, je veux publier un de mes modes sur la marketplace, afin de le partager avec tous | 10 publications, 10 reçues dans la file de modération | À faire | F36 |
| US-38 | Socle | En tant que modérateur, je veux valider ou refuser un mode publié en voyant son score de risque, afin de garder la marketplace sûre | 10 décisions, 0 mode refusé visible | À faire | F37 |

### Compte, appareils et offre

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-39 | Socle | En tant qu'utilisateur, je veux créer un compte (e-mail et mot de passe) et me connecter, afin de retrouver mes données | 20 comptes créés sur le serveur en ligne, 0 échec | En cours | F38 |
| US-40 | Multi-app. | En tant qu'utilisateur, je veux synchroniser mes modes entre mes ordinateurs, afin de ne pas les recréer sur chaque machine | 20 synchronisations, modes identiques, aucune modification perdue | En cours | F39 |
| US-41 | Multi-app. | En tant qu'utilisateur, je veux activer un mode du PC depuis mon téléphone (iOS ou Android), afin de piloter mon poste à distance | 20 essais via le serveur en ligne, 0 échec, moins de 3 s | En cours | F40 |
| US-42 | Multi-app. | En tant qu'utilisateur, je veux lancer des modes sur mon téléphone lui-même (luminosité, lampe torche, vibration, notification, Spotify), et savoir clairement quand le système refuse une action (volume et sonnerie sur iPhone), afin d'adapter aussi mon téléphone | Chaque action autorisée s'applique sur un vrai iPhone et un vrai Android ; chaque action refusée affiche sa raison, jamais un faux succès | En cours | (#34) |
| US-43 | Socle | En tant qu'utilisateur, je veux envoyer un retour depuis l'app, journaux joints, afin de signaler un problème facilement | 10 envois, 10 reçus par l'équipe avec les journaux | À faire | F41 |
| US-44 | Socle | En tant qu'utilisateur, je veux recevoir les mises à jour automatiquement, afin d'avoir toujours la dernière version | 3 mises à jour sans réinstallation, 0 échec | À faire | F42 |
| US-45 | Socle | En tant qu'utilisateur, je veux utiliser gratuitement les modes de base (luminosité, lancement de jeux…) et pouvoir passer à l'offre payante (synchronisation cloud, app mobile, déclencheurs avancés), afin de payer seulement si j'en ai besoin | Les limites de l'offre gratuite sont affichées clairement ; le passage à l'offre payante débloque les fonctions annoncées | À faire | (19/10) |
| US-46 | Socle | En tant qu'utilisateur en situation de handicap, je veux utiliser Nexum au clavier et avec un lecteur d'écran, avec des contrastes suffisants, afin d'accéder à toutes les fonctions | Écrans principaux conformes WCAG 2.2 niveau AA (navigation clavier, contrastes, libellés) | À faire | (#64) |

**Bilan au 20/10/2026** : 46 user stories, dont 11 faites, 14 en cours et 21 à faire. La priorisation
MoSCoW du backlog est suivie dans #107.

## 2.3 Jalons

| Jalon | Date | Objectifs (à atteindre pour valider le jalon) | Comment on le vérifie |
|---|---|---|---|
| **J1 — Bêta fermée sur une famille** | **début décembre 2026** (date exacte à fixer en équipe) | Livrer **une famille complète et stable**, choisie parmi Réunions, Travail et Messages (19/10) ; mettre l'API cloud en ligne chez OVH (US-39) ; recruter les premiers bêta-testeurs ; lancer le cycle d'itération n° 1 | Les bêta-testeurs installent l'app et utilisent la famille sans aide ; leurs retours arrivent dans l'app (US-43) |
| **J2 — MVP + Beta Test Plan v1** | **07/02/2027** | Livrer l'éditeur sans code (US-06, US-07), Philips Hue sur un vrai pont (US-03, US-17), Steam, compte et synchronisation (US-39, US-40), télécommande iOS et Android (US-41) ; clore le cycle n° 1 ; rendre le BTP | Ces user stories remplissent leur critère « Terminé quand » |
| **J3 — Greenlight blanc** | **04/04/2027** | Livrer l'automatisation (US-26 à US-29), la marketplace avec modération (US-36 à US-38) et les raccourcis (US-23) ; mener le cycle n° 2 et décider de continuer ou pivoter | Démonstration en direct devant le jury blanc ; retours intégrés au plan jusqu'en juillet |
| **J4 — Greenlight + RNCP** | **05/07/2027** | Livrer les installeurs signés et les mises à jour (US-01, US-44), les messages centralisés (US-30 à US-33), la génération de mode par IA (US-08) et l'offre payante (US-45) ; démontrer toutes les fonctionnalités du BTP sur l'app installée | Démo en direct sans vidéo ; tableau des critères de réussite du BTP rempli |

Les dates J2 à J4 sont celles des jalons GitHub de l'équipe ; J1 suit l'objectif fixé avec le
mentor le 19/10/2026 (une famille en bêta sous un mois et demi).
