# Brief projet Nexum — référence factuelle partagée

> Source de vérité pour TOUS les documents EIP. Chiffres, personas, dates et
> positionnement doivent être cohérents avec ce fichier. (FR = langue des livrables.)

## Identité
- **Nom :** Nexum. **Type :** projet EIP Epitech (PROMO 2028, Phase PGE4, campus Marseille). Intra : eip.epitech.eu/project/1035.
- **Tagline :** « Nexum : jouer, streamer ou chiller sans friction. »
- **Pitch :** Application universelle, no-code et agnostique qui synchronise en un clic tout l'environnement numérique (logiciels, système, périphériques, objets connectés) selon l'activité, via des « modes ».

## Problème
- Setup fragmenté : launchers, logiciels constructeurs, utilitaires système isolés.
- Temps perdu avant chaque session (jeu, stream, travail).
- Solutions existantes limitées à un écosystème (Razer, Corsair) ou trop techniques (scripts AutoHotkey).
- Absence d'automatisation contextuelle.

## Proposition de valeur (les 5 axes du radar)
1. Interopérabilité (5/5) — connecte des marques concurrentes.
2. Facilité d'usage / No-code (5/5) — sans script.
3. Performance système (4/5) — Rust/Tauri, empreinte minimale.
4. Personnalisation IA (4/5) — modes en langage naturel (Mode-as-Code).
5. Stabilité & sécurité (4/5) — protocoles officiels (SDK), compatibilité anti-cheat.

## Personas (3)
- **Léo Bernard, 22 ans** — Gamer compétitif (Valorant, LoL). Veut la performance max sans friction : couper les process inutiles, régler les lumières. Douleur : temps de préparation, reflets.
- **Maxime Roux, 28 ans** — Streamer Twitch. Jongle entre OBS, Spotify, scènes lumières, retour caméra. Veut lancer son « Direct » en un clic.
- **Sarah Martin, 34 ans** — Développeuse en télétravail. Même PC pour coder et se détendre. Veut un « Mode Chill » automatique après 18h (lumières tamisées, Slack coupé, Spotify lancé) et une séparation nette pro/perso.

## Marché (chiffres à citer)
- Marché mondial du gaming : **197 Md$ en 2025** (Newzoo). PC seul : **43 Md$**, croissance **+10,4 %**.
- Joueurs : **3,32 Md** dont **~1 Md sur PC** (le PC franchit le milliard en 2026) (DemandSage).
- Croissance software gaming (TCAC) : **+10,37 % à +12,68 %/an** (Mordor Intelligence). Segment abonnement : TCAC **~19,5 %** (le plus rapide).
- Smart home / IoT : **147,5 Md$ en 2025 → 848 Md$ d'ici 2034** (Fortune Business Insights).
- **>50 % des joueurs PC** utilisent au moins **3 marques** de périphériques différentes → besoin d'une solution agnostique.
- Potentiel d'utilisateurs PC : ~1 milliard dans le monde.

## SWOT
- **Forces :** agnostique, no-code, centralisé (logiciel+système+IoT), IA Mode-as-Code.
- **Faiblesses :** dépendance API tierces, conso CPU/RAM potentielle, stade POC (gros besoin de dev).
- **Opportunités :** boom télétravail (séparation pro/perso), croissance e-sport, effet Marketplace (viralité via influenceurs), standardisation IoT (Matter).
- **Menaces :** réaction des OS (Windows intègre des profils nativement), concurrence hardware (Elgato/Logitech ouvrent leurs logiciels), risque de détection anti-cheat.

## Concurrents
- **Razer Synapse / Corsair iCUE :** forts sur le hardware maison, verrouillés à une marque, pas d'orchestration système/logiciel globale.
- **AutoHotkey / scripts :** puissants mais complexes, réservés aux techniciens.
- **Launchers (Steam, Playnite) :** centrés jeu, aucune gestion IoT/système/ambiance.
- Différenciation Nexum : agnostique + no-code + orchestration universelle + IA.

## Modèle économique
- **Freemium :** gratuit (config locale, 3 modes max, découverte).
- **Premium SaaS ~4,99 €/mois :** modes illimités, sync cloud, automatisations avancées, IA, thèmes, statistiques.
- **Licence Lifetime ~49 € :** achat unique (utilisateurs anti-abonnement).
- **Commission Marketplace :** prélèvement sur presets premium communautaires.
- **B2B / partenariats :** licences volume (salles e-sport, entreprises).
- Coûts : R&D (connecteurs API + IA), infra cloud (AWS/Azure), marketing (Twitch/YouTube), sécurité/conformité (certif anti-cheat, RGPD), support.

## Périmètre produit
- **V1 (fondations) :** Windows (prioritaire) + Linux ; gestion process ; audio/volume + périphérique par défaut ; affichage de base ; lancement jeux (Steam/Epic/GOG) ; IoT & périphériques (Philips Hue scènes, SteelSeries RGB, Logitech/Corsair via SDK).
- **Extensions stratégiques (EIP) :** IA générative Mode-as-Code (langage naturel → DSL interne → simulation → validation capacités) ; Marketplace sécurisée (sandbox déclaratif + analyse statique + score de risque IA + modération + réputation) ; moteur d'automatisation SI/ALORS (heure, batterie, lancement app, géoloc) ; sync cross-environnement (contexte mobile, gestion des conflits).

## Stack & architecture technique
- **Frontend :** React + TypeScript + Vite. **Desktop :** Tauri 2 (Rust). **Cloud :** service Rust axum + PostgreSQL. **Mobile :** Tauri mobile (Phase 2).
- **Idée clé :** tout est une **Action** typée, exécutée par un **Adapter** de plateforme, orchestrée par un **Engine** event-driven, à partir d'un **modèle Mode/Action déclaratif (DSL JSON)** partagé. Un mode = données, jamais du code → no-code, Marketplace sûre (validation d'allowlist), IA, cross-platform.
- **Monorepo** `nexum/` : crates Rust (nexum-schema=DSL, nexum-core=moteur, nexum-adapters, nexum-store), services/nexum-cloud, apps/desktop (Tauri+React), packages/schema-ts.
- Offline-first (SQLite local) + sync cloud. Sécurité par conception (pas de code arbitraire dans les modes partagés).

## Contexte EIP (piste ENTREPRENEURIAT)
- **Objectifs obligatoires :** validation marché (**15-20 interviews utilisateurs**, MVP testé/itéré sur **2 cycles min.**, pivot ou consolidation argumentée) ; maîtrise des outils entrepreneuriaux (**Business Model Canvas**, **KPIs + projections financières**, **roadmap produit**).
- **Objectifs complémentaires choisis (2) :** Stratégie & Vision ; Image & Message.
- **RNCP :** Bloc 5 (assurance qualité), Bloc 6 (déploiement), Bloc 7 (gestion de projet).

## Dates clés
- **Rendu Beta Test Plan (BTP) : janvier 2027.**
- **Greenlight Jury blanc : avril 2027** (visio, 1h).
- **Greenlight Jury + Jury RNCP : juillet 2027** (présentiel, campus Kremlin-Bicêtre / Paris, 1h chacun, même jour). **Démo LIVE du projet déployé obligatoire — aucune vidéo autorisée.**
- Verrouillage des objectifs de track : octobre 2026.
- Suivis : pédago + mentor toutes les 6 semaines en PGE4, mensuels en PGE5. Contact coordinateurs via help.epitech.eu.
