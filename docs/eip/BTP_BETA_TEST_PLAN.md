# Nexum — Beta Test Plan (BTP)

> **Document de référence pour le Greenlight Jury EIP.**
> Projet : **Nexum** — EIP Epitech, PROMO 2028, Phase PGE4, campus Marseille. Intra : eip.epitech.eu/project/1035.
> Piste EIP : **Entrepreneuriat** (objectifs complémentaires : Stratégie & Vision ; Image & Message).
> Rendu BTP : **janvier 2027**. Greenlight blanc : avril 2027. Greenlight + RNCP : **juillet 2027 (démo LIVE obligatoire, aucune vidéo autorisée)**.
>
> Langue des livrables : français. Dernière mise à jour : 2026-07-13.
> Sources de vérité : `docs/eip/_BRIEF_PROJET.md`, `NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`, `README.md`.

---

## Sommaire

1. Introduction & objectifs du BTP
2. Rappel du contexte projet
3. Périmètre de la bêta (in-scope / hors-scope)
4. Rôles utilisateurs
5. Liste exhaustive des fonctionnalités bêta (avec critères d'acceptation, statut cible, MoSCoW)
6. Scénarios de test détaillés
7. Plan de test bêta utilisateur (recrutement, protocole, métriques, outils)
8. Critères de sortie / Definition of Done de la bêta
9. Environnements & prérequis de test
10. Gestion des risques de test
11. Traçabilité fonctionnalités ↔ scénarios ↔ démo jury
12. Annexes

---

## 1. Introduction & objectifs du BTP

### 1.1 Qu'est-ce que ce document ?

Le **Beta Test Plan (BTP)** est le contrat de vérité entre l'équipe Nexum et le jury EIP. Il définit **précisément** :

- ce que la version bêta de Nexum **fera** (et ne fera pas) ;
- **comment** chaque fonctionnalité sera prouvée, en conditions réelles, **en direct** ;
- **qui** teste, **pendant combien de temps**, et **selon quels critères** on déclare la bêta « réussie » ;
- comment ces critères s'alignent sur les attendus du **Greenlight Jury de juillet 2027**.

Ce document est rédigé pour être **exécutable** : chaque fonctionnalité listée en §5 possède des critères d'acceptation binaires (réussi / échoué), et chaque scénario de test en §6 est reproductible pas à pas par un tiers.

### 1.2 Objectifs du BTP

| # | Objectif | Résultat attendu |
|---|---|---|
| O1 | **Figer le périmètre démontrable** | Une liste fermée de fonctionnalités bêta, chacune testable **en live** sans vidéo. |
| O2 | **Rendre chaque promesse produit vérifiable** | Des critères d'acceptation objectifs, pas d'affirmation invérifiable. |
| O3 | **Organiser la campagne de test utilisateur** | ≥ 20 bêta-testeurs actifs, protocole, métriques, outils de feedback. |
| O4 | **Définir la Definition of Done (DoD) de la bêta** | Un seuil de sortie chiffré, aligné Greenlight Jury. |
| O5 | **Sécuriser la démo jury** | Un plan de repli (fallback) pour chaque dépendance matérielle/API tierce. |
| O6 | **Alimenter les blocs RNCP** | Preuves pour Bloc 5 (assurance qualité), Bloc 6 (déploiement), Bloc 7 (gestion de projet). |

### 1.3 À qui s'adresse ce document ?

- **Jury EIP / RNCP** : référence d'évaluation.
- **Équipe Nexum** : feuille de route de validation.
- **Bêta-testeurs** : cadre de participation (via l'extrait « protocole testeur » en §7).
- **Référent EIP & mentor** : point de suivi (cadence 6 semaines en PGE4, mensuelle en PGE5).

---

## 2. Rappel du contexte projet

### 2.1 Le produit en une phrase

> **Nexum : jouer, streamer ou chiller sans friction.**
> Application universelle, **no-code** et **agnostique** qui synchronise en un clic tout l'environnement numérique (logiciels, système, périphériques, objets connectés) selon l'activité, via des **« modes »**.

### 2.2 Le problème adressé

Le setup numérique est **fragmenté** : launchers, logiciels constructeurs (Razer Synapse, Corsair iCUE), utilitaires système isolés, scripts AutoHotkey. Résultat : du temps perdu avant chaque session, des solutions verrouillées à une marque ou réservées aux techniciens, et **aucune automatisation contextuelle**.

### 2.3 La proposition de valeur (5 axes)

1. **Interopérabilité (5/5)** — connecte des marques concurrentes.
2. **Facilité d'usage / No-code (5/5)** — sans script.
3. **Performance système (4/5)** — Rust/Tauri, empreinte minimale.
4. **Personnalisation IA (4/5)** — modes en langage naturel (Mode-as-Code).
5. **Stabilité & sécurité (4/5)** — protocoles officiels (SDK), compatibilité anti-cheat.

### 2.4 L'idée d'architecture qui rend la bêta possible

> Tout est une **Action** typée, exécutée par un **Adapter** de plateforme, orchestrée par un **Engine** event-driven, à partir d'une **définition de Mode déclarative (DSL JSON)** partagée par tous les composants.

Un **Mode = données, jamais du code**. Cette décision unique résout d'un coup : le no-code, le cross-platform, la Marketplace sûre (validation par allowlist), et l'IA Mode-as-Code. C'est le socle de tout ce BTP.

### 2.5 État de l'implémentation au moment de la rédaction (baseline)

D'après le `README.md` du monorepo (statut réel des adapters au démarrage de la campagne) :

| Action | Statut baseline (2026) |
|---|---|
| `system.launch_app` / `close_app` / `open_url` | ✅ cross-platform, réel |
| `gaming.launch_steam` (via `steam://`) | ✅ réel, officiel, anti-cheat-safe |
| `audio.set_volume` | ✅ Linux · ⛔ Windows (Core Audio à corriger — priorité Phase 0) |
| `display.set_brightness` | ⛔ TODO (valide les params seulement) |
| `iot.hue.activate_scene` | 🔸 mocké — intégration Hue réelle en Phase 1 |
| `peripheral.apply_rgb_profile` | 🔸 mocké — Phase 1 |

Ce BTP décrit la **cible bêta de juillet 2027**, qui suppose la résolution des TODO ci-dessus. Le statut cible de chaque fonctionnalité est précisé en §5.

---

## 3. Périmètre de la bêta

**La bêta ne couvre pas tout le scope produit.** Elle couvre un **sous-ensemble fermé, entièrement démontrable en live**, choisi pour prouver la thèse de Nexum (agnostique + no-code + orchestration universelle + IA) avec un maximum d'effet devant le jury et un minimum de dépendances fragiles.

### 3.1 DANS le périmètre de la bêta (in-scope)

- **Éditeur de modes no-code** (création, édition, suppression, réordonnancement des steps).
- **Moteur d'exécution réel** avec feedback temps réel par step (succès/échec).
- **Adapters réels** : System (launch/close/open_url), Audio (volume **Windows + Linux**), Gaming (Steam via `steam://`), IoT (**Philips Hue** réel), Display (luminosité).
- **Persistance locale** SQLite (offline-first) + CRUD des modes.
- **Automatisation SI/ALORS** avec au minimum le **trigger horaire** (« Mode Chill 18h » de Sarah).
- **Auth cloud** (email + OAuth Google/Discord) + **sync cloud multi-device**.
- **Télécommande mobile** (activer un mode à distance via le cloud).
- **Marketplace v1** : partage, validation par allowlist, score de risque, import d'un mode validé.
- **IA Mode-as-Code** : langage naturel → DSL JSON → simulation → activation (démonstrateur).
- **Plateformes** : **Windows (prioritaire)** et **Linux**.

### 3.2 HORS du périmètre de la bêta (out-of-scope, assumé)

| Hors-scope bêta | Raison | Horizon |
|---|---|---|
| **macOS** | Bonus non prioritaire ; effort cross-platform concentré sur Win/Linux. | Post-bêta |
| **Adapters périphériques RGB réels** (SteelSeries, Logitech, Corsair) | SDK propriétaires lourds ; restent **mockés** en bêta. Un seul « effet waouh » matériel réel suffit (Hue). | Post-bêta / SDK public |
| **Triggers d'automatisation avancés** (batterie, géoloc mobile, connexion périphérique) | La bêta valide le moteur via le **trigger horaire**, le plus démonstratif et fiable. Les autres triggers sont architecturés mais non garantis en démo. | Should / Could |
| **Marketplace : paiement & commission** | Le flux monétaire n'est pas testé en bêta (partage gratuit uniquement). | Post-bêta |
| **App mobile complète** (édition de modes sur mobile) | Le mobile bêta se limite au rôle **télécommande**. | Phase 2+ |
| **Épic / GOG launch** | Steam couvre la démo gaming ; Epic/GOG sont architecturés (même action_type générique) mais non exigés en bêta. | Could |
| **Certification anti-cheat formelle** | On garantit la **méthode** (API officielles, pas d'injection) mais pas une certification tierce. | Post-bêta |
| **B2B / licences volume** | Hors périmètre technique de la bêta (axe business documenté ailleurs). | Post-bêta |

> **Principe de cadrage :** mieux vaut **9 fonctionnalités qui marchent à 100 % en live** que 30 à moitié. La priorisation MoSCoW (§5) matérialise ce principe.

---

## 4. Rôles utilisateurs

La bêta distingue quatre rôles. Chaque scénario de test (§6) précise le rôle concerné.

| Rôle | Description | Droits / limites en bêta | Persona associé |
|---|---|---|---|
| **Utilisateur gratuit** (Free) | Découverte, usage local. | Config locale, **3 modes maximum**, pas de sync cloud, pas d'IA, pas d'automatisation avancée. | Léo (gamer) au départ |
| **Utilisateur premium** (Premium SaaS ~4,99 €/mois) | Cœur de cible payant. | **Modes illimités**, sync cloud multi-device, automatisations avancées (triggers), IA Mode-as-Code, thèmes, statistiques. | Maxime (streamer), Sarah (télétravail) |
| **Créateur Marketplace** | Publie des presets pour la communauté. | Premium + peut **soumettre un mode** à la Marketplace (passe par validation allowlist + score de risque + modération). Réputation (ratings). | Maxime (partage ses scènes) |
| **Administrateur / modérateur** | Équipe Nexum. | Accès back-office : file de **modération** (`pending`/`approved`/`rejected`), consultation des scores de risque, gestion des signalements, supervision de la sync. | Équipe interne |

> **Note bêta :** en bêta, la distinction Free/Premium est **fonctionnelle** (feature-gating), sans facturation réelle. Les bêta-testeurs premium reçoivent un accès premium gratuit pour la durée du test.

---

## 5. Liste exhaustive des fonctionnalités bêta

**Légende priorité MoSCoW :** **Must** = sans elle, pas de bêta ni de Greenlight. **Should** = fortement attendue, contournable. **Could** = valeur ajoutée, sacrifiable si le temps manque.
**Statut cible juillet 2027 :** état visé pour la démo live.

Chaque fonctionnalité porte un identifiant `F-xx` réutilisé dans la matrice de traçabilité (§11).

---

### F-01 — Éditeur de modes no-code

- **Description :** UI visuelle permettant de créer un mode, y ajouter des steps depuis un catalogue d'`action_types`, régler les `params`, réordonner, activer/désactiver un step, définir `on_error` (`continue`/`abort`), puis sauvegarder. Aucune ligne de code écrite par l'utilisateur.
- **Critères d'acceptation :**
  - CA1 : Depuis zéro, un utilisateur crée un mode nommé avec ≥ 3 steps et le sauvegarde en < 3 min.
  - CA2 : Le mode sauvegardé est persisté (visible après redémarrage de l'app).
  - CA3 : L'éditeur n'expose que des `action_types` de l'allowlist ; impossible d'injecter du code.
  - CA4 : Réordonner un step met à jour l'ordre d'exécution effectif.
- **Statut cible juillet 2027 :** ✅ Complet et réel.
- **Priorité :** **Must**.

### F-02 — Moteur d'exécution d'un mode (actions réelles + feedback temps réel)

- **Description :** À l'activation d'un mode, l'Engine charge la définition, vérifie les capacités, exécute chaque step dans l'ordre via l'Action Registry → Adapter, et **émet un événement de succès/échec par step** (le LiveActionsPanel devient réel).
- **Critères d'acceptation :**
  - CA1 : Chaque step affiche un état réel (succès/échec), pas une liste statique.
  - CA2 : Une action réelle observable se produit (volume système change, app se lance/ferme, URL s'ouvre).
  - CA3 : La politique `on_error` est respectée (`continue` poursuit, `abort` arrête la séquence).
  - CA4 : L'exécution est journalisée (table `MODE_EXECUTIONS`).
- **Statut cible juillet 2027 :** ✅ Complet et réel.
- **Priorité :** **Must**.

### F-03 — Adapter System (launch_app / close_app / open_url / run_preset)

- **Description :** Lancer une application, fermer une application par nom, ouvrir une URL dans le navigateur par défaut. Cross-platform Windows + Linux.
- **Critères d'acceptation :**
  - CA1 : `system.launch_app` démarre l'app cible (ex. Spotify) sur Win **et** Linux.
  - CA2 : `system.close_app` termine le process cible (ex. Slack).
  - CA3 : `system.open_url` ouvre l'URL dans le navigateur par défaut.
- **Statut cible juillet 2027 :** ✅ Réel (déjà cross-platform en baseline).
- **Priorité :** **Must**.

### F-04 — Adapter Audio (set_volume, set_default_device, mute) — Windows + Linux

- **Description :** Régler le volume système, changer le périphérique de sortie par défaut, couper le son. **Correction critique** du bug volume Windows (Core Audio via crate `windows` / `IAudioEndpointVolume`).
- **Critères d'acceptation :**
  - CA1 : `audio.set_volume` à 70 % modifie **réellement** le volume système sous **Windows** (bug baseline corrigé).
  - CA2 : Idem sous **Linux** (pactl / PipeWire).
  - CA3 : Le changement est observable dans le mixeur de l'OS.
- **Statut cible juillet 2027 :** ✅ Réel Windows + Linux (`set_default_device`/`mute` : Should).
- **Priorité :** **Must** (le volume Windows est un enjeu de crédibilité central).

### F-05 — Adapter Gaming (launch_steam via `steam://`)

- **Description :** Lancer un jeu Steam par `app_id` via le protocole officiel `steam://`. Anti-cheat-safe (aucune injection).
- **Critères d'acceptation :**
  - CA1 : `gaming.launch_steam` avec un `app_id` valide démarre le jeu via le client Steam.
  - CA2 : Aucune injection dans le process du jeu (uniquement l'URL protocol officielle).
  - CA3 : Si Steam est absent, échec propre et signalé (pas de crash).
- **Statut cible juillet 2027 :** ✅ Réel (baseline). Epic/GOG : Could.
- **Priorité :** **Must**.

### F-06 — Adapter Display (set_brightness, set_refresh_rate, set_resolution)

- **Description :** Régler la luminosité de l'écran (au minimum), idéalement le taux de rafraîchissement et la résolution.
- **Critères d'acceptation :**
  - CA1 : `display.set_brightness` modifie **réellement** la luminosité (baseline = valide seulement, à rendre effectif).
  - CA2 : Dégradation propre si le HW ne supporte pas le réglage.
- **Statut cible juillet 2027 :** 🎯 `set_brightness` réel ; `set_refresh_rate`/`set_resolution` : Should/Could.
- **Priorité :** **Should**.

### F-07 — Adapter IoT Philips Hue (activate_scene, set_color, set_on)

- **Description :** Contrôle **réel** d'un pont Philips Hue : activer une scène, changer la couleur, allumer/éteindre. C'est l'**effet « waouh » visuel** de la démo jury.
- **Critères d'acceptation :**
  - CA1 : `iot.hue.activate_scene` change **physiquement** l'éclairage d'une lampe Hue réelle devant le jury.
  - CA2 : Détection du pont Hue (`is_available`) ; si absent, step signalé incompatible sans crash.
  - CA3 : Latence perçue < 2 s entre activation du mode et changement lumineux.
- **Statut cible juillet 2027 :** ✅ Réel (baseline = mocké → à réaliser en Phase 1).
- **Priorité :** **Must** (pièce maîtresse de la démo).

### F-08 — Adapter Peripherals (apply_rgb_profile, set_dpi)

- **Description :** Appliquer un profil RGB / DPI sur un périphérique. Reste **mocké** en bêta (SDK propriétaires hors-scope).
- **Critères d'acceptation :**
  - CA1 : Le step s'exécute et rapporte un statut (mock) cohérent dans le LiveActionsPanel.
  - CA2 : L'architecture (action_type + Adapter enregistré) prouve l'extensibilité.
- **Statut cible juillet 2027 :** 🔸 Mocké (démonstration d'extensibilité).
- **Priorité :** **Could**.

### F-09 — Persistance locale SQLite (offline-first) + CRUD modes

- **Description :** Stockage local des modes, actions, devices, règles, logs récents et file de sync, dans SQLite embarqué. L'app fonctionne **sans réseau**.
- **Critères d'acceptation :**
  - CA1 : Un mode créé hors-ligne est présent après redémarrage.
  - CA2 : CRUD complet (créer / lire / modifier / supprimer) fonctionnel.
  - CA3 : Aucune perte de données au redémarrage.
- **Statut cible juillet 2027 :** ✅ Réel (baseline = store in-memory → SQLite en Phase 1).
- **Priorité :** **Must**.

### F-10 — Moteur d'automatisation SI/ALORS (trigger horaire)

- **Description :** Règles event-driven : un trigger active/désactive un `mode_id`. En bêta, le **trigger horaire** est garanti (« Mode Chill à 18h » de Sarah). Conflits gérés par `last-write + priorité utilisateur`.
- **Critères d'acceptation :**
  - CA1 : Une règle `trigger: time>=18:00 → mode: Chill` déclenche l'activation **automatique** du mode sans intervention.
  - CA2 : L'exécution automatique produit les mêmes actions réelles qu'une activation manuelle.
  - CA3 : Un conflit (deux modes) est résolu de façon déterministe et journalisé.
- **Statut cible juillet 2027 :** ✅ Réel (trigger horaire). Autres triggers : Should/Could.
- **Priorité :** **Must**.

### F-11 — Authentification cloud (email + OAuth Google/Discord, JWT)

- **Description :** Création de compte / connexion par email ou OAuth (Google/Discord, pertinents pour la cible gaming), sessions JWT.
- **Critères d'acceptation :**
  - CA1 : Inscription + connexion email fonctionnelles.
  - CA2 : Au moins un provider OAuth (Google **ou** Discord) fonctionnel.
  - CA3 : Session sécurisée (JWT), déconnexion effective.
- **Statut cible juillet 2027 :** ✅ Réel.
- **Priorité :** **Must** (prérequis de la sync et du multi-device).

### F-12 — Synchronisation cloud multi-device

- **Description :** Sync Manager : upload des changements locaux, download des changements distants, résolution de conflits. Un mode créé sur la machine A apparaît sur la machine B du même compte.
- **Critères d'acceptation :**
  - CA1 : Un mode créé sur A est retrouvé sur B (même compte) après sync.
  - CA2 : Une modification concurrente est résolue sans corruption (politique documentée).
  - CA3 : Le mode fonctionne hors-ligne puis se synchronise à la reconnexion.
- **Statut cible juillet 2027 :** ✅ Réel.
- **Priorité :** **Must**.

### F-13 — Télécommande mobile

- **Description :** App mobile (Tauri mobile) servant de **télécommande** : lister et activer à distance les modes du compte via le cloud.
- **Critères d'acceptation :**
  - CA1 : Depuis le téléphone, activer un mode déclenche l'exécution réelle sur le desktop lié.
  - CA2 : Latence perçue < 5 s.
  - CA3 : Auth du mobile sur le même compte que le desktop.
- **Statut cible juillet 2027 :** 🎯 Réel (rôle télécommande uniquement).
- **Priorité :** **Should**.

### F-14 — Marketplace : publication + validation + score de risque

- **Description :** Un créateur soumet un mode. Le back-office : (1) analyse statique (chaque `type` ∈ allowlist, params validés par `validate()`), (2) score de risque IA (pondéré selon actions/params sensibles), (3) modération (`pending`/`approved`/`rejected`), (4) réputation créateur (ratings).
- **Critères d'acceptation :**
  - CA1 : Un mode soumis avec un action_type hors allowlist est **rejeté** automatiquement.
  - CA2 : Un mode contenant `system.close_app` sur un process sensible reçoit un **score de risque plus élevé**.
  - CA3 : Le statut de modération est visible et modifiable par l'admin.
- **Statut cible juillet 2027 :** 🎯 Réel (partage gratuit ; paiement hors-scope).
- **Priorité :** **Should**.

### F-15 — Marketplace : import d'un mode validé

- **Description :** Un utilisateur parcourt les modes `approved`, en importe un, qui apparaît dans sa bibliothèque locale, prêt à l'emploi.
- **Critères d'acceptation :**
  - CA1 : Seuls les modes `approved` sont importables.
  - CA2 : Le mode importé est vérifié à nouveau côté client (allowlist + capacités) avant activation.
  - CA3 : Le mode importé s'exécute correctement (actions supportées) ou signale les steps incompatibles.
- **Statut cible juillet 2027 :** 🎯 Réel.
- **Priorité :** **Should**.

### F-16 — IA Mode-as-Code (langage naturel → mode généré)

- **Description :** L'utilisateur décrit un besoin en langage naturel ; le service IA produit un **JSON de Mode (DSL §3)** ; simulation (`validate()` sans exécuter) ; validation des capacités ; puis proposition d'activation. **Le LLM ne génère jamais de code, seulement de la donnée déclarative validée.**
- **Critères d'acceptation :**
  - CA1 : Une phrase (ex. « Prépare-moi une session Valorant tranquille le soir ») produit un mode cohérent (steps plausibles, action_types valides).
  - CA2 : Le mode généré passe la validation allowlist + capacités avant toute activation.
  - CA3 : Aucune sortie du LLM n'est exécutée sans passer par le pipeline de validation.
- **Statut cible juillet 2027 :** 🎯 Démonstrateur réel.
- **Priorité :** **Should** (fort différenciateur EIP ; garde-fou sécurité obligatoire).

### F-17 — Feature-gating Free / Premium

- **Description :** Application des limites de l'offre : Free = 3 modes max, pas de sync/IA/automatisation avancée ; Premium = illimité + toutes fonctions.
- **Critères d'acceptation :**
  - CA1 : Un compte Free bloqué à la création du 4ᵉ mode avec message d'upsell.
  - CA2 : Un compte Premium accède à sync + IA + automatisation.
- **Statut cible juillet 2027 :** 🎯 Réel (sans facturation).
- **Priorité :** **Should**.

### F-18 — RGPD : consentement + export / suppression des données

- **Description :** Consentement au traitement, export des données utilisateur, suppression de compte/données.
- **Critères d'acceptation :**
  - CA1 : Consentement recueilli à l'inscription.
  - CA2 : Export des données du compte disponible.
  - CA3 : Suppression effective des données sur demande.
- **Statut cible juillet 2027 :** 🎯 Réel (exigence de l'étude de marché).
- **Priorité :** **Should**.

### F-19 — Packaging & déploiement (installeurs Windows + Linux)

- **Description :** Installeurs signés Windows + Linux, service cloud déployé et accessible. Condition du « projet déployé » exigé par le Greenlight.
- **Critères d'acceptation :**
  - CA1 : Installation propre depuis un installeur sur une machine vierge (Win **et** Linux).
  - CA2 : Le service cloud est joignable (health check OK) depuis l'app installée.
- **Statut cible juillet 2027 :** ✅ Réel (prérequis démo live).
- **Priorité :** **Must**.

### 5.1 Tableau récapitulatif MoSCoW

| ID | Fonctionnalité | Statut cible 07/2027 | Priorité |
|---|---|---|---|
| F-01 | Éditeur de modes no-code | ✅ Réel | Must |
| F-02 | Moteur d'exécution + feedback temps réel | ✅ Réel | Must |
| F-03 | Adapter System | ✅ Réel | Must |
| F-04 | Adapter Audio (volume Win+Linux) | ✅ Réel | Must |
| F-05 | Adapter Gaming (Steam) | ✅ Réel | Must |
| F-06 | Adapter Display (luminosité) | 🎯 Réel (partiel) | Should |
| F-07 | Adapter IoT Philips Hue | ✅ Réel | Must |
| F-08 | Adapter Peripherals (RGB) | 🔸 Mocké | Could |
| F-09 | Persistance SQLite + CRUD | ✅ Réel | Must |
| F-10 | Automatisation SI/ALORS (horaire) | ✅ Réel | Must |
| F-11 | Auth cloud (email + OAuth) | ✅ Réel | Must |
| F-12 | Sync cloud multi-device | ✅ Réel | Must |
| F-13 | Télécommande mobile | 🎯 Réel | Should |
| F-14 | Marketplace publication + validation + score | 🎯 Réel | Should |
| F-15 | Marketplace import mode validé | 🎯 Réel | Should |
| F-16 | IA Mode-as-Code | 🎯 Démonstrateur | Should |
| F-17 | Feature-gating Free/Premium | 🎯 Réel | Should |
| F-18 | RGPD (consentement/export/suppression) | 🎯 Réel | Should |
| F-19 | Packaging & déploiement Win/Linux | ✅ Réel | Must |

> **Seuil Greenlight :** 100 % des **Must** validés et 100 % des Must démontrables en live. Objectif ≥ 70 % des **Should** validés.

---

## 6. Scénarios de test détaillés

Chaque scénario est reproductible par un tiers. **Résultat attendu** = ce qui doit se produire ; **Critère de réussite** = condition binaire de validation. Tous sont conçus pour être joués **en live** au jury.

> Environnement de référence des scénarios : voir §9. « PC A » et « PC B » = deux machines liées au même compte premium. Pont Hue et lampe réelle disponibles pour ST-04 et ST-06.

### ST-01 — Création no-code d'un mode (rôle : Free)

| Champ | Contenu |
|---|---|
| **ID** | ST-01 |
| **Fonctionnalités** | F-01, F-09 |
| **Rôle** | Utilisateur gratuit |
| **Préconditions** | App installée (F-19), compte Free connecté, < 3 modes existants. |
| **Étapes** | 1. Ouvrir l'éditeur no-code. 2. Nommer le mode « Focus ». 3. Ajouter step `audio.set_volume` (30 %). 4. Ajouter step `system.close_app` (Slack). 5. Ajouter step `system.open_url` (docs). 6. Réordonner : volume en premier. 7. Sauvegarder. 8. Redémarrer l'app. |
| **Résultat attendu** | Le mode « Focus » avec 3 steps ordonnés est visible après redémarrage. |
| **Critère de réussite** | Mode persistant, 3 steps, ordre respecté, aucun code saisi. Temps < 3 min. |

### ST-02 — Activation d'un mode avec actions réelles (rôle : Premium)

| Champ | Contenu |
|---|---|
| **ID** | ST-02 |
| **Fonctionnalités** | F-02, F-03, F-04 |
| **Rôle** | Premium |
| **Préconditions** | Mode « Focus » existant (ST-01) ; Slack ouvert ; volume système à 100 %. |
| **Étapes** | 1. Activer le mode « Focus ». 2. Observer le LiveActionsPanel. |
| **Résultat attendu** | Volume système passe à 30 % (réel, observable dans le mixeur OS), Slack se ferme, l'URL s'ouvre dans le navigateur. Chaque step affiche succès/échec en temps réel. |
| **Critère de réussite** | Les 3 actions se produisent réellement (Windows **et** Linux) ; chaque step montre un état réel, pas statique. |

### ST-03 — Lancement d'un jeu Steam depuis un mode (rôle : Free — persona Léo)

| Champ | Contenu |
|---|---|
| **ID** | ST-03 |
| **Fonctionnalités** | F-05, F-02 |
| **Rôle** | Utilisateur gratuit |
| **Préconditions** | Client Steam installé et connecté ; jeu (app_id connu) présent dans la bibliothèque. |
| **Étapes** | 1. Créer/activer un mode « Ranked » avec step `gaming.launch_steam` (app_id valide). 2. Observer. |
| **Résultat attendu** | Steam lance le jeu via `steam://` sans injection. |
| **Critère de réussite** | Le jeu démarre via le protocole officiel ; aucun hook/injection ; si Steam absent → échec propre signalé, pas de crash. |

### ST-04 — Contrôle d'une lampe Philips Hue réelle (rôle : Premium — persona Maxime)

| Champ | Contenu |
|---|---|
| **ID** | ST-04 |
| **Fonctionnalités** | F-07, F-02 |
| **Rôle** | Premium |
| **Préconditions** | Pont Hue sur le même réseau, appairé ; ≥ 1 lampe Hue physique allumable ; scène « Purple Night » définie. |
| **Étapes** | 1. Activer un mode « Direct » avec step `iot.hue.activate_scene` (Purple Night). 2. Observer la lampe. |
| **Résultat attendu** | La lampe change **physiquement** de couleur/scène devant le jury. |
| **Critère de réussite** | Changement lumineux réel < 2 s ; si pont absent → step signalé incompatible sans crash (fallback documenté §10). |

### ST-05 — Automatisation horaire « Mode Chill 18h » (rôle : Premium — persona Sarah)

| Champ | Contenu |
|---|---|
| **ID** | ST-05 |
| **Fonctionnalités** | F-10, F-02, F-03, F-04, F-07 |
| **Rôle** | Premium |
| **Préconditions** | Mode « Chill » existant (lumières tamisées Hue, volume ↓, Slack fermé, Spotify lancé) ; règle `time>=18:00 → Chill`. |
| **Étapes** | 1. Créer la règle horaire. 2. (Démo) régler l'heure déclencheur à T+1 min. 3. Attendre le déclenchement. |
| **Résultat attendu** | À l'heure atteinte, le mode « Chill » s'active **seul** ; toutes les actions réelles s'exécutent. |
| **Critère de réussite** | Activation automatique sans intervention ; mêmes effets réels qu'une activation manuelle ; déclenchement journalisé. |

### ST-06 — Sync cloud multi-device (rôle : Premium)

| Champ | Contenu |
|---|---|
| **ID** | ST-06 |
| **Fonctionnalités** | F-11, F-12, F-09 |
| **Rôle** | Premium |
| **Préconditions** | PC A et PC B connectés au même compte premium ; service cloud joignable. |
| **Étapes** | 1. Sur PC A, créer le mode « Stream ». 2. Laisser la sync s'effectuer. 3. Sur PC B, rafraîchir la bibliothèque. 4. Activer « Stream » sur PC B. |
| **Résultat attendu** | « Stream » apparaît sur PC B et s'exécute. |
| **Critère de réussite** | Mode retrouvé sur B sans re-saisie ; exécution correcte ; test hors-ligne→reconnexion resynchronise sans perte. |

### ST-07 — Télécommande mobile (rôle : Premium)

| Champ | Contenu |
|---|---|
| **ID** | ST-07 |
| **Fonctionnalités** | F-13, F-12, F-02 |
| **Rôle** | Premium |
| **Préconditions** | App mobile installée, connectée au même compte ; desktop cible en ligne. |
| **Étapes** | 1. Sur mobile, lister les modes. 2. Activer « Chill » depuis le téléphone. |
| **Résultat attendu** | Le desktop exécute réellement le mode « Chill » (lumières, audio, apps). |
| **Critère de réussite** | Activation distante réussie ; latence perçue < 5 s ; actions réelles observées sur le desktop. |

### ST-08 — Import d'un mode Marketplace validé (rôle : Premium importe ; Admin a validé)

| Champ | Contenu |
|---|---|
| **ID** | ST-08 |
| **Fonctionnalités** | F-15, F-14, F-02 |
| **Rôle** | Premium (import) + Admin (pré-validation) |
| **Préconditions** | Un mode publié et passé au statut `approved` par l'admin. |
| **Étapes** | 1. Parcourir la Marketplace. 2. Importer le mode `approved`. 3. L'activer. |
| **Résultat attendu** | Le mode apparaît en bibliothèque locale et s'exécute (steps supportés) ou signale les steps incompatibles. |
| **Critère de réussite** | Seuls les `approved` importables ; re-vérification client (allowlist + capacités) ; exécution ou signalement propre. |

### ST-09 — Publication + scoring de risque Marketplace (rôle : Créateur + Admin)

| Champ | Contenu |
|---|---|
| **ID** | ST-09 |
| **Fonctionnalités** | F-14 |
| **Rôle** | Créateur Marketplace + Administrateur |
| **Préconditions** | Compte créateur ; back-office modération accessible (admin). |
| **Étapes** | 1. Le créateur soumet le mode A (actions bénignes). 2. Il soumet le mode B (contenant `system.close_app` sur un process sensible). 3. Il tente de soumettre le mode C (action_type hors allowlist). 4. L'admin consulte la file de modération. |
| **Résultat attendu** | A = score faible (`pending`→`approved`) ; B = score de risque **plus élevé** ; C = **rejeté automatiquement** (hors allowlist). |
| **Critère de réussite** | Scoring différencié cohérent ; rejet auto du hors-allowlist ; statuts visibles/modifiables par l'admin. |

### ST-10 — Génération IA d'un mode (Mode-as-Code) (rôle : Premium)

| Champ | Contenu |
|---|---|
| **ID** | ST-10 |
| **Fonctionnalités** | F-16, F-01, F-02 |
| **Rôle** | Premium |
| **Préconditions** | Service IA cloud joignable ; compte premium. |
| **Étapes** | 1. Saisir « Prépare une session de stream le soir : lumières violettes, Spotify, OBS, volume à 60 % ». 2. Lancer la génération. 3. Inspecter le mode proposé (simulation `validate()`). 4. Activer. |
| **Résultat attendu** | Un mode cohérent est généré (action_types valides), simulé sans exécution, validé (allowlist + capacités), puis activable. |
| **Critère de réussite** | Le mode généré est valide et plausible ; **aucune sortie LLM exécutée sans validation** ; actions réelles à l'activation. |

### ST-11 — Feature-gating Free (limite 3 modes) (rôle : Free)

| Champ | Contenu |
|---|---|
| **ID** | ST-11 |
| **Fonctionnalités** | F-17 |
| **Rôle** | Utilisateur gratuit |
| **Préconditions** | Compte Free avec 3 modes existants. |
| **Étapes** | 1. Tenter de créer un 4ᵉ mode. |
| **Résultat attendu** | Création bloquée avec message d'upsell premium. |
| **Critère de réussite** | Blocage effectif à 3 modes ; l'upgrade premium débloque la création. |

### ST-12 — Offline-first + résilience réseau (rôle : Premium)

| Champ | Contenu |
|---|---|
| **ID** | ST-12 |
| **Fonctionnalités** | F-09, F-12, F-02 |
| **Rôle** | Premium |
| **Préconditions** | App installée ; réseau désactivable. |
| **Étapes** | 1. Couper le réseau. 2. Créer et activer un mode local. 3. Rétablir le réseau. 4. Vérifier la sync. |
| **Résultat attendu** | L'app fonctionne hors-ligne ; à la reconnexion, le mode remonte au cloud. |
| **Critère de réussite** | Aucune perte de données ; sync automatique post-reconnexion ; aucun crash hors-ligne. |

> **Couverture démo jury :** ST-01 → ST-10 couvrent l'intégralité de la §10 du plan technique (cartographie BTP). ST-11 et ST-12 renforcent respectivement le business model (freemium) et la promesse offline-first.

---

## 7. Plan de test bêta utilisateur

### 7.1 Objectif de la campagne

Valider **en conditions réelles** que Nexum tient sa promesse (« sans friction ») auprès de sa cible, recueillir des retours exploitables pour **2 cycles d'itération minimum** (objectif obligatoire EIP), et produire des preuves quantitatives pour le Greenlight.

### 7.2 Recrutement — **minimum 20 bêta-testeurs actifs**

- **Cible :** ≥ 20 testeurs **actifs** (ayant réalisé ≥ 1 activation de mode par semaine sur la durée du test).
- **Répartition par persona** (alignée sur le Brief) :
  - **Gamers** (type Léo) : ~8 testeurs.
  - **Streamers** (type Maxime) : ~5 testeurs.
  - **Télétravailleurs** (type Sarah) : ~7 testeurs.
- **Répartition OS :** ≥ 70 % Windows (OS prioritaire), ≥ 20 % Linux.
- **Diversité matérielle :** au moins 3 testeurs équipés d'un pont Philips Hue réel ; diversité de marques de périphériques (cohérent avec « >50 % des joueurs PC utilisent ≥ 3 marques »).
- **Canaux de recrutement :** communautés Discord gaming/streaming, campus Epitech, réseaux des interviews utilisateurs déjà menées (15-20 interviews), Twitch/YouTube.
- **Surrecrutement :** viser 28-30 inscrits pour garantir ≥ 20 **actifs** (marge d'attrition ~30 %).

### 7.3 Protocole de test

1. **Onboarding (S0)** : formulaire de consentement (RGPD), fiche de configuration matérielle, installation guidée (F-19), attribution d'un accès premium gratuit pour la durée.
2. **Tâches guidées (S1)** : chaque testeur exécute une check-list dérivée des scénarios ST-01 à ST-07 adaptés à son matériel.
3. **Usage libre (S2→S5)** : usage quotidien réel ; création de modes personnels ; automatisations.
4. **Tests thématiques ciblés** : sous-groupe Marketplace (ST-08/09), sous-groupe IA (ST-10).
5. **Collecte continue** : feedback in-app + télémétrie anonymisée (avec consentement).
6. **Points intermédiaires** : 2 sessions de restitution (fin de chaque cycle d'itération).

### 7.4 Durée

- **Durée totale : 6 semaines** (2 cycles d'itération de 3 semaines).
- **Cycle 1 (S1-S3)** → analyse → correctifs → **Cycle 2 (S4-S6)**.
- Fenêtre calendaire : idéalement **février → avril 2027**, entre le rendu BTP (janvier) et le Greenlight blanc (avril), pour que les enseignements nourrissent la répétition générale.

### 7.5 Métriques de succès

| Métrique | Définition | Cible bêta |
|---|---|---|
| **Testeurs actifs** | ≥ 1 activation/semaine sur la durée | ≥ 20 |
| **Taux de complétion des tâches guidées** | Scénarios ST réussis sans aide | ≥ 85 % |
| **Taux de succès d'activation de mode** | Activations sans erreur bloquante / total | ≥ 95 % |
| **Temps de création d'un mode** | Médiane sur ST-01 | < 3 min |
| **Fiabilité des actions réelles** | Steps exécutés OK / total (hors HW absent) | ≥ 98 % |
| **Crash-free sessions** | Sessions sans crash / total | ≥ 99 % |
| **SUS (System Usability Scale)** | Questionnaire standard de fin de test | ≥ 75 / 100 |
| **NPS** | « Recommanderiez-vous Nexum ? » | ≥ +30 |
| **Rétention S1→S6** | Testeurs encore actifs en semaine 6 | ≥ 70 % |
| **Bugs bloquants ouverts en fin de test** | Sévérité « bloquant » non résolus | 0 |
| **Intention de payer** | % prêts à payer ~4,99 €/mois ou 49 € lifetime | ≥ 25 % (signal business) |

### 7.6 Outils de feedback & suivi

- **Feedback in-app** : bouton « Signaler » (capture le mode, le log d'exécution, l'OS).
- **Suivi de bugs** : GitHub Issues (labels sévérité : bloquant / majeur / mineur / cosmétique).
- **Questionnaires** : Google Forms / Typeform (SUS + NPS + intention de payer) en fin de chaque cycle.
- **Télémétrie anonymisée** : compteurs d'activations, taux de succès par action_type, crashs (opt-in RGPD).
- **Canal communautaire** : serveur Discord dédié aux bêta-testeurs (feedback qualitatif, animation).
- **Journal d'itération** : consigne les décisions pivot/consolidation entre les 2 cycles (preuve EIP).

---

## 8. Critères de sortie / Definition of Done de la bêta

La bêta est **validée** (et Nexum « Greenlight-ready ») quand **tous** les critères suivants sont remplis. Ils sont alignés sur les attendus du Greenlight Jury (démo live obligatoire) et sur les blocs RNCP.

### 8.1 DoD fonctionnelle

- [ ] **100 % des fonctionnalités Must (F-01→F-05, F-07, F-09→F-12, F-19) validées et démontrables en live.**
- [ ] **≥ 70 % des fonctionnalités Should validées.**
- [ ] Les 12 scénarios ST-01→ST-12 passent ; **ST-01→ST-10 rejouables en direct** sans vidéo.
- [ ] Le volume Windows (F-04) est **réel** (bug baseline corrigé) — enjeu de crédibilité.
- [ ] L'effet Hue réel (F-07) fonctionne en démo, **avec fallback** documenté (§10).

### 8.2 DoD qualité (Bloc RNCP 5)

- [ ] `nexum-core` couvert par des tests unitaires (Engine, Registry, validation) exécutés en CI.
- [ ] 0 bug **bloquant** ouvert ; ≤ 5 bugs **majeurs** ouverts avec contournement documenté.
- [ ] Crash-free sessions ≥ 99 % sur la campagne.
- [ ] Fiabilité des actions réelles ≥ 98 %.

### 8.3 DoD déploiement (Bloc RNCP 6)

- [ ] Installeurs **Windows + Linux** produits et installables sur machine vierge (F-19).
- [ ] Service cloud **déployé** et joignable (health check) depuis l'app installée.
- [ ] Procédure de démo live répétée au moins une fois de bout en bout.

### 8.4 DoD produit / entrepreneuriat (Bloc RNCP 7 & track)

- [ ] **≥ 20 bêta-testeurs actifs** ayant participé.
- [ ] **2 cycles d'itération** réalisés, avec décisions de pivot/consolidation **argumentées et documentées**.
- [ ] Métriques §7.5 atteintes (SUS ≥ 75, NPS ≥ +30, rétention ≥ 70 %).
- [ ] Signal business : ≥ 25 % d'intention de payer.
- [ ] Business Model Canvas, KPIs et projections financières mis à jour avec les données bêta.

### 8.5 Critère global de Greenlight

> La bêta est **réussie** si l'équipe peut, sur une machine déployée, **rejouer en direct ST-01 à ST-10 devant le jury**, avec 100 % des Must fonctionnels et les métriques utilisateurs atteintes. C'est le seuil de passage du Greenlight Jury de juillet 2027.

---

## 9. Environnements & prérequis de test

### 9.1 Plateformes cibles

| Plateforme | Priorité | Portée bêta |
|---|---|---|
| **Windows 10/11 (x64)** | **Prioritaire** | Toutes les fonctionnalités. OS de référence de la démo jury. |
| **Linux (Ubuntu 22.04+ / distributions récentes)** | Supportée | Toutes les fonctionnalités du core + adapters cross-platform. |
| macOS | Hors-scope bêta | — |

### 9.2 Prérequis logiciels

- **Runtime desktop :** app packagée (Tauri 2) — aucune installation de Rust côté utilisateur final.
- **Linux :** dépendances Tauri + `libdbus` + `pactl`/PipeWire pour l'adapter audio.
- **Steam** installé et connecté pour ST-03.
- **Navigateur par défaut** configuré pour `system.open_url`.
- **Compte Google ou Discord** pour tester l'OAuth (F-11).
- **App mobile** (Android en priorité, build Tauri mobile) pour ST-07.

### 9.3 Prérequis matériels

- **Pont Philips Hue** + ≥ 1 lampe Hue physique sur le réseau local (ST-04, ST-05) — au moins pour la machine de démo jury et 3 testeurs.
- Écran supportant le réglage de luminosité logiciel (F-06, dégradation propre sinon).
- Deux machines liées au même compte pour ST-06 (multi-device).

### 9.4 Environnements de la campagne

| Environnement | Usage |
|---|---|
| **Local (testeur)** | App installée + SQLite local ; usage réel. |
| **Cloud staging** | API axum + PostgreSQL dédiés à la bêta (données isolées de la prod). |
| **Machine de démo jury** | Configuration maîtrisée, matériel Hue présent, réseau contrôlé, comptes de démo pré-remplis, **fallbacks préparés**. |

### 9.5 Jeux de données de test

- Comptes : ≥ 1 Free, ≥ 1 Premium, ≥ 1 Créateur, ≥ 1 Admin.
- Modes de démo pré-remplis : « Focus », « Ranked », « Direct », « Chill », « Stream ».
- Marketplace : ≥ 3 modes `approved`, ≥ 1 `pending`, ≥ 1 `rejected`, pour ST-08/09.

---

## 10. Gestion des risques de test

Risques **spécifiques à la campagne de test et à la démo live** (les risques produit généraux sont couverts au §11 du plan technique).

| ID | Risque | Impact | Prob. | Mitigation | Plan de repli (fallback démo) |
|---|---|---|---|---|---|
| R1 | **Pont Hue indisponible / réseau jury capricieux** (F-07, ST-04/05) | Élevé (effet waouh perdu) | Moyenne | Hotspot dédié maîtrisé ; pont testé la veille ; scène pré-chargée. | Basculer l'adapter Hue en **mode simulé** identifié comme tel ; montrer le step réussir dans le LiveActionsPanel + expliquer l'API officielle. |
| R2 | **API tierce en panne** (Steam, IA cloud) | Moyen | Moyenne | Adapters isolés, `on_error: continue` → le reste du mode marche. | Steam : app_id de secours local ; IA : mode pré-généré mis en cache à rejouer. |
| R3 | **Bug volume Windows non corrigé à temps** (F-04) | Élevé (crédibilité) | Faible-Moy. | Corriger dès la Phase 0, tests CI dédiés Core Audio. | Démontrer d'abord sous Linux + montrer les tests unitaires ; ne jamais présenter un stub non fonctionnel. |
| R4 | **Attrition des bêta-testeurs < 20 actifs** | Élevé (métriques EIP) | Moyenne | Surrecruter (28-30), animation Discord, relances hebdo, accès premium offert. | Prolonger d'1 semaine ; requalifier « actif » avec preuve télémétrie. |
| R5 | **Latence sync / conflits multi-device** (ST-06) | Moyen | Moyenne | Résolution `last-write + priorité`, file de sync robuste, tests offline→online. | Rejouer le scénario sur staging maîtrisé avec 2 machines locales. |
| R6 | **Faux positif de l'IA (mode incohérent)** (ST-10) | Moyen | Moyenne | Pipeline `validate()` + capacités avant activation ; prompts cadrés. | Utiliser un prompt de démo éprouvé ; montrer la simulation qui rejette une sortie invalide (preuve du garde-fou). |
| R7 | **Anti-cheat bloque/soupçonne Nexum** | Élevé (image) | Faible | Uniquement API officielles (`steam://`, SDK), **aucune injection** ; documenté. | Discours cadré : montrer qu'aucun process de jeu n'est touché. |
| R8 | **Perte de données locale (SQLite)** | Élevé | Faible | Tests de persistance/redémarrage (ST-12) ; migrations versionnées. | Sauvegardes des jeux de données de démo. |
| R9 | **Machine de démo défaillante le jour J** | Critique | Faible | Machine de secours identiquement configurée + cloud staging répliqué. | Basculer sur la machine miroir ; comptes/ modes pré-remplis identiques. |
| R10 | **Biais RGPD / consentement manquant** | Moyen (conformité) | Faible | Consentement à l'onboarding, télémétrie opt-in, export/suppression (F-18). | Exclure les données non consenties de l'analyse. |
| R11 | **Retard sur les Should (Marketplace/IA/mobile)** | Moyen | Moyenne | Priorisation MoSCoW stricte ; Must d'abord. | Présenter les Should en l'état ; ne jamais compromettre les Must. |
| R12 | **Fragmentation Linux (distros/audio)** | Moyen | Moyenne | Cibler Ubuntu 22.04+ ; matrice de test CI ; pactl/PipeWire testés. | Démo Linux sur distro de référence maîtrisée. |

---

## 11. Traçabilité fonctionnalités ↔ scénarios ↔ démo jury

| Fonctionnalité | Scénario(s) | Point §10 plan technique | Persona | MoSCoW |
|---|---|---|---|---|
| F-01 Éditeur no-code | ST-01, ST-10 | 1 | Tous | Must |
| F-02 Exécution + feedback | ST-02→ST-08, ST-10, ST-12 | 2 | Tous | Must |
| F-03 System | ST-01, ST-02 | 2 | Sarah | Must |
| F-04 Audio (Win+Linux) | ST-02, ST-05 | 2 | Léo | Must |
| F-05 Gaming Steam | ST-03 | 3 | Léo | Must |
| F-06 Display | (ST-02 étendu) | 2 | Léo | Should |
| F-07 Hue | ST-04, ST-05 | 4 | Maxime/Sarah | Must |
| F-08 Peripherals | (démo extensibilité) | 2 | Léo | Could |
| F-09 SQLite/CRUD | ST-01, ST-06, ST-12 | — | Tous | Must |
| F-10 Automatisation | ST-05 | 5 | Sarah | Must |
| F-11 Auth cloud | ST-06 | — | Tous | Must |
| F-12 Sync multi-device | ST-06, ST-07, ST-12 | 6 | Maxime | Must |
| F-13 Télécommande mobile | ST-07 | 7 | Maxime | Should |
| F-14 Marketplace publication/score | ST-09 | 8 | Créateur/Admin | Should |
| F-15 Marketplace import | ST-08 | 8 | Premium | Should |
| F-16 IA Mode-as-Code | ST-10 | 9 | Premium | Should |
| F-17 Feature-gating | ST-11 | — | Free | Should |
| F-18 RGPD | (onboarding campagne) | — | Tous | Should |
| F-19 Packaging/déploiement | Prérequis ST-* | — | Tous | Must |

> **Lecture jury :** toutes les cases « point §10 » de 1 à 9 sont couvertes par un scénario live. La démo jury enchaîne ST-01 → ST-10 comme un parcours narratif (créer → activer → jeu → lumière → automatiser → sync → mobile → importer → IA).

---

## 12. Annexes

### 12.1 Rappel du modèle DSL (extrait, source de vérité)

```jsonc
{
  "id": "uuid",
  "name": "Ranked",
  "category": "gaming",
  "steps": [
    { "order": 1, "type": "audio.set_volume",      "params": { "percent": 70 },  "on_error": "continue" },
    { "order": 2, "type": "display.set_brightness", "params": { "percent": 100 }, "on_error": "continue" },
    { "order": 3, "type": "gaming.launch_steam",    "params": { "app_id": "1030300" }, "on_error": "abort" },
    { "order": 4, "type": "iot.hue.activate_scene", "params": { "scene": "Purple Night" }, "on_error": "continue" },
    { "order": 5, "type": "system.close_app",       "params": { "name": "Slack" }, "on_error": "continue" }
  ]
}
```

### 12.2 Catalogue d'action_types V1 (allowlist de référence)

| Namespace | Actions | Adapter | Statut cible bêta |
|---|---|---|---|
| `system.*` | `launch_app`, `close_app`, `open_url`, `run_preset` | System | ✅ Réel |
| `audio.*` | `set_volume`, `set_default_device`, `mute` | Audio | ✅ Réel (Win+Linux) |
| `display.*` | `set_brightness`, `set_refresh_rate`, `set_resolution` | Display | 🎯 Partiel |
| `gaming.*` | `launch_steam`, `launch_epic`, `launch_gog`, `start_game` | Gaming | ✅ Steam réel |
| `iot.hue.*` | `activate_scene`, `set_color`, `set_on` | IoT/Hue | ✅ Réel |
| `peripheral.*` | `apply_rgb_profile`, `set_dpi` | Peripherals | 🔸 Mocké |

### 12.3 Glossaire

- **Mode** : séquence ordonnée d'ActionStep déclaratifs (données, jamais du code).
- **Action / ActionStep** : opération typée (`type` + `params` + `on_error`).
- **Adapter** : implémentation d'un ou plusieurs `action_types` pour une plateforme/marque.
- **Engine** : orchestrateur event-driven (load · validate · schedule · execute).
- **Capability Checker** : vérifie la disponibilité HW/API avant exécution.
- **Allowlist** : liste fermée des `action_types` autorisés (fondement de la Marketplace sûre).
- **DoD** : Definition of Done (§8).
- **MoSCoW** : Must / Should / Could (/ Won't).
- **SUS / NPS** : System Usability Scale / Net Promoter Score.

### 12.4 Références

- `docs/eip/_BRIEF_PROJET.md` — référence factuelle partagée (personas, marché, dates, modèle éco).
- `NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md` — architecture, roadmap, cartographie BTP (§10), risques (§11).
- `README.md` — statut réel des adapters (baseline).
- `docs/GRAPHES_ARCHITECTURE_BDD.md` — modèle ER (USERS, MODES, MODE_ACTIONS, AUTOMATION_RULES, MODE_EXECUTIONS, SHARED_MODES, MODE_RATINGS, DEVICES).

---

> **Statut du document :** BTP v1, prêt pour revue équipe + référent EIP. Rendu cible : **janvier 2027**. Ce document sera figé après validation et servira de référence d'évaluation au Greenlight Jury de juillet 2027.
