# Business Model Canvas — Nexum

> Document EIP (piste **Entrepreneuriat**) — projet **Nexum**, PROMO 2028, campus Marseille.
> Source de vérité : `docs/eip/_BRIEF_PROJET.md`. Langue : français.
> **Convention de sourçage (mise à jour du 2026-11-05)** : chaque chiffre porte une référence **[E]** (enquête Nexum, n = 14) ou **[P#]** (source publique, voir § Sources en fin de document). Les valeurs qui ne peuvent pas encore être sourcées sont notées « **Non validé** » avec la raison. Aucune valeur n'est inventée.
> Dernière mise à jour : 2026-11-05.

---

## Lecture de l'enquête [E] — à garder en tête

**[E]** = formulaire « Nexum — Ton avis compte » (version française, 12 réponses) + « Nexum — Help us build it » (version anglaise, 2 réponses), soit **14 réponses** recueillies du 31/10 au 05/11/2026. Les réponses anglaises ont été traduites vers les libellés français et fusionnées.

- **Échantillon très petit (n = 14)** : les résultats sont des **signaux qualitatifs**, pas des mesures statistiquement représentatives. Chaque réponse pèse 7 points de pourcentage. Les chiffres sont toujours donnés « x/14 » (ou « x/n » quand une question n'a eu que n réponses).
- **Profil** : 11/14 ont 18–24 ans, 2/14 25–34 ans, 1/14 35 ans et plus ; 10/14 utilisent surtout l'ordinateur pour travailler/étudier, 3/14 « un peu tout », **1/14 pour jouer** ; **0 streamer** (les questions « stream » n'ont aucune réponse) ; **13/14 sont sur iPhone** ; OS : Windows 6, macOS 5, Linux 2, plusieurs 1.
- **Le cœur gamer/streamer du positionnement n'est donc pas couvert** : seuls 3 répondants ont rempli la section « jeu ». Aucun répondant B2B.

---

## Rappel du positionnement

**Nexum** est une application universelle, **no-code** et **agnostique** qui synchronise en un clic tout l'environnement numérique (logiciels, système, périphériques, objets connectés) selon l'activité, via des « **modes** ».

> *« Nexum : jouer, streamer ou chiller sans friction. »*

Le Business Model Canvas ci-dessous décrit **comment Nexum crée, délivre et capte de la valeur**. Il s'articule autour d'un moteur central : un mode = de la **donnée déclarative** (DSL JSON), jamais du code — ce qui rend possible à la fois le no-code, la Marketplace sécurisée et l'IA Mode-as-Code.

---

## Vue synthétique (9 blocs)

| Bloc | Contenu clé |
|---|---|
| **1. Partenaires clés** | Fabricants HW/IoT (Philips Hue, SteelSeries, Logitech, Corsair), plateformes de jeu (Steam/Epic/GOG), fournisseurs cloud (AWS/Azure), fournisseur LLM, créateurs de presets, salles e-sport, écosystème Epitech. |
| **2. Activités clés** | R&D connecteurs (Adapters) + moteur, IA Mode-as-Code, modération Marketplace, sécurité/conformité (anti-cheat, RGPD), acquisition & communauté. |
| **3. Ressources clés** | Équipe Rust/TS, le DSL Mode/Action (IP cœur), infra cloud, la communauté & sa bibliothèque de modes, la marque. |
| **4. Proposition de valeur** | Interopérabilité, no-code, performance (Rust/Tauri), personnalisation IA, sécurité — un clic pour tout synchroniser. |
| **5. Relation client** | Self-service freemium, communauté, support Premium, onboarding par personas, comptes B2B dédiés. |
| **6. Canaux** | Site + téléchargement direct, Twitch/YouTube/TikTok, Marketplace virale, bouche-à-oreille influenceurs, vente directe B2B. |
| **7. Segments clients** | Gamers compétitifs, streamers, télétravailleurs ; B2B : salles e-sport & entreprises. |
| **8. Structure de coûts** | Salaires/R&D, infra cloud, IA (tokens LLM), marketing/acquisition, sécurité & conformité, support. |
| **9. Flux de revenus** | Freemium → Premium 4,99 €/mois, Lifetime 49 €, commission Marketplace (benchmark 12–30 %), licences B2B (benchmark 2–7 $/poste/mois). |

---

## 1. Partenaires clés (Key Partners)

| Partenaire | Rôle / apport |
|---|---|
| Fabricants de périphériques & IoT (Philips Hue, SteelSeries, Logitech, Corsair) | Accès aux **SDK / API officiels** → intégrations stables et compatibles anti-cheat. |
| Plateformes de jeu (Steam, Epic, GOG) | Lancement de jeux via protocoles officiels (`steam://`). |
| Fournisseurs cloud (AWS / Azure) | Hébergement de l'API axum, PostgreSQL, sync, Marketplace. |
| Fournisseur de LLM (API IA) | Moteur de génération Mode-as-Code (langage naturel → DSL). |
| Créateurs de presets / influenceurs gaming | Alimentent la Marketplace, moteur de viralité. |
| Salles e-sport & entreprises (B2B) | Clients-partenaires de déploiement volume. |
| Écosystème Epitech / mentors EIP | Accompagnement, réseau, crédibilité. |

**Narratif.** Le modèle agnostique de Nexum n'existe que parce qu'il s'appuie sur les **protocoles officiels** des fabricants (SDK Hue, SteelSeries, etc.) plutôt que sur du reverse-engineering : c'est le fondement de la stabilité et de la compatibilité anti-cheat mise en avant dans la proposition de valeur. Les partenaires cloud et LLM sont des dépendances opérationnelles ; les créateurs de la communauté sont, eux, des **partenaires de croissance** (effet Marketplace).

**Données d'enquête [E].**
- Équipement déjà utilisé avec un logiciel constructeur : **clavier/souris 9/14**, **casque/enceintes 8/14**, lumières connectées 1/14, Home Assistant 1/14 ; **11/14** en utilisent au moins un, **6/14** au moins deux catégories.
- Intégrations demandées en priorité (5 choix max) : **Teams 10/14, Gmail 9/14, Discord 8/14**, Outlook 7/14, Zoom/Meet 6/14, Spotify 3/14 ; Steam/Epic 2/14, Home Assistant 2/14, Philips Hue 1/14, Govee/Nanoleaf 1/14.
- ➜ Les premiers « partenaires » demandés sont des **services de messagerie/visio**, avant les fabricants matériels (échantillon peu gamer, voir encadré en tête).

---

## 2. Activités clés (Key Activities)

| Activité | Détail |
|---|---|
| Développement des Adapters | Connecteurs par plateforme/marque (System, Audio, Display, Gaming, IoT, Peripherals). |
| Développement du moteur (Core) | Engine event-driven, Registry, moteur d'automatisation SI/ALORS, sync. |
| IA Mode-as-Code | Pipeline langage naturel → DSL → simulation → validation. |
| Exploitation & modération Marketplace | Analyse statique, score de risque IA, modération, réputation. |
| Sécurité & conformité | Certification anti-cheat, RGPD (export/suppression), durcissement. |
| Acquisition & animation communautaire | Contenu Twitch/YouTube, gestion des créateurs, support. |

**Narratif.** La valeur se concentre dans le **Core Rust OS-agnostique** (testable en CI) et dans l'**écosystème d'Adapters**, qui permet d'ajouter des intégrations de façon incrémentale sans toucher au moteur. Deux activités différenciantes portent l'argumentaire EIP : l'**IA Mode-as-Code** et la **modération sécurisée de la Marketplace**.

**Données d'enquête [E].**
- **Sécurité/confiance = priorité n° 1** : **14/14** citent « mes données personnelles » comme frein, **9/14** « la fiabilité », 6/14 « donner accès à mes mails et messageries », 2/14 « peur pour mon compte de jeu (anti-cheat) ».
- Réponses libres (anonymisées) : « Action destructrice, télémétrie non déclarée » ; « Ne pas revendre les données » ; « Ne jamais modifier le registre sans mon approbation » (réponse anglaise, traduite).
- **Marketplace** : 10/14 installeraient un mode tiers (9/14 « s'il a été vérifié », 1/14 « sans hésiter ») ; 2/14 seulement s'il vient de l'équipe Nexum ; 2/14 non. Signaux de confiance : **notes et avis 9/14**, **vérifié par l'équipe 8/14**, analyse de sécurité automatique 6/14, code source visible 5/14, nombre de téléchargements 5/14.
- Gestion d'échec d'une action : **9/14** veulent un « réessai automatique puis notification », 3/14 une notification avec choix, 2/14 ignorer l'échec.

---

## 3. Ressources clés (Key Resources)

| Ressource | Nature |
|---|---|
| Le DSL Mode/Action (modèle déclaratif) | **Propriété intellectuelle cœur** — rend possible no-code, sécurité, IA. |
| Équipe technique (Rust, TypeScript, DevOps) | Capital humain. |
| Infrastructure cloud (axum + PostgreSQL) | Ressource physique/opérationnelle. |
| Communauté & bibliothèque de modes partagés | Ressource réseau (effet de réseau). |
| Marque « Nexum » & image | Ressource intangible. |

**Narratif.** L'actif stratégique n'est pas une intégration particulière (elles sont réplicables) mais l'**architecture** : « tout est une Action typée » exécutée par un Adapter. Cette abstraction est le rempart concurrentiel et la condition d'une Marketplace sûre. À mesure que la communauté publie des modes, la **bibliothèque partagée** devient une barrière à l'entrée difficile à copier.

**Données d'enquête [E] — appétence pour la communauté.**
- Créer et partager ses propres modes : **3/14 oui** (2 gratuitement, 1 « si rémunéré »), 7/14 « peut-être », 4/14 non. Offre de contributeurs **mince** à ce stade.
- Rejoindre le Discord communautaire : 1/14 oui, 4/14 peut-être, 9/14 non. Bêta : **7/14 veulent tester** ; 7/14 donneraient leur avis pendant la bêta (6 « de temps en temps », 1 « chaque semaine »), 5/14 préfèrent « juste tester ». 3/14 acceptent un entretien de 20 min.
- Canaux suivis (13 réponses) : **Instagram 11/13**, YouTube 6/13, TikTok 6/13, LinkedIn 5/13 ; Twitch 1/13.

---

## 4. Proposition de valeur (Value Propositions)

| Axe (radar) | Note | Bénéfice client |
|---|---|---|
| Interopérabilité | 5/5 | Connecte des marques concurrentes (Razer + Corsair + Hue…) dans un seul outil. |
| Facilité / No-code | 5/5 | Créer un mode sans script (vs AutoHotkey). |
| Performance système | 4/5 | Rust/Tauri, empreinte minimale, pas de polling. |
| Personnalisation IA | 4/5 | Décrire un mode en langage naturel (Mode-as-Code). |
| Stabilité & sécurité | 4/5 | Protocoles officiels, compatibilité anti-cheat, pas de code arbitraire. |

*(Notes du radar = auto-évaluation de l'équipe ; elles ne proviennent pas de l'enquête.)*

**Narratif.** Nexum supprime la **friction** avant chaque session (jeu, stream, télétravail) : un clic synchronise logiciels, système, périphériques et objets connectés. Là où les concurrents sont **verrouillés à une marque** (Synapse, iCUE) ou **réservés aux techniciens** (scripts), Nexum est le seul à combiner **agnostique + no-code + orchestration universelle + IA**.

**Validation par l'enquête [E] (échelle 1–5 ou Important/Indispensable).**

| Hypothèse de valeur | Résultat | Lecture |
|---|---|---|
| Utilité globale de Nexum (1–5) | **moy. 2,7** ; 5/14 notent 4, 8/14 notent 1–2 | Intérêt **partagé** : 36 % utile (4/5), 57 % peu utile (1–2) ; personne ne note 5. |
| Détection automatique de l'activité | 7/14 important/indispensable ; confort à laisser Nexum agir seul : **moy. 2,6/5**, 3/14 à 4–5, 7/14 à 1–2 | Utile mais **la confiance dans l'autonomie n'est pas acquise**. |
| « Tout remettre comme avant » | 7/14 important/indispensable | Fonction clé du modèle « modes » validée à moitié. |
| « Marcher avec toutes les marques » (agnostique) | 7/14 important/indispensable (4/14 « indispensable ») | Le besoin d'agnosticité est **confirmé pour la moitié** de l'échantillon. |
| « Créer mes modes sans coder » (no-code) | **3/14** important/indispensable ; 5/14 « pas important » | **No-code peu prioritaire** dans cet échantillon (profil non-technique/travail). |
| « Voir tous mes messages au même endroit » | **9/14** important/indispensable (3/14 « indispensable ») | Fonction **non prévue au cœur** du pitch mais bien notée. |
| « Lancer un mode depuis le téléphone » | 7/14 important/indispensable | Cohérent avec l'app mobile (voir § 9). |
| « Lancer un mode à la voix » | 5/14 important/indispensable | Fonction secondaire. |

**Ce qui agace le plus (1 = pas du tout, 5 = énormément) [E].**

| Situation | Moyenne | Part à 4–5 |
|---|---|---|
| Jongler entre plusieurs messageries | **3,4** | **8/14** |
| Notifications en réunion / concentration | 2,9 | 6/14 |
| Rouvrir chaque jour les mêmes applis/fenêtres | 2,9 | 5/14 |
| Remettre mes réglages comme avant | 2,5 | 4/14 |
| Ne pas contrôler PC/maison depuis le téléphone | 2,1 | 1/14 |
| **Préparer mon PC avant de jouer** | **1,1** | **0/14** |

> ⚠️ La friction « avant de jouer », centrale dans le slogan, n'est **pas ressentie** dans cet échantillon (1,1/5) (mais seuls 3 répondants ont rempli la section jeu). Elle reste à tester auprès de vrais joueurs/streamers. Temps déclaré passé à régler son PC par jour : < 2 min 5/14, 2–5 min 7/14, « ne sais pas » 2/14 (aucun > 5 min).

---

## 5. Relation client (Customer Relationships)

| Type de relation | Mise en œuvre |
|---|---|
| Self-service | Installation et découverte en autonomie (offre gratuite). |
| Communauté | Marketplace, partage de modes, réputation des créateurs. |
| Support assisté | Support prioritaire pour les abonnés Premium. |
| Onboarding par persona | Parcours guidés « Gamer », « Streamer », « Chill/Télétravail ». |
| Comptes gérés (B2B) | Accompagnement dédié pour salles e-sport / entreprises. |

**Narratif.** La relation est majoritairement **automatisée et communautaire** en B2C (coût marginal faible, essentiel pour un modèle freemium), et **personnalisée** en B2B. La communauté n'est pas qu'un canal de support : c'est un levier de rétention (plus un utilisateur crée/importe des modes, plus le coût de changement augmente).

**Données d'enquête [E].**
- Mode de lancement préféré (3 favoris) : **« un clic dans l'application » cité par 12/14 (10/14 en 1er choix)**, raccourci clavier 8/14, depuis le téléphone 8/14, à la voix 4/14, à heure fixe 3/14, automatique au lancement d'un jeu 3/14, automatique en début de réunion 2/14 → l'interface manuelle prime sur l'automatisation.
- Support prioritaire : 3/14 seraient prêts à payer pour cela.
- Ce qui a bloqué l'automatisation chez ceux qui l'ont essayée (n = 5) : « trop long à configurer » 4/5, « ça casse après une mise à jour » 1/5, « trop technique, il faut coder » 1/5, « pas rentable pour le gain » 1/5. Sur l'ensemble : 5/14 ont déjà automatisé avec succès, 6/14 « non mais ça m'intéresserait », 3/14 pas intéressés.

---

## 6. Canaux (Channels)

| Canal | Fonction |
|---|---|
| Site web + téléchargement direct (installeurs Win/Linux signés) | Acquisition & distribution. |
| Twitch / YouTube / TikTok (créateurs gaming) | Notoriété & démonstration. |
| Marketplace intégrée | Distribution virale de presets, réengagement. |
| Bouche-à-oreille & influenceurs | Acquisition organique (viralité). |
| Vente directe B2B | Salles e-sport, entreprises. |

**Narratif.** Le canal le plus stratégique est la **viralité par les créateurs** : un streamer qui partage son « mode Direct » expose Nexum à sa communauté, ce qui alimente la Marketplace, qui à son tour attire de nouveaux utilisateurs (boucle de croissance). Les canaux payants (ads Twitch/YouTube) complètent l'organique.

**Données d'enquête [E] — points d'attention.**
- **Réseaux** : **Instagram 11/13**, YouTube 6/13, TikTok 6/13, LinkedIn 5/13, **Twitch 1/13** → pour cet échantillon, Instagram/TikTok devancent largement Twitch.
- **Systèmes** : Windows 6/14, **macOS 5/14**, Linux 2/14, « plusieurs » 1/14 (**5/14 sur Mac**, 6/14 si « plusieurs » en inclut un). Les installeurs prévus **Win/Linux** ne couvriraient que 8/14 de l'échantillon (hors « plusieurs »).
- **Smartphone : iPhone 13/14**, Android 1/14 → une app mobile devrait viser **iOS en priorité** pour ce public.
- Installation de l'application : « devoir installer une app » est un frein pour 2/14 seulement.

---

## 7. Segments clients (Customer Segments)

| Segment | Persona / cible | Besoin principal | Couverture par l'enquête [E] |
|---|---|---|---|
| Gamers compétitifs | **Léo, 22 ans** (Valorant, LoL) | Performance max, zéro friction avant la partie. | **Faible** : 4/14 jouent (1 « jouer », 3 « un peu tout ») ; 3 jouent avec anti-cheat (2 « souvent », 1 « parfois »). |
| Streamers | **Maxime, 28 ans** (Twitch) | Lancer son « Direct » (OBS, Spotify, lumières) en un clic. | **Nulle** : 0 répondant. **Non validé.** |
| Télétravailleurs | **Sarah, 34 ans** (dev) | Séparation pro/perso, « Mode Chill » auto après 18h. | **Bonne (profil dominant)** : 10/14 travail/étudiant ; mais 11/14 ont 18–24 ans (étudiants ; 1 seul répondant de 35 ans et plus). |
| **B2B** — salles e-sport & entreprises | Structures | Déploiement volume, standardisation des postes. | **Nulle** : aucune question/répondant B2B. **Non validé.** |

**Modes préférés (3 choix) [E].** Travail : cité par **12/14** (7/14 en 1er choix) ; Concentration 8/14 ; Réunion 7/14 ; Chill/détente 6/14 ; Gaming 3/14 (tous en 1er choix) ; Soirée/sommeil 3/14 ; Sport 1/14 ; **Stream 1/14** (en 2e choix, par un répondant non streamer).

**Marché adressable.**

| Indicateur | Valeur | Source |
|---|---|---|
| Marché mondial des jeux vidéo (2025, données finales) | **201,6 Md$ (+9,1 %)** | [P1] Newzoo, 26 juin 2026 |
| *(prévision antérieure, même source)* | 196,7 Md$ (+7,4 %) | [P2] Newzoo, nov. 2025 — *remplacé par la valeur finale ci-dessus* |
| Segment PC (2025) | **43,6 Md$ (+12 %)** — plus forte croissance historique de Newzoo | [P1] |
| *(prévision antérieure)* | 43 Md$ (+10,4 %) | [P2] |
| Smart home / IoT | **147,5 Md$ (2025) → 848,5 Md$ (2034)**, TCAC 21,4 % (2026–2034) | [P3] Fortune Business Insights, maj 19 oct. 2026 |
| Joueurs PC | ~1 milliard (le PC franchit le milliard en 2026) | **Non revérifié** — chiffre du brief, source à retrouver |
| Croissance software gaming (TCAC) | +10,37 % à +12,68 %/an | **Non revérifié** — chiffre du brief, source à retrouver |
| Segment abonnement (TCAC) | ~19,5 % | **Non revérifié** — chiffre du brief, source à retrouver |
| Joueurs PC multi-marques (≥ 3 marques) | « > 50 % » (brief) | **Non validé** : aucune source publique retrouvée. Proxy d'enquête [E] : 6/14 (43 %) utilisent **≥ 2 catégories** de périphériques/objets avec logiciel constructeur, 2/14 ≥ 3 catégories (échantillon peu gamer). |

**Narratif.** Nexum vise un marché **multi-plateforme en forte croissance**, avec un point d'entrée B2C (gamers/streamers/télétravailleurs) et une extension B2B. Le segment **PC est le plus dynamique du marché des jeux** [P1], mais **le besoin d'agnosticité n'est confirmé que pour la moitié de l'échantillon (7/14)** [E] ; l'affirmation « > 50 % des joueurs PC utilisent au moins 3 marques » reste à sourcer avant d'être utilisée comme argument de validation.

---

## 8. Structure de coûts (Cost Structure)

| Poste de coût | Nature | Commentaire |
|---|---|---|
| Salaires & R&D | Fixe (dominant) | Connecteurs API + IA, moteur, mobile. |
| Infrastructure cloud (AWS/Azure) | Variable | Sync, API, Marketplace ; croît avec le nombre d'utilisateurs actifs. |
| IA (tokens LLM) | Variable | Coût par génération Mode-as-Code (réservé au Premium). |
| Marketing & acquisition | Semi-variable | Ads Twitch/YouTube, partenariats influenceurs. |
| Sécurité & conformité | Fixe | Certification anti-cheat, RGPD, audits. |
| Support | Semi-variable | Croît avec la base Premium/B2B. |

**Narratif.** Structure **cost-driven côté R&D** (le gros de l'effort est le développement, cohérent avec le stade POC → produit), mais à **coûts marginaux faibles** une fois le produit livré : servir un utilisateur gratuit coûte peu (offline-first, config locale), et seuls les usages Premium (sync cloud, IA) génèrent un coût variable — ce qui protège la marge du freemium.

**Données d'enquête [E] — cohérence avec le modèle « local d'abord ».**
- Stockage des modes : **« uniquement sur mon ordinateur » 10/14**, « synchronisé cloud, si optionnel » 4/14, « cloud sans problème » 0/14 → le cloud doit rester **optionnel** et son coût variable ne doit pas peser sur le gratuit.
- Seuls **3/14** paieraient pour la synchronisation cloud : le cloud est donc un levier de revenu faible.
- Aucun chiffre de coût (salaires, infra, tokens LLM) n'est issu de l'enquête ; ils restent des estimations à chiffrer dans `KPIS_ET_PROJECTIONS.md`.

---

## 9. Flux de revenus (Revenue Streams)

| Offre | Prix | Contenu | Cible |
|---|---|---|---|
| **Freemium** | Gratuit | Config locale, **3 modes max**, découverte. | Acquisition, large base. |
| **Premium SaaS** | **~4,99 €/mois** | Modes illimités, sync cloud, automatisations avancées, IA, thèmes, statistiques. | Utilisateurs engagés. |
| **Licence Lifetime** | **~49 € (achat unique)** | Équivalent Premium, sans abonnement. | Public anti-abonnement. |
| **Commission Marketplace** | **Benchmark observé 12–30 %** ; **proposition de lancement : 15 %** *(à valider par l'équipe)* | Prélèvement sur les modes payants communautaires. | Créateurs + Nexum. |
| **B2B / licences volume** | **Benchmark salles gaming : 2–7 $/poste/mois** ; fourchette visée 3–5 €/poste/mois cohérente | Déploiement multi-postes, gestion centralisée. | Salles e-sport, entreprises. |

**Narratif.** Le modèle combine **récurrent** (Premium mensuel + B2B) et **ponctuel** (Lifetime, Marketplace). Le Freemium sert d'entonnoir : il maximise l'adoption puis convertit une fraction vers le Premium/Lifetime. La commission Marketplace crée un **revenu additionnel qui grandit avec la communauté**, et le B2B offre un ticket moyen élevé pour équilibrer le CAC B2C.

### 9.1 Taux de conversion freemium → payant (remplace « ~3–5 % hypothèse »)

| Donnée | Valeur | Source |
|---|---|---|
| Benchmark « bon » (≈ médiane) pour un produit freemium | **3–5 %** | [P4] ChartMogul, *SaaS Conversion Report*, 4 fév. 2026 (n = 200 entreprises) |
| Moyenne freemium (inscription → payant sous 6 mois) | **5,5 %** ; « excellent » 8–12 % ; 25 % des produits freemium restent < 2,5 % | [P4] |
| Intention déclarée de payer ≥ 1 fonction (enquête) | **7/14 (50 %)** | [E] |
| Préfèrent une formule payante (mensuel, annuel ou achat unique) | **9/14 (64 %)** — dont 2 qui ont aussi répondu « aucune fonction » : réponses **incohérentes**, à ne pas additionner | [E] |

➜ La fourchette 3–5 % est **maintenant sourcée** [P4]. L'intention déclarée en enquête (50 %) est **un plafond d'intérêt, pas un taux de conversion** : l'écart avec les 3–5 % de référence est normal (intention déclarée ≠ achat réel) et l'enquête ne permet pas de le mesurer.

### 9.2 Prix et formule [E]

| Indicateur | Résultat |
|---|---|
| Formule préférée | **Achat unique 6/14 (43 %)** ; gratuit seul 5/14 (36 %) ; abonnement mensuel 2/14 (14 %) ; abonnement annuel 1/14 (7 %). Abonnements au total : **3/14 (21 %)**. |
| Fonctions pour lesquelles on paierait | **App mobile 4/14**, déclencheurs automatiques 4/14, sync cloud 3/14, support prioritaire 3/14, messagerie unique 2/14, modes premium de la communauté 2/14 ; **aucune : 7/14**. |
| A déjà payé un outil d'automatisation | 1/14 (abonnement) ; 4/14 non ; 9/14 sans objet (n'ont pas automatisé). |
| Seuils de prix (4 questions) | **2 réponses seulement** (sur 14). Version FR : 30 / 50 / 100 / 100 (consigne « € par mois ») → incompatible avec un prix mensuel plausible. Version EN : 5 / 25 / 50 / 60 (devise : €) — répondant qui préfère l'achat unique ; l'unité (mensuel ou unique) n'est pas précisée dans l'export. Ordre : « trop bon marché » / « bonne affaire » / « cher mais j'y réfléchirais » / « trop cher ». **Inexploitables statistiquement.** |

➜ **Le prix de 4,99 €/mois et de 49 € (Lifetime) n'est pas validé par l'enquête** (2 réponses sur les seuils de prix, non comparables). Signal utile : **l'achat unique (43 %) devance l'abonnement (21 %)**, ce qui est cohérent avec l'offre Lifetime. Le test de prix devra être refait (Van Westendorp ou test A/B) sur un échantillon plus large.

### 9.3 Commission Marketplace (remplace « Hypothèse : 30 % »)

| Plateforme | Commission prélevée | Source |
|---|---|---|
| Steam | **30 %** (descend à 25 % au-delà d'environ 10 M$, puis 20 % au-delà de 50 M$, selon [P6]) | [P6] Gamepressure 2019 ; [P5] PC Gamer 2021 |
| Epic Games Store | **12 %** | [P5], [P6] |
| itch.io | Part fixée librement par le créateur, **jusqu'à 0 %** | [P6] |
| Apple App Store / Google Play | **30 %** standard ; **15 %** sous 1 M$ de revenus annuels | [P7] Appbot, 19 oct. 2025 |
| **Perception des développeurs** | Seuls **3 %** jugent 30 % équitable pour des boutiques comme Steam/GOG ; **43 %** jugent justifié un taux de 10–15 % (enquête GDC 2021) | [P5] |
| Enquête Nexum | **1/14** créerait des modes **si rémunéré** ; 3/14 créeraient et partageraient (2 gratuitement) | [E] |

➜ **Le 30 % n'est plus une simple hypothèse** : c'est le taux standard des grandes plateformes **mais aussi le plus contesté** par les créateurs. Pour attirer une offre de créateurs encore mince [E], **une commission d'amorçage de ~15 %** (alignée sur les programmes « petits éditeurs » d'Apple/Google et la zone de confort 10–15 % du GDC) semble plus cohérente. **Proposition à valider en équipe**, pas une donnée.

### 9.4 B2B (remplace « Hypothèse : ~3–5 €/poste/mois »)

| Référence | Prix publié | Source |
|---|---|---|
| Senet (gestion de salle gaming) | **~2 $/PC/mois** (Base), ~3 $ (Business), ~4,5 $ (Premium) — soit 100/150/225 $/mois pour 50 PC | [P8] G2, mis à jour 8 avr. 2026 |
| Smartlaunch (gestion de salle gaming) | **7 $/PC/mois**, 12 $ avec support premium, 15 $ avec « Smart Disk » | [P9] TrustRadius |
| Microsoft Intune Plan 1 (entreprise, gestion de postes — non comparable en fonctions) | **8 $/utilisateur/mois** | [P10] Venn, page modifiée 20 oct. 2026 |
| Enquête Nexum | **Aucun répondant B2B** | [E] |

➜ La fourchette **3–5 €/poste/mois se situe dans la partie basse/médiane des tarifs publiés pour les salles gaming (2–7 $/PC/mois)** et sous le prix d'un MDM d'entreprise (8 $). Elle est **cohérente avec les prix du marché**, mais **la demande B2B de Nexum n'est pas validée** (aucune interview B2B) : à tester auprès de salles e-sport.

> ⚠️ Restent **non validés** : le prix Premium (4,99 €/mois) et Lifetime (49 €), la demande B2B, le taux de conversion propre à Nexum, la part de joueurs multi-marques. Les hypothèses remplacées par des **références publiques** (conversion 3–5 %, commission, tarifs B2B) restent des **ordres de grandeur de marché**, pas des mesures sur les utilisateurs de Nexum.

---

## Cohérence du modèle (synthèse)

- **Ce qui crée la valeur** : l'architecture DSL (no-code + sécurité + IA) et l'agnosticité — *agnosticité confirmée par 7/14 ; no-code jugé important par seulement 3/14 [E]*.
- **Ce qui la délivre** : distribution directe + viralité communautaire (Marketplace, créateurs) — *10/14 installeraient un mode tiers, surtout s'il est vérifié ; 3/14 créeraient [E]*.
- **Ce qui la capte** : freemium → Premium/Lifetime, commission Marketplace, B2B — *intention de payer 7/14, préférence achat unique (6/14) > abonnement (3/14) [E] ; conversion de référence 3–5 % [P4]*.
- **Ce qui la protège** : effet de réseau de la bibliothèque de modes + faible coût marginal du gratuit — *« local d'abord » préféré par 10/14 [E]*.

## Points d'alerte issus des données (à discuter en équipe)

1. **Cible gamer/streamer non validée** : 0 streamer, 1 « joueur » principal ; la friction « préparer son PC avant de jouer » est notée **1,1/5** (n = 3 joueurs). Il faut recruter des gamers/streamers avant de conclure.
2. **La douleur dominante est la messagerie/le travail** (jonglage entre messageries 8/14 à 4–5 ; mode « Travail » cité par 12/14 ; « voir tous mes messages au même endroit » important/indispensable pour 9/14), pas le gaming.
3. **macOS et iPhone** : 5/14 sur Mac (6/14 avec « plusieurs systèmes ») et 13/14 sur iPhone ; les installeurs Win/Linux et une app mobile non iOS laisseraient une grande part du public de côté.
4. **Confiance/données = frein universel** (14/14) ; fiabilité 9/14 : à traiter dès la proposition de valeur (télémétrie, accès aux mails, anti-cheat).
5. **Peu d'intérêt pour les fonctions « IA/no-code »** dans cet échantillon ; l'automatisation autonome (confort 2,8/5) n'est pas acquise.

---

## Sources

**Enquête interne**
- **[E]** Formulaires Google « Nexum — Ton avis compte » (FR, 12 réponses) et « Nexum — Help us build it » (EN, 2 réponses), exports CSV fusionnés : 14 réponses (31 oct. → 5 nov. 2026). Données brutes non reproduites ici (les e-mails laissés pour la bêta ne sont pas utilisés).

**Sources publiques**
- **[P1]** Newzoo, *Gaming market surpassed $200 Billion in 2025*, relayé par Game Developer Reports, 26 juin 2026 — https://gamedevreports.substack.com/p/newzoo-gaming-market-surpassed-200
- **[P2]** Newzoo, prévision 2025, relayée par GamesBeat — https://gamesbeat.com/global-game-revenues-hit-196-7b-in-2025-up-7-4-newzoo/
- **[P3]** Fortune Business Insights, *Smart Home Market*, maj 19 oct. 2026 — https://www.fortunebusinessinsights.com/smart-home-market-101900
- **[P4]** ChartMogul, *The Conversion Report* (publié 4 fév. 2026, 200 répondants) — https://chartmogul.com/reports/saas-conversion-report/
- **[P5]** PC Gamer, *Most game devs don't think Steam earns its 30% revenue cut*, 28 avr. 2021 (enquête GDC) — https://www.pcgamer.com/most-game-devs-dont-think-steam-earns-its-30-revenue-cut
- **[P6]** Gamepressure, *Epic is Not Just Against Steam – 30% is the Industry Standard*, 8 oct. 2019 — https://www.gamepressure.com/newsroom/epic-is-not-just-against-steam-30-is-an-industry-standard/zc1263
- **[P7]** Appbot, *Apple's App Store Small Business Program*, 19 oct. 2025 — https://appbot.co/blog/app-developers-apple-google-small-business-programs/
- **[P8]** G2, tarifs Senet (maj 8 avr. 2026) — https://www.g2.com/products/senet/pricing
- **[P9]** TrustRadius, Smartlaunch vs ggLeap — https://www.trustradius.com/compare-products/smartlaunch-vs-ggleap
- **[P10]** Venn, *Microsoft Intune pricing* (modifié 20 oct. 2026) — https://www.venn.com/learn/microsoft-intune/microsoft-intune-pricing/
