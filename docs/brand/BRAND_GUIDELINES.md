# Nexum — Charte graphique & identité de marque

> Document EIP (piste Entrepreneuriat — objectif complémentaire « Image & Message »).
> Source de vérité couleurs & tokens : [`PALETTE.md`](./PALETTE.md). Données produit &
> positionnement : [`../eip/_BRIEF_PROJET.md`](../eip/_BRIEF_PROJET.md).
>
> Dernière mise à jour : 2026-09-25 — nouvelle identité monochrome autour du logo « N » tramé
> (issue #27). **À valider par Arnaud et Rares avant toute publication.**

---

## 1. Plateforme de marque

### 1.1 Mission

**Rendre à chacun le contrôle de son environnement numérique, sans une ligne de code.**
Nexum synchronise en un clic tout l'environnement (logiciels, système, périphériques,
objets connectés) selon l'activité, via des « modes ». On appuie, tout s'aligne.

### 1.2 Vision

Un monde où l'ordinateur s'adapte à l'humain — et non l'inverse. Nexum vise à devenir la
**couche d'orchestration universelle et agnostique** du poste de travail et de jeu :
la première application qui parle à toutes les marques, tous les logiciels et tous les
objets connectés d'un même geste. Notre étoile polaire : la **« liberté numérique »** —
sortir des écosystèmes verrouillés (Razer, Corsair) et de la complexité technique
(scripts AutoHotkey).

### 1.3 Valeurs

| Valeur | Ce qu'elle signifie | Traduction concrète |
|---|---|---|
| **Liberté** | Aucun verrou de marque, aucun écosystème imposé | Agnostique : connecte des marques concurrentes |
| **Simplicité** | La puissance sans la complexité | No-code : un mode = des données, jamais du script |
| **Transparence** | L'utilisateur sait ce que fait l'app | Modes déclaratifs, Marketplace validée, pas de code arbitraire |
| **Performance** | Discrétion et respect de la machine | Rust/Tauri, empreinte minimale |
| **Communauté** | La valeur naît du partage | Marketplace de presets, build in public, bêta ouverte |

### 1.4 Personnalité de marque

Nexum est un **allié technique cool** : compétent sans être condescendant, moderne sans
être froid, énergique sans être criard. Sur les archétypes de marque, Nexum combine le
**Magicien** (« un clic et tout change », l'effet waouh) et le **Hors-la-loi maîtrisé**
(casser les silos des grandes marques, rendre le pouvoir à l'utilisateur).

Positionnement sur les axes :

- Technique ↔ Accessible → **penche accessible** (no-code d'abord).
- Sérieux ↔ Ludique → **équilibré**, ludique côté gaming, crédible côté pro.
- Corporate ↔ Communautaire → **communautaire**.

### 1.5 Ton de voix

- **Direct et concret.** On parle bénéfice, pas jargon. « Lance ton Direct en un clic »
  plutôt que « orchestration multi-processus événementielle ».
- **Complice, jamais familier à l'excès.** Tutoiement sur les canaux communautaires
  (Instagram, Discord, TikTok) ; vouvoiement sur LinkedIn et en B2B.
- **Honnête.** On assume le stade projet (POC/MVP), on montre les coulisses (build in
  public). Pas de promesse survendue.
- **Énergique mais clair.** Phrases courtes. Verbes d'action. Un emoji maximum par post
  social (jamais dans les documents officiels ni dans l'UI).

**Mots que l'on emploie :** mode, un clic, sans friction, agnostique, no-code, setup,
liberté, s'aligner, orchestrer.
**Mots que l'on évite :** « révolutionnaire », « ultime », « magique » (au sens littéral),
tout superlatif non prouvé, tout jargon non explicité.

Exemple d'application du ton :

> ❌ « La solution ultime et révolutionnaire pour un contrôle total de votre écosystème. »
> ✅ « Un clic. Ton PC coupe le superflu, règle tes lumières et lance ta partie. »

---

## 2. Positionnement

**Pour** les joueurs, streamers et télétravailleurs (dont >50 % utilisent au moins 3
marques de périphériques), **qui** perdent du temps à préparer leur setup avant chaque
session, **Nexum est** une application universelle, no-code et agnostique **qui**
synchronise en un clic tout l'environnement numérique selon l'activité. **Contrairement à**
Razer Synapse / Corsair iCUE (verrouillés à une marque) ou aux scripts AutoHotkey
(réservés aux techniciens), **Nexum** orchestre logiciels + système + IoT de toutes
marques, sans écrire une ligne de code.

Signature de marque (tagline) : **« Nexum : jouer, streamer ou chiller sans friction. »**

---

## 3. Logo

### 3.1 Description

Le logo Nexum est un **« N » tramé** (halftone) en noir et blanc :

- une **diagonale pleine** qui se dissout en points aux deux extrémités : le clic qui
  traverse et met tout en ordre ;
- deux **montants détachés**, remplis d'une trame de points de plus en plus fins : les
  éléments séparés du setup (apps, périphériques, lumières) que Nexum relie, « nexum »
  signifiant « le lien » en latin.

La trame évoque l'écran, le pixel et l'imprimé à la fois ; le monochrome rend le logo
lisible partout (fond sombre, impression, gravure) et reste cohérent avec l'interface de
l'app, elle-même monochrome.

Le **mot-marque** est « NEXUM » en capitales, **Inter 500**, interlettrage **+0,24 em**
(identique à la barre de titre de l'app).

### 3.2 Fichiers

| Fichier | Contenu | Usage |
|---|---|---|
| `logo.svg` | N blanc sur carré noir | Icône d'app, favicon, fichier source |
| `logo-mark-white.svg` | N blanc, fond transparent | Sur fond sombre (usage principal) |
| `logo-mark-black.svg` | N noir, fond transparent | Sur fond clair, impression N&B |
| `exports/lockup-white.png` | N + NEXUM blancs, transparent | Bannières, slides, en-têtes sur fond sombre |
| `exports/lockup-black.png` | N + NEXUM noirs, transparent | Documents, fonds clairs |
| `exports/avatar-1080.png` / `avatar-400.png` | N centré sur noir, marge pour le recadrage rond | Photo de profil Instagram, TikTok, LinkedIn, Discord |
| `exports/linkedin-cover-1128x191.png` | Lockup + signature, calé à droite | Bannière de la page LinkedIn |

`logo-mark.svg` et `logo-wordmark.svg` (anneau néon) sont l'**ancien logo** : ne plus les
utiliser. Les visuels de `social/` sont aussi à l'ancienne charte et doivent être refaits.

### 3.3 Zone de protection

Garder autour du logo un vide au moins égal à **la largeur d'un montant du N** (≈ 1/8 de la
largeur du symbole). Pour un avatar rond, le N occupe **60 % de la largeur** du carré
(c'est le cas des exports `avatar-*`) afin que rien ne soit rogné.

### 3.4 Tailles minimales

La trame se bouche en petit : en dessous des seuils, les points fusionnent et le N perd sa
texture.

| Support | Taille min. |
|---|---|
| Symbole (écran) | 32 px de haut (favicon 16 px toléré) |
| Lockup (écran) | 160 px de large |
| Symbole (impression) | 10 mm |
| Lockup (impression) | 35 mm de large |

### 3.5 À faire / À ne pas faire

**À faire :**
- Blanc sur fond sombre (`#080808` à `#1A1A1A`), noir sur fond clair.
- Mise à l'échelle homothétique uniquement.
- Sur une photo, poser le logo sur une zone sombre et unie (ou ajouter un voile noir).

**À ne pas faire :**
- ❌ Coloriser le N ou sa trame (pas de dégradé, pas de néon).
- ❌ Déformer, incliner, faire pivoter le symbole.
- ❌ Remplacer la trame par un aplat, ou changer la taille des points.
- ❌ Ajouter ombre portée, lueur, contour ou effet 3D.
- ❌ Changer la police ou l'interlettrage du mot-marque.
- ❌ Utiliser le logo en dessous des tailles minimales.

---

## 4. Palette

> Reprend les valeurs de l'app (`apps/desktop/src/styles.css` et `materials.css`).
> Détail des tokens : [`PALETTE.md`](./PALETTE.md).

L'identité est **strictement monochrome** : noir, gris et blanc. La couleur ne porte
aucune information ; l'état passe par les **libellés et les icônes**.

### 4.1 Neutres (thème sombre — principal)

| Rôle | Hex | Usage |
|---|---|---|
| Fond | `#080808` | Fond d'app, fond des visuels |
| Barre / bandeau | `#0B0B0B` | Barre de titre, en-têtes |
| Panneau | `#131313` | Cartes, panneaux principaux |
| Panneau secondaire | `#101010` | Panneaux imbriqués |
| Texte | `#F2F2F2` | Texte principal, logo |
| Texte secondaire | `#ACACAC` | Descriptions, légendes |
| Texte discret | `#8C8C8C` | Métadonnées (jamais d'info critique) |
| Bordure | `#FFFFFF` à 5 % | Séparateurs |
| Bordure marquée | `#FFFFFF` à 14 % | Contours de focus, éléments actifs |

### 4.2 Thème clair (documents, impression)

| Rôle | Hex |
|---|---|
| Fond | `#FFFFFF` |
| Surface | `#F4F4F4` |
| Bordure | `#E2E2E2` |
| Texte | `#0A0A0A` |
| Texte secondaire | `#5C5C5C` |

### 4.3 Et la couleur ?

Pas de couleur de marque. Les **photos et captures** (lumières Hue, RGB du setup) apportent
la couleur ; la charte, elle, reste noire et blanche pour les encadrer.

> À décider en équipe : une **couleur fonctionnelle unique** pour les erreurs (ex. rouge
> `#F0436E`) améliorerait la lisibilité des échecs dans l'app (#47). Elle resterait
> réservée à l'UI, jamais utilisée dans la communication. Les thèmes au choix (#100) sont
> une option utilisateur et ne changent pas la charte.

---

## 5. Typographie

| Rôle | Police | Graisses | Détails |
|---|---|---|---|
| Mot-marque | **Inter** | 500 | Capitales, interlettrage +0,24 em |
| Titres | **Inter** | 300–400 | Grands titres fins, interlettrage −0,035 em |
| Texte & UI | **Inter** (fallback `system-ui`) | 400 / 500 | 14 px minimum en UI |
| Code / modes / logs | **JetBrains Mono** | 400 / 500 | Presets JSON, logs, détails techniques |

Les titres sont **légers**, pas gras : le contraste vient de la taille et de l'espace, pas
de la graisse. Échelle : 12 / 13 / 14 (base) / 18 / 24 / 32 / 48 px.

---

## 6. Style visuel

**Direction : « console cinématique » — noir profond, blanc, trame.**

- **Fonds :** noir `#080808` uni. Pas de dégradé coloré.
- **Trame (halftone) :** motif signature, repris du logo. À utiliser en accent : fondu
  d'une image vers le noir, bord d'un visuel, transition. Jamais derrière du texte.
- **Icônes :** linéaires (stroke 1,5–2 px), coins légèrement arrondis, en blanc ou gris.
- **Formes :** rayons 12 / 16 / 24 px, beaucoup d'espace vide, compositions centrées.
- **Photos & captures :** vrais setups, lumière tamisée ; la couleur des lumières est
  bienvenue dans la photo, pas dans les éléments graphiques posés dessus.
- **Mouvement (vidéo / reels) :** apparitions par trame qui se remplit, coupes nettes.
  Respecter `prefers-reduced-motion` dans l'app.

**À éviter :** néons, dégradés arc-en-ciel, ombres colorées, fonds clairs criards,
plus de deux graisses dans un même visuel.

---

## 7. Applications

### 7.1 Réseaux sociaux

- **Photo de profil (Instagram, TikTok, LinkedIn, Discord) :** `exports/avatar-1080.png`.
- **Bannière LinkedIn :** `exports/linkedin-cover-1128x191.png` (le contenu est calé à
  droite car le logo de la page recouvre le coin bas-gauche).
- **Gabarit de post :** fond `#080808`, une idée par visuel, titre Inter 300 en grand,
  petit lockup blanc en bas à droite, trame en accent. Même marges d'un post à l'autre.
- **Captures d'app :** thème sombre, dans une fenêtre sans décor, ombre neutre.

### 7.2 Icône d'application

`logo.svg` (N blanc sur carré noir). À faire : régénérer les icônes Tauri
(`npm run tauri icon ../../docs/brand/logo.svg` dans `apps/desktop`) et remplacer
l'ancien symbole `IconLogo` de la barre de titre.

### 7.3 Documents (EIP, pitch, one-pager)

Thème clair, lockup noir en en-tête, titres Inter 300, texte Inter 400.

---

## 8. Accessibilité

- Texte `#F2F2F2` sur `#080808` : contraste ≈ 18:1 ; `#ACACAC` sur `#080808` ≈ 8,8:1 ;
  `#8C8C8C` sur `#080808` ≈ 6:1 (AA). Rester au-dessus de 4,5:1 pour tout texte courant.
- La couleur ne portant aucune information, **chaque état a un libellé ou une icône**
  (✓ / ✗, « Actif » / « Échec »).
- Le logo tramé n'est pas lisible en très petit : respecter les tailles minimales (§3.4).
- Toujours fournir un texte alternatif (« Logo Nexum ») aux images du logo.

---

## 9. Récapitulatif

| ✅ À faire | ❌ À ne pas faire |
|---|---|
| Noir, gris, blanc — rien d'autre | Couleurs de marque, néons, dégradés |
| Blanc sur sombre, noir sur clair | Logo colorisé ou déformé |
| Trame en accent, avec parcimonie | Trame derrière du texte |
| Titres Inter fins, beaucoup d'espace | Titres gras et surchargés |
| État = libellé + icône | Information portée par la couleur seule |
| Ton direct, bénéfice d'abord | Superlatifs non prouvés, jargon |
