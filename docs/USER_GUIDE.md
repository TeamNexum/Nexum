# Guide utilisateur — Nexum

*Jouer, streamer ou chiller sans friction.*

Bienvenue dans Nexum. Ce guide s'adresse aux utilisateurs : aucune connaissance
technique n'est nécessaire. Vous y apprendrez à installer l'application, à créer
vos propres ambiances (les « modes ») et à automatiser votre installation numérique.

---

## Sommaire

1. [Qu'est-ce que Nexum ?](#1-quest-ce-que-nexum-)
2. [Installation](#2-installation)
3. [Premier lancement](#3-premier-lancement)
4. [Le Dashboard](#4-le-dashboard)
5. [Activer un mode](#5-activer-un-mode)
6. [Créer ou éditer un mode (no-code)](#6-créer-ou-éditer-un-mode-no-code)
7. [Utiliser « Générer avec l'IA »](#7-utiliser--générer-avec-lia-)
8. [Configurer une automatisation](#8-configurer-une-automatisation)
9. [Importer un mode depuis la Marketplace](#9-importer-un-mode-depuis-la-marketplace)
10. [Réglages](#10-réglages)
11. [FAQ et dépannage](#11-faq-et-dépannage)

---

## 1. Qu'est-ce que Nexum ?

Nexum est un **centre de contrôle universel** pour tout votre environnement
numérique. En **un seul clic**, il prépare votre ordinateur, vos logiciels, vos
périphériques et vos objets connectés en fonction de ce que vous voulez faire.

Concrètement, vous définissez des **modes**. Un mode est une ambiance prête à
l'emploi. Par exemple :

- **Mode Gaming** : ferme les applications inutiles, lance Steam, règle le volume,
  passe vos lumières connectées en rouge.
- **Mode Stream** : ouvre OBS et Spotify, active la scène lumière « Direct »,
  coupe les notifications.
- **Mode Chill** : tamise les lumières, coupe Slack, lance une playlist détente.

Ce qui rend Nexum unique :

- **Universel et sans marque imposée** : il pilote aussi bien du matériel Razer,
  Corsair, Philips Hue, SteelSeries ou Logitech, même mélangés.
- **No-code** : vous construisez vos modes en cliquant, sans écrire une seule
  ligne de code ni de script.
- **Intelligent** : vous pouvez décrire un mode en français et l'IA le construit
  pour vous.
- **Léger et respectueux de votre machine** : conçu pour consommer très peu de
  ressources.

> 💡 **Astuce** — Pensez à un mode comme à un « interrupteur d'ambiance ». Vous
> l'allumez, tout se met en place ; c'est fait pour vous faire gagner les
> quelques minutes de préparation avant chaque session.

---

## 2. Installation

Nexum est une application de bureau disponible sur **Windows** et **Linux**.

> ℹ️ Selon votre version de Nexum, le programme d'installation peut vous être
> fourni sous forme de fichier téléchargeable. Suivez d'abord la procédure
> simple ci-dessous ; la procédure « avancée » n'est utile qu'aux personnes qui
> installent Nexum à partir du code source.

### Installation simple (recommandée)

#### Sur Windows

1. Téléchargez le fichier d'installation Nexum (`.msi` ou `.exe`).
2. Double-cliquez dessus.
3. Si Windows affiche un avertissement de sécurité, cliquez sur **Informations
   complémentaires** puis **Exécuter quand même** (l'application n'est pas encore
   signée à ce stade du projet).
4. Suivez les étapes de l'assistant (Suivant → Suivant → Installer).
5. Lancez Nexum depuis le menu Démarrer.

> 💡 **Astuce** — Sur Windows 10/11, le composant **WebView2** requis est
> généralement déjà présent. Si l'application refuse de s'ouvrir, installez
> « Microsoft Edge WebView2 Runtime » (gratuit, depuis le site de Microsoft).

#### Sur Linux (Debian / Ubuntu)

1. Téléchargez le paquet Nexum (`.deb` ou `.AppImage`).
2. Pour un `.deb`, double-cliquez dessus ou installez-le depuis votre logithèque.
3. Pour un `.AppImage`, faites un clic droit → **Propriétés** → autorisez
   l'exécution, puis double-cliquez.
4. Lancez Nexum depuis votre menu d'applications.

### Installation avancée (à partir du code source)

Réservée aux profils techniques. Elle nécessite d'installer des outils de
développement (Rust, Node.js) puis de compiler l'application. La procédure
complète est décrite dans le document `docs/GETTING_STARTED.md`.

> ⚠️ À ce stade du projet, le programme d'installation « clé en main » peut ne
> pas encore être publié. Dans ce cas, l'installation passe par la procédure
> avancée. — « Hypothèse » sur la disponibilité de l'installeur grand public.

---

## 3. Premier lancement

1. Ouvrez Nexum.
2. L'application s'ouvre directement sur l'écran **Accueil** (Dashboard).
3. Vous y voyez vos profils enregistrés (Gaming, Work, Chill) pour découvrir le fonctionnement.
4. Explorez les **cinq espaces de travail** accessibles depuis la barre supérieure :
   - **Accueil** : activez vos profils, consultez l'activité récente, gérez vos favoris (★) et réorganisez vos profils.
   - **Studio** : composez vos profils action par action, ajustez les curseurs et utilisez l'IA.
   - **Règles** : consultez vos règles d'automatisation et testez un horaire avec le simulateur.
   - **Découvrir** : parcourez le catalogue de modèles avec analyse de sécurité et installez-les en un clic.
   - **Système** : synchronisez avec le cloud, lancez un diagnostic des connexions et réglez la densité de l'interface.

> 💡 **Astuce** — Vous pouvez utiliser Nexum **sans compte** : vos profils sont enregistrés localement dans une base SQLite robuste (`nexum.db`). Un compte n'est utile que pour synchroniser vos profils entre plusieurs machines ou avec la télécommande mobile.
>
> ⌨️ **Raccourci** — Appuyez sur **`Ctrl + K`** (ou `Cmd + K`) pour ouvrir la palette de commandes et naviguer instantanément entre vos profils et vos réglages.

---

## 4. L'Accueil (Dashboard)

L'Accueil est votre centre de contrôle quotidien.

On y trouve :

- **Le carrousel cinématique** : tous vos profils sous forme de cartes d'ambiance avec leur catégorie visuelle.
- **Les commandes rapides** : un bouton de lecture directe ▶️ pour activer un profil sans ouvrir ses détails, une étoile ★ pour épingler en favoris, et une poignée ⠿ pour réordonner par glisser-déposer.
- **L'aperçu détaillé (tiroir)** : cliquez sur une carte pour ouvrir son détail complet, vérifier la liste des actions ordonnées et lancer l'activation.
- **Le journal d'activité récente (« Live actions »)** : un flux en direct qui affiche l'état d'exécution de chaque étape (✅ succès, ❌ échec, indicateur en cours).
- **Le panneau récapitulatif de votre bibliothèque** : compteurs de profils, actions actives, et accès rapides.

> 💡 **Astuce** — Le journal en direct est votre meilleur ami pour comprendre ce
> qui se passe. Si une lumière ne s'allume pas, le journal vous dira précisément
> quelle étape a échoué.

---

## 5. Activer un mode

1. Rendez-vous sur le **Dashboard**.
2. Repérez la carte du mode souhaité (par exemple « Gaming »).
3. Cliquez sur le bouton **Activer**.
4. Observez le **journal d'actions en direct** : chaque étape s'exécute dans
   l'ordre (fermer une application, lancer Steam, régler le volume, changer les
   lumières…).
5. Une fois toutes les étapes terminées, votre environnement est prêt.

Si une étape échoue (par exemple, une lampe connectée est éteinte), les autres
étapes continuent de s'exécuter. Nexum vous indique simplement le point de blocage.

> 💡 **Astuce** — Toutes les fonctions ne sont pas encore actives sur toutes les
> plateformes à ce stade du projet. Le volume fonctionne sur Windows et Linux ;
> la luminosité dépend du matériel, et Hue nécessite un pont configuré. Le RGB
> n'est pas encore proposé. Le journal indique toujours ce qui a été exécuté.

---

## 6. Créer ou éditer un mode (no-code)

C'est le cœur de Nexum : vous composez un mode vous-même, **sans code**, en
empilant des **actions**. Chaque action est une petite tâche (lancer une appli,
régler le son, allumer une lumière…).

### Étape par étape

1. Ouvrez l'onglet **Éditeur de modes**.
2. Cliquez sur **Nouveau mode** (ou sélectionnez un mode existant pour le modifier).
3. Renseignez les **informations générales** du mode :
   - **Nom** : le titre affiché sur le Dashboard (ex. « Soirée cinéma »).
   - **Icône / couleur** *(si disponible)* : pour reconnaître le mode d'un coup d'œil.
   - **Description** *(facultatif)* : une phrase pour vous souvenir de son but.
4. Ajoutez une action : cliquez sur **Ajouter une étape**.
5. Choisissez le **type d'action** dans la liste, par exemple :
   - **Lancer une application** → renseignez le nom ou le chemin de l'application.
   - **Fermer une application** → indiquez l'application à fermer.
   - **Ouvrir une page web / un lien** → collez l'adresse (URL).
   - **Lancer un jeu Steam** → indiquez le jeu (via son lien `steam://`).
   - **Régler le volume** → choisissez un niveau (de 0 à 100).
   - **Régler la luminosité de l'écran** → choisissez un niveau.
   - **Activer une scène de lumières (Philips Hue)** → choisissez la scène.
6. Remplissez les **champs** demandés par l'action sélectionnée (chaque type
   d'action affiche son propre petit formulaire).
7. Répétez les étapes 4 à 6 pour ajouter autant d'actions que voulu.
8. **Réordonnez** les étapes par glisser-déposer : l'ordre compte, les actions
   s'exécutent de haut en bas.
9. *(Optionnel)* Pour chaque étape, choisissez le **comportement en cas d'erreur**
   (« on_error ») : continuer malgré l'échec, ou arrêter le mode.
10. Cliquez sur **Enregistrer**.
11. Retournez sur le **Dashboard** et testez votre mode avec **Activer**.

> 💡 **Astuce** — Commencez petit : 2 ou 3 actions suffisent pour un premier
> mode. Testez, puis ajoutez des étapes une par une. C'est plus facile de repérer
> ce qui ne marche pas.

> 💡 **Astuce** — Un mode Nexum n'est que des **données**, jamais un programme.
> C'est ce qui rend l'édition sans risque : vous ne pouvez pas « casser » votre
> ordinateur en éditant un mode.

---

## 7. Utiliser « Générer avec l'IA »

Vous ne savez pas par où commencer ? Décrivez votre besoin en français, l'IA
construit le mode pour vous.

1. Ouvrez l'onglet **Éditeur de modes**.
2. Cliquez sur le bouton **✨ Générer avec l'IA**.
3. Dans le champ de texte, décrivez ce que vous voulez, en langage naturel.
   Exemples :
   - « musique chill et lumières tamisées pour me détendre »
   - « session de jeu classé sur Steam, coupe les applis inutiles »
   - « mode stream : lance OBS et Spotify, lumières en rouge »
4. Validez.
5. L'IA génère un mode complet avec ses étapes déjà remplies.
6. **Relisez** les étapes proposées : vous pouvez tout modifier comme dans
   l'éditeur classique (ajouter, supprimer, réordonner).
7. Cliquez sur **Enregistrer** quand le mode vous convient.

> 💡 **Astuce** — Considérez le résultat de l'IA comme un **brouillon de départ**
> à ajuster, pas comme une version définitive. Vous gardez toujours la main.

> ℹ️ Nexum ne génère jamais de « code » à exécuter : l'IA produit uniquement une
> liste d'actions décrites, que vous validez. C'est sûr par conception.

---

## 8. Configurer une automatisation

Une **automatisation** déclenche un mode toute seule, quand une condition est
remplie. Le principe est simple : **QUAND** ceci se produit, **ALORS** active tel
mode.

### Exemple : activer « Chill » tous les jours à 18h

1. Ouvrez l'onglet **Automatisations**.
2. Cliquez sur **Nouvelle automatisation**.
3. Donnez-lui un **nom** (ex. « Détente du soir »).
4. Choisissez le **déclencheur (QUAND)** :
   - Sélectionnez **Heure** et réglez **18:00**.
5. *(Optionnel)* Ajoutez une **condition (SI)** pour affiner, par exemple :
   - **SI** la batterie est en dessous d'un seuil, **SI** une application est
     lancée, **SI** vous êtes à un certain endroit (géolocalisation), etc.
6. Choisissez l'**action (ALORS)** :
   - **Activer le mode** → sélectionnez **Chill**.
7. **Enregistrez**.
8. Pour vérifier sans attendre 18h, utilisez la **simulation d'horloge** de
   l'onglet Automatisations : déclenchez un « tic » à 18:00 et observez le mode
   Chill s'activer automatiquement.

> 💡 **Astuce** — Les déclencheurs possibles incluent l'heure, le niveau de
> batterie, le lancement d'une application et la géolocalisation. Combinez un
> déclencheur (QUAND) avec une ou plusieurs conditions (SI) pour des scénarios
> précis, par exemple « à 18h **et** seulement si je suis à la maison ».

---

## 9. Importer un mode depuis la Marketplace

La **Marketplace** est une bibliothèque de modes partagés par la communauté.
Vous pouvez récupérer un mode déjà tout prêt au lieu de le construire.

1. Ouvrez l'onglet **Marketplace**.
2. Parcourez ou recherchez un mode (ex. « Setup Valorant compétitif »).
3. Cliquez sur un mode pour voir son détail et sa liste d'actions.
4. Consultez le **score de risque** affiché : Nexum analyse automatiquement
   chaque mode partagé et lui attribue une évaluation de sécurité.
5. Cliquez sur **Importer** pour l'ajouter à vos modes.
6. Ouvrez-le dans l'**Éditeur de modes** pour l'adapter à votre matériel (noms
   d'applications, scènes de lumières, etc.).
7. Testez-le depuis le **Dashboard**.

> 💡 **Astuce** — Regardez toujours le **score de risque** et la liste des
> actions avant d'importer. Comme un mode n'est que des données (jamais un
> programme), il ne peut effectuer que des actions autorisées et vérifiées par
> Nexum : vous restez protégé.

### Partager un mode par fichier

Vous pouvez aussi échanger un mode directement, sans passer par le catalogue
(par exemple entre collègues d'un même chantier).

- **Exporter** : sur le Dashboard, ouvrez un de vos profils puis cliquez sur
  **Exporter**. Choisissez où enregistrer le fichier `.nexum.json`.
- **Importer** : dans l'onglet **Marketplace**, section **Importer un
  profil**, cliquez sur **Choisir un fichier…**. Nexum affiche le niveau de
  risque du mode avant de l'ajouter :
  - un mode contenant une action inconnue est **refusé** ;
  - un mode à **risque élevé** demande une confirmation explicite ;
  - le mode importé reçoit un nouvel identifiant (et le suffixe « (importé) »
    si vous avez déjà un profil du même nom), il n'écrase donc jamais un de
    vos modes.

---

## 10. L'espace Système (Réglages)

L'onglet **Système** rassemble la gestion de votre compte, la synchronisation et la maintenance de votre installation :

- **Compte & synchronisation** :
  - Créez un compte ou connectez-vous avec votre e-mail et mot de passe.
  - **⬆ Envoyer les profils** (*Push*) : téléverse vos profils locaux vers le cloud.
  - **⬇ Récupérer depuis le cloud** (*Pull*) : importe les profils synchronisés sur votre machine.
  - Déconnexion en un clic.
- **Diagnostic en lecture seule (État des connexions)** :
  - Teste en temps réel la disponibilité de vos intégrations sans modifier vos réglages actuels :
    - **Audio** : disponibilité de la sortie audio par défaut (Windows Core Audio ou Linux PipeWire/PulseAudio).
    - **Écran** : détection des moniteurs compatibles avec le réglage de luminosité.
    - **Philips Hue** : vérification de l'accès au pont Hue et validation de l'authentification.
    - **Cloud** : contrôle de l'accessibilité de l'API Nexum Cloud.
- **Densité d'affichage de l'interface** :
  - Choisissez entre **Compact** (espacement réduit, idéal pour petits écrans ou fenêtres réduites) et **Confort** (espacement aéré). La préférence est conservée pour chaque lancement.
- **Serveur de synchronisation** :
  - Indiquez l'URL du serveur Nexum Cloud (par défaut `http://localhost:8787` en local, ou l'adresse IP de votre PC pour le compagnon mobile).
- **Statistiques de la bibliothèque locale** :
  - Nombre de profils enregistrés en SQLite, nombre d'actions actives, et état de l'environnement (Application de bureau vs Aperçu navigateur).

> 💡 **Astuce (Philips Hue)** — Pour piloter vos lumières Hue, configurez les variables d'environnement `NEXUM_HUE_BRIDGE` (adresse IP de votre pont) et `NEXUM_HUE_USER` (nom d'utilisateur généré sur le pont). L'outil de diagnostic confirmera immédiatement l'accès.

---

## 11. FAQ et dépannage

### Nexum est-il gratuit ?

Oui. La version **gratuite** permet d'utiliser Nexum en local avec jusqu'à
**3 modes**. La version **Premium (~4,99 €/mois)** débloque les modes illimités,
la synchronisation cloud, les automatisations avancées, l'IA et davantage. Une
**licence à vie (~49 €)** en achat unique est également prévue.

### Ai-je besoin d'un compte pour utiliser Nexum ?

Non. Vos modes sont enregistrés localement sur votre machine. Un compte ne sert
qu'à la synchronisation entre appareils.

### Est-ce compatible avec les jeux protégés par un anti-triche ?

Nexum est conçu pour rester sûr : il lance les jeux via les canaux officiels
(par exemple le lien `steam://`) et n'injecte pas de code dans les jeux. L'objectif
est d'être compatible avec les protections anti-triche.

### Mon mode s'active mais une lumière ne réagit pas

Vérifiez la configuration du pont Hue (`NEXUM_HUE_BRIDGE` et `NEXUM_HUE_USER`)
et le nom de la scène. Le **journal d'actions en direct** indique précisément
quelle étape n'a pas abouti. Le RGB n'est pas encore proposé dans l'éditeur.

### Le réglage du volume ne fonctionne pas sur Windows

Le contrôle du volume utilise Windows Core Audio. Vérifiez qu'un périphérique
de sortie par défaut est disponible, puis consultez le journal d'actions pour
voir le message d'erreur précis.

### L'application ne s'ouvre pas sur Windows

Installez le composant gratuit **Microsoft Edge WebView2 Runtime**, puis
relancez Nexum.

### Fenêtre blanche au lancement sur Linux

Ce cas est normalement géré automatiquement. Si le problème persiste, redémarrez
l'application ; en dernier recours, contactez le support avec le détail de votre
distribution Linux.

### Windows affiche un avertissement de sécurité à l'installation

L'application n'est pas encore signée numériquement à ce stade du projet. Cliquez
sur **Informations complémentaires** → **Exécuter quand même**.

### Comment revenir à un environnement « normal » après un mode ?

Activez simplement un autre mode (par exemple un mode « Bureau » ou « Chill ») qui
remet les réglages voulus. Vous pouvez créer un mode dédié « retour à la normale ».

### Où sont enregistrés mes modes ?

En local sur votre ordinateur. Avec un compte Premium et la synchronisation
activée, ils sont aussi sauvegardés dans le cloud et disponibles sur vos autres
appareils.

### J'ai encore un souci

- Consultez le **journal d'actions en direct** pour localiser l'étape en échec.
- Fermez et relancez Nexum.
- Vérifiez que le matériel concerné (lumières, périphériques) est allumé et
  connecté au même réseau.
- ⚠️ Canal de support / contact : à préciser. — placeholder à compléter par
  l'équipe.

---

*Nexum — projet EIP Epitech. Ce guide décrit des fonctionnalités dont certaines
sont encore en cours de développement ; l'interface réelle peut légèrement
différer selon la version installée.*
