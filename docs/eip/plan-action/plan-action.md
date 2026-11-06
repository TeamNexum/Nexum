# Plan d'action « Highway to Tech4 » (G-EIP-600) — Nexum

Plan d'action complet de l'EIP Nexum, à déposer sur la plateforme EIP (#113). Trois parties : 1. Contexte, 2. Spécifications techniques, 3. Spécifications non techniques. **Version 3, mise à jour du 06/11/2026 (choix de famille, plateforme et responsable cloud)** ; l'état des user stories a été revérifié sur le code le 06/11/2026 (branche `main` au commit `d7ac255`, branche d'intégration `unstable` au commit `954a671`). Les preuves attendues par le mentor sont dans le pack à remettre le 07/11/2026 à 19 h 30 (séance 4 : 09/11/2026 à 19 h 30) ; ce plan y renvoie sans les recopier.

Équipe : Arnaud, Rares, Raphaël, Max, Enzo (Epitech Marseille). Track : Entrepreneuriat. Site : https://teamnexum.github.io/NexumWebsite/ · Code : dépôt principal https://github.com/TeamNexum/Nexum ; applications mobiles dans les dépôts privés TeamNexum/NexumIOS et TeamNexum/NexumAndroid.

**Décisions en attente.** Trois sujets restent à valider par le mentor ou par Ruben ; ils sont marqués [À TRANCHER (n)] là où ils apparaissent, avec une recommandation : (2) jeu d'intitulés des deux objectifs complémentaires, stratégie et vision, image et message (mentor, 09/11) ; (4) budget et hébergeur (Ruben) ; (6) report du modèle économique de la marketplace (confirmation du mentor). **Décisions déjà prises :** fournisseur d'agenda, Microsoft (voir US-47 et 2.2) ; choix de l'équipe du 06/11/2026 : famille Travail (version concentration), plateforme PC Windows, responsable du cloud Raphaël (voir 2.3 et 2.4). La famille et la plateforme sont présentées au mentor en séance 4 (09/11/2026) pour validation sur la matrice de priorisation : elles ne sont pas validées par le mentor à ce jour. Un chiffre présenté comme « cible » ou « proposé » n'est pas une mesure.

---

## 1. Contexte

Partie 1 du plan d'action. Sources : site Nexum, organisation GitHub TeamNexum, `docs/eip/OBJECTIFS.md`, comptes rendus des suivis du 25/09/2026 (track) et du 19/10/2026 (séance 3 : compte rendu du mentor, objectifs complémentaires).

### 1.1 D'où vient le projet

Nexum est le projet EIP (Epitech Innovative Project) de cinq étudiants d'Epitech Marseille. Il court de 2026 à l'été 2027.

| Membre | Rôle dans l'équipe |
|---|---|
| Arnaud | Produit et coordination, macOS, communication |
| Rares | Pilotage du projet et coordination de l'équipe sur le plan technique; polyvalent (moteur, interface, messagerie unifiée, cloud, communication) |
| Raphaël | Moteur, installeur et mises à jour, serveur cloud (responsable du déploiement, voir 2.4) |
| Max | Moteur, extensions, Android |
| Enzo | Business, stratégie et données |

Tout part d’un agacement courant quand on utilise un PC : avant une partie, un stream ou une journée de travail, on ouvre, règle et relance à la main les mêmes outils, qui ne se parlent pas. Une première version, une app web aux actions simulées, a servi de prototype. Elle a montré trois limites : des actions qui ne faisaient rien de réel, un front et un back désynchronisés, des modes écrits en dur. Le projet a été repris sur une base technique différente (voir 2.1). Aujourd'hui, l'app desktop active de vrais modes : volume, luminosité, lancement d'applications, fermeture d'applications (à fiabiliser, US-14), liens, jeux Steam. Philips Hue est en cours d'intégration (état au 06/11/2026).

### 1.2 Le problème

Les utilisateurs de PC qui enchaînent plusieurs activités (jouer, streamer, travailler, se détendre) règlent leur environnement à la main, à chaque fois. Trois constats de départ :

- **Cinq applications pour un seul moment.** Lanceur, logiciel du casque, application des lumières, musique, messagerie : chacun se règle séparément, avant chaque session.
- **Une marque, un logiciel.** Les outils des fabricants ne pilotent que leur propre matériel, alors qu'un poste mélange plusieurs marques.
- **Les scripts sont réservés aux techniciens.** Automatiser avec AutoHotkey ou des raccourcis demande du code ; la plupart des gens y renoncent.

Ces constats sont des hypothèses de départ. Le premier questionnaire (13 réponses, voir 3.1) confirme surtout les douleurs liées au travail (messageries multiples, notifications) et beaucoup moins celles liées au jeu. Les entretiens individuels de la track Entrepreneuriat (cible : 20 documentés, voir 3.1) servent à les valider, à les corriger et à hiérarchiser les douleurs.

### 1.3 La solution

Nexum est un centre de contrôle sans code pour son environnement numérique. L'utilisateur choisit un **mode**, c'est-à-dire une liste d'actions (son, luminosité, lumières, applications, jeux, liens), et Nexum règle tout en un clic.

- **Sans code.** Un mode est une donnée (JSON), jamais un script : il se crée dans un éditeur visuel, se valide, se partage et se génère sans risque.
- **Toutes marques (visé).** Nexum raisonne en besoins (« lancer la musique », « changer la lumière ») puis utilise le service que l'utilisateur possède. Aujourd'hui, les actions sont liées à chaque marque ; la capacité générique est l'objet de US-55.
- **Transparent.** Chaque action renvoie son résultat réel : l'utilisateur voit ce qui a marché, ce qui a échoué et pourquoi.
- **Léger et local d'abord.** App native (Tauri, Rust), stockage local, reconnaissance vocale locale. Le cloud ne sert qu'aux comptes, à la synchronisation et à la télécommande mobile.

**Hypothèse de différenciation, non démontrée à ce jour.** Le tableau ci-dessous résume ce que l'équipe a compris des alternatives en lisant leur documentation (non testé à ce jour).

| Outil | Marques | Code | Ce qu'il pilote |
|---|---|---|---|
| Logiciels de fabricants (Razer Synapse, Corsair iCUE…) | Une seule | Sans code | Périphériques |
| Scripts (AutoHotkey, raccourcis) | Toutes | Code requis | Ce que l'on programme |
| Lanceurs (Steam, Playnite…) | — | Sans code | Jeux uniquement |
| Automatisation en ligne (IFTTT, Zapier, n8n, Make, Power Automate) | Services connectés | Sans code à technique (n8n) ; offres gratuites limitées (Zapier, offre gratuite : 100 tâches par mois, Zaps illimités mais à deux étapes seulement ; vérifié le 06/11/2026 sur https://zapier.com/pricing) | Services web ; d'après leur documentation, ne règlent pas le poste local |
| **Nexum** (visé) | Toutes | Sans code | Applications, système, jeux, lumières (en partie réalisé, voir 2.2) |

L'hypothèse est qu'aucun de ces outils ne réunit à la fois le **déclenchement selon le contexte** (US-26 à US-28), le **réglage du poste local**, la **restauration de l'état d'avant** (US-48) et l'absence de code. Elle sera validée ou corrigée par le **test réel d'au moins trois alternatives** (comptes utilisés, scénarios essayés, captures, résultats et limites), livré dans le pack du 07/11 (voir 3.1). Tant que ce test n'est pas fait, la différenciation ne doit pas être présentée comme un fait.

Le détail fonctionnel et la stack sont en partie 2. La partie 2 s'appuie sur un catalogue interne de 1 176 capacités, qui sert à choisir, repousser ou abandonner des idées : il ne vaut pas promesse de tout développer.

### 1.4 Objectif

**Objectif du projet.** Livrer, au Greenlight + RNCP de juillet 2027, une application installée et utilisable, qui exécute de vrais modes, et démontrer en direct toutes les fonctionnalités du Beta Test Plan (partie 2, jalon J4). Le Greenlight est un go / no-go : un BTP assez conséquent pour cinq personnes sur un an, et entièrement réalisé (rappel du suivi du 25/09/2026).

**Objectif entrepreneurial.** Prouver, avec des utilisateurs réels, que le problème existe et que Nexum le résout, puis décider sur des preuves de continuer, pivoter ou redéfinir le MVP au Greenlight blanc d'avril 2027 (jalon J3). La bêta fermée de début décembre 2026 (jalon J1) en est la première étape. Conformément au mentor, elle porte sur **une seule famille de fonctionnalités et une seule plateforme prioritaire (PC)** : tester PC, Android et iOS en même temps créerait trop de variables.

### 1.5 Track choisie

**Track Entrepreneuriat**, confirmée au suivi pédagogique du 25/09/2026. Selon la fiche G-EIP-600, le plan traite les thèmes obligatoires (validation du marché ; outils entrepreneuriaux) et au moins deux thèmes optionnels, avec une note d'intention par thème.

| Thème (intitulé de la fiche G-EIP-600, traduit) | Type | Statut |
|---|---|---|
| 1. Valider l'idée par la validation du marché | Obligatoire | Traité en 3.1 |
| 2. Maîtriser les outils entrepreneuriaux | Obligatoire | Traité en 3.2 |
| Définir une stratégie et une vision | Optionnel | Retenu avec le mentor le 19/10/2026, traité en 3.3 |
| Renforcer l'image et le message du projet | Optionnel | Retenu avec le mentor le 19/10/2026, traité en 3.4 |
| Établir des partenariats | Optionnel | Non retenu : aucun contact partenaire n'est engagé à ce jour |
| Prévoir la croissance et l'expansion | Optionnel | Non retenu |

**Correspondance avec les intitulés du mentor.** Le compte rendu de la séance 3 nomme les deux thèmes optionnels retenus autrement que la fiche. Pour ne rien perdre, le plan couvre les attendus du mentor sous les deux jeux d'intitulés.

| Intitulé de la fiche G-EIP-600 (ce plan) | Intitulé du mentor (compte rendu de la séance 3) | Où c'est traité |
|---|---|---|
| Stratégie et vision | Communiquer autour du projet et se faire connaître | Fiche : 3.3. Mentor : 3.4 (canaux, ligne éditoriale, calendrier, page de conversion, registre des publications) |
| Image et message | Obtenir les premiers utilisateurs et mesurer leur usage | Fiche : 3.4. Mentor : 3.1 (registre des testeurs, parcours, deux canaux d'acquisition, usage répété) |

[À TRANCHER (2) avec David Simonian le 09/11 : quel jeu d'intitulés fait foi pour ces deux thèmes. Recommandation : garder les intitulés de la fiche dans le document déposé, puisque la fiche est la référence de la plateforme, et rendre visibles dans les mêmes sections les attendus du mentor, comme ci-dessus.]

Pourquoi ces deux thèmes : le travail de marque est déjà lancé (charte, logo, site avec inscription à la bêta) et il manque le test du message et le recrutement des premiers utilisateurs. La vision et l'analyse concurrentielle sont rédigées ; il reste à les transformer en arbitrages et en stratégie datée, ce qui sert la décision continuer / pivoter de J3. Ni l'un ni l'autre ne dépend d'un tiers, contrairement aux partenariats.

### 1.6 Partenaires

**Aucun partenaire à ce jour.** Aucun partenariat n'est annoncé dans ce plan, faute de contact réel avec preuve d'échange. Si la décision de J3 est de continuer, la question sera rouverte.

Les acteurs suivants ne sont pas des partenaires, mais le projet s'appuie sur eux :

| Acteur | Nature de la relation |
|---|---|
| Mentor Epitech (David Simonian) et équipe pédagogique | Encadrement : séances de suivi (séance 3 le 19/10/2026, séance 4 le 09/11/2026 à 19 h 30) |
| Ruben (Epitech) | Interlocuteur pour clarifier le budget d'infrastructure que l'école pourrait prendre en charge (#121) |
| OVH (France) | Hébergeur **pressenti** de l'API cloud et de la base de données (suivi du 19/10) ; budget, localisation effective des données et conformité RGPD **à documenter** ; aucun contrat ni déploiement [À TRANCHER (4) : recommandation : décider fournisseur et budget le 09/11, puis documenter la localisation des données avant d'y mettre des comptes de testeurs] |
| Philips Hue, Steam, Epic, GOG, Spotify, Google, Microsoft | Services tiers pilotés par API publiques ; aucun accord commercial |
| Futurs bêta-testeurs | Recrutés via le site, les réseaux et les entretiens ; pas des partenaires au sens de la track |

---

## 2. Spécifications techniques

Partie 2 du plan d'action « Highway to Tech4 » (G-EIP-600).

### 2.1 Stack technique

Le prototype (une app web avec des actions simulées) a montré trois limites : des actions qui ne faisaient rien de réel, un front et un back désynchronisés, des modes écrits en dur. La stack ci-dessous répond à ces trois points.

| Brique | Technologie | Rôle | Pourquoi ce choix |
|---|---|---|---|
| Application desktop | **Tauri 2** (Windows, macOS, Linux) | Fenêtre native de l'app | Binaire bien plus léger qu'Electron, backend en Rust, même outil pour le mobile |
| Interface | **React 18 + TypeScript + Vite** | Écrans desktop et mobile | Compétences de l'équipe, un même langage d'interface partout ; l'interface mobile est copiée dans chaque dépôt mobile |
| Cœur | **Rust** : `nexum-schema`, `nexum-core` | Format des modes, moteur qui exécute les actions, bus d'événements | Un mode est une **donnée JSON, jamais du code** : il se valide, se partage et se génère sans risque |
| Intégrations | **Rust** : `nexum-adapters`, une implémentation par système | Volume, luminosité, applications, liens, jeux (Steam, Epic, GOG), Philips Hue | Windows : API Core Audio (COM) pour le volume ; macOS : AppleScript pour le volume et framework système privé DisplayServices pour la luminosité ; Linux : commandes `wpctl` / `pactl` (PipeWire, PulseAudio) ; luminosité Windows et Linux via la bibliothèque `brightness` |
| Stockage local | **SQLite** (`nexum-store`) | Modes et réglages sur la machine | Aucun serveur à installer, l'app marche hors ligne |
| Commande vocale | **whisper.cpp** via `whisper-rs` (`nexum-voice`) | Reconnaissance vocale (option de compilation `voice`, pas encore dans les installeurs) | Locale : aucune voix envoyée sur Internet |
| API cloud | **Rust, axum + Tokio** (`nexum-cloud`) ; **PostgreSQL** fusionné dans la branche `unstable` le 06/11 (PR #134), pas encore dans `main` (qui garde un stockage en mémoire) | Comptes, synchronisation, télécommande, retours des testeurs ; catalogue de la marketplace côté serveur à construire (le catalogue est local aujourd'hui) | Même langage que le cœur, types partagés |
| Hébergement | **OVH** (France), pressenti | API cloud et base de données | Pressenti au suivi du 19/10 (proximité, souveraineté perçue). Budget Epitech à clarifier avec Ruben (#121) ; fournisseur, localisation des données, coûts et obligations de sécurité à documenter [À TRANCHER (4)]. Rien n'est déployé |
| Apps mobiles | **Tauri 2 mobile**. iOS (dépôt privé `NexumIOS`) : plugin natif **Swift**, plus complet ; une action refusée par iOS (volume, sonnerie) revient en échec avec sa raison. Android (dépôt privé `NexumAndroid`) : pont natif **Kotlin** ; le compte rendu d'exécution marque aujourd'hui toutes les étapes en succès (à corriger, US-42). Télécommande web de secours : PWA React (`apps/mobile`, dépôt principal) | Télécommande du PC via le cloud, modes sur le téléphone (hors bêta J1) | Interface React copiée dans chaque dépôt ; crates Rust `nexum-core`, `nexum-schema`, `nexum-store` en dépendance git. Sur iOS le moteur pilote le plugin Swift ; sur Android l'exécution réelle passe par Kotlin. L'état réel d'Android est attendu dans le pack du 07/11 |
| IA | Règles locales (app desktop) ; API **Claude** en option côté cloud | Transformer une phrase en mode | L'IA ne produit qu'un mode JSON, validé avant toute exécution |
| Types partagés | **ts-rs** | Types TypeScript générés depuis le Rust | Front et back ne peuvent plus diverger |
| Qualité | cargo test, **Vitest**, **Playwright**, **GitHub Actions** | Tests et build sur chaque pull request et chaque push sur `main` | Dépôt principal : Rust (fmt, clippy, tests) sur Windows, macOS et Linux ; application desktop : clippy et compilation sur les 3 systèmes, tests de bout en bout sur Linux ; 3 jobs en échec sur `main` au 06/11 (tests Vitest, Playwright, smoke Tauri). `NexumIOS` : Vitest, clippy, tests Rust et build pour le simulateur iOS sur macOS. `NexumAndroid` : build de l'APK sur Ubuntu, sans test. État des exécutions des dépôts privés à vérifier |

**Architecture en une phrase.** L'interface envoie un mode au moteur Rust, qui exécute ses actions une par une à travers l'intégration du système (une par OS ou appareil) et renvoie le résultat réel de chaque action ; le cloud ne sert qu'aux comptes, à la synchronisation et au pilotage à distance.

### 2.2 Ce que fera Nexum : user stories

Nexum s'organise en **5 familles de fonctionnalités** (suivi du 19/10/2026) : **Jeu**, **Réunions** (réunions et concentration), **Travail** (espaces de travail), **Messages** (communications centralisées), **Multi-app.** (multi-appareils et maison connectée). Le **Socle** regroupe ce qui sert à toutes les familles. Rôles : **Utilisateur**, **Créateur** (publie ses modes) et **Modérateur** (membre de l'équipe qui valide les modes publiés).

Colonnes :

- **Terminé quand** : le critère mesurable qui dit que la fonctionnalité est livrée (colonne BTP de `docs/eip/beta_test_plan.md`). Pour les US 47 à 68, les critères sont des **cibles proposées**.
- **État au 06/11/2026** : **Fait** (marche dans l'app) · **En cours** (code commencé, pas fini ou pas déployé) · **À faire** · **Won't** (retiré du périmètre, raison indiquée).
- **Jalon** : J1 à J4 (voir 2.3) ; « Fait » = déjà livrée, à re-démontrer au BTP.
- **Taille** : S, M, L ou XL, **estimation relative de l'auteur du plan, non mesurée**, à revoir par l'équipe.
- **Capacités NX** : identifiants du catalogue interne (« Master Technical Feature Universe », 1 176 capacités) que l'US recouvre, relevés dans le catalogue ; le recouvrement est approximatif. « Hors catalogue » = aucune capacité du catalogue ne correspond ; l'US n'est pas comptée dans le décompte (pour une US partiellement couverte, seule la part qui correspond à une capacité est comptée).

Le plan n'ajoute pas de user stories pour la forme : les 22 nouvelles (US-47 à US-58, puis US-59 à US-68) soutiennent le scénario Travail ou la différenciation annoncée en 1.3 (contexte, restauration d'état, transparence, confiance). Aucune ne touche à OAuth, aux messageries ni à la marketplace publique, sauf US-47 (agenda).

#### Installer et configurer

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-01 | Socle | En tant qu'utilisateur, je veux installer Nexum sur Windows, macOS ou Linux, afin de l'utiliser sans outil technique | L'app s'installe et démarre sur une machine vierge : 3 systèmes × 3 machines, 0 échec | À faire (`release.yml` dans `unstable` : Windows et Ubuntu, non signé, sans macOS ; aucun test sur machine vierge consigné) | F1 | J1 (Windows), J4 (signé, 3 systèmes) | L | NX-292, NX-293, NX-294 |
| US-02 | Socle | En tant qu'utilisateur, je veux voir au premier lancement les intégrations disponibles sur ma machine, afin de savoir ce que Nexum peut piloter | 10 lancements, 100 % des intégrations disponibles détectées | En cours | F2 | J2 | M | NX-761, NX-1019, NX-1024, NX-1026, NX-1030 |
| US-03 | Multi-app. | En tant qu'utilisateur, je veux appairer mon pont Philips Hue depuis l'app, afin de piloter mes lampes sans éditer de fichier | 5 appairages réussis, moins d'1 min chacun | En cours | F3 | J2 | M | NX-181, NX-1023, NX-1024 |
| US-04 | Socle | En tant qu'utilisateur, je veux activer ou désactiver une intégration, afin de garder la main sur ce que Nexum touche | Une intégration désactivée n'exécute plus rien : 10 essais, 0 action | En cours | F4 | J2 | S | NX-775, NX-1017 |
| US-05 | Socle | En tant qu'utilisateur, je veux installer une extension depuis l'app, afin d'ajouter une intégration sans réinstaller Nexum | 5 installations utilisables tout de suite, 0 échec | Won't (extensions arbitraires : surface de sécurité trop large ; voir US-55 et US-58 pour le minimum) | F5 | Won't | L | NX-230, NX-231, NX-233, NX-246 (non comptées) |

#### Créer un mode

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-06 | Socle | En tant qu'utilisateur, je veux créer un mode dans un éditeur visuel (nom, catégorie, actions), afin de régler mon environnement sans écrire de code | 20 modes créés, tous retrouvés après redémarrage | En cours | F6 | J2 | M | NX-001, NX-002, NX-003 ; enregistrement local : hors catalogue |
| US-07 | Socle | En tant qu'utilisateur, je veux ajouter, réordonner ou désactiver les actions d'un mode et choisir quoi faire si l'une échoue, afin d'obtenir exactement le comportement voulu | 20 modes, ordre et réglages respectés à l'exécution, 0 écart | En cours | F7 | J2 | M | NX-015, NX-017, NX-021, NX-022 |
| US-08 | Socle | En tant qu'utilisateur, je veux décrire un mode en une phrase (« prépare-moi une soirée ranked »), afin d'obtenir un mode prêt à ajuster | 20 phrases, au moins 16 modes valides et jugés corrects | En cours | F8 | J4 | L | NX-277 |
| US-09 | Socle | En tant qu'utilisateur, je veux voir avant l'exécution les actions impossibles sur ma machine, afin de ne pas être surpris par un échec | 10 cas, 10 actions indisponibles signalées avant l'exécution | En cours (signalement dans l'éditeur fait ; reste la campagne de 10 cas) | F9 | J2 | S | NX-574, NX-761, NX-1026 |

#### Activer un mode

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-10 | Socle | En tant qu'utilisateur, je veux activer un mode en un clic, afin de passer d'une activité à l'autre instantanément | 50 activations, 0 échec dû à l'app, moins de 3 s pour 5 actions | Fait | F10 | Fait | S | NX-006, NX-017, NX-020, NX-042 |
| US-11 | Socle | En tant qu'utilisateur, je veux qu'un mode règle le volume, afin d'avoir le bon son pour chaque activité | 20 essais par système, volume exact | Fait | F11 | Fait | M | NX-097 |
| US-12 | Socle | En tant qu'utilisateur, je veux qu'un mode règle la luminosité de l'écran, afin de ménager mes yeux selon l'activité | 20 essais, écart de 5 % au plus | Fait | F12 | Fait | M | NX-103 |
| US-13 | Travail | En tant qu'utilisateur, je veux qu'un mode lance mes applications, afin de retrouver mon espace de travail prêt | 20 essais, 0 échec | Fait | F13 | Fait | S | NX-127 |
| US-14 | Jeu | En tant qu'utilisateur, je veux qu'un mode ferme les applications inutiles (Discord, navigateur), afin de libérer la machine | 20 essais, 0 échec | En cours (la fermeture n'est pas vérifiée : le résultat annonce un succès même si rien n'est fermé ; tests à écrire) | F14 | J1 | S | NX-126 |
| US-15 | Travail | En tant qu'utilisateur, je veux qu'un mode ouvre des pages web ou des liens d'application, afin d'avoir mes outils en ligne ouverts | 20 essais, ouverture dans l'app par défaut, 0 échec | Fait | F15 | Fait | S | hors catalogue |
| US-16 | Jeu | En tant qu'utilisateur, je veux qu'un mode lance un jeu Steam, afin de démarrer ma session en un geste | 10 essais, 0 échec | Fait | F16 | Fait | S | NX-132, NX-1038 |
| US-17 | Multi-app. | En tant qu'utilisateur, je veux qu'un mode applique une scène Philips Hue, afin d'adapter l'éclairage de la pièce | 20 essais sur un vrai pont, 0 échec, moins de 2 s | En cours | F17 | J2 | M | NX-162 |
| US-18 | Jeu | En tant qu'utilisateur, je veux qu'un mode lance ou mette en pause ma musique Spotify, afin d'avoir l'ambiance de l'activité | 20 essais, 0 échec (compte Spotify Premium) | À faire (Could : seulement si le temps le permet) | F18 | J3 (Could) | M | NX-184, NX-185, NX-189, NX-1066 |
| US-19 | Jeu | En tant que streamer, je veux qu'un mode change de scène OBS, afin de passer en direct sans manipulation | 20 essais, 0 échec, moins d'1 s | Won't (remplacé par les actions génériques HTTP, webhook et script local, US-53 et US-54, sans intégration dédiée) | F19 | Won't | M | NX-148 (non comptées) |
| US-20 | Jeu | En tant qu'utilisateur, je veux qu'un mode affiche mon activité sur Discord, afin que mes amis sachent ce que je fais | 10 activations, statut visible par les amis à chaque fois | Won't (remplacé par les actions génériques, US-53 et US-54, sans intégration dédiée) | F20 | Won't | M | NX-137, NX-138 (non comptées) |
| US-21 | Réunions | En tant qu'utilisateur, je veux ne recevoir que les notifications des apps du mode actif, afin de ne pas être dérangé | 10 sessions, 0 notification hors mode | Won't (le filtrage des notifications dépend du système d'exploitation ; faisabilité non établie) | F21 | Won't | L | NX-438, NX-440, NX-448 (non comptées) |
| US-22 | Socle | En tant qu'utilisateur, je veux lancer un mode à la voix, afin de changer de mode sans quitter mon activité | 50 commandes, au moins 45 correctes, moins de 2 s | En cours (option `voice` à inclure dans les installeurs ; précision non mesurée) | F22 | J2 | M | NX-051 |
| US-23 | Socle | En tant qu'utilisateur, je veux lancer un mode par un raccourci clavier, afin de changer de mode même quand l'app est en arrière-plan | 20 essais app en arrière-plan, 0 échec | En cours (un seul raccourci codé en dur, pour le mode Gaming ; réglage par mode à faire) | F23 | J1 | M | NX-049, NX-050 |
| US-24 | Socle | En tant qu'utilisateur, je veux suivre l'exécution action par action, afin de voir ce que Nexum a vraiment fait | 20 activations, 100 % des actions affichées avec leur résultat | Fait | F24 | Fait | S | NX-391, NX-625 |
| US-25 | Socle | En tant qu'utilisateur, je veux comprendre pourquoi une action a échoué, afin de corriger le problème moi-même | 10 testeurs, au moins 8 retrouvent la cause sans aide | En cours | F25 | J2 | M | NX-041, NX-043 |

#### Automatiser

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-26 | Socle | En tant qu'utilisateur, je veux programmer un mode à une heure et des jours choisis, afin que mon environnement change sans y penser | 10 programmations, déclenchement à moins d'1 min de l'heure | En cours (ordonnanceur réel ; règles codées en dur ; interface de création et enregistrement à faire) | F26 | J1 | M | NX-052, NX-053, NX-409, NX-410, NX-414, NX-421 |
| US-27 | Jeu | En tant qu'utilisateur, je veux qu'un mode se déclenche quand je lance un jeu, afin d'être prêt dès le lancement | 20 lancements, 0 oubli, moins de 3 s | À faire | F27 | J3 | M | NX-055, NX-057, NX-409, NX-410, NX-421 |
| US-28 | Réunions | En tant qu'utilisateur, je veux qu'un mode se déclenche au début d'une réunion de mon agenda Outlook ou Google, afin d'être prêt sans rien faire | 10 réunions, déclenchement à moins d'1 min | À faire | F28 | J3 | L | NX-086, NX-215, NX-409, NX-410 |
| US-29 | Multi-app. | En tant qu'utilisateur, je veux qu'un mode se déclenche quand j'arrive à un lieu (maison, bureau), d'après la position de mon téléphone, afin que mon poste soit prêt à mon arrivée | 10 arrivées, mode déclenché à chaque fois, position jamais envoyée hors de mon compte | Won't (application mobile, RGPD, gain faible) | (#18) | Won't | L | NX-900 (non comptées) |

#### Messages et agenda

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-30 | Messages | En tant qu'utilisateur, je veux connecter mon compte Gmail en lecture seule (OAuth), afin de voir mes e-mails dans Nexum | 5 connexions, messages récents affichés, 0 échec | À faire (J4, seulement si le temps le permet ; rien n'est promis sans prototype d'authentification) | F29 | J4 (si le temps) | L | NX-197, NX-224, NX-357, NX-359, NX-360 |
| US-31 | Messages | En tant qu'utilisateur, je veux connecter mon compte Outlook en lecture seule (OAuth), afin de voir mes e-mails et mon agenda | 5 connexions, 0 échec | À faire (J4, seulement si le temps le permet ; rien n'est promis sans prototype d'authentification) | F30 | J4 (si le temps) | L | NX-204, NX-224, NX-357, NX-359, NX-360 |
| US-32 | Messages | En tant qu'utilisateur, je veux connecter Microsoft Teams en lecture seule (OAuth), afin de voir mes messages de travail | 5 connexions, 0 échec | À faire (J4, seulement si le temps le permet ; rien n'est promis sans prototype d'authentification) | F31 | J4 (si le temps) | XL | NX-210, NX-224, NX-357, NX-359, NX-360 |
| US-33 | Messages | En tant qu'utilisateur, je veux lire tous mes messages dans un seul fil trié, afin de ne plus passer d'une app à l'autre | 3 comptes connectés, 0 message manquant sur 50 | À faire (J4, seulement si le temps le permet) | F32 | J4 (si le temps) | XL | NX-437, NX-445 |
| US-47 | Messages | En tant qu'utilisateur, je veux connecter mon agenda Microsoft (Outlook / Microsoft 365) en lecture seule, afin que Nexum connaisse mes réunions | 3 connexions réussies, les événements des 7 prochains jours affichés, 0 échec ; aucune écriture dans l'agenda | À faire (fournisseur retenu pour la planification : Microsoft, via Microsoft Graph, permission déléguée Calendars.Read, à confirmer ou corriger par les entretiens ; Google Agenda, second choix) | F43 (à créer dans le BTP) | J3 | L | NX-224, NX-357, NX-359, NX-360, NX-1150 |

#### Partager

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-34 | Socle | En tant qu'utilisateur, je veux exporter un mode dans un fichier `.nexum.json`, afin de l'envoyer à quelqu'un | 20 allers-retours export puis import, 0 différence | Fait | F33 | Fait | S | NX-972, NX-1000 |
| US-35 | Socle | En tant qu'utilisateur, je veux importer un mode reçu après une analyse de risque, afin de ne rien exécuter de dangereux | 10 fichiers piégés refusés, 10 fichiers sains importés | Fait | F34 | Fait | M | NX-1013 ; analyse de risque : hors catalogue |
| US-36 | Socle | En tant qu'utilisateur, je veux parcourir la marketplace, prévisualiser les actions d'un mode et l'installer, afin de profiter des modes de la communauté | 10 installations utilisables tout de suite, 0 échec | En cours (catalogue local ; score de risque réel ; pas d'API de catalogue côté serveur) | F35 | J3 | L | NX-250, NX-263 ; score de risque : hors catalogue |
| US-37 | Socle | En tant que créateur, je veux publier un de mes modes sur la marketplace, afin de le partager avec tous | 10 publications, 10 reçues dans la file de modération | À faire | F36 | J3 | L | NX-265, NX-270 ; score de risque : hors catalogue |
| US-38 | Socle | En tant que modérateur, je veux valider ou refuser un mode publié en voyant son score de risque, afin de garder la marketplace sûre | 10 décisions, 0 mode refusé visible | À faire | F37 | J3 | L | NX-270 ; score de risque : hors catalogue |

#### Compte, appareils et offre

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-39 | Socle | En tant qu'utilisateur, je veux créer un compte (e-mail et mot de passe) et me connecter, afin de retrouver mes données | 20 comptes créés sur le serveur en ligne, 0 échec | En cours (Postgres, mots de passe Argon2id et jetons de session dans `unstable` depuis le 06/11, pas dans `main` ; rien de déployé) | F38 | J1, J2 (critère) | L | NX-360, NX-366, NX-368 |
| US-40 | Multi-app. | En tant qu'utilisateur, je veux synchroniser mes modes entre mes ordinateurs, afin de ne pas les recréer sur chaque machine | 20 synchronisations, modes identiques, aucune modification perdue | En cours (synchronisation automatique et trousseau dans `unstable`, pas dans `main`) | F39 | J1 (premier test), J2 (critère) | L | NX-304, NX-879 |
| US-41 | Multi-app. | En tant qu'utilisateur, je veux activer un mode du PC depuis mon téléphone (iOS ou Android, connecté au même compte), afin de piloter mon poste à distance | 20 essais via le serveur en ligne et le compte authentifié, 0 échec, moins de 5 s (le PC sonde la file toutes les 2,5 s) ; aucune activation possible sans compte (file `/api/direct/*` supprimée, issue #136) | En cours (apps iOS et Android écrites ; renouvellement des jetons à ajouter ; file sans compte encore présente dans `unstable`, `direct.rs`) | F40 | J2 | M | NX-302, NX-316, NX-368, NX-450, NX-452, NX-460 |
| US-42 | Multi-app. | En tant qu'utilisateur, je veux lancer des modes sur mon téléphone lui-même (luminosité, lampe torche, vibration, notification, Spotify), et savoir clairement quand le système refuse une action (volume et sonnerie sur iPhone), afin d'adapter aussi mon téléphone | Sur un vrai iPhone et un vrai Android : luminosité, lampe, vibration, notification, liens et ouverture de Spotify s'appliquent ; sur iPhone, volume et sonnerie sont refusés avec leur raison ; sur Android, le compte rendu reflète le résultat réel de chaque action (jamais un faux succès) | En cours (iOS : fonctions complètes, essai sur appareil à consigner ; Android : compte rendu à corriger, luminosité limitée à la fenêtre de l'app) | (#34, #35, #36) | J3 | L | NX-295, NX-296 ; actions locales du téléphone : hors catalogue |
| US-43 | Socle | En tant qu'utilisateur, je veux envoyer un retour depuis l'app, journaux joints, afin de signaler un problème facilement | 10 envois, 10 reçus par l'équipe avec les journaux | En cours (fusionnée dans `main` ; inutilisable tant que le cloud n'est pas en ligne) | F41 | J1 | M | NX-623, NX-624, NX-955 |
| US-44 | Socle | En tant qu'utilisateur, je veux recevoir les mises à jour automatiquement, afin d'avoir toujours la dernière version | 3 mises à jour sans réinstallation, 0 échec | À faire | F42 | J4 | L | hors catalogue |
| US-45 | Socle | En tant qu'utilisateur, je veux voir clairement ce que comprend la version gratuite et ses limites, afin de savoir ce que j'obtiens sans payer | Les limites de l'offre gratuite sont affichées dans l'app ; le prix de l'offre payante est testé auprès d'au moins 10 personnes de la cible (cible Epitech) ; aucun paiement ni blocage de fonction n'est mis en place | À faire | (19/10) | J4 | M | hors catalogue |
| US-46 | Socle | En tant qu'utilisateur en situation de handicap, je veux utiliser Nexum au clavier et avec un lecteur d'écran, avec des contrastes suffisants, afin d'accéder à toutes les fonctions | Écrans principaux conformes WCAG 2.2 niveau AA (navigation clavier, contrastes, libellés) | À faire | (#64) | J4 (WCAG AA de base) | L | NX-979, NX-980, NX-981, NX-983, NX-984 |

#### Profondeur du moteur : fiabilité, explication, actions génériques, espaces de travail, extensions (ajoutées le 06/11/2026)

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-48 | Socle | En tant qu'utilisateur, je veux que Nexum restaure l'état d'avant (volume, luminosité) à la fin d'un mode, afin de retrouver mon poste comme je l'avais laissé | 20 essais sur volume et luminosité : valeur restaurée à l'identique (volume exact, luminosité à 5 % près), 0 oubli, y compris si le mode est interrompu | À faire | F44 (à créer dans le BTP) | J2 | L | NX-007, NX-037, NX-681 |
| US-49 | Socle | En tant qu'utilisateur, je veux fixer pour une action un nombre de nouvelles tentatives et un délai maximal, afin qu'une action lente ou capricieuse ne bloque pas tout le mode | 20 modes d'essai avec une action qui échoue ou dépasse le délai : tentatives et délai respectés, résultat réel affiché à chaque tentative | À faire (le moteur gère déjà « continuer » ou « arrêter » en cas d'échec, US-07) | F45 (à créer dans le BTP) | J2 | M | NX-019, NX-020, NX-493 |
| US-50 | Socle | En tant qu'utilisateur, je veux qu'un mode « tout ou rien » annule les actions déjà faites quand une action échoue, afin de ne pas rester dans un état à moitié appliqué | 10 modes d'essai avec un échec au milieu : les actions réversibles déjà faites sont annulées, le rapport indique ce qui a été annulé et ce qui ne pouvait pas l'être | À faire | F46 (à créer dans le BTP) | J3 | L | NX-022, NX-037, NX-498 |
| US-51 | Socle | En tant qu'utilisateur, je veux consulter l'historique des exécutions (mode, action, heure, résultat, durée), afin de savoir ce que Nexum a fait et quand | 20 activations : 100 % retrouvées dans l'historique après redémarrage de l'app, avec résultat et durée | À faire (le fil d'activité existe en mémoire, US-24, mais n'est pas conservé) | F47 (à créer dans le BTP) | J2 | M | NX-040, NX-041, NX-042, NX-607 |
| US-52 | Socle | En tant qu'utilisateur, je veux savoir pourquoi une action a tourné, a été ignorée ou a échoué, et simuler un mode sans rien modifier, afin de faire confiance à l'automatisation | 10 exécutions : la raison de chaque action (lancée, ignorée, échouée) est affichée ; 10 simulations : aucune modification du poste, liste des changements prévus affichée | À faire (seule la simulation d'horaire des règles existe ; la question de garder la simulation d'un mode est ouverte, #58) | F48 (à créer dans le BTP) | J3 | M | NX-038, NX-610, NX-611, NX-617 |
| US-53 | Socle | En tant qu'utilisateur, je veux qu'un mode appelle une adresse web (HTTP) ou démarre sur réception d'un webhook, afin de piloter un service sans intégration dédiée | 10 appels (GET et POST) avec en-têtes, résultat réel affiché ; 10 webhooks reçus : mode déclenché à chaque fois ; secrets non journalisés | À faire | F49 (à créer dans le BTP) | J3 | M | NX-084, NX-217, NX-218, NX-221, NX-222, NX-223, NX-225, NX-364 |
| US-54 | Socle | En tant qu'utilisateur, je veux qu'un mode lance un script local déjà présent sur mon poste, après permission explicite, afin d'automatiser ce que Nexum ne sait pas encore faire | 10 essais : permission demandée avant la première exécution, chaque exécution inscrite au journal (script, heure, résultat), refus sans permission ; aucun script écrit ou modifié par Nexum | À faire | F50 (à créer dans le BTP) | J3 | L | NX-121, NX-122, NX-228, NX-229, NX-363, NX-367 |
| US-55 | Socle | En tant qu'utilisateur, je veux qu'une action (par exemple « lancer un jeu ») fonctionne avec plusieurs fournisseurs et que Nexum utilise celui que j'ai, afin de ne pas dépendre d'une marque | Une capacité « lancer un jeu » résolue sur 3 fournisseurs (Steam, Epic, GOG) à partir d'un même mode ; ajout d'un fournisseur sans modifier le moteur | À faire (les adaptateurs Steam, Epic et GOG existent mais l'action est liée à chaque marque) | F51 (à créer dans le BTP) | J3 | L | NX-1015, NX-1016, NX-1017, NX-1019, NX-1021, NX-1030, NX-1032, NX-1037, NX-1038, NX-1039, NX-1040 |
| US-56 | Travail | En tant qu'utilisateur, je veux une palette de commandes accessible de partout (raccourci système), afin d'activer un mode ou de changer d'écran sans ouvrir l'app | 20 essais depuis une autre application au premier plan : palette ouverte par raccourci, mode activé sans ouvrir la fenêtre, 0 échec | En cours (palette interne à l'app, Ctrl K, existante ; raccourci système à faire) | F52 (à créer dans le BTP) | J2 | M | NX-050, NX-473, NX-474, NX-477 |
| US-57 | Travail | En tant qu'utilisateur, je veux capturer puis restaurer mon espace de travail (applications ouvertes, position des fenêtres), afin de retrouver tout mon contexte en un clic | 10 espaces capturés puis restaurés : applications relancées à 100 %, fenêtres replacées sur leur écran ; onglets du navigateur seulement si le temps le permet | À faire | F53 (à créer dans le BTP) | J3 | XL | NX-127, NX-523, NX-524, NX-525, NX-526, NX-528, NX-543, NX-544, NX-545, NX-552, NX-553, NX-554 |
| US-58 | Socle | En tant que créateur, je veux un format d'extension minimal et une politique de validation écrite, afin de savoir ce qui peut être publié et comment c'est vérifié | Format documenté (manifeste, permissions) ; politique écrite ; 10 extensions d'essai passées dans la politique, chacune acceptée ou refusée pour une raison écrite | À faire | F54 (à créer dans le BTP) | J2 (document), J3 (prototype) | L | NX-235, NX-236, NX-247, NX-270, NX-272, NX-362 |

#### Contexte, confiance et mesure (ajoutées le 06/11/2026, version 3b)

| ID | Famille | User story | Terminé quand | État | BTP | Jalon | Taille | Capacités NX |
|---|---|---|---|---|---|---|---|---|
| US-59 | Travail | En tant qu'utilisateur, je veux que Nexum sache quel mode est actif et que mes règles puissent en dépendre, afin que « fin de journée » ne se déclenche que si le mode Travail est actif | 10 essais : le mode actif est affiché ; une règle conditionnée à « mode Travail actif » se déclenche quand il l'est et jamais sinon ; l'état survit au redémarrage | À faire (la condition « mode actif » existe dans le schéma, mais l'app passe une liste vide à l'évaluateur de règles) | F55 (à créer dans le BTP) | J3 | M | NX-326, NX-392, NX-399, NX-403 |
| US-60 | Travail | En tant qu'utilisateur, je veux déclencher ou terminer un mode quand une application se ferme, quand je verrouille ma session ou quand je rejoins un Wi-Fi donné, afin que Nexum suive ma journée de travail | 10 essais par déclencheur (arrêt d'application, verrouillage, déverrouillage, Wi-Fi donné) : mode déclenché à chaque fois, moins de 5 s | À faire (Could : seulement si le temps le permet ; remplace la géolocalisation de US-29) | F56 (à créer dans le BTP) | J4 (si le temps) | M | NX-056, NX-069, NX-094, NX-095 |
| US-61 | Socle | En tant qu'utilisateur, je veux qu'un seul mode s'exécute à la fois et décider ce qui se passe si j'en lance un second, afin d'éviter deux modes qui se contredisent | 10 activations rapprochées de deux modes : un seul s'exécute à la fois, le second attend ou remplace selon la règle choisie, le résultat est affiché, 0 état incohérent | À faire (le moteur n'a ni file ni verrou : deux activations peuvent se chevaucher) | F57 (à créer dans le BTP) | J3 | L | NX-692, NX-694, NX-700, NX-705, NX-707 |
| US-62 | Socle | En tant qu'utilisateur, je veux voir en permanence quelles intégrations fonctionnent et pourquoi les autres ne fonctionnent pas, afin de ne pas découvrir une panne en plein mode | 5 intégrations (audio, écran, Hue, jeux, cloud) : chacune affiche un état et une raison, rafraîchis automatiquement ; 10 pannes provoquées, 10 signalées | En cours (diagnostic à la demande dans Réglages, `ConnectionStatus.tsx` ; pas de rafraîchissement automatique) | F58 (à créer dans le BTP) | J3 | S | NX-388, NX-431, NX-1024 |
| US-63 | Socle | En tant qu'utilisateur, je veux exporter toutes mes données et supprimer mon compte et mes données en ligne, afin de garder la main sur mes données personnelles | 5 essais : export complet (modes, réglages) en un fichier ; suppression du compte et des données en ligne en un geste, confirmée par le serveur ; rien ne reste côté serveur | À faire (l'export existe mode par mode, US-34) | F59 (à créer dans le BTP) | J3 | M | NX-787, NX-788 |
| US-64 | Socle | En tant qu'utilisateur, je veux n'envoyer de mesures d'usage qu'après un consentement explicite et pouvoir le retirer, afin que la mesure demandée aux testeurs respecte ma vie privée | Aucune requête d'usage avant consentement (vérifié sur 5 installations propres) ; consentement révocable ; liste des événements envoyés visible dans l'app ; cible : 10 testeurs consentants | À faire (aucune mesure d'usage dans l'app aujourd'hui) | F60 (à créer dans le BTP) | J3 | M | NX-644, NX-778 |
| US-65 | Socle | En tant qu'utilisateur, je veux voir pour chaque mode le nombre d'activations, le taux de réussite des actions et la durée moyenne, afin de savoir quels modes sont fiables | 20 activations : nombre, taux de réussite et durée moyenne exacts pour chaque mode, calculés depuis l'historique (US-51) | À faire (Could : seulement si le temps le permet ; dépend de US-51) | F61 (à créer dans le BTP) | J4 (si le temps) | M | NX-343, NX-344, NX-346, NX-347 |
| US-66 | Socle | En tant que développeur de Nexum, je veux rejouer un mode sur des intégrations et une horloge simulées et vérifier le résultat, afin de ne pas casser un scénario validé | 10 modes de référence rejoués en CI sur un environnement simulé : actions attendues exécutées, état attendu atteint, 0 écart | En cours (adaptateurs factices dans `engine_test.rs`, 8 tests ; pas d'horloge simulée ni de modes de référence) | F62 (à créer dans le BTP) | J4 (si le temps) | M | NX-714, NX-715, NX-716, NX-717, NX-718 |
| US-67 | Socle | En tant qu'utilisateur, je veux que Nexum reprenne proprement après un arrêt brutal au milieu d'un mode, afin de ne pas rester avec un poste à moitié modifié | 10 arrêts brutaux en cours de mode : au redémarrage, l'état d'avant est restauré ou l'utilisateur voit la liste des actions déjà faites, 0 état perdu | À faire (Could : seulement si le temps le permet ; dépend de US-48) | F63 (à créer dans le BTP) | J4 (si le temps) | L | NX-727, NX-728 |
| US-68 | Socle | En tant qu'utilisateur, je veux confirmer avant qu'un mode ferme une application ou lance un script, afin de ne pas perdre un travail non enregistré | 10 essais : la confirmation apparaît avant la fermeture d'une application ou le lancement d'un script non encore autorisés ; un refus ne ferme ni ne lance rien | À faire (Could : seulement si le temps le permet) | F64 (à créer dans le BTP) | J3 (Could) | S | NX-499 |

**Périmètre des messages.** Un seul fournisseur d'agenda, en lecture seule, d'abord (US-47), parce que le déclencheur « début de réunion » (US-28) en dépend. **Fournisseur retenu pour la planification : Microsoft (Outlook / Microsoft 365, via Microsoft Graph, permission déléguée Calendars.Read), à confirmer ou corriger par les entretiens.** Raisons : Teams est cité par 10 répondants sur 13 et Outlook par 6 dans le questionnaire ; une même inscription d'application servira plus tard à Teams ; Gmail est classé « restricted » par Google (voir ci-dessous), donc c'est la voie la plus lourde. Google Agenda reste le second choix. Les e-mails, Teams et le fil unifié (US-30 à US-33) sont en J4, **seulement si le temps le permet**, et rien n'est promis sans prototype d'authentification.

**Contraintes des API Google et Microsoft : faits vérifiés le 06/11/2026, et ce qui ne l'est pas.**

- Google, **vérifié** : `gmail.readonly`, `gmail.metadata` et `gmail.modify` sont des portées « restricted » (https://developers.google.com/workspace/gmail/api/auth/scopes). Elles exigent la « restricted scope OAuth App Verification » et, si l'application stocke ces données sur des serveurs ou les transmet, une évaluation de sécurité (security assessment).
- Google, **vérifié** : les portées « sensitive » demandent une vérification avant publication (https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification) : vérification de la marque (domaine vérifié dans Search Console, page d'accueil publique, politique de confidentialité sur le même domaine) et de l'accès aux données (justification de chaque portée, vidéo YouTube non répertoriée montrant le flux de consentement) ; délai jusqu'à 10 jours ; la page ne mentionne pas d'évaluation de sécurité par un tiers pour ces portées. En mode « Testing », seuls des testeurs ajoutés à la main peuvent autoriser l'application, avec un plafond d'utilisateurs (chiffre non indiqué sur la page) et des jetons de rafraîchissement limités.
- Google, **non confirmé** : la classification exacte de `calendar.readonly` (la documentation de Google Calendar ne la donne pas). À vérifier dans la console Google Cloud (écran de consentement OAuth) avant toute promesse.
- Microsoft, **vérifié** (miroir des métadonnées Microsoft Graph, https://graphpermissions.merill.net) : les permissions déléguées `Calendars.Read` et `Chat.Read` ont `AdminConsentRequired` = « No » par défaut.
- Microsoft, **non confirmé** : la prise en charge des comptes Microsoft personnels pour ces permissions ; l'exigence d'un consentement administrateur pour `ChannelMessage.Read.All` ; la possibilité pour l'administrateur d'un locataire (école, entreprise) de restreindre le consentement utilisateur. À vérifier dans la documentation Microsoft Graph.

**Périmètre de la marketplace.** Brique stratégique mais potentiellement prématurée (séance 3). Version simple, en J3 : catalogue, installation avec score de risque, publication avec modération manuelle par l'équipe (US-36 à US-38), format d'extension minimal documenté et politique de validation écrite (US-58). Le prototype est séparé de la marketplace publique : pas de notes, d'avis ni de commissions avant J3, et **aucun modèle de rémunération tant que le cœur n'est pas stable** [À TRANCHER (6) : confirmation du mentor le 09/11 que le modèle économique de la marketplace est reporté ; recommandation : le reporter après J3].

**Bilan au 06/11/2026** : 68 user stories (46 d'origine et 22 ajoutées le 06/11), dont **9 faites, 22 en cours, 32 à faire et 5 Won't** (recompté par script sur les tableaux ci-dessus). Depuis le plan du 04/11 : US-09, US-14, US-22 et US-23 sont « En cours » après vérification du code ; US-05, US-19, US-20, US-21 et US-29 sont retirées du périmètre ; US-45 est reformulée sans paiement ni facturation. Côté dépôt : le retour depuis l'app (US-43) est fusionné dans `main` (PR #133) mais inutilisable tant que le cloud n'est pas en ligne ; le serveur cloud avec PostgreSQL et la synchronisation automatique (PR #134) et le workflow d'installateur sont fusionnés dans `unstable` le 06/11, **pas dans `main`**, dont la CI est en échec (3 jobs). La file sans compte `/api/direct/*` est toujours présente dans `unstable` (`direct.rs`) ; sa suppression est une action à faire (issue #136). La priorisation MoSCoW du backlog est en cours dans #107 (non terminée).

**Du catalogue au plan.** Le catalogue compte 1 176 capacités. Après réaudit (`mapping-us-nx.md`), les 53 US d'origine engagées en recouvrent **140** (la v3 en comptait 121 : 31 ajoutées, 12 retirées), et avec les nouvelles US 59 à 68 (63 US engagées au total) **171** : 120 « BTP candidate », 42 « Stretch », 9 « Roadmap ». Sur ces 171, 25 ne sont portées que par des US « si le temps le permet » ou « Could » ; 146 le sont par des US fermes. 338 des 458 « BTP candidate » n'ont aucune US : liste dans `annexe-capacites-sans-us.md`, reclassement proposé (non appliqué : 327 en Stretch, dont 10 à réexaminer si les entretiens font ressortir ce besoin, et 11 en Roadmap, aucune laissée à arbitrer) dans `reclassement-catalogue-propose.md`. Le recouvrement est une estimation de l'auteur du plan, à relire par Raphaël ou Max ; le périmètre final se fixe au gel de J3.

### 2.3 Jalons

Quatre jalons, chacun avec ses objectifs, les user stories qui s'y rattachent et sa vérification. **Le pack de preuves remis au mentor le 07/11/2026 est la source des preuves** de ce plan (comparatif testé, matrice, registre des entretiens et des testeurs, état d'Android, coûts) ; ce plan ne les recopie pas.

| Jalon | Date | Objectifs (à atteindre pour valider le jalon) | US rattachées | Comment on le vérifie |
|---|---|---|---|---|
| **J1 — Bêta fermée sur une famille et une plateforme** | **début décembre 2026** (date exacte à fixer ; l'issue #119 vise vers le 04/12) | Livrer **une famille complète et stable sur PC Windows** : **Travail, version « concentration »** (horaire avec interface de création, raccourci par mode, lancement et fermeture d'applications, liens, volume, luminosité, installateur Windows), **sans coupure des notifications**. **Choix de l'équipe (06/11/2026) : Travail, version concentration, sur PC Windows. Présenté au mentor en séance 4 (09/11/2026) pour validation sur la matrice de priorisation.** Plateforme : où le code est le plus avancé (volume via COM, installateur Windows dans `release.yml`, présent dans `unstable`) et choix de l'équipe. Plan B : famille Réunions réduite. Mettre l'API cloud en ligne, recruter les premiers testeurs, lancer le cycle d'itération n° 1. Prérequis (issue #136) : PR #134 de `unstable` vers `main`, file sans compte supprimée, CI de `main` verte, adresse de production par défaut dans l'app. Mobile hors J1. | US-01 (version Windows non signée), US-14, US-23, US-26, US-39, US-40, US-43 ; déjà livrées utiles : US-10, US-11, US-12, US-13, US-15, US-24 | Des testeurs installent l'app sous Windows et utilisent la famille sans aide ; leurs retours arrivent par l'app (US-43) |
| **J2 — MVP + Beta Test Plan v1** | **07/02/2027** (BTP v1) | Éditeur sans code, intégrations activables et premier lancement, actions indisponibles signalées, Philips Hue sur un vrai pont, voix, compte et synchronisation au niveau du critère, télécommande du PC depuis le téléphone, restauration d'état, fiabilité de base, historique, palette globale, format d'extension et politique de validation (document) ; clore le cycle n° 1 ; rendre le BTP v1 | US-02, US-03, US-04, US-06, US-07, US-09, US-17, US-22, US-25, US-41, US-48, US-49, US-51, US-56, US-58 (document) ; critères de US-39 et US-40 | Ces user stories remplissent leur critère « Terminé quand » |
| **J3 — Gel du périmètre et Greenlight blanc** | **04/04/2027** (BTP version finale ; gel du périmètre) | Geler la liste des user stories engagées ; livrer l'automatisation contextuelle, l'agenda, la marketplace simple avec modération manuelle, les actions génériques, les espaces de travail, l'explication des exécutions, le mobile local, le mode actif, un seul mode à la fois, la santé des intégrations, l'export et la suppression des données, la mesure d'usage avec consentement ; mener le cycle n° 2 ; décider de continuer ou pivoter | US-18 (Could), US-27, US-28, US-36, US-37, US-38, US-42, US-47, US-50, US-52, US-53, US-54, US-55, US-57, US-58 (prototype), US-59, US-61, US-62, US-63, US-64, US-68 (Could) | Démonstration en direct devant le jury blanc ; retours intégrés au plan jusqu'en juillet |
| **J4 — Greenlight + RNCP** | **05/07/2027** (début de la fenêtre 05 → 16/07) | Installeurs signés pour les trois systèmes et mises à jour, génération de mode par IA, limites de l'offre gratuite affichées, accessibilité de base (WCAG AA), messages centralisés seulement si le temps le permet ; concentrer le travail sur les tests, la sécurité, la performance et la documentation ; démontrer toutes les fonctionnalités du BTP sur l'app installée | US-01 (signée, 3 systèmes), US-08, US-44, US-45, US-46 ; si le temps le permet : US-30, US-31, US-32, US-33, US-60, US-65, US-66, US-67 | Démo en direct sans vidéo ; tableau des critères de réussite du BTP rempli |

**Charge par jalon (estimation de l'auteur du plan, hors US Fait et Won't).** Une US est comptée dans le premier jalon qui la concerne ; poids S = 1, M = 2, L = 4, XL = 8 (convention de l'auteur, non mesurée). La charge « ferme » exclut les US « si le temps le permet » ou « Could ».

| Jalon | US | dont conditionnelles | Répartition des tailles | Charge totale | Charge ferme |
|---|---|---|---|---|---|
| J1 | 7 | 0 | 1 S, 3 M, 3 L | 19 | 19 |
| J2 | 15 | 0 | 2 S, 11 M, 2 L | 32 | 32 |
| J3 | 20 | 2 | 2 S, 7 M, 10 L, 1 XL | 64 | 61 |
| J4 | 12 | 8 | 4 M, 6 L, 2 XL | 48 | 14 |

Lecture : J1 (7 US, charge ferme 19) et J2 (15 US, 32) sont courts en durée (quatre semaines pour J1, deux mois pour J2) mais portent le chemin critique (installateur, cloud, retours). J3 (20 US, charge ferme 61) est le jalon le plus chargé et c'est lui qui gèle le périmètre : **il paraît surchargé**. J4 (12 US) est surtout conditionnel.

**Propositions de déplacement, sans décision** (à arbitrer par l'équipe). De J3 vers J4 « si le temps le permet » : US-55 (abstraction par fournisseur, L), US-57 (espaces de travail, XL) et US-52 (explication et simulation, M), qui ne sont pas nécessaires au scénario Travail « concentration » de J1 ; cela ramènerait la charge ferme de J3 d'environ 61 à 47 et porterait celle de J4 à 28. De J2 vers J4 « si le temps le permet » : US-56 (palette globale, M, confort). US-03 et US-17 (Hue sur un vrai pont) : à conditionner à la disponibilité d'un pont (R14). US-59 (mode actif) reste en J3, car les conditions de US-26 et US-27 en dépendent.

**Déjà livrées, à re-démontrer au BTP :** US-10, US-11, US-12, US-13, US-15, US-16, US-24, US-34, US-35.

**Retirées du périmètre (Won't).** US-05 (extensions arbitraires), US-19 (OBS), US-20 (Discord), US-21 (filtrage des notifications, dépend de l'OS), US-29 (géolocalisation : application mobile, RGPD, gain faible). Les cas d'usage visés par US-19 et US-20 sont couverts, sans intégration dédiée, par les actions génériques HTTP, webhook et script local (US-53, US-54). Le BTP (`beta_test_plan.md`) doit être mis à jour en conséquence (F5, F19, F20, F21 ; l'US-29 n'a pas de ligne F).

**Dates, vérifiées dans les documents disponibles.** J2 = 07/02/2027 (document mentor : « 7 février 2027 » ; `PLAN_EXECUTION_EQUIPE.md` : BTP v1). J3 = 04/04/2027 est la date de la **version finale du BTP** (`PLAN_EXECUTION_EQUIPE.md`) et correspond au « gel du périmètre final » d'avril 2027 du document mentor ; **le Greenlight blanc lui-même est du 05 au 16/04/2027** selon `PLAN_EXECUTION_EQUIPE.md`, alors que `docs/eip/README.md` donne 04/04 : à confirmer sur l'intra. J4 = 05/07/2027, début de la fenêtre 05 → 16/07 (`PLAN_EXECUTION_EQUIPE.md`). `ROADMAP_PRODUIT.md` (13/07/2026) donne d'autres dates (BTP le 15/01, Greenlight blanc le 10/04) : obsolète. **Non vérifiable** : les dates de « mock Greenlight » et des phases de test de fin novembre et de début janvier ne figurent dans aucun des documents lus (fiche G-EIP-600, compte rendu de la séance 3, document mentor, `PLAN_EXECUTION_EQUIPE.md`) ; il faudrait le calendrier officiel de l'intra.

**Tickets GitHub à aligner sur ce plan (action à faire, non faite).** #21 (installeurs), #50 (mises à jour), #69 (raccourcis par mode), #95 à #97 et #6 (messages) sont aujourd'hui dans le jalon GitHub Phase 1 (07/02/2027) ; ils doivent suivre les jalons ci-dessus, et non l'inverse. #107 (MoSCoW) reste à terminer.

### 2.4 Risques et plans B

| # | Risque | Signal d'alerte | Plan B |
|---|---|---|---|
| R1 | Le cloud n'est pas en ligne pour J1 (budget et hébergeur non tranchés, #121 ; PR #134 dans `unstable` seulement) | Pas de serveur le 25/11 (proposé) | Bêta locale sans synchronisation ; retours par un lien vers un formulaire ; serveur payé par l'équipe en dernier recours |
| R2 | Pas d'installateur pour les testeurs (US-01) | Rien de testé sur machine vierge le 25/11 (proposé) | Bêta Windows seule, fichier construit par la CI (lancement manuel) |
| R3 | Choix de l'équipe (Travail, PC Windows) non validé par le mentor | Le mentor écarte Travail ou Windows en séance 4 (09/11) | Le choix du 06/11 est présenté en séance 4 pour validation sur la matrice ; en attendant, Travail sur Windows reste l'hypothèse de travail ; si Travail est écartée, plan B : famille Réunions réduite |
| R4 | Trop peu de testeurs et aucune mesure d'usage (13 réponses, 0 entretien documenté, aucune inscription réelle au 04/11 ; 6 répondants sur 13 veulent tester ; pas de télémétrie dans l'app) | Moins de 8 inscrits au 25/11 (proposé) | Cohorte restreinte de 8 à 10 (proposé) pour J1, extension vers le référentiel de 25 utilisateurs B2C ; mesure d'usage par le registre des testeurs et des retours volontaires, avec un plan d'instrumentation à écrire (US-64) |
| R5 | Entretiens en retard (5 au 15/11, 12 au 25/11, proposé) | Compteur sous la cible | Répartir entre plusieurs membres ; entretiens écrits acceptés |
| R6 | Agenda et messages : vérifications et consentements chez Google et Microsoft | Aucun prototype d'authentification au 15/12 (proposé) | Reporter ; ne rien promettre en J3 ou J4 sans preuve. Gmail : portée restreinte, vérification de l'application et évaluation de sécurité si les données sont stockées ou transmises côté serveur (vérifié le 06/11/2026). Microsoft : `Calendars.Read` sans consentement administrateur par défaut (vérifié le 06/11/2026) ; consentement administrateur possible côté entreprise ou école, à confirmer |
| R7 | Dépendance à des API système fragiles (luminosité macOS via un framework privé, fermeture d'applications par nom de processus) | Résultats instables dans les essais de J1 | Limiter la bêta à Windows ; corriger US-14 ; consigner les limites par système |
| R8 | Mobile : jetons de 15 minutes sans renouvellement dans les deux apps ; compte rendu Android toujours « succès » ; file sans compte | Télécommande en échec après 15 minutes | Mobile hors J1 ; corriger avant J2 ; garder la PWA en secours |
| R9 | CI rouge sur `main` (3 jobs en échec au 06/11) | Moins de 100 % de jobs verts | **Aucune fusion dans `main` tant que la CI de `main` est rouge** |
| R10 | Retard global sur J2 à J4 | Moins de 70 % des priorités faites à mi-parcours (proposé) | Ordre de sacrifice ci-dessous |
| R11 | Surpromesse : 1 176 capacités au catalogue, formule « plus smart » (mentor) | Un engagement du plan sans preuve ou sans US | Le catalogue reste un espace de décision ; périmètre gelé à J3 ; aucune US ajoutée pour la forme ; différenciation présentée comme hypothèse tant que ≥ 3 alternatives ne sont pas testées |
| R12 | Sécurité et confiance : Nexum modifie l'environnement local, lance des scripts, accepte des extensions, expose une file sans compte | Une action sans permission, sans journal ou sans possibilité d'annulation | Permissions explicites et journal pour les scripts (US-54), annulation et restauration (US-48, US-50), suppression de la file sans compte, politique de validation des extensions (US-58) |
| R13 | Hébergement et données non documentés (fournisseur, localisation, sous-traitants, coûts, IA) | Des comptes de testeurs créés avant la cartographie des données | Cartographier les données avant la bêta ; l'équipe indique ne pas prévoir de données sensibles à ce stade ; ne pas affirmer « données en Europe » tant que ce n'est pas documenté |
| R14 | Philips Hue : aucun pont ni kit disponible pour J2 (#98 bloqué par #121) ; US-03 et US-17 demandent un vrai pont | Pas de pont de test au 15/12 (proposé) | Hors bêta J1 (Travail). Présenter Hue sur un pont emprunté ou déclasser US-03 et US-17 en « si le temps le permet » ; ne pas promettre « 20 essais sur un vrai pont » sans matériel |
| R15 | Dépendance à une personne : Raphaël cumule moteur, installateur, mises à jour et cloud | Plus d'une de ces tâches en retard en même temps (proposé) | Cloud (US-39, US-40, US-43) : Raphaël (décidé le 06/11/2026). Reste de la répartition, proposé, à valider : installateur Windows (US-01, #21) à Max ; mises à jour (US-44, #50) à Rares ; les US moteur 48 à 52 réparties entre Max et Rares ; un second membre relit chaque fusion de `main` |

**Ordre de sacrifice en cas de retard.** 1. Les Won't actuels (US-05, 19, 20, 21, 29), déjà retirés ; 2. les messages (US-30 à US-33, puis US-47 et US-28 si l'agenda tarde) ; 3. Spotify (US-18) ; 4. la modération côté serveur (US-37, US-38). À protéger : US-01, 06, 07, 10, 24, 25, 26, 39, 40, 43, 44.

**Responsable du déploiement du cloud : Raphaël (décision de l'équipe du 06/11/2026).** Le ticket #48 est aujourd'hui assigné à Enzo, l'issue #136 à Max, Arnaud et Raphaël, et la matrice de compétences parle d'un binôme avec Max : les tickets restent à réaligner sur cette décision (action à faire).

---

## 3. Spécifications non techniques

Partie 3 du plan d'action : une note d'intention par thème de la track Entrepreneuriat, soit les deux thèmes obligatoires (validation du marché, outils entrepreneuriaux) et les deux thèmes optionnels retenus (stratégie et vision, image et message). Le mentor accompagne cette partie dans la durée : elle reste volontairement courte. Sources : fiche G-EIP-600, `docs/eip/OBJECTIFS.md`, issue #26, compte rendu de la séance 3 (19/10/2026).

Chaque note donne l'intention, ce qui existe déjà, ce que l'équipe va faire, les livrables et le critère « Terminé quand ». Les dates marquées « proposé » sont des propositions de l'auteur du plan.

| Thème | Type | Responsable | Livrables clés | Échéance principale |
|---|---|---|---|---|
| 3.1 Validation du marché | Obligatoire | Enzo | Matrice de priorisation, 35 réponses B2C, 20 entretiens documentés, 3 alternatives testées, registre des testeurs | Pack du 07/11 ; décision de famille le 09/11 ; J1 ; J2 ; décision stratégique à J3 |
| 3.2 Outils entrepreneuriaux | Obligatoire | Enzo | Lean Canvas V1 daté, structure de coûts, comparaison des modèles de facturation, projection à 12 mois, test de prix auprès de 10 personnes | Premières versions au pack du 07/11 ; mises à jour à J2 |
| 3.3 Stratégie et vision | Optionnel | Arnaud, avec toute l'équipe | Manifeste, arbitrages, stratégie à 6–18 mois, segments prioritaires | J2 ; revue à J3 |
| 3.4 Image et message | Optionnel | Arnaud, Rares | Note sur les deux canaux, ligne éditoriale, calendrier sur 3 mois, page de conversion, registre des publications, tests du message | V0 de la page au 07/11 ; premier test avant J1 ; bilan à J3 |

### 3.1 Validation du marché (obligatoire)

**Intention.** Vérifier, auprès d'utilisateurs B2C réels, que le problème décrit en 1.2 existe, qu'il est assez douloureux pour qu'on change d'outil, et que Nexum y répond. Chaque choix important, en premier lieu la famille livrée en bêta, doit se justifier par des données individuelles et datées, pas par les préférences de l'équipe. Cette section couvre aussi les attendus du mentor pour l'objectif « Obtenir les premiers utilisateurs et mesurer leur usage » (voir 1.5).

**Ce qui existe déjà.**

- Un guide d'entretien et un formulaire (`QUESTIONNAIRE_INTERVIEWS.md`, `GOOGLE_FORM.md`), les questionnaires FR et EN générés par script (`docs/eip/questionnaire/`), un gabarit de synthèse (`INTERVIEW_SYNTHESIS_TEMPLATE.md`) et une étude de marché rédigée le 13/07/2026 (`ETUDE_DE_MARCHE.md`, chiffres à renseigner).
- Un MVP testable : l'app desktop active de vrais modes (code présent pour Windows, macOS et Linux ; essais réels à consigner).
- Un site en ligne (français et anglais) avec formulaire d'inscription à la bêta, qui propose un entretien de 20 minutes et écrit dans un tableau partagé de l'équipe depuis le 20/10/2026. Au 04/11/2026, aucune inscription réelle n'y était arrivée (information de l'équipe, non vérifiable dans le dépôt).

**Où l'on en est par rapport au référentiel Epitech** (seuils cités par le mentor à la séance 3).

| Seuil | Cible | État au 06/11/2026 |
|---|---|---|
| Réponses B2C exploitables | au moins 35 | 13 réponses reçues (31/10 → 02/11) ; part exploitable B2C à qualifier |
| Entretiens individuels documentés | 20 | **0** documenté dans le dépôt |
| Utilisateurs B2C | 25 | aucun inscrit à la bêta |
| Utilisateurs ayant répété l'usage | 10 | 0 (pas de bêta) |
| Confrontations de prix | 10 | 0 structurée (une personne a donné un prix dans le questionnaire) |

**Premiers résultats du questionnaire** (13 réponses, 11 en français et 2 en anglais ; 10 personnes sur 13 ont de 18 à 24 ans, la plupart étudient, 12 ont un iPhone). Ce n'est pas l'étude demandée par la track : l'échantillon est petit et peu varié.

| Question | Résultat |
|---|---|
| Douleurs les plus fortes (4 ou 5 sur 5) | Jongler entre plusieurs messageries : 8 sur 13 ; notifications en réunion ou en concentration : 6 ; rouvrir chaque jour les mêmes applications : 5 |
| Préparer son PC avant de jouer | Note de 1 sur 5 pour 12 personnes sur 13, y compris les 3 joueurs. Modes préférés : Travail 11, Concentration 8, Réunion 6, Jeu 3 |
| Intégrations voulues en premier | Teams 10, Gmail 8, Discord 7, Outlook 6, Zoom ou Google Meet 5 |
| Lancement d'un mode et freins | Clic en premier choix pour 10 personnes sur 12 ; voix citée par 3, jamais en premier. Freins : données personnelles 13 sur 13, fiabilité 8, accès aux mails et messageries 5 |
| Payer | 7 sur 13 resteraient en gratuit ; achat unique 6 contre abonnement 2 ; fonctions payantes citées : application mobile et déclencheurs automatiques (3 chacune) ; un seul prix donné : « bonne affaire » à 25 €, « trop cher » à 60 € |

Autres résultats : modes gardés uniquement sur l'ordinateur 9 sur 13 ; 9 sur 13 installeraient des modes créés par d'autres s'ils sont vérifiés (notes et avis 8, vérification par l'équipe 7) ; utilité perçue 2,6 sur 5 ; 6 sur 13 veulent tester la bêta, 2 sur 13 acceptent un entretien ; réseaux suivis : Instagram 10, YouTube 6, TikTok 5, LinkedIn 4. Ces résultats ne figurent nulle part ailleurs dans le dépôt : à joindre au pack du 07/11 avec l'export horodaté des réponses.

**Choix de la famille et de la plateforme.** Les cinq familles se comparent sur une **matrice de priorisation** aux critères du mentor : fréquence et intensité du problème, solutions actuelles, temps perdu, intérêt, disposition à payer, faisabilité. Le mentor demande une proposition le 07/11 et une validation en séance 4, le 09/11/2026 à 19 h 30. La décision s'appuie sur le questionnaire et les premiers entretiens ; **les entretiens suivants valident ou corrigent ce choix** au lieu de le précéder. Les familles écartées sont justifiées par écrit.

La matrice chiffrée est un livrable du pack du 07/11 ; elle n'est pas reproduite ici. **Choix de l'équipe (06/11/2026) : Travail, version concentration, sur PC Windows. Présenté au mentor en séance 4 (09/11/2026) pour validation sur la matrice de priorisation.** Plateforme : où le code est le plus avancé (volume via COM, installateur Windows dans `release.yml`, présent dans `unstable`) et choix de l'équipe. Plan B : Réunions réduite. Travail est la famille la plus citée (mode Travail : 11 sur 13), la plus proche de ce qui existe déjà et la famille estimée tenable en quatre semaines. Raisons proposées pour écarter les autres en J1 : Jeu, parce que préparer son PC avant de jouer n'est pas la douleur d'entrée (note de 1 sur 5 pour 12 personnes sur 13) ; Messages, parce que rien n'existe côté code, que la portée Gmail est « restricted » chez Google (vérifié le 06/11/2026, voir 2.2) et que le consentement côté Microsoft reste à confirmer ; Multi-app., parce que Philips Hue n'a pas été essayé sur un vrai pont et que le mobile est hors J1 ; Réunions, parce qu'elle dépend d'un agenda connecté, et du filtrage des notifications, retiré du périmètre.

**Ce que nous allons faire.**

- **Fiche de cibles exploratoires** avec critères d'inclusion et d'exclusion, et **étude de marché structurée** (besoins, douleurs, comportements actuels), à la place de chiffres de cadrage non sourcés.
- **20 entretiens individuels documentés**, d'environ 20 minutes, centrés sur les pratiques passées (notes datées : profil, pratique actuelle, fréquence et intensité du problème, temps ou argent perdu, solution utilisée, confiance, disposition à tester et à payer), auprès de personnes de la cible hors de l'équipe et hors de la promotion Epitech autant que possible. Points d'étape proposés :

| Date | Entretiens documentés | Réponses B2C exploitables | Ce qui en sort |
|---|---|---|---|
| 07/11 (pack) | notes disponibles à indiquer | export horodaté des réponses | Entrée de la matrice |
| 09/11 (séance 4) | — | — | Décision de famille et de plateforme |
| 15/11 (proposé) | 5 | — | Guide d'entretien corrigé si besoin |
| 25/11 (proposé) | 12 | — | Synthèse intermédiaire par cible |
| J1, début décembre (proposé) | 15 | 35 | Synthèse consolidée ; le choix de famille est confirmé ou corrigé |
| J2, 07/02/2027 (proposé) | 20 | — | Cycle n° 1 clos |

- **Test réel d'au moins trois alternatives** (IFTTT, Zapier, n8n, Make, Power Automate, solutions natives) : comptes utilisés, scénarios essayés, captures, résultats et limites, pour valider ou corriger l'hypothèse de 1.3.
- **Bêta définie avant de poursuivre un développement dispersé** : famille, plateforme, scénario principal, exclusions, conditions d'accès, canal de support (retours dans l'app, US-43), événements à mesurer, critères de succès. Aucune mesure d'usage n'existe dans l'app aujourd'hui (pas de télémétrie, par choix « local d'abord ») : un plan d'instrumentation, avec consentement (US-64), est un livrable, ainsi qu'un registre des anomalies.
- **Registre unique des testeurs** : source du contact, profil, famille d'intérêt, entretien, inscription, disponibilité. Objectif : 25 utilisateurs B2C, dont 10 qui reviennent.
- **Parcours suivi individuellement** : acquisition, inscription, activation, premier usage, retour, réutilisation. Pour les 10 utilisateurs qui répètent l'usage : fréquence, durée, abandon et raisons.
- **Test de deux canaux d'acquisition** (Instagram et LinkedIn, voir 3.4) et comparaison de leur efficacité.
- **Deux itérations complètes** : cycle n° 1 de J1 à J2, cycle n° 2 jusqu'à J3, chacune consignée dans un journal (v1, v2…) : ce qui a été entendu, ce qui a changé et pourquoi.
- **Décision stratégique** à J3 : continuer, pivoter ou redéfinir le MVP, justifiée par les résultats.

**Livrables.** Matrice de priorisation et décision · fiche de cibles · synthèse de l'étude de marché · guide d'entretien · registre des entretiens et des testeurs · comparatif testé des alternatives · plan d'instrumentation · tableau de résultats consolidé · bêta · journal d'itérations · justification de la décision de J3.

**Terminé quand.** 20 entretiens individuels documentés et synthétisés ; au moins 35 réponses B2C exploitables ; au moins 3 alternatives testées ; 25 utilisateurs B2C dont 10 ayant répété l'usage ; au moins 2 itérations documentées, chacune avec un changement concret lié à un besoin identifié ; métriques consolidées dans un tableau ; décision de J3 écrite et justifiée.

**Points de vigilance.** Biais de recrutement (privilégier des personnes extérieures à l'équipe) ; pas de questions fermées du type « aimez-vous notre idée ? » ; ne conserver comme itération que les changements reliés à un besoin identifié.

### 3.2 Outils entrepreneuriaux (obligatoire)

**Intention.** Savoir pour qui l'on construit, ce que cela coûte, ce que cela peut rapporter, comment on mesure le progrès, et pouvoir le démontrer avec des chiffres. **Le modèle économique n'est pas figé avant le choix de la première famille** (mentor).

**Ce qui existe déjà.** `BUSINESS_MODEL_CANVAS.md`, `FINANCIAL_MODEL.md`, `KPIS_ET_PROJECTIONS.md`, `ROADMAP_PRODUIT.md` (hypothèses, rédigés en juillet 2026) ; trois personas (`USER_JOURNEYS.md`) ; `ANALYSE_CONCURRENTIELLE.md` ; plan du pitch (`PITCH_PRESENTATION.md`, le support reste à réaliser) ; board GitHub Projects, jalons, issues attribuées, backlog de ce plan (MoSCoW en cours, #107) et Beta Test Plan.

**Ce que nous allons faire.**

- **Lean Canvas V1 daté** et **proposition de valeur en une phrase** pour les deux familles les plus prometteuses, liés aux résultats des entretiens ; repris à chaque jalon.
- **Persona principal** (hypothèse de départ : Sarah, 34 ans, développeuse en télétravail, `USER_JOURNEYS.md`) : même PC pour travailler et se détendre ; scénario type, à 18 h ou à la fin de sa dernière réunion, un mode ferme les outils de travail, baisse la luminosité et lance sa musique. Il change si les entretiens montrent une douleur plus forte ailleurs, et ce changement est noté dans le journal d'itérations.
- **Structure de coûts** en quatre colonnes : ressources fournies par Epitech, dépenses réelles, coût futur au prix du marché, coût marginal par utilisateur. Postes : hébergement, IA, stockage et trafic, licences et certificats, signature des installeurs, comptes développeur mobile (Apple 99 $ par an, Google Play 25 $ une fois, tarifs publics), outils, maintenance et support. Le budget d'infrastructure que l'école peut prendre en charge est à clarifier avec Ruben (#121, voir 1.6).
- **Comparaison argumentée des modèles de facturation** : abonnement, volume d'usage, achat ponctuel, cloud ou local, commission sur la marketplace (reportée, voir 2.2). Deux jeux d'hypothèses existent et ne sont pas testés : `FINANCIAL_MODEL.md` (4,99 € par mois ou 49 € en achat unique, conversion de 3 %, coûts de première année d'environ 8 000 €) et le document mentor (Nexum Plus d'environ 5 à 7 € par mois, Nexum Cloud d'environ 9 à 12 € par mois, pas de facturation de chaque action locale). Ils sont à réconcilier après le choix de la famille. Signaux du questionnaire : 7 sur 13 resteraient en gratuit, achat unique préféré (6 contre 2). Repères de prix cités au suivi du 19/10 : Zapier, offre gratuite, 100 tâches par mois, Zaps illimités mais à deux étapes seulement (vérifié le 06/11/2026, https://zapier.com/pricing) ; Stream Deck 15 touches, 149,99 $ sur la boutique Elgato US (vérifié le 06/11/2026 ; le mentor a cité « 149 € » le 19/10) ; Signal RGB Pro, 45 €/an (valeur citée par le mentor le 19/10, non revérifiée : prix non lu sur la page de tarifs).
- **Projection à 12 mois et point mort**, avec hypothèses documentées, repartant de la bêta (peu d'utilisateurs, coûts surtout d'hébergement et de comptes développeur).
- **Test de prix auprès d'au moins 10 personnes de la cible** (sensibilité, verbatims), intégré aux entretiens ; l'US-45 n'affiche que les limites de l'offre gratuite, sans paiement.
- **KPIs** (détail et suivi : `KPIS_ET_PROJECTIONS.md` et issue #103) : taux de clic (« Rejoindre la bêta » / visiteurs), taux d'inscription, conversion en entretien, utilisateurs actifs (au moins un mode par semaine), usage (activations par utilisateur actif et par semaine), fiabilité (actions réussies / lancées), rétention à 7 et 30 jours, satisfaction (score sur 5 via US-43), conversion payante (à partir de J4), CAC (proche de zéro tant que l'acquisition est organique). Les sources « Application » supposent la mesure d'usage décrite en 3.1.
- **SWOT** et **concurrence** tenus à jour après les entretiens (point de départ : forces = actions réelles sur le poste, sans code, voix locale ; faiblesses = équipe étudiante, aucune donnée terrain, nombreuses intégrations ; menaces = un éditeur établi qui ajoute le pilotage local, API tierces, restrictions d'iOS). **Roadmap visuelle** avec jalons et responsables (#128).

**Livrables.** Lean Canvas V1 daté · proposition de valeur · persona et scénarios · structure de coûts · comparaison des modèles · projection à 12 mois et point mort · résultats du test de prix · KPIs avec définitions · SWOT et concurrence · pitch · roadmap visuelle.

**Terminé quand.** Le Lean Canvas, le persona et la projection s'appuient sur des données de terrain (entretiens, inscriptions, usages) et non plus seulement sur des hypothèses ; au moins 10 confrontations de prix sont documentées ; les KPIs du site et de l'usage bêta s'affichent dans un tableau de bord ; la roadmap visuelle est publiée avec ses responsables.

### 3.3 Stratégie et vision (optionnel)

**Intention.** Formaliser le cap et surtout les choix qu'il implique : ce que l'équipe fait, refuse, dans quel ordre et pour qui, avec des critères posés à l'avance pour la décision de J3.

**Ce qui existe déjà.** Une vision et une analyse concurrentielle rédigées ; les principes du produit (sans code, toutes marques, transparent, léger) sont visibles dans le site et le dépôt.

**Ce que nous allons faire.**

- **Manifeste** d'une page : la vision (un seul endroit pour régler son environnement numérique, sans code, quelle que soit la marque) et les quatre principes.
- **Arbitrages assumés**, version de départ à réviser : Nexum ne modifie ni n'injecte rien dans un jeu (anti-triche) ; un mode reste une donnée validée, il peut seulement déclencher un script local déjà présent, avec permission explicite et journal (US-54) ; la voix reste locale ; les messageries restent en lecture seule ; une famille complète et stable à la fois ; pas de partenariat avant le Greenlight blanc ; pas de modèle de rémunération de la marketplace avant que le cœur soit stable.
- **Stratégie sur 6 à 18 mois**, révisée à chaque jalon : jusqu'en avril 2027, bêta sur une famille (J1), BTP v1 (J2), gel du périmètre et décision (J3) ; jusqu'en juillet 2027, installeurs signés, mises à jour, offre gratuite expliquée (J4) ; au-delà, ouverture progressive de la bêta et marketplace ouverte, conditionnées à une traction mesurée (rétention, conversion). La marketplace reste simple avant J3 (voir 2.2) ; en attendant la bêta, une communauté (forum ou Discord) peut recueillir idées et fonctionnalités et constituer un vivier de testeurs.
- **Segments prioritaires** : trois cibles de départ (joueurs PC, streamers, télétravailleurs) ; le segment d'entrée se tranche d'après les entretiens selon la douleur exprimée, la fréquence d'usage, l'adéquation avec l'existant et la disposition à payer. Premier signal : les douleurs fortes portent sur le travail et les études, presque pas sur le jeu.
- **Revue stratégique à J3**.

**Livrables.** Manifeste · liste d'arbitrages · stratégie 6–18 mois · fiche des segments avec critères · compte rendu de la revue de J3.

**Terminé quand.** Manifeste, arbitrages et stratégie validés par l'équipe avant J2 ; segment d'entrée choisi avec ses critères et ses preuves ; revue de J3 tenue et décisions écrites.

### 3.4 Image et message (optionnel)

**Intention.** Qu'un inconnu comprenne en quelques secondes ce que fait Nexum, pour qui et pourquoi c'est différent, et que le même message se retrouve partout. Chaque contenu doit viser une audience, porter une promesse claire et conduire à une action mesurable (répondre au questionnaire, demander un entretien, rejoindre la communauté, s'inscrire à la bêta). Cette section couvre aussi les attendus du mentor pour l'objectif « Communiquer autour du projet et se faire connaître » (voir 1.5).

**Ce qui existe déjà.** Un site vitrine en ligne (français et anglais), thème sombre unique (direction artistique « Galaxy » v1.0, reprise dans l'application), pages par cible (joueurs, streamers, télétravail) et inscription à la bêta ; une charte (`docs/brand/BRAND_GUIDELINES.md`), des exports pour les réseaux (`docs/brand/social/`) ; un calendrier éditorial sur 10 semaines (`SOCIAL_EDITORIAL_CALENDAR.md`) ; un ton éditorial décrit dans la charte (concret, direct, honnête sur l'état du produit). Les comptes sociaux, la page LinkedIn et la bande-annonce mentionnés par l'équipe sont **à prouver dans le pack du 07/11** (liens, captures). Le message n'a pas encore été testé auprès d'utilisateurs.

**Ce que nous allons faire.**

- **Note justifiant les deux canaux** : Instagram (jeunes et joueurs) et LinkedIn (professionnels), avec l'audience visée, la promesse et l'action attendue pour chacun.
- **Ligne éditoriale, rôles et calendrier de publication sur trois mois**, avec des exemples de contenus (le calendrier de 10 semaines existant est à étendre).
- **Page de conversion** : version V0 au 07/11, depuis le site, permettant de choisir une famille d'intérêt, répondre au questionnaire, demander un entretien ou rejoindre la bêta.
- **Registre des publications** : date, canal, contenu, portée, engagement, clics, contacts, réponses, entretiens et inscriptions attribuées ; démarrage immédiat, première analyse en séance 4. Il alimente le test des deux canaux d'acquisition de 3.1.
- **Relais extérieurs** et présence personnelle des membres pour amplifier la diffusion.
- **Proposition de valeur en une phrase**, version de travail : « Nous aidons les joueurs, les streamers et les télétravailleurs à préparer leur PC pour chaque activité en un clic, grâce à des modes sans code qui règlent le son, la luminosité, les lumières et les applications, quelle que soit la marque. » Elle sera resserrée sur le segment d'entrée dès qu'il est choisi. **Une seule accroche** : le site (« Un clic. Tout votre setup. », vouvoiement) et les réseaux (« Dis-le. Ton setup suit. », tutoiement) utilisent deux accroches et deux tons ; la voix est la façon la moins demandée de lancer un mode, et les données personnelles sont le premier frein (13 sur 13). La gagnante est appliquée partout avant J1.
- **Tests du message** auprès d'au moins 15 personnes de la cible, répartis sur les trois cibles, intégrés aux entretiens : on montre la phrase de valeur, le pitch court et 2 ou 3 visuels sans explication ; mesures : compréhension (la personne reformule ; objectif : 2 sur 3), résonance (note sur 5, « pour qui est-ce ? »), verbatims, taux de clic et d'inscription par variante ; chaque ajustement est noté avec ce qui l'a déclenché.

**Livrables.** Note sur les canaux · ligne éditoriale et calendrier sur 3 mois · page de conversion · registre des publications · proposition de valeur et accroche unique · charte appliquée · protocole et résultats des tests du message · journal des ajustements.

**Terminé quand.** La page de conversion est en ligne ; le registre des publications est tenu et analysé ; la charte est figée et appliquée sur le site, les réseaux et l'application ; au moins 15 personnes ont testé le message, avec résultats chiffrés et verbatims ; au moins un ajustement est documenté avec sa raison ; le même message est utilisé sur tous les canaux.

---

---

Les capacités du catalogue « BTP candidate » qui n'ont aucune user story sont listées dans `annexe-capacites-sans-us.md` ; le mapping des US vers les capacités est dans `mapping-us-nx.md`.
