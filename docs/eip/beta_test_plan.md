# Nexum — Beta Test Plan

> **Brouillon à valider en équipe** avant le rendu du BTP v1 (07/02/2027). Format officiel
> G-EIP-600 : rôles, fonctionnalités par parcours utilisateur, critères de réussite mesurables.
> Tout ce qui est listé ici devra être **démontré et fonctionnel** au Greenlight. Version
> détaillée (scénarios, protocole bêta) : [`BTP_BETA_TEST_PLAN.md`](BTP_BETA_TEST_PLAN.md).

## 1. Contexte

**Problème.** Avant chaque session (jouer, streamer, travailler), un utilisateur perd plusieurs
minutes à régler son environnement : volume, luminosité, lumières, applications à ouvrir ou fermer,
notifications. Les outils existants sont liés à une marque (Razer Synapse, Corsair iCUE) ou
demandent d'écrire des scripts.

**Solution.** Nexum est une application desktop (Windows, macOS, Linux) qui règle tout
l'environnement **en un clic** grâce à des **modes** : un mode est une suite d'actions (régler le
volume, lancer Steam, allumer une scène Hue…) créée sans code, activée d'un clic, à la voix, par un
raccourci, à une heure donnée ou depuis le téléphone. Les modes se partagent sous forme de fichiers
ou sur une marketplace qui vérifie qu'ils ne contiennent que des actions autorisées.

**Fonctionnement.** Un moteur en Rust exécute les actions d'un mode dans l'ordre à travers des
**intégrations** (une par système ou appareil) ; l'interface suit l'exécution en direct. Les
données restent sur la machine (fonctionnement hors ligne) ; un compte cloud facultatif
synchronise les modes entre appareils.

## 2. Rôles utilisateurs

| Rôle | Description |
|---|---|
| Utilisateur | Installe Nexum, crée et active ses modes, connecte ses appareils et ses comptes |
| Créateur | Utilisateur qui publie ses modes sur la marketplace |
| Modérateur | Membre de l'équipe Nexum qui valide ou refuse les modes publiés |

## 3. Fonctionnalités, par parcours utilisateur

| ID | Rôle | Fonctionnalité | Description |
|---|---|---|---|
| **Installer et configurer** | | | |
| F1 | Utilisateur | Installer Nexum | Installeur pour Windows, macOS et Linux (#21) |
| F2 | Utilisateur | Détecter ses appareils | Au premier lancement, Nexum liste les intégrations disponibles sur la machine (#11) |
| F3 | Utilisateur | Appairer un pont Philips Hue | Depuis l'app, sans configuration manuelle (#11) |
| F4 | Utilisateur | Activer ou désactiver une intégration | Depuis les réglages (#11) |
| F5 | Utilisateur | Installer une extension | Ajouter une intégration depuis l'app sans réinstaller Nexum (#23) |
| **Créer un mode** | | | |
| F6 | Utilisateur | Créer un mode sans code | Éditeur visuel : nom, catégorie, actions et leurs réglages (#13) |
| F7 | Utilisateur | Organiser les actions d'un mode | Ajouter, réordonner, désactiver une action, choisir quoi faire si elle échoue (#8) |
| F8 | Utilisateur | Générer un mode à partir d'une phrase | « Prépare-moi une soirée ranked » produit un mode modifiable (#19) |
| F9 | Utilisateur | Repérer les actions indisponibles | Les actions impossibles sur cette machine sont signalées avant l'exécution (#47) |
| **Activer un mode** | | | |
| F10 | Utilisateur | Activer un mode en un clic | Depuis le hub des modes (#7) |
| F11 | Utilisateur | Régler le volume | Sur Windows, macOS et Linux |
| F12 | Utilisateur | Régler la luminosité de l'écran | Écran intégré et écrans compatibles |
| F13 | Utilisateur | Lancer une application | N'importe quel programme installé |
| F14 | Utilisateur | Fermer une application | Par exemple Discord ou le navigateur avant de jouer |
| F15 | Utilisateur | Ouvrir un lien | Page web ou lien d'application |
| F16 | Utilisateur | Lancer un jeu Steam | Par son identifiant Steam |
| F17 | Utilisateur | Appliquer une scène Philips Hue | Scène choisie par son nom |
| F18 | Utilisateur | Contrôler la musique Spotify | Lancer une playlist, mettre en pause (#55, compte Spotify Premium) |
| F19 | Utilisateur | Changer de scène OBS | Pour les streamers : passer sur la scène « Live » (#56) |
| F20 | Utilisateur | Afficher son activité sur Discord | Statut du type « En mode Gaming » (#57, Rich Presence) |
| F21 | Utilisateur | Filtrer les notifications selon le mode | Seules les apps du mode affichent leurs notifications (#10) |
| F22 | Utilisateur | Lancer un mode à la voix | Raccourci « appuyer pour parler » puis « lance le mode Gaming », reconnaissance vocale locale (#94) |
| F23 | Utilisateur | Lancer un mode par raccourci clavier | Un raccourci réglable par mode (#69) |
| F24 | Utilisateur | Suivre l'exécution en direct | Fil d'activité : chaque action, son résultat et sa durée |
| F25 | Utilisateur | Comprendre un échec | Message clair qui distingue une action en échec d'une action indisponible (#47) |
| **Automatiser** | | | |
| F26 | Utilisateur | Programmer un mode | Activer un mode à une heure et des jours choisis (#15) |
| F27 | Utilisateur | Déclencher un mode au lancement d'une application | Ex. lancer Valorant active le mode « Gaming » (#15) |
| F28 | Utilisateur | Déclencher un mode au début d'une réunion | Lu dans l'agenda Outlook ou Google connecté (#15, même connexion que #96) |
| **Centraliser ses messages** | | | |
| F29 | Utilisateur | Connecter un compte Gmail | Connexion sécurisée (OAuth), lecture seule (#95) |
| F30 | Utilisateur | Connecter un compte Outlook | Connexion sécurisée (OAuth), lecture seule (#96) |
| F31 | Utilisateur | Connecter Microsoft Teams | Connexion sécurisée (OAuth), lecture seule (#97) |
| F32 | Utilisateur | Lire ses messages au même endroit | Fil unifié de tous les comptes connectés (#6) |
| **Partager** | | | |
| F33 | Utilisateur | Exporter un mode | Fichier `.nexum.json` à envoyer à quelqu'un (#60) |
| F34 | Utilisateur | Importer un mode | Analyse du risque avant l'ajout, refus des actions inconnues (#60) |
| F35 | Utilisateur | Installer un mode de la marketplace | Parcourir, prévisualiser les actions, installer (#16) |
| F36 | Créateur | Publier un mode | Soumettre un de ses modes à la marketplace (#16) |
| F37 | Modérateur | Valider ou refuser un mode publié | File de modération avec le score de risque (#17) |
| **Compte et appareils** | | | |
| F38 | Utilisateur | Créer un compte et se connecter | E-mail et mot de passe (#14) |
| F39 | Utilisateur | Synchroniser ses modes | Retrouver ses modes sur un autre ordinateur (#14) |
| F40 | Utilisateur | Activer un mode depuis son téléphone | App mobile iOS et Android (#18, #34) |
| F41 | Utilisateur | Envoyer un retour | Bouton dans l'app, journaux joints (#62) |
| F42 | Utilisateur | Mettre à jour l'app | Mise à jour automatique (#50) |

## 4. Critères de réussite

Colonne « Résultat » à remplir lors des tests de la bêta.

| ID | Critère de réussite | Indicateur | Résultat |
|---|---|---|---|
| F1 | L'app s'installe et démarre sur une machine vierge | 3 systèmes × 3 machines, 0 échec | |
| F2 | Les intégrations présentes sont détectées | 10 lancements, 100 % des intégrations disponibles détectées | |
| F3 | Le pont Hue est appairé sans éditer de fichier | 5 appairages, 5 réussis, < 1 min chacun | |
| F4 | Une intégration désactivée n'est plus exécutée | 10 essais, 0 action exécutée | |
| F5 | L'extension installée est utilisable tout de suite | 5 installations, 0 échec | |
| F6 | Un mode créé est enregistré et réapparaît au redémarrage | 20 modes créés, 0 perdu | |
| F7 | L'ordre et les réglages des actions sont respectés à l'exécution | 20 modes, 0 écart | |
| F8 | La phrase produit un mode valide et modifiable | 20 phrases, ≥ 16 modes jugés corrects | |
| F9 | Chaque action indisponible est signalée avant l'exécution | 10 cas, 10 signalés | |
| F10 | Le mode s'active en un clic | 50 activations, 0 échec lié à l'app, < 3 s pour 5 actions | |
| F11 | Le volume atteint la valeur demandée | 20 essais par système, 0 écart | |
| F12 | La luminosité atteint la valeur demandée | 20 essais, écart ≤ 5 % | |
| F13 | L'application demandée s'ouvre | 20 essais, 0 échec | |
| F14 | L'application demandée se ferme | 20 essais, 0 échec | |
| F15 | Le lien s'ouvre dans l'app par défaut | 20 essais, 0 échec | |
| F16 | Le jeu Steam se lance | 10 essais, 0 échec | |
| F17 | La scène Hue s'applique aux lampes | 20 essais, 0 échec, < 2 s | |
| F18 | La musique demandée se lance ou se met en pause | 20 essais, 0 échec | |
| F19 | OBS passe sur la scène demandée | 20 essais, 0 échec, < 1 s | |
| F20 | Le statut est visible par les amis Discord | 10 activations, statut visible à chaque fois | |
| F21 | Les notifications hors mode ne s'affichent pas | 10 sessions, 0 notification hors mode | |
| F22 | La commande vocale lance le bon mode | 50 commandes, ≥ 45 correctes, < 2 s | |
| F23 | Le raccourci lance le bon mode, app en arrière-plan | 20 essais, 0 échec | |
| F24 | Chaque action apparaît avec son résultat | 20 activations, 100 % des actions affichées | |
| F25 | L'utilisateur identifie la cause d'un échec | 10 testeurs, ≥ 8 la retrouvent sans aide | |
| F26 | Le mode se déclenche à l'heure prévue | 10 programmations, écart < 1 min | |
| F27 | Le mode se déclenche quand l'application démarre | 20 lancements, 0 oubli, < 3 s | |
| F28 | Le mode se déclenche au début de la réunion | 10 réunions, écart < 1 min | |
| F29–F31 | Le compte se connecte et ses messages récents s'affichent | 5 connexions par service, 0 échec | |
| F32 | Les messages de tous les comptes sont regroupés et triés | 3 comptes connectés, 0 message manquant sur 50 | |
| F33 | Le fichier exporté se réimporte à l'identique | 20 allers-retours, 0 différence | |
| F34 | Un mode dangereux est refusé, un mode sain est importé | 10 fichiers piégés refusés, 10 fichiers sains importés | |
| F35 | Le mode installé est utilisable tout de suite | 10 installations, 0 échec | |
| F36 | Le mode publié arrive dans la file de modération | 10 publications, 10 reçues | |
| F37 | Seuls les modes validés sont visibles | 10 décisions, 0 mode refusé visible | |
| F38 | Inscription et connexion fonctionnent | 20 comptes, 0 échec | |
| F39 | Les modes sont identiques sur deux ordinateurs | 20 synchronisations, 0 conflit perdu | |
| F40 | Le mode s'active sur le PC depuis le téléphone | 20 essais, 0 échec, < 3 s | |
| F41 | Le retour arrive à l'équipe avec les journaux | 10 envois, 10 reçus | |
| F42 | L'app se met à jour sans réinstallation | 3 mises à jour, 0 échec | |
