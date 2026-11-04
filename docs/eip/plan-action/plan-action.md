# Plan d'action « Highway to Tech4 » (G-EIP-600) — Nexum

Plan d'action complet de l'EIP Nexum, à déposer sur la plateforme EIP (#113). Trois parties : 1. Contexte, 2. Spécifications techniques, 3. Spécifications non techniques. Version du 04/11/2026 ; l'état des fonctionnalités de la partie 2 date du 20/10/2026, complété le 04/11/2026 (bilan de 2.2).

Équipe : Arnaud, Rares, Raphaël, Max, Enzo (Epitech Marseille). Track : Entrepreneuriat. Site : https://teamnexum.github.io/NexumWebsite/ · Code : https://github.com/TeamNexum

---

## 1. Contexte

Partie 1 du plan d'action. Sources : site Nexum, organisation GitHub TeamNexum, docs/eip/OBJECTIFS.md, compte-rendu des suivis du 25/09/2026 (track) et du 19/10/2026 (objectifs complémentaires).

### 1.1 D'où vient le projet

Nexum est le projet EIP (Epitech Innovative Project) de cinq étudiants d'Epitech Marseille. Il court de 2026 à l'été 2027.

| Membre | Rôle dans l'équipe |
|---|---|
| Arnaud | Produit et coordination, macOS, communication |
| Rares | Interface, messagerie unifiée, communication |
| Raphaël | Moteur, installeur et mises à jour |
| Max | Moteur, extensions, Android |
| Enzo | Business, stratégie et données|

Tout part d’un agacement courant quand on utilise un PC : avant une partie, un stream ou une journée de travail, on ouvre, règle et relance à la main les mêmes outils, qui ne se parlent pas. Une première version, une app web aux actions simulées, a servi de prototype. Elle a montré trois limites : des actions qui ne faisaient rien de réel, un front et un back désynchronisés, des modes écrits en dur. Le projet a été repris sur une base technique différente (voir 2.1). Aujourd'hui, l'app desktop active de vrais modes : volume, luminosité, lancement et fermeture d'applications, liens, jeux Steam. Philips Hue est en cours d'intégration (état au 20/10/2026).

### 1.2 Le problème

Les utilisateurs de PC qui enchaînent plusieurs activités (jouer, streamer, travailler, se détendre) règlent leur environnement à la main, à chaque fois. Trois constats de départ :

- **Cinq applications pour un seul moment.** Lanceur, logiciel du casque, application des lumières, musique, messagerie : chacun se règle séparément, avant chaque session.
- **Une marque, un logiciel.** Les outils des fabricants ne pilotent que leur propre matériel, alors qu'un poste mélange plusieurs marques.
- **Les scripts sont réservés aux techniciens.** Automatiser avec AutoHotkey ou des raccourcis demande du code ; la plupart des gens y renoncent.

Ces constats sont des hypothèses de départ. Le premier questionnaire (13 réponses, voir 3.1) confirme surtout les douleurs liées au travail (messageries multiples, notifications) et beaucoup moins celles liées au jeu. Les 15 à 20 entretiens de la track Entrepreneuriat (voir 3.1) servent à les valider, à les corriger et à hiérarchiser les douleurs.

### 1.3 La solution

Nexum est un centre de contrôle sans code pour son environnement numérique. L'utilisateur choisit un **mode**, c'est-à-dire une liste d'actions (son, luminosité, lumières, applications, jeux, liens), et Nexum règle tout en un clic.

- **Sans code.** Un mode est une donnée (JSON), jamais un script : il se crée dans un éditeur visuel, se valide, se partage et se génère sans risque.
- **Toutes marques.** Nexum raisonne en besoins (« lancer la musique », « changer la lumière ») puis utilise le service que l'utilisateur possède.
- **Transparent.** Chaque action renvoie son résultat réel : l'utilisateur voit ce qui a marché, ce qui a échoué et pourquoi.
- **Léger et local d'abord.** App native (Tauri, Rust), stockage local, reconnaissance vocale locale. Le cloud ne sert qu'aux comptes, à la synchronisation et à la télécommande mobile.

Comparaison avec l'existant :

| Outil | Marques | Code | Ce qu'il pilote |
|---|---|---|---|
| Logiciels de fabricants (Razer Synapse, Corsair iCUE…) | Une seule | Sans code | Périphériques |
| Scripts (AutoHotkey, raccourcis) | Toutes | Code requis | Ce que l'on programme |
| Lanceurs (Steam, Playnite…) | — | Sans code | Jeux uniquement |
| Automatisation en ligne (IFTTT, Zapier, n8n, Power Automate) | Services connectés | Sans code à technique (n8n) ; offres gratuites limitées (Zapier : 100 tâches par mois) | Services web ; ne règlent pas le PC lui-même (son, luminosité, applications) |
| **Nexum** | **Toutes** | **Sans code** | **Applications, système, jeux, lumières** |

Aucun de ces outils ne réunit les trois points qui font Nexum (benchmark présenté au suivi du 19/10/2026) : **déclencher selon le contexte** (lancement d'un jeu, début d'une réunion, heure, lieu : US-26 à US-29), **régler le poste local** (son, luminosité, applications, lumières) et rester **accessible sans code**, alors que les outils à base de code excluent la grande majorité des utilisateurs.

Le détail fonctionnel (46 user stories, 5 familles) et la stack sont en partie 2.

### 1.4 Objectif

**Objectif du projet.** Livrer, au Greenlight + RNCP du 05/07/2027, une application installée et utilisable, qui exécute de vrais modes sur plusieurs systèmes et appareils, et démontrer en direct toutes les fonctionnalités du Beta Test Plan (partie 2, jalon J4).

**Objectif entrepreneurial.** Prouver, avec des utilisateurs réels, que le problème existe et que Nexum le résout, puis décider sur des preuves de continuer, pivoter ou redéfinir le MVP au Greenlight blanc du 04/04/2027 (jalon J3). La bêta fermée sur une famille de fonctionnalités, visée début décembre 2026 (jalon J1), est la première étape : elle fournit les premiers usages réels à mesurer.

### 1.5 Track choisie

**Track Entrepreneuriat** (« From idea to venture »), confirmée au suivi pédagogique du 25/09/2026. La track impose deux objectifs obligatoires et deux objectifs complémentaires choisis avec le mentor.

| Objectif | Type | Statut |
|---|---|---|
| 1. Validation marché | Obligatoire | Traité en 3.1 |
| 2. Outils entrepreneuriaux | Obligatoire | Traité en 3.2 |
| B. Stratégie et vision | Complémentaire | Retenu avec le mentor le 19/10/2026, traité en 3.3 |
| C. Image et message | Complémentaire | Retenu avec le mentor le 19/10/2026, traité en 3.4 |
| A. Partenariats | Complémentaire | Non retenu : aucun contact partenaire n'est engagé à ce jour |
| D. Crédibilité et réputation | Complémentaire | Non retenu |
| E. Croissance | Complémentaire | Non retenu |

Pourquoi B et C : le travail de marque est déjà lancé (charte, logo, réseaux sociaux, site avec inscription à la bêta) et il manque surtout le test du message auprès de vrais utilisateurs (C). La vision et l'analyse concurrentielle sont déjà rédigées ; B demande de les transformer en arbitrages et en stratégie datée, ce qui sert directement la décision continuer/pivoter de J3. Ni B ni C ne dépendent d'un tiers, contrairement à D (publication externe) ou E (traction mesurée).

### 1.6 Partenaires

**Aucun partenaire à ce jour.** Aucun partenariat n'est annoncé dans ce plan, faute de contact réel avec preuve d'échange. Si la décision de J3 est de continuer, la question sera rouverte.

Les acteurs suivants ne sont pas des partenaires, mais le projet s'appuie sur eux :

| Acteur | Nature de la relation |
|---|---|
| Référent / mentor Epitech | Encadrement : suivis pédagogiques (dernier suivi le 19/10/2026, prochain le 09/11/2026) et choix des objectifs complémentaires |
| OVH (France) | Fournisseur d'hébergement de l'API cloud et de la base de données (choisi le 19/10/2026, données en Europe, RGPD) |
| Philips Hue, Steam, Spotify, Discord, OBS, Google, Microsoft | Services tiers pilotés par API publiques ; aucun accord commercial |
| Futurs bêta-testeurs | Recrutés via le site, Instagram (@app.nexum) et les entretiens ; pas des partenaires au sens de la track |

---

## 2. Spécifications techniques

Partie 2 du plan d'action « Highway to Tech4 » (G-EIP-600) à déposer sur la plateforme EIP.

### 2.1 Stack technique

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

### 2.2 Ce que fera Nexum : user stories

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

#### Installer et configurer

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-01 | Socle | En tant qu'utilisateur, je veux installer Nexum sur Windows, macOS ou Linux, afin de l'utiliser sans outil technique | L'app s'installe et démarre sur une machine vierge : 3 systèmes × 3 machines, 0 échec | À faire | F1 |
| US-02 | Socle | En tant qu'utilisateur, je veux voir au premier lancement les intégrations disponibles sur ma machine, afin de savoir ce que Nexum peut piloter | 10 lancements, 100 % des intégrations disponibles détectées | En cours | F2 |
| US-03 | Multi-app. | En tant qu'utilisateur, je veux appairer mon pont Philips Hue depuis l'app, afin de piloter mes lampes sans éditer de fichier | 5 appairages réussis, moins d'1 min chacun | En cours | F3 |
| US-04 | Socle | En tant qu'utilisateur, je veux activer ou désactiver une intégration, afin de garder la main sur ce que Nexum touche | Une intégration désactivée n'exécute plus rien : 10 essais, 0 action | En cours | F4 |
| US-05 | Socle | En tant qu'utilisateur, je veux installer une extension depuis l'app, afin d'ajouter une intégration sans réinstaller Nexum | 5 installations utilisables tout de suite, 0 échec | À faire | F5 |

#### Créer un mode

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-06 | Socle | En tant qu'utilisateur, je veux créer un mode dans un éditeur visuel (nom, catégorie, actions), afin de régler mon environnement sans écrire de code | 20 modes créés, tous retrouvés après redémarrage | En cours | F6 |
| US-07 | Socle | En tant qu'utilisateur, je veux ajouter, réordonner ou désactiver les actions d'un mode et choisir quoi faire si l'une échoue, afin d'obtenir exactement le comportement voulu | 20 modes, ordre et réglages respectés à l'exécution, 0 écart | En cours | F7 |
| US-08 | Socle | En tant qu'utilisateur, je veux décrire un mode en une phrase (« prépare-moi une soirée ranked »), afin d'obtenir un mode prêt à ajuster | 20 phrases, au moins 16 modes valides et jugés corrects | En cours | F8 |
| US-09 | Socle | En tant qu'utilisateur, je veux voir avant l'exécution les actions impossibles sur ma machine, afin de ne pas être surpris par un échec | 10 cas, 10 actions indisponibles signalées avant l'exécution | À faire | F9 |

#### Activer un mode

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

#### Automatiser

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-26 | Socle | En tant qu'utilisateur, je veux programmer un mode à une heure et des jours choisis, afin que mon environnement change sans y penser | 10 programmations, déclenchement à moins d'1 min de l'heure | En cours | F26 |
| US-27 | Jeu | En tant qu'utilisateur, je veux qu'un mode se déclenche quand je lance un jeu, afin d'être prêt dès le lancement | 20 lancements, 0 oubli, moins de 3 s | À faire | F27 |
| US-28 | Réunions | En tant qu'utilisateur, je veux qu'un mode se déclenche au début d'une réunion de mon agenda Outlook ou Google, afin d'être prêt sans rien faire | 10 réunions, déclenchement à moins d'1 min | À faire | F28 |
| US-29 | Multi-app. | En tant qu'utilisateur, je veux qu'un mode se déclenche quand j'arrive à un lieu (maison, bureau), d'après la position de mon téléphone, afin que mon poste soit prêt à mon arrivée | 10 arrivées, mode déclenché à chaque fois, position jamais envoyée hors de mon compte | À faire | (#18) |

#### Centraliser ses messages

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-30 | Messages | En tant qu'utilisateur, je veux connecter mon compte Gmail en lecture seule (OAuth), afin de voir mes e-mails dans Nexum | 5 connexions, messages récents affichés, 0 échec | À faire | F29 |
| US-31 | Messages | En tant qu'utilisateur, je veux connecter mon compte Outlook en lecture seule (OAuth), afin de voir mes e-mails et mon agenda | 5 connexions, 0 échec | À faire | F30 |
| US-32 | Messages | En tant qu'utilisateur, je veux connecter Microsoft Teams en lecture seule (OAuth), afin de voir mes messages de travail | 5 connexions, 0 échec | À faire | F31 |
| US-33 | Messages | En tant qu'utilisateur, je veux lire tous mes messages dans un seul fil trié, afin de ne plus passer d'une app à l'autre | 3 comptes connectés, 0 message manquant sur 50 | À faire | F32 |

#### Partager

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-34 | Socle | En tant qu'utilisateur, je veux exporter un mode dans un fichier `.nexum.json`, afin de l'envoyer à quelqu'un | 20 allers-retours export puis import, 0 différence | Fait | F33 |
| US-35 | Socle | En tant qu'utilisateur, je veux importer un mode reçu après une analyse de risque, afin de ne rien exécuter de dangereux | 10 fichiers piégés refusés, 10 fichiers sains importés | Fait | F34 |
| US-36 | Socle | En tant qu'utilisateur, je veux parcourir la marketplace, prévisualiser les actions d'un mode et l'installer, afin de profiter des modes de la communauté | 10 installations utilisables tout de suite, 0 échec | En cours | F35 |
| US-37 | Socle | En tant que créateur, je veux publier un de mes modes sur la marketplace, afin de le partager avec tous | 10 publications, 10 reçues dans la file de modération | À faire | F36 |
| US-38 | Socle | En tant que modérateur, je veux valider ou refuser un mode publié en voyant son score de risque, afin de garder la marketplace sûre | 10 décisions, 0 mode refusé visible | À faire | F37 |

#### Compte, appareils et offre

| ID | Famille | User story | Terminé quand | État | BTP |
|---|---|---|---|---|---|
| US-39 | Socle | En tant qu'utilisateur, je veux créer un compte (e-mail et mot de passe) et me connecter, afin de retrouver mes données | 20 comptes créés sur le serveur en ligne, 0 échec | En cours | F38 |
| US-40 | Multi-app. | En tant qu'utilisateur, je veux synchroniser mes modes entre mes ordinateurs, afin de ne pas les recréer sur chaque machine | 20 synchronisations, modes identiques, aucune modification perdue | En cours | F39 |
| US-41 | Multi-app. | En tant qu'utilisateur, je veux activer un mode du PC depuis mon téléphone (iOS ou Android), afin de piloter mon poste à distance | 20 essais via le serveur en ligne, 0 échec, moins de 3 s | En cours | F40 |
| US-42 | Multi-app. | En tant qu'utilisateur, je veux lancer des modes sur mon téléphone lui-même (luminosité, lampe torche, vibration, notification, Spotify), et savoir clairement quand le système refuse une action (volume et sonnerie sur iPhone), afin d'adapter aussi mon téléphone | Chaque action autorisée s'applique sur un vrai iPhone et un vrai Android ; chaque action refusée affiche sa raison, jamais un faux succès | En cours | (#34) |
| US-43 | Socle | En tant qu'utilisateur, je veux envoyer un retour depuis l'app, journaux joints, afin de signaler un problème facilement | 10 envois, 10 reçus par l'équipe avec les journaux | En cours | F41 |
| US-44 | Socle | En tant qu'utilisateur, je veux recevoir les mises à jour automatiquement, afin d'avoir toujours la dernière version | 3 mises à jour sans réinstallation, 0 échec | À faire | F42 |
| US-45 | Socle | En tant qu'utilisateur, je veux utiliser gratuitement les modes de base (luminosité, lancement de jeux…) et pouvoir passer à l'offre payante (synchronisation cloud, app mobile, déclencheurs avancés), afin de payer seulement si j'en ai besoin | Les limites de l'offre gratuite sont affichées clairement ; le passage à l'offre payante débloque les fonctions annoncées | À faire | (19/10) |
| US-46 | Socle | En tant qu'utilisateur en situation de handicap, je veux utiliser Nexum au clavier et avec un lecteur d'écran, avec des contrastes suffisants, afin d'accéder à toutes les fonctions | Écrans principaux conformes WCAG 2.2 niveau AA (navigation clavier, contrastes, libellés) | À faire | (#64) |

**Bilan au 04/11/2026** : 46 user stories, dont 11 faites, 15 en cours et 20 à faire. La priorisation
MoSCoW du backlog est suivie dans #107. Depuis le 20/10 : le retour depuis l'app (US-43) est
développé et en relecture (PR #133) ; le serveur cloud avec PostgreSQL et la synchronisation
automatique (US-39, US-40) avancent (PR #134).

### 2.3 Jalons

| Jalon | Date | Objectifs (à atteindre pour valider le jalon) | Comment on le vérifie |
|---|---|---|---|
| **J1 — Bêta fermée sur une famille** | **début décembre 2026** (date exacte à fixer en équipe) | Livrer **une famille complète et stable**, choisie parmi Réunions, Travail et Messages (19/10) ; mettre l'API cloud en ligne chez OVH (US-39) ; recruter les premiers bêta-testeurs ; lancer le cycle d'itération n° 1 | Les bêta-testeurs installent l'app et utilisent la famille sans aide ; leurs retours arrivent dans l'app (US-43) |
| **J2 — MVP + Beta Test Plan v1** | **07/02/2027** | Livrer l'éditeur sans code (US-06, US-07), Philips Hue sur un vrai pont (US-03, US-17), Steam, compte et synchronisation (US-39, US-40), télécommande iOS et Android (US-41) ; clore le cycle n° 1 ; rendre le BTP | Ces user stories remplissent leur critère « Terminé quand » |
| **J3 — Greenlight blanc** | **04/04/2027** | Livrer l'automatisation (US-26 à US-29), la marketplace avec modération (US-36 à US-38) et les raccourcis (US-23) ; mener le cycle n° 2 et décider de continuer ou pivoter | Démonstration en direct devant le jury blanc ; retours intégrés au plan jusqu'en juillet |
| **J4 — Greenlight + RNCP** | **05/07/2027** | Livrer les installeurs signés et les mises à jour (US-01, US-44), les messages centralisés (US-30 à US-33), la génération de mode par IA (US-08) et l'offre payante (US-45) ; démontrer toutes les fonctionnalités du BTP sur l'app installée | Démo en direct sans vidéo ; tableau des critères de réussite du BTP rempli |

Les dates J2 à J4 sont celles des jalons GitHub de l'équipe ; J1 suit l'objectif fixé avec le
mentor le 19/10/2026 (une famille en bêta sous un mois et demi).

---

## 3. Spécifications non techniques

Partie 3 du plan d'action. Une note d'intention par thème de la track Entrepreneuriat : les deux thèmes obligatoires (validation marché, outils entrepreneuriaux) et les deux thèmes optionnels retenus avec le mentor le 19/10/2026 (stratégie et vision, image et message). Sources : fiche G-EIP-600 de la track, docs/eip/OBJECTIFS.md, issue #26.

Chaque note suit le même plan : l'intention, ce qui existe déjà, ce que l'équipe va faire, les livrables, et le critère « Terminé quand » (même logique que la partie 2).

Vue d'ensemble :

| Thème | Type | Responsable | Livrables clés | Échéance principale |
|---|---|---|---|---|
| 3.1 Validation marché | Obligatoire | Enzo | 15 à 20 entretiens, synthèse, journal d'itérations, décision stratégique | Entretiens avant J1 ; décision à J3 |
| 3.2 Outils entrepreneuriaux | Obligatoire | Enzo | Canvas, persona, prévisionnel 6–12 mois, KPIs et tableau de bord, roadmap visuelle | J2 |
| 3.3 Stratégie et vision | Optionnel (B) | Arnaud, avec toute l'équipe | Manifeste, arbitrages, stratégie 6–18 mois, segments prioritaires | J2, revue à J3 |
| 3.4 Image et message | Optionnel (C) | Arnaud, Rares | Proposition de valeur, charte, kit de communication, tests du message | Premier test avant J1 ; bilan à J3 |

### 3.1 Validation marché (obligatoire)

**Intention.** Vérifier, auprès de vrais utilisateurs, que le problème décrit en 1.2 existe, qu'il est assez douloureux pour qu'on change d'outil, et que Nexum y répond. Les hypothèses de départ servent à construire le guide d'entretien, pas à conclure. Chaque choix de développement important (par exemple la famille de fonctionnalités livrée en bêta à J1) doit pouvoir se justifier par ce qu'on aura entendu sur le terrain.

**Ce qui existe déjà.**

- Un guide d'entretien et un formulaire prêts à publier (QUESTIONNAIRE_INTERVIEWS.md, GOOGLE_FORM.md), les questionnaires en français et en anglais générés par script dans Google Forms (docs/eip/questionnaire/), un gabarit de synthèse (INTERVIEW_SYNTHESIS_TEMPLATE.md) et une étude de marché rédigée (ETUDE_DE_MARCHE.md) dont les chiffres restent à renseigner.
- Un MVP testable : l'app desktop active de vrais modes (volume, luminosité, applications, liens, Steam) sur Windows, Linux et macOS.
- Un site en ligne (français et anglais) avec formulaire d'inscription à la bêta, qui propose un entretien de 20 minutes. Le formulaire fonctionne depuis le 19/10/2026 : chaque inscription (profil, principal agacement, accord pour un entretien, segment, source de la visite) arrive dans un tableau partagé de l'équipe, ce qui fournit les données des KPIs du site (3.2). Au 04/11/2026, aucune inscription réelle n'y est encore arrivée.

**Premiers résultats : questionnaire du 31/10 au 02/11/2026 (13 réponses, 11 en français et 2 en anglais).** Ce n'est pas encore l'étude demandée par la track : l'échantillon est petit et peu varié (10 personnes sur 13 ont de 18 à 24 ans, la plupart étudient, 12 ont un iPhone), et un questionnaire ne remplace pas les entretiens. Il donne cependant de premiers signaux :

| Question | Résultat | Ce que cela change |
|---|---|---|
| Douleurs les plus fortes (note de 4 ou 5 sur 5) | Jongler entre plusieurs messageries : 8 sur 13 ; être dérangé par les notifications en réunion ou en concentration : 6 sur 13 ; rouvrir chaque jour les mêmes applications : 5 sur 13 | Les familles Messages, Réunions et Travail sont les bonnes candidates pour la bêta de J1 |
| Préparer son PC avant de jouer | Note de 1 sur 5 pour 12 personnes sur 13, y compris les 3 joueurs (qui ouvrent pourtant Discord, règlent le son et ferment des applications avant de jouer) | Le jeu n'est pas la douleur d'entrée ; la famille Jeu passe après la bêta |
| Modes préférés | Travail cité par 11 personnes sur 13, puis Concentration (8) et Réunion (6) ; Jeu : 3 | Idem |
| Intégrations voulues en premier | Teams (10), Gmail (8), Discord (7), Outlook (6), Zoom ou Google Meet (5) | Ordre de priorité des intégrations de la bêta |
| Façon de lancer un mode | Un clic dans l'application en premier choix pour 10 personnes sur 12 ; la voix n'est citée que par 3 personnes, jamais en premier | Le clic reste la base ; la voix est un plus, pas l'argument principal |
| Freins | Données personnelles : 13 sur 13 ; fiabilité : 8 ; accès aux mails et messageries : 5 | Le « local d'abord » devient un argument central ; l'accès aux messageries doit rester en lecture seule et expliqué |
| Où garder ses modes | Uniquement sur l'ordinateur : 9 sur 13 | La synchronisation cloud reste optionnelle |
| Modes créés par d'autres | 9 sur 13 les installeraient s'ils sont vérifiés ; confiance : notes et avis (8), vérification par l'équipe (7) | Confirme la marketplace avec modération (US-36 à US-38) |
| Payer | 7 sur 13 resteraient sur la version gratuite ; formule préférée : achat unique (6) contre abonnement (2) ; fonctions payantes les plus citées : l'application mobile et les déclencheurs automatiques (3 chacune) | Hypothèses de prix à revoir (3.2) |
| Utilité perçue | 2,6 sur 5 en moyenne | Le message doit mieux montrer le gain ; à creuser en entretien |
| Bêta et entretien | 6 sur 13 veulent tester la bêta ; 2 sur 13 acceptent un entretien | Le questionnaire ne suffit pas à recruter les 15 à 20 entretiens : il faut d'autres canaux |
| Réseaux suivis | Instagram (10), YouTube (6), TikTok (5), LinkedIn (4) | Confirme Instagram comme canal principal (3.4) |

Les entretiens qualifiés, la collecte de métriques d'usage et les itérations restent à faire.

**Ce que nous allons faire.**

- **Étude de marché structurée** : besoins, douleurs et comportements actuels (outils utilisés, temps passé à régler son poste, solutions de contournement), avec les vrais chiffres.
- **15 à 20 entretiens qualifiés**, répartis sur les trois cibles de départ (joueurs, streamers, télétravailleurs), d'environ 20 minutes, en visioconférence ou à l'écrit. Recrutement via le site, Instagram et le réseau de l'équipe, en veillant à ne pas interroger que des proches. Comme seules 2 personnes sur 13 ont accepté un entretien via le questionnaire, l'équipe sollicite aussi directement des personnes qui correspondent à la cible (télétravailleurs, alternants, salariés qui utilisent Teams ou Outlook), hors de la promotion Epitech, pour corriger l'âge et le profil trop homogènes du questionnaire. Les entretiens sont menés avant J1, car leurs résultats servent à choisir la famille livrée en bêta. Il reste environ quatre semaines, d'où des points d'étape :

| Date | Entretiens réalisés | Ce qui en sort |
|---|---|---|
| 15/11/2026 | 5 | Premiers retours ; guide d'entretien corrigé si des questions ne fonctionnent pas |
| 25/11/2026 | 12 | Synthèse intermédiaire ; premier classement des douleurs par cible |
| J1 (début décembre) | 15 à 20 | Synthèse consolidée ; choix de la famille et du segment d'entrée (3.3) |

Si un point d'étape n'est pas atteint, l'équipe répartit les entretiens restants entre plusieurs membres plutôt que de repousser J1.
- **Synthèse consolidée** : problèmes récurrents, comportements, critères de décision, objections.
- **MVP testé selon un scénario d'usage** (installer, créer ou activer un mode, constater le résultat) qui mesure la compréhension, l'intérêt et l'engagement.
- **Métriques quantitatives et qualitatives** : taux de clic et taux d'inscription sur le site, nombre d'activations de modes, score de satisfaction, verbatims. Un bouton « Envoyer un retour » dans l'app (US-43) collecte les retours des bêta-testeurs, avec un objectif d'au moins 20 bêta-testeurs.
- **Deux itérations complètes** (tests, collecte, analyse, ajustements concrets) : le cycle n° 1 de J1 à J2 (07/02/2027) et le cycle n° 2 jusqu'à J3 (04/04/2027). Chaque itération est consignée dans un journal (v1, v2…) : ce qui a été entendu, ce qui a changé (fonctionnalité, design, message ou usage) et pourquoi.
- **Décision stratégique** à J3 : continuer, pivoter ou redéfinir le MVP, justifiée par les résultats, avec un plan d'action pour la suite.

**Livrables.** Synthèse de l'étude de marché · guide d'entretien · tableau de résultats consolidé · démo ou MVP · journal d'itérations · justification de la décision de J3.

**Terminé quand.** 15 à 20 entretiens réalisés et synthétisés ; au moins 2 itérations documentées, chacune avec au moins un changement concret lié à un besoin identifié ; métriques consolidées dans un tableau ; décision de J3 écrite et justifiée.

**Points de vigilance.** Risque de biais de recrutement (privilégier des personnes extérieures à l'équipe). Éviter les questions fermées du type « aimez-vous notre idée ? » : les entretiens portent sur les comportements actuels. Ne conserver comme itération que les changements reliés à un besoin identifié.

### 3.2 Outils entrepreneuriaux (obligatoire)

**Intention.** Se doter des outils qui font passer Nexum d'un projet technique à un projet viable : savoir pour qui on construit, ce qui coûte, ce qui rapporte, comment on mesure le progrès, et pouvoir le démontrer avec des chiffres.

**Ce qui existe déjà.**

- Des documents rédigés dont les chiffres sont encore des hypothèses : BUSINESS_MODEL_CANVAS.md, FINANCIAL_MODEL.md, KPIS_ET_PROJECTIONS.md, ROADMAP_PRODUIT.md.
- Trois personas avec leurs parcours (USER_JOURNEYS.md), une analyse concurrentielle (ANALYSE_CONCURRENTIELLE.md) et le plan du pitch (PITCH_PRESENTATION.md).
- Une gestion de projet en place : board GitHub Projects, jalons avec les dates officielles, issues attribuées, backlog de 46 user stories (partie 2) priorisé en MoSCoW (#107) et Beta Test Plan.

**Ce que nous allons faire.**

- **Business Model Canvas** tenu à jour : il reflète l'état réel du projet et change quand les entretiens corrigent une hypothèse. Il est revu à chaque jalon.
- **Proposition de valeur** en une phrase et **Value Proposition Canvas** (problème, pour qui, solution différenciante), liés aux résultats des entretiens.
- **Persona principal** et scénarios d'usage réalistes, confirmés par les entretiens (segment décrit en 3.3). Hypothèse de départ : **Sarah, 34 ans, développeuse en télétravail** (USER_JOURNEYS.md), qui utilise le même PC pour travailler et se détendre. Sa douleur : les notifications du travail continuent le soir et rien ne marque la fin de la journée. Son scénario : à 18 h, ou à la fin de sa dernière réunion, un mode ferme les outils de travail, coupe les notifications, baisse la luminosité et lance sa musique. Ce qui la convaincrait : un déclenchement fiable et des données qui restent sur sa machine ; son frein : un logiciel qui change des choses sans prévenir. Elle correspond aux familles pressenties pour la bêta (Réunions, Travail, Messages), et le questionnaire de fin octobre va dans son sens : 11 personnes sur 13 choisissent le mode Travail, et la donnée personnelle est le premier frein pour toutes. Les personas joueur (Léo) et streamer (Maxime) restent secondaires ; si les entretiens montrent une douleur plus forte chez eux, le persona principal change, et ce changement est noté dans le journal d'itérations.
- **Modèle financier simplifié sur 6 à 12 mois**. Côté revenus : un modèle freemium (modes de base gratuits ; offre payante pour la synchronisation cloud, l'app mobile et les déclencheurs avancés, voir US-45), dont les prix ne sont pas fixés et sont testés avec les utilisateurs. Côté coûts : hébergement OVH, signature des installeurs, comptes développeur mobile, nom de domaine et outils. Chaque hypothèse est justifiée et le modèle est actualisé avec les données réelles.

  Hypothèses de départ (FINANCIAL_MODEL.md, à reprendre pour la période J1 → J4) :

  | Poste | Hypothèse | Origine |
  |---|---|---|
  | Prix de l'offre payante | 4,99 €/mois, ou 49 € en achat unique | FINANCIAL_MODEL.md ; à tester en entretien face aux repères cités au suivi du 19/10 (Signal RGB Pro : 45 $/an ; Stream Deck 15 touches : 149 $) |
  | Conversion gratuit → payant | 3 % la première année | FINANCIAL_MODEL.md |
  | Coûts de la première année | ~8 000 € : cloud ~2 000 €, IA ~500 €, marketing ~3 000 €, sécurité et conformité ~1 500 €, outils ~1 000 €, aucun salaire | FINANCIAL_MODEL.md |
  | Comptes développeur mobile | Apple : 99 $/an ; Google Play : 25 $ une seule fois | Tarifs publics |
  | Hébergement OVH | À chiffrer ; un budget Epitech est possible | #121 |

  Le questionnaire de fin octobre (3.1) nuance ces hypothèses : sur 13 personnes, 7 resteraient sur la version gratuite, l'achat unique est préféré à l'abonnement (6 contre 2), et les fonctions payantes les plus citées sont l'application mobile et les déclencheurs automatiques (3 chacune), alors que 9 personnes veulent garder leurs modes uniquement sur leur ordinateur, ce qui fragilise la synchronisation cloud comme offre payante. Une seule personne a donné un prix : « bonne affaire » à 25 €, « trop cher » à 60 €. Les prix et le contenu de l'offre payante sont donc testés en priorité pendant les entretiens.

  Ces chiffres datent de juillet 2026 et visent 5 000 utilisateurs actifs en fin de première année. Ils précèdent la décision de bêta fermée sur une famille (19/10/2026) et l'objectif d'au moins 20 bêta-testeurs : le prévisionnel 6–12 mois part donc de la bêta (peu d'utilisateurs, coûts surtout d'hébergement et de comptes développeur) et ne prévoit des revenus qu'avec l'offre payante (US-45, J4).
- **KPIs** adaptés à la maturité du projet, suivis dans un tableau de bord simple :

| KPI | Définition | Source |
|---|---|---|
| Taux de clic | Visiteurs qui cliquent sur « Rejoindre la bêta » / visiteurs du site | Site |
| Taux d'inscription | Inscriptions à la bêta / visiteurs du site | Formulaire d'inscription |
| Conversion en entretien | Inscrits qui acceptent un entretien / inscrits | Formulaire et suivi des entretiens |
| Utilisateurs actifs | Bêta-testeurs qui activent au moins un mode par semaine | Application |
| Usage | Activations de modes par utilisateur actif et par semaine | Application |
| Fiabilité | Actions réussies / actions lancées (le moteur renvoie le résultat réel de chaque action) | Journal d'exécution |
| Rétention | Utilisateurs encore actifs 7 et 30 jours après l'installation | Application |
| Satisfaction | Score sur 5 demandé via le retour dans l'app (US-43) | Retours |
| Conversion payante | Utilisateurs gratuits qui passent à l'offre payante / utilisateurs gratuits (dès l'offre US-45, J4) | Compte |
| CAC | Dépenses d'acquisition / nouveaux utilisateurs ; proche de zéro tant que l'acquisition reste organique, calculé dès la première dépense | Finances |

- **Analyse SWOT** (forces, faiblesses, opportunités, menaces), reliée au benchmark de 1.3 et révisée après les entretiens. Point de départ : forces = actions réelles sur le poste, sans code, toutes marques, voix locale ; faiblesses = équipe étudiante, aucune donnée terrain, nombreuses intégrations à maintenir ; opportunités = offres gratuites limitées des outils d'automatisation, demande de souveraineté des données (hébergement OVH), communauté de créateurs via la marketplace ; menaces = un éditeur établi (fabricant ou outil d'automatisation) qui ajoute le pilotage local, évolution des API tierces, restrictions d'iOS.
- **Concurrence** : l'analyse concurrentielle (ANALYSE_CONCURRENTIELLE.md) et le tableau de 1.3 sont tenus à jour (nouveaux acteurs, prix, limites des offres gratuites) et complétés par ce que les personnes interrogées utilisent vraiment.
- **Pitch deck** : le plan diapositive par diapositive, le script de démo et la FAQ du jury existent (PITCH_PRESENTATION.md) ; le support est réalisé, puis mis à jour à chaque jalon avec les chiffres réels et utilisé aux suivis et aux Greenlight. Sa version orale courte est décrite en 3.4.
- **Outils de pilotage** : GitHub Projects, jalons, backlog MoSCoW, Beta Test Plan. **Roadmap visuelle** avec jalons J1 à J4, échéances et responsables (la roadmap actuelle est textuelle et sera rendue visuelle).

**Livrables.** BMC à jour · Value Proposition Canvas · persona et scénarios · analyse SWOT · tableau de la concurrence · pitch deck · roadmap visuelle · prévisionnel 6–12 mois avec hypothèses · liste des KPIs avec définitions et méthode de suivi · captures du tableau de bord · accès au board et au backlog.

**Terminé quand.** Le BMC, le persona et le prévisionnel s'appuient sur des données de terrain (entretiens, inscriptions, usages) et non plus seulement sur des hypothèses ; les KPIs ci-dessus sont définis et le tableau de bord affiche au moins les KPIs du site et de l'usage bêta ; la roadmap visuelle est publiée avec ses responsables.

### 3.3 Stratégie et vision (objectif complémentaire B)

**Intention.** Formaliser le cap de Nexum et surtout les choix qu'il implique : ce que l'équipe fait, ce qu'elle refuse de faire, dans quel ordre et pour qui. Cette note sert à décider à J3 avec des critères posés à l'avance, et non au feeling.

**Ce qui existe déjà.** Une vision et une analyse concurrentielle rédigées (comparaison avec les logiciels de fabricants, les scripts, les lanceurs et les outils d'automatisation en ligne, voir 1.3). Les principes du produit sont déjà visibles dans le site et le dépôt : sans code, toutes marques, transparent, léger.

**Ce que nous allons faire.**

- **Manifeste** d'une page : la vision (un seul endroit pour régler son environnement numérique, sans code, quelle que soit la marque) et les quatre principes du produit (sans code, toutes marques, transparent sur ce qui a marché ou non, léger et local d'abord).
- **Arbitrages assumés** : ce que Nexum ne fera pas, avec la raison. Version de départ, à réviser avec les retours :

| Nous ne ferons pas | Pourquoi |
|---|---|
| Modifier ou injecter quoi que ce soit dans un jeu | Nexum lance le jeu et règle ce qui l'entoure ; cela évite tout conflit avec les anti-triche |
| Faire écrire du code à l'utilisateur | Un mode est une donnée validée, pas un script : c'est la promesse « sans code » et la sécurité du partage |
| Envoyer la voix sur Internet | La reconnaissance vocale reste locale |
| Écrire dans les messageries (Gmail, Outlook, Teams) | Connexion en lecture seule, pour limiter les risques et la confiance à demander |
| Ouvrir toutes les intégrations en même temps | Une famille complète et stable à la fois, en commençant par une seule pour la bêta (J1) |
| Chercher des partenariats avant le Greenlight blanc | Aucun contact engagé ; l'objectif complémentaire A n'est pas retenu |

- **Stratégie sur 6 à 18 mois**, fondée sur le terrain et révisée à chaque jalon :

| Horizon | Période | Contenu | Condition |
|---|---|---|---|
| 0 à 6 mois | octobre 2026 → avril 2027 | Bêta fermée sur une famille (J1), MVP et Beta Test Plan (J2), marketplace avec modération (J3), cycle d'itération n° 2, Greenlight blanc et décision (J3) | Résultats des entretiens |
| 6 à 9 mois | → juillet 2027 | Installeurs signés, mises à jour automatiques, messages centralisés, génération de mode par IA, offre payante (J4) | Décision « continuer » à J3 |
| 9 à 18 mois | → avril 2028 | Ouverture progressive de la bêta, marketplace ouverte aux contributeurs extérieurs (modes gratuits et payants), nouvelles extensions | Traction mesurée : rétention et conversion |

La marketplace arrive tôt (J3) car elle est prioritaire (suivi du 19/10/2026) : des contributeurs extérieurs peuvent créer des modes et des extensions plus vite que l'équipe seule. Elle impose une modération (score de risque, file de validation : US-36 à US-38) contre les modes malveillants. En attendant la bêta, un espace communautaire (Discord ou forum) recueille les idées de fonctionnalités et prépare les premiers créateurs.

- **Segments prioritaires.** Trois cibles de départ : les joueurs PC, les streamers et les télétravailleurs. Le segment d'entrée n'est pas figé : il sera tranché d'après les entretiens (3.1) selon quatre critères : douleur exprimée, fréquence d'usage, adéquation avec ce qui existe déjà, et disposition à payer. Premier signal (questionnaire de fin octobre, 13 réponses, voir 3.1) : les douleurs fortes portent sur le travail et les études (messageries, notifications, applications à rouvrir), presque pas sur le jeu. La bêta de J1 porte donc sur une famille parmi Réunions, Travail et Messages, ce qui correspond d'abord au segment des personnes qui travaillent ou étudient sur leur PC ; les joueurs et les streamers sont couverts par la famille Jeu (Steam, Hue, OBS, Spotify), livrée avec le MVP et dans la suite du backlog.
- **Revue stratégique à J3** : relire le manifeste, les arbitrages et la stratégie à la lumière des deux cycles d'itération, et décider de continuer, pivoter ou redéfinir.

**Livrables.** Manifeste · liste d'arbitrages · stratégie 6–18 mois · fiche des segments prioritaires avec les critères de choix · compte rendu de la revue de J3.

**Terminé quand.** Le manifeste, les arbitrages et la stratégie sont rédigés et validés par toute l'équipe avant J2 ; le segment d'entrée est choisi avec ses critères et ses preuves issues des entretiens ; la revue de J3 a eu lieu et ses décisions sont écrites.

### 3.4 Image et message (objectif complémentaire C)

**Intention.** S'assurer qu'un inconnu comprend en quelques secondes ce que fait Nexum, pour qui, et pourquoi c'est différent, et que le même message se retrouve partout : site, réseaux, démo, application. Le message est testé auprès de vrais utilisateurs, puis ajusté.

**Ce qui existe déjà.**

- Un site vitrine en ligne (français et anglais) avec thème sombre monochrome et thème clair « Galaxie », des pages par cible (joueurs, streamers, télétravail) et l'inscription à la bêta.
- Une identité en cours de validation : logo « N » tramé, palette, charte (BRAND_GUIDELINES.md), exports pour les réseaux.
- Un compte Instagram (@app.nexum) et un profil d'organisation GitHub avec bannière et démonstration animée, une page LinkedIn (Nexum Entertainment, pour toucher les professionnels) et une bande-annonce de 47 secondes. TikTok reste à créer.
- Un ton éditorial décrit dans la charte : concret, direct, honnête sur l'état du produit (« sans survendre », comme sur le site).

Le message n'a pas encore été testé auprès d'utilisateurs. Le questionnaire de fin octobre (3.1) donne déjà deux indices : la voix est la façon de lancer un mode la moins demandée, ce qui affaiblit une accroche centrée sur la voix (« Dis-le. Ton setup suit. ») ; et les données personnelles sont le premier frein pour les 13 personnes, ce qui place « vos données restent sur votre machine » au cœur du message.

**Ce que nous allons faire.**

- **Proposition de valeur en une phrase**, version de travail : « Nous aidons les joueurs, les streamers et les télétravailleurs à préparer leur PC pour chaque activité en un clic, grâce à des modes sans code qui règlent le son, la luminosité, les lumières et les applications, quelle que soit la marque. » Elle cite trois cibles à dessein : c'est une version de travail, resserrée sur le segment d'entrée dès qu'il est choisi d'après les entretiens (3.3), pour éviter un message « pour tout le monde ». Elle est déclinée par canal :

| Canal | Déclinaison |
|---|---|
| Site | Accroche « Un clic. Tout votre setup. » et pages par cible |
| Réseaux sociaux | Signature « Dis-le. Ton setup suit. » (bande-annonce, carrousel de présentation), démos courtes, calendrier éditorial |
| Pitch | Version courte (30 secondes) pour la démo devant le jury |
| Application | Maquettes et textes de l'interface cohérents avec la promesse |
| E-mail | Message d'accueil de la bêta |

- **Charte finalisée** (logo, couleurs, typographie, éléments réutilisables) et **kit de communication** : décider la déclinaison définitive, puis l'appliquer au site, aux réseaux et à l'application pour éviter des visuels incohérents d'un canal à l'autre.
- **Une seule accroche** : le site (« Un clic. Tout votre setup. », vouvoiement) et les réseaux (« Dis-le. Ton setup suit. », tutoiement) utilisent aujourd'hui deux accroches et deux tons. Les deux sont testées auprès des personnes interrogées (voir ci-dessous) ; la gagnante, et le ton qui va avec, sont appliqués partout avant J1.
- **Différenciation** claire face aux logiciels de fabricants, aux scripts, aux lanceurs et aux outils d'automatisation en ligne : Nexum est le seul à cumuler le déclenchement selon le contexte, le réglage du poste local, toutes les marques et aucun code (tableau de 1.3).
- **Tests du message** auprès de vrais utilisateurs de la cible :
  - Protocole : on montre la phrase de valeur, le pitch court et 2 ou 3 visuels, sans explication, à au moins 15 personnes réparties sur les trois cibles. Le premier test est intégré aux entretiens de 3.1.
  - Mesures : compréhension (la personne reformule ce que fait Nexum ; l'objectif est qu'au moins 2 personnes sur 3 y parviennent), résonance (note sur 5 et « pour qui est-ce ? »), verbatims, et en ligne, taux de clic et d'inscription par variante de message.
  - Preuves conservées : captures, commentaires, verbatims.
  - Ajustements : chaque modification du message ou des visuels est notée avec ce qui l'a déclenchée (avant/après), puis retestée au cycle suivant.

**Livrables.** Proposition de valeur et ses déclinaisons · charte graphique, ton éditorial et kit de communication · site et réseaux cohérents · protocole et résultats des tests du message · journal des ajustements.

**Terminé quand.** La charte est figée et appliquée sur le site, les réseaux et l'application ; au moins 15 personnes ont testé le message, avec résultats chiffrés et verbatims à l'appui ; au moins un ajustement du message ou des visuels est documenté avec sa raison ; le même message est utilisé sur tous les canaux.

### 3.5 Calendrier des objectifs non techniques

| Jalon | Date | Validation marché (3.1) | Outils (3.2) | Stratégie (3.3) | Image et message (3.4) |
|---|---|---|---|---|---|
| J1 | début décembre 2026 | Entretiens faits et synthétisés ; bêta-testeurs recrutés ; cycle n° 1 lancé | Définition des KPIs ; tableau de bord initial | Choix du segment d'entrée d'après les entretiens | Premier test du message (intégré aux entretiens) ; accroche unique choisie ; charte figée |
| J2 | 07/02/2027 | Cycle n° 1 clos ; journal d'itérations v1 | BMC, persona, prévisionnel et roadmap visuelle à jour | Manifeste, arbitrages et stratégie validés | Ajustements du message documentés |
| J3 | 04/04/2027 | Cycle n° 2 clos ; décision continuer ou pivoter | Chiffres actualisés avec les données réelles | Revue stratégique | Bilan des tests du message |
| J4 | 05/07/2027 | Résultats du BTP en démonstration | Mesure de la conversion payante (offre US-45) | Stratégie mise à jour pour la suite | Message final cohérent sur tous les canaux |
