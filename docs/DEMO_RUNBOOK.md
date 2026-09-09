# Runbook de démonstration live — Greenlight Jury (juillet 2027)

> **Document opérationnel de l'équipe Nexum pour la démo LIVE du projet déployé.**
> Projet : **Nexum** — EIP Epitech, PROMO 2028. Intra : eip.epitech.eu/project/1035.
> Contexte : **Greenlight Jury + Jury RNCP, juillet 2027, présentiel (Kremlin-Bicêtre / Paris).**
> **Démo LIVE du projet déployé obligatoire — aucune vidéo autorisée.**
>
> Langue : français. Dernière mise à jour : 2026-07-13.
> Sources de vérité : `docs/eip/_BRIEF_PROJET.md`, `docs/eip/BTP_BETA_TEST_PLAN.md`,
> `docs/rncp/QA_TEST_STRATEGY.md`, `docs/rncp/DEPLOYMENT_CICD.md`, `docs/rncp/RISK_REGISTER.md`.

---

## 0. Principe directeur

> **Une action qui échoue devant le jury est un échec produit.** Ce runbook existe pour qu'**aucune
> surprise** ne survienne : tout est répété, tout a un plan B, et la démo est jouée sur un **produit
> réellement déployé** (installeurs signés + cloud managé), pas sur un `localhost`.

Deux garde-fous structurels hérités de l'architecture :

- **Offline-first (SQLite local)** : le cœur produit fonctionne **sans réseau**. Une panne réseau au
  jury ne casse jamais la création, l'activation d'un mode et les actions système/Hue locales.
- **Adapters isolés + `on_error`** : si une dépendance (Steam, Hue, IA cloud) tombe, le reste du mode
  s'exécute ; chaque step affiche son état réel dans le LiveActionsPanel.

Le fil narratif suit le parcours BTP **ST-01 → ST-10** : *créer → activer → IA → automatiser → synchroniser → contrôler la lumière → partager*.

---

## 1. Checklist de préparation matérielle

### 1.1 Machines

| # | Élément | Détail | Vérifié |
|---|---|---|:--:|
| M1 | **PC A — Windows 10/11 (x64)** | Machine principale de démo (OS prioritaire). Nexum installé via **installeur signé** (canal `stable`). Volume système à 100 % au départ. | ☐ |
| M2 | **PC B — Linux (Ubuntu 22.04+)** | Deuxième machine liée **au même compte premium** que PC A, pour la sync multi-device (ST-06). Nexum installé via AppImage/`.deb`. | ☐ |
| M3 | **PC de secours (miroir de PC A)** | Windows, configuration **identique** à PC A (mêmes comptes, mêmes modes, même installeur). Éteint mais prêt (R09/R17). | ☐ |
| M4 | **Téléphone (Android)** | App mobile Tauri (télécommande) connectée au même compte premium, pour ST-07. | ☐ |
| M5 | **Adaptateurs & câbles** | HDMI/USB-C vers le vidéoprojecteur du jury + adaptateur de secours ; chargeurs de chaque machine ; multiprise. | ☐ |

### 1.2 Objet connecté (effet « waouh »)

| # | Élément | Détail | Vérifié |
|---|---|---|:--:|
| H1 | **Pont Philips Hue** | Alimenté, appairé, **sur le même réseau** que PC A (voir §1.3). Testé la veille (R1). | ☐ |
| H2 | **≥ 1 lampe Hue physique** | Allumable, visible du jury, placée pour un contraste net (idéalement 2 lampes). | ☐ |
| H3 | **Scènes Hue pré-créées** | `Purple Night` (stream), lumière tamisée « Chill », lumière vive « Ranked » — pré-chargées dans le pont. | ☐ |
| H4 | **Lampe de secours + piles/alim** | 2ᵉ lampe Hue en réserve + bloc d'alimentation de rechange. | ☐ |

### 1.3 Connexion réseau

| # | Élément | Détail | Vérifié |
|---|---|---|:--:|
| N1 | **Hotspot 4G/5G dédié et maîtrisé** | Réseau **contrôlé par l'équipe** (ne pas dépendre du Wi-Fi du campus). PC A, PC B, pont Hue et téléphone connectés dessus. | ☐ |
| N2 | **Hotspot de secours** | 2ᵉ partage de connexion (autre opérateur / 2ᵉ téléphone) en cas de zone morte (R17). | ☐ |
| N3 | **Forfait data vérifié** | Data restante suffisante, itinérance/économiseur désactivés. | ☐ |
| N4 | **Réseau local Hue** | Pont et PC A **sur le même sous-réseau** (le hotspot doit autoriser le trafic local / mDNS). Testé la veille. | ☐ |

### 1.4 Cloud déployé

| # | Élément | Détail | Vérifié |
|---|---|---|:--:|
| C1 | **Service `nexum-cloud` en prod** | Conteneur Docker déployé sur hébergeur managé (Fly.io/Railway), région **UE** (RGPD). | ☐ |
| C2 | **Health check vert** | `GET /health` répond OK ; dashboard uptime (UptimeRobot/Better Stack) au vert, ouvert dans un onglet. | ☐ |
| C3 | **PostgreSQL managé** | Base prod joignable, migrations appliquées, backup récent vérifié. | ☐ |
| C4 | **Smoke test sync** | Un scénario de sync minimal PC A ↔ cloud réussi la veille. | ☐ |

### 1.5 Comptes de démonstration

| Compte | Rôle | Usage démo | Vérifié |
|---|---|---|:--:|
| `demo-free@nexum` | **Free** | ST-01 (création), feature-gating (limite 3 modes). | ☐ |
| `demo-premium@nexum` | **Premium** | Cœur de démo : sync, IA, automatisation, mobile. Connecté sur PC A **et** PC B. | ☐ |
| `demo-creator@nexum` | **Créateur Marketplace** | Publication d'un mode (ST-09). | ☐ |
| `demo-admin@nexum` | **Admin / modérateur** | File de modération, scores de risque (back-office). | ☐ |

> Mots de passe consignés hors-ligne (gestionnaire de secrets de l'équipe), **connexions déjà
> ouvertes** sur PC A/PC B avant l'entrée du jury pour éviter toute latence OAuth.

### 1.6 Jeux de données de démo (pré-remplis)

| # | Donnée | Détail | Vérifié |
|---|---|---|:--:|
| D1 | **Modes pré-créés** | « Focus », « Ranked », « Direct », « Chill », « Stream » présents et fonctionnels. | ☐ |
| D2 | **Règle d'automatisation** | `time >= HH:MM → Chill` prête, heure ajustable à T+1 min pour la démo (ST-05). | ☐ |
| D3 | **Marketplace** | ≥ 3 modes `approved`, ≥ 1 `pending`, ≥ 1 `rejected` ; 1 mode `close_app` sensible pour montrer le score de risque élevé. | ☐ |
| D4 | **App externes** | Slack **ouvert** au départ (pour le voir se fermer), Spotify installé, Steam connecté avec un jeu au `app_id` connu. | ☐ |
| D5 | **Prompt IA éprouvé** | Phrase de génération testée et validée (§4, scène 3) + **mode pré-généré en cache** comme filet. | ☐ |

### 1.7 Poste de présentation

| # | Élément | Vérifié |
|---|---|:--:|
| P1 | Résolution/scaling écran adaptés au vidéoprojecteur (police lisible du fond de salle). | ☐ |
| P2 | Notifications OS/Slack/Discord **coupées** (mode « ne pas déranger ») sauf celles à démontrer. | ☐ |
| P3 | Luminosité écran max, veille/mise en veille désactivées, mises à jour OS **gelées**. | ☐ |
| P4 | Curseur agrandi + zoom disponible pour montrer le LiveActionsPanel. | ☐ |
| P5 | Chronomètre visible du **Gardien du temps** (§5). | ☐ |

---

## 2. Matériel de secours (récapitulatif)

| Catégorie | Primaire | Secours |
|---|---|---|
| Machine de démo | PC A (Windows) | **PC de secours miroir** (M3), config identique |
| Sync multi-device | PC B (Linux) | 2ᵉ machine locale sur staging maîtrisé (R5) |
| Réseau | Hotspot dédié (N1) | 2ᵉ hotspot autre opérateur (N2) |
| Éclairage | Lampe Hue #1 (H2) | Lampe Hue #2 + alim de rechange (H4) |
| Câblage vidéo | Adaptateur principal | Adaptateur de rechange + câble HDMI long (M5) |
| Alimentation | Chargeurs individuels | Multiprise + batterie externe (téléphone) |
| Comptes/données | Cloud prod | Jeux de données répliqués sur staging + export local SQLite |
| IA Mode-as-Code | Génération live via cloud | **Mode pré-généré en cache** (D5) |

> **Règle d'or :** tout ce qui est branché sur le réseau a un jumeau hors-ligne. On ne présente
> **jamais** un stub non fonctionnel : en dégradé, on bascule sur un **mock explicitement identifié
> comme tel** + explication de l'API officielle.

---

## 3. Plans B — un repli pour chaque risque

> Repris et étendu du BTP §10 et du `RISK_REGISTER.md`. Chaque plan B est **répété au moins une fois**
> avant le jour J. Le **Pilote démo** annonce toujours la bascule à voix haute (« je passe en repli X »)
> pour que le jury voie la maîtrise, pas la panne.

| Risque | Symptôme au jury | Plan B immédiat | Réf. |
|---|---|---|---|
| **Pas de réseau du tout** | Cloud injoignable, sync KO. | **Rester en offline-first** : créer/activer des modes en local, actions système + Hue **local** continuent de marcher (même réseau local via hotspot dédié). Reporter les scènes cloud (sync, IA, Marketplace) et y revenir dès reconnexion via le 2ᵉ hotspot. | R17, DEPLOYMENT §1 |
| **Réseau Hue capricieux / pont introuvable** | La lampe ne réagit pas ; `is_available` échoue. | Basculer l'adapter Hue en **mode simulé identifié** : montrer le step réussir dans le LiveActionsPanel, expliquer l'appel à l'**API Hue officielle**, puis reprendre la lampe réelle dès que le pont répond (2ᵉ lampe H4 en dernier recours). | R1, BTP R1, ST-04 |
| **API Steam down / jeu absent** | `gaming.launch_steam` échoue. | `on_error: continue` → le reste du mode s'exécute normalement. Utiliser un **app_id de secours local** ; sinon montrer l'échec **propre** (pas de crash) comme preuve de robustesse. | R01/R02, ST-03 |
| **IA cloud down / génération incohérente** | Pas de mode généré, ou mode farfelu. | Rejouer le **prompt de démo éprouvé** (D5) ; si le service ne répond pas, présenter le **mode pré-généré en cache** et **montrer la simulation `validate()`** qui prouve le garde-fou (aucune sortie LLM exécutée sans validation). | R18, BTP R6, ST-10 |
| **Bug volume Windows non fiable** | Le volume ne change pas sur PC A. | Démontrer d'abord le volume **sous Linux (PC B)** + **montrer les tests unitaires** `nexum-core`/Core Audio en CI ; ne jamais présenter un stub. | R08, BTP R3, QA §6.2 |
| **Latence / conflit de sync multi-device** | « Stream » n'apparaît pas sur PC B. | Forcer un refresh ; si échec, rejouer la sync sur **staging maîtrisé** avec 2 machines locales ; expliquer la politique `last-write + priorité`. | R05, BTP R5, ST-06 |
| **Latence télécommande mobile > 5 s** | L'activation depuis le téléphone tarde. | Réexpliquer le trajet mobile → cloud → desktop ; à défaut, déclencher le même mode depuis PC A pour prouver l'action réelle, puis réessayer le mobile. | ST-07 |
| **Machine de démo défaillante (crash/boot)** | PC A ne démarre pas / plante. | Bascule sur le **PC de secours miroir** (M3) : comptes et modes identiques, aucune reconfiguration. | R17, BTP R9 |
| **Vidéoprojecteur / câble HS** | Pas d'image. | Adaptateur de rechange (M5) ; à défaut, présenter sur l'écran du portable rapproché du jury. | — |
| **Anti-cheat / question de conformité** | Le jury interroge le risque triche. | Discours cadré : **aucune injection**, uniquement API officielles (`steam://`, SDK) ; montrer qu'aucun process de jeu n'est touché. | R04, BTP R7 |
| **RGPD questionné** | Question sur les données. | Montrer consentement à l'inscription + export/suppression (F-18) + hébergement UE ; renvoyer à `SECURITY_RGPD.md`. | R13, F-18 |

---

## 4. Déroulé minute par minute (~11 min)

> Cible : **10-12 min** de démo, laissant du temps pour les questions dans le créneau d'1 h.
> Convention : **[PILOTE]** = ce que fait l'opérateur clavier ; **[NARRATEUR]** = ce que dit le
> présentateur ; **✅ preuve visible** = ce que le jury doit constater ; **⚠️ si problème** = plan B (§3).
> Chaque scène référence les scénarios BTP (`ST-xx`) et les fonctionnalités (`F-xx`).

### Scène 0 — Ouverture : « le produit est déployé » (0:00 → 0:45)

- **[NARRATEUR]** Pitch en une phrase : « Nexum : jouer, streamer ou chiller sans friction. »
  Annonce du fil : créer → activer → IA → automatiser → synchroniser → lumière → partager.
- **[PILOTE]** Montre PC A avec Nexum **installé** (installeur signé, pas un `dev`) + l'onglet
  navigateur **dashboard uptime / `GET /health` vert** du cloud prod.
- **✅ preuve visible :** app installée + service cloud vivant et supervisé (pas un localhost).
- **Réf. :** F-19 · Bloc 6.

### Scène 1 — Création no-code d'un mode (0:45 → 2:15)

- **[PILOTE]** Sur `demo-free`, ouvre l'éditeur, crée le mode **« Focus »** : ajoute 3 steps depuis le
  catalogue (`audio.set_volume` 30 %, `system.close_app` Slack, `system.open_url` docs), réordonne
  (volume en premier), sauvegarde. **Aucune ligne de code.**
- **[NARRATEUR]** « Un mode = des données déclaratives, jamais du code : c'est ce qui rend Nexum
  no-code, sûr et pilotable par IA. »
- **✅ preuve visible :** mode créé en < 3 min, steps ordonnés, catalogue limité à l'allowlist.
- **Réf. :** ST-01 · F-01, F-09 · Bloc 5 (allowlist).

### Scène 2 — Activation avec actions réelles + lumière Hue (2:15 → 4:15)

- **[PILOTE]** Passe sur `demo-premium`, active le mode **« Direct »** (contient `audio.set_volume`,
  `system.close_app` Slack, `iot.hue.activate_scene` = *Purple Night*).
- **✅ preuve visible :**
  - le **volume système change réellement** (montrer le mixeur OS) ;
  - **Slack se ferme** sous les yeux du jury ;
  - **la lampe Hue passe physiquement en violet** (< 2 s) — **l'effet « waouh »** ;
  - chaque step affiche **succès/échec en temps réel** (LiveActionsPanel), pas une liste statique.
- **[NARRATEUR]** « Tout ce que vous voyez est réel et se produit sur la machine et dans la pièce. »
- **⚠️ si problème :** Hue → mode simulé identifié (§3) ; volume Windows → basculer démonstration Linux.
- **Réf. :** ST-02 + ST-04 · F-02, F-03, F-04, F-07 · Blocs 5/6.

### Scène 3 — Génération IA d'un mode (Mode-as-Code) (4:15 → 6:00)

- **[PILOTE]** Saisit le **prompt éprouvé** (D5) : « Prépare une session de stream le soir : lumières
  violettes, Spotify, OBS, volume à 60 %. » Lance la génération.
- **[PILOTE]** Ouvre la **simulation `validate()`** : le mode généré (JSON DSL) est inspecté, validé
  contre l'**allowlist + capacités**, **avant** toute exécution. Puis active le mode.
- **[NARRATEUR]** « Le LLM ne génère **jamais** de code : il produit de la donnée déclarative validée.
  C'est le garde-fou de sécurité de Nexum. »
- **✅ preuve visible :** mode cohérent généré, simulation qui garantit qu'aucune sortie non validée
  n'est exécutée, puis actions réelles à l'activation.
- **⚠️ si problème :** mode pré-généré en cache + montrer la simulation qui **rejette** une sortie invalide.
- **Réf. :** ST-10 · F-16, F-01, F-02 · différenciateur EIP.

### Scène 4 — Automatisation horaire « Chill à 18h » (6:00 → 7:30)

- **[PILOTE]** Montre la règle `time >= HH:MM → Chill` (persona Sarah), règle l'heure déclencheur à
  **T+1 min**, puis laisse le temps s'écouler (enchaîner avec la scène 5 pendant l'attente).
- **✅ preuve visible :** à l'heure atteinte, le mode **« Chill » s'active seul** (lumière Hue tamisée,
  volume ↓, Slack fermé, Spotify lancé) — **sans aucune intervention** ; déclenchement journalisé.
- **[NARRATEUR]** « L'automatisation contextuelle : le setup se prépare tout seul. »
- **⚠️ si problème :** si le trigger ne part pas, activer « Chill » manuellement pour prouver l'action,
  puis rejouer la règle.
- **Réf. :** ST-05 · F-10 (+ F-02/03/04/07) · Bloc 5.

### Scène 5 — Sync multi-device + télécommande mobile (7:30 → 9:15)

- **[PILOTE PC A]** Crée/modifie le mode **« Stream »** sur PC A (Windows), laisse la sync monter au cloud.
- **[OPS PC B]** Sur **PC B (Linux)**, rafraîchit la bibliothèque : **« Stream » apparaît** et s'exécute.
- **[PILOTE MOBILE]** Depuis le **téléphone**, active « Chill » à distance : le **desktop exécute
  réellement** le mode (lumière, audio, apps).
- **✅ preuve visible :** un mode créé sur A se retrouve sur B (même compte, cross-OS) ; activation
  distante mobile → action réelle sur desktop (< 5 s).
- **[NARRATEUR]** « Vos modes vous suivent partout : Windows, Linux, mobile — même compte. »
- **⚠️ si problème :** sync → staging maîtrisé (§3) ; mobile → déclencher depuis PC A puis réessayer.
- **Réf. :** ST-06 + ST-07 · F-11, F-12, F-13 · Bloc 6.

### Scène 6 — Marketplace : publication, score de risque, import (9:15 → 10:30)

- **[PILOTE créateur]** Avec `demo-creator`, soumet un mode. Montre le back-office `demo-admin` :
  file de modération `pending/approved/rejected`, **score de risque** (mode avec `system.close_app`
  sur process sensible = score plus élevé), rejet **automatique** d'un `action_type` hors allowlist.
- **[PILOTE premium]** Importe un mode `approved` : il apparaît en bibliothèque locale, **re-vérifié
  côté client** (allowlist + capacités) avant activation, puis s'exécute.
- **[NARRATEUR]** « Une Marketplace **sûre par conception** : que de la donnée validée, jamais du code. »
- **✅ preuve visible :** scoring différencié, rejet auto du hors-allowlist, import fonctionnel.
- **Réf. :** ST-08 + ST-09 · F-14, F-15 · Blocs 5/6.

### Scène 7 — Clôture (10:30 → 11:00)

- **[NARRATEUR]** Récapitulatif : « Vous avez vu, **en direct et sur un produit déployé**, les
  7 promesses : no-code, actions réelles, IA garde-fou, automatisation, sync multi-device, IoT réel,
  Marketplace sûre. » Transition vers les questions et les preuves RNCP (blocs 5/6/7).
- **[PILOTE]** Laisse à l'écran le LiveActionsPanel + le dashboard uptime (preuve de déploiement vivant).

### 4.1 Table de marche condensée

| Temps | Scène | ST / F | Effet clé |
|---|---|---|---|
| 0:00–0:45 | Ouverture (déployé + cloud vert) | F-19 | Produit installé + cloud supervisé |
| 0:45–2:15 | Création no-code « Focus » | ST-01 / F-01 | Mode en < 3 min, sans code |
| 2:15–4:15 | Activation réelle + Hue | ST-02+04 / F-02,03,04,07 | Volume, Slack, **lampe violette** |
| 4:15–6:00 | Génération IA | ST-10 / F-16 | JSON validé avant exécution |
| 6:00–7:30 | Automatisation 18h | ST-05 / F-10 | Mode qui s'active seul |
| 7:30–9:15 | Sync + mobile | ST-06+07 / F-11,12,13 | Cross-OS + télécommande |
| 9:15–10:30 | Marketplace | ST-08+09 / F-14,15 | Score de risque + import sûr |
| 10:30–11:00 | Clôture | — | Récap + questions |

---

## 5. Rôles de l'équipe pendant la démo

> Aligné sur `PROJECT_MANAGEMENT.md` (§3, RACI). Équipe supposée de 5-6 personnes. ⚠️ *Nommer chaque
> titulaire réel avant le J-1.* Un même membre peut cumuler deux rôles si l'équipe est plus réduite.

| Rôle démo | Titulaire | Responsabilité pendant la démo |
|---|---|---|
| **Pilote démo** (clavier PC A) | ⚠️ *à nommer* (Lead Frontend/UX) | Exécute le scénario sur PC A ; annonce chaque bascule de plan B à voix haute. |
| **Narrateur / Pitch** | ⚠️ *à nommer* (Chef de projet ou Réf. Entrepreneuriat) | Porte le discours, fait le lien avec la valeur produit et les blocs RNCP ; gère les questions. |
| **Ops Cloud & PC B** | ⚠️ *à nommer* (Lead Cloud/DevOps) | Surveille `/health` + uptime ; opère PC B (sync) ; prêt à basculer sur staging. |
| **Opérateur secours / réseau** | ⚠️ *à nommer* (Lead Technique) | Gère hotspot + pont Hue ; déclenche les mocks/replis ; tient le PC de secours prêt. |
| **Pilote mobile** | ⚠️ *à nommer* | Opère la télécommande (ST-07) ; peut être cumulé avec Ops Cloud. |
| **Gardien du temps** | ⚠️ *à nommer* (Réf. QA) | Chronomètre, signale les dépassements, garantit la fin à ~11 min. |

**Règle de communication :** un seul narrateur parle à la fois ; les bascules techniques passent par des
signaux discrets convenus (ex. main levée = « je prends le relais en secours »).

---

## 6. Check final J-1 (répétition générale)

> À faire **la veille**, dans des conditions au plus proche du réel (une répétition générale a déjà eu
> lieu au Greenlight blanc d'avril 2027, cf. DEPLOYMENT §11).

- [ ] **Répétition complète de bout en bout** (scènes 0 → 7) chronométrée < 12 min.
- [ ] **Chaque plan B répété au moins une fois** (couper le réseau, débrancher le pont Hue, forcer un
      échec Steam, jouer le mode IA en cache).
- [ ] Cloud **prod** déployé, `GET /health` vert, dashboard uptime opérationnel, **backup DB** vérifié.
- [ ] Smoke test **sync PC A ↔ PC B** réussi ; télécommande **mobile** testée.
- [ ] **Pont Hue** appairé, scènes chargées, latence < 2 s vérifiée sur le **réseau du jour** (hotspot).
- [ ] **Volume Windows** (PC A) confirmé réel ; sinon plan Linux + tests CI prêts à montrer.
- [ ] Les **4 comptes** de démo connectés/testés ; **modes pré-remplis** présents ; Marketplace peuplée
      (`approved`/`pending`/`rejected` + mode à score élevé).
- [ ] **Prompt IA éprouvé** validé + **mode pré-généré en cache** enregistré.
- [ ] **Installeurs signés** installés sur PC A **et** PC de secours miroir (mêmes données).
- [ ] Matériel de secours (§2) testé : 2ᵉ hotspot, 2ᵉ lampe, adaptateur vidéo de rechange.
- [ ] Notifications coupées, veille désactivée, mises à jour OS gelées sur PC A et PC de secours.
- [ ] Batteries **toutes chargées** (PC A, PC B, secours, téléphone) + multiprise dans le sac.
- [ ] Rôles attribués et **noms figés** (§5) ; ordre de passage relu par toute l'équipe.

---

## 7. Check J-0 (jour J, 30-45 min avant le passage)

- [ ] Arrivée en **avance** ; repérage salle, prise électrique, position des lampes visible du jury.
- [ ] **Vidéoprojecteur** testé avec l'adaptateur principal (image + lisibilité fond de salle) ; secours prêt.
- [ ] **Hotspot dédié** activé, PC A / PC B / pont Hue / téléphone **connectés** ; `/health` vert re-vérifié.
- [ ] **Pont Hue** répond (test d'une scène) sur le réseau du jour ; lampe(s) allumée(s).
- [ ] **Comptes connectés** d'avance (Free, Premium sur A et B, Créateur, Admin) ; sessions OAuth valides.
- [ ] État initial **remis à zéro** : Slack ouvert, volume à 100 %, modes de démo présents, règle
      horaire pré-réglée (heure à ajuster juste avant la scène 4).
- [ ] **PC de secours** allumé en veille, sur le réseau, prêt à prendre le relais.
- [ ] Notifications coupées (mode « ne pas déranger ») ; luminosité écran max ; chrono du Gardien prêt.
- [ ] Téléphone (télécommande) **déverrouillé et connecté** ; app mobile ouverte sur la liste des modes.
- [ ] Dernier **run à blanc silencieux** de la scène 2 (activation + Hue) hors regard du jury si possible.
- [ ] Eau + notes du narrateur + ce runbook (papier ou 2ᵉ écran) à portée.

---

## 8. Références

- `docs/eip/BTP_BETA_TEST_PLAN.md` — scénarios ST-01→ST-12, fonctionnalités F-01→F-19, risques §10.
- `docs/rncp/QA_TEST_STRATEGY.md` — preuves qualité (tests, CI, sévérités) mobilisées dans les plans B.
- `docs/rncp/DEPLOYMENT_CICD.md` — déploiement prod, health check, environnements, monitoring.
- `docs/rncp/RISK_REGISTER.md` — R01, R04, R05, R08, R09, R13, R17, R18 (adossés aux plans B).
- `docs/eip/_BRIEF_PROJET.md` — personas, dates, positionnement, exigence démo live.
- `docs/rncp/SECURITY_RGPD.md` — réponses conformité (consentement, export, suppression, UE).

---

> **Statut :** runbook v1, à figer après la répétition générale du Greenlight blanc (avril 2027) et à
> réviser au J-1 de juillet 2027. **Aucune vidéo : tout se joue en direct, tout a un plan B.**
