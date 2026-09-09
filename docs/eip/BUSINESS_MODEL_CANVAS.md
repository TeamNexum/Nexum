# Business Model Canvas — Nexum

> Document EIP (piste **Entrepreneuriat**) — projet **Nexum**, PROMO 2028, campus Marseille.
> Source de vérité : `docs/eip/_BRIEF_PROJET.md`. Langue : français.
> Les valeurs marché sont issues du brief ; toute valeur non sourcée est explicitement notée « **Hypothèse** ».
> Dernière mise à jour : 2026-07-13.

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
| **9. Flux de revenus** | Freemium → Premium 4,99 €/mois, Lifetime 49 €, commission Marketplace, licences B2B. |

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

---

## 4. Proposition de valeur (Value Propositions)

| Axe (radar) | Note | Bénéfice client |
|---|---|---|
| Interopérabilité | 5/5 | Connecte des marques concurrentes (Razer + Corsair + Hue…) dans un seul outil. |
| Facilité / No-code | 5/5 | Créer un mode sans script (vs AutoHotkey). |
| Performance système | 4/5 | Rust/Tauri, empreinte minimale, pas de polling. |
| Personnalisation IA | 4/5 | Décrire un mode en langage naturel (Mode-as-Code). |
| Stabilité & sécurité | 4/5 | Protocoles officiels, compatibilité anti-cheat, pas de code arbitraire. |

**Narratif.** Nexum supprime la **friction** avant chaque session (jeu, stream, télétravail) : un clic synchronise logiciels, système, périphériques et objets connectés. Là où les concurrents sont **verrouillés à une marque** (Synapse, iCUE) ou **réservés aux techniciens** (scripts), Nexum est le seul à combiner **agnostique + no-code + orchestration universelle + IA**.

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

---

## 7. Segments clients (Customer Segments)

| Segment | Persona / cible | Besoin principal |
|---|---|---|
| Gamers compétitifs | **Léo, 22 ans** (Valorant, LoL) | Performance max, zéro friction avant la partie. |
| Streamers | **Maxime, 28 ans** (Twitch) | Lancer son « Direct » (OBS, Spotify, lumières) en un clic. |
| Télétravailleurs | **Sarah, 34 ans** (dev) | Séparation pro/perso, « Mode Chill » auto après 18h. |
| **B2B** — salles e-sport & entreprises | Structures | Déploiement volume, standardisation des postes. |

**Marché adressable (chiffres du brief).**

| Indicateur | Valeur |
|---|---|
| Marché mondial gaming (2025) | 197 Md$ |
| Segment PC | 43 Md$ (+10,4 %) |
| Joueurs PC | ~1 milliard (le PC franchit le milliard en 2026) |
| Croissance software gaming (TCAC) | +10,37 % à +12,68 %/an |
| Segment abonnement (TCAC) | ~19,5 % (le plus rapide) |
| Smart home / IoT | 147,5 Md$ (2025) → 848 Md$ (2034) |
| Joueurs PC multi-marques (≥3 marques) | >50 % → besoin agnostique |

**Narratif.** Nexum vise un marché **multi-plateforme en forte croissance**, avec un point d'entrée B2C (gamers/streamers/télétravailleurs) et une extension B2B. Le fait que **>50 % des joueurs PC utilisent au moins 3 marques** valide directement le besoin d'une solution agnostique.

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

---

## 9. Flux de revenus (Revenue Streams)

| Offre | Prix | Contenu | Cible |
|---|---|---|---|
| **Freemium** | Gratuit | Config locale, **3 modes max**, découverte. | Acquisition, large base. |
| **Premium SaaS** | **~4,99 €/mois** | Modes illimités, sync cloud, automatisations avancées, IA, thèmes, statistiques. | Utilisateurs engagés. |
| **Licence Lifetime** | **~49 € (achat unique)** | Équivalent Premium, sans abonnement. | Public anti-abonnement. |
| **Commission Marketplace** | **% Hypothèse : 30 %** sur presets premium | Prélèvement sur les modes payants communautaires. | Créateurs + Nexum. |
| **B2B / licences volume** | **Hypothèse : ~3–5 €/poste/mois** ou forfait | Déploiement multi-postes, gestion centralisée. | Salles e-sport, entreprises. |

**Narratif.** Le modèle combine **récurrent** (Premium mensuel + B2B) et **ponctuel** (Lifetime, Marketplace). Le Freemium sert d'entonnoir : il maximise l'adoption puis convertit une fraction (~3–5 %, cf. document KPIs) vers le Premium/Lifetime. La commission Marketplace crée un **revenu additionnel qui grandit avec la communauté**, et le B2B offre un ticket moyen élevé pour équilibrer le CAC B2C.

> ⚠️ Le taux de commission Marketplace (30 %), les tarifs B2B et les taux de conversion sont des **hypothèses de travail** détaillées et chiffrées dans `KPIS_ET_PROJECTIONS.md`.

---

## Cohérence du modèle (synthèse)

- **Ce qui crée la valeur** : l'architecture DSL (no-code + sécurité + IA) et l'agnosticité.
- **Ce qui la délivre** : distribution directe + viralité communautaire (Marketplace, créateurs).
- **Ce qui la capte** : freemium → Premium/Lifetime, commission Marketplace, B2B.
- **Ce qui la protège** : effet de réseau de la bibliothèque de modes + faible coût marginal du gratuit.
