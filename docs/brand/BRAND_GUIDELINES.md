# Nexum — Charte graphique & identité de marque

> Document EIP (piste Entrepreneuriat — objectif complémentaire « Image & Message »).
> Source de vérité couleurs & tokens : [`PALETTE.md`](./PALETTE.md). Données produit &
> positionnement : [`../eip/_BRIEF_PROJET.md`](../eip/_BRIEF_PROJET.md).
>
> Dernière mise à jour : 2026-07-13.

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

Le logo Nexum est un **swirl** (tourbillon) fluide déclinant le dégradé signature
**cyan → violet → magenta**, évoquant à la fois le lien (« nexum », le lien en latin), le
mouvement d'un « clic qui met tout en ordre » et l'identité néon-setup. Le lockup complet
associe le symbole (swirl) au mot-marque « Nexum » en Inter.

### 3.2 Déclinaisons

| Version | Usage |
|---|---|
| **Lockup couleur** (swirl + mot-marque) | Usage principal sur fond sombre |
| **Symbole seul** (swirl) | Icône d'app, favicon, avatar réseaux, petites tailles |
| **Mot-marque seul** | Cas où le symbole est déjà présent à proximité |
| **Monochrome clair** (`#E7EAF0` / blanc) | Fonds sombres unis, gravure, tampon |
| **Monochrome foncé** (`#0B0E14`) | Fonds clairs, impression N&B, fax/administratif |

### 3.3 Zone de protection

Réserver autour du logo un espace vide **égal à la hauteur de la lettre « N »** du
mot-marque (notée **x**). Aucun autre élément (texte, image, bord) ne doit pénétrer cette
zone. Pour le symbole seul, la zone de protection = **0,5 × la largeur du swirl** sur
chaque côté.

### 3.4 Tailles minimales

| Support | Taille min. |
|---|---|
| Lockup complet (écran) | 120 px de large |
| Symbole seul (écran) | 24 px (favicon 16 px toléré, version simplifiée) |
| Lockup complet (impression) | 25 mm de large |
| Symbole seul (impression) | 8 mm |

### 3.5 À faire / À ne pas faire

**À faire :**
- Placer le logo couleur sur `--nx-bg` (`#0B0E14`) ou une surface sombre.
- Utiliser la version monochrome quand le fond est chargé ou peu contrasté.
- Respecter le dégradé signature exact (135°, cyan → violet → magenta).
- Conserver les proportions d'origine (mise à l'échelle homothétique uniquement).

**À ne pas faire :**
- ❌ Déformer, étirer ou incliner le swirl.
- ❌ Recolorer le dégradé ou remplacer par d'autres couleurs.
- ❌ Ajouter ombre portée, contour, biseau ou effet 3D.
- ❌ Poser le logo couleur sur un fond clair ou coloré peu contrasté (utiliser le mono).
- ❌ Recomposer le lockup (changer la police, l'espacement symbole/texte).
- ❌ Placer le logo dans un cadre ou une pastille non prévue.

> **Hypothèse** : le fichier logo vectoriel de référence (SVG/AI) sera versionné dans
> `docs/brand/assets/` ; ces règles s'appliquent à toutes ses déclinaisons.

---

## 4. Palette (tokens exacts)

> Reprend **à l'identique** les tokens de [`PALETTE.md`](./PALETTE.md), source de vérité.
> Le thème sombre est le thème **primaire** (identité néon-setup) ; le thème clair sert aux
> documents et supports marketing.

### 4.1 Palette principale (thème sombre — primaire)

| Token | Hex | Usage |
|---|---|---|
| `--nx-bg` | `#0B0E14` | Fond d'application (deep space) |
| `--nx-surface` | `#151A22` | Cartes, panneaux |
| `--nx-surface-2` | `#1E2530` | Surfaces imbriquées, champs |
| `--nx-border` | `#2A323F` | Bordures, séparateurs |
| `--nx-text` | `#E7EAF0` | Texte principal |
| `--nx-muted` | `#8A93A3` | Texte secondaire |
| **`--nx-cyan`** | `#22D3EE` | **Primaire** — actions, état actif, « ON » |
| **`--nx-purple`** | `#7C5CFF` | **Secondaire** — badges, accents |
| **`--nx-magenta`** | `#F038A0` | Tertiaire — highlights, streaming |
| `--nx-green` | `#22C55E` | Succès |
| `--nx-amber` | `#F5B84B` | Avertissement |
| `--nx-red` | `#F0436E` | Erreur / danger |

### 4.2 Dégradé signature

```
linear-gradient(135deg, #22D3EE 0%, #7C5CFF 50%, #F038A0 100%)
```

À utiliser pour le lockup du logo, les éléments héros et le glow « activer ». **Jamais**
pour du texte courant.

### 4.3 Thème clair (secondaire — docs & marketing)

| Rôle | Hex |
|---|---|
| bg | `#F7F8FB` |
| surface | `#FFFFFF` |
| border | `#E3E7EE` |
| text | `#0B0E14` |
| muted | `#5A6472` |
| cyan (sur clair) | `#0EA5C4` |
| purple (sur clair) | `#6D4AFF` |
| magenta (sur clair) | `#D81B84` |

### 4.4 Bloc de tokens CSS (à copier dans `:root`)

```css
:root {
  --nx-bg:#0B0E14; --nx-surface:#151A22; --nx-surface-2:#1E2530; --nx-border:#2A323F;
  --nx-text:#E7EAF0; --nx-muted:#8A93A3;
  --nx-cyan:#22D3EE; --nx-purple:#7C5CFF; --nx-magenta:#F038A0;
  --nx-green:#22C55E; --nx-amber:#F5B84B; --nx-red:#F0436E;
  --nx-gradient:linear-gradient(135deg,#22D3EE 0%,#7C5CFF 50%,#F038A0 100%);
}
```

### 4.5 Règles d'emploi de la couleur

- Le **cyan** est la couleur d'action par défaut (boutons primaires, état « ON »).
- Le **violet** structure les accents secondaires (badges, tags, catégories).
- Le **magenta** est réservé aux highlights et à l'univers **streaming**.
- Vert / ambre / rouge portent uniquement un statut sémantique (succès / alerte / erreur).
- Le dégradé signature est un **accent rare** : héros, logo, glow d'activation. Ne pas en
  saturer les interfaces.

---

## 5. Typographie

| Rôle | Police | Graisses | Détails |
|---|---|---|---|
| UI & titres | **Inter** (fallback `system-ui`) | 400 / 600 / 800 | Titres en 800, labels en 600 |
| Code / DSL / logs | **`ui-monospace, "JetBrains Mono", monospace`** | 400 / 600 | Blocs de code, presets JSON, logs |

**Échelle typographique :** 12 / 13 / 14 (base) / 18 / 24 / 32 px.
**Interlettrage :** +1 px sur les labels en MAJUSCULES.

Recommandations :
- Un seul niveau de titre par bloc, hiérarchie claire (32 → 24 → 18).
- Corps de texte à 14 px minimum en UI.
- Le monospace signale visuellement « ceci est du contenu technique / un mode » — c'est un
  marqueur d'identité (le no-code lit du JSON déclaratif, jamais du code arbitraire).

---

## 6. Iconographie & style visuel

**Direction artistique : néon sur fond sombre (« deep space + neon setup »).**

- **Fond :** toujours partir du `--nx-bg` (`#0B0E14`) ou d'une surface sombre.
- **Icônes :** style linéaire (stroke), coins légèrement arrondis, épaisseur de trait
  régulière (≈ 1,5–2 px à taille de base). Bibliothèque de référence : **Lucide**
  (*Hypothèse*, cohérente avec un stack React). Icônes en `--nx-text` ou `--nx-muted`,
  accent cyan/violet/magenta pour l'état actif.
- **Glow :** halos néon subtils (ombres colorées floutées) autour des éléments actifs et
  du swirl. Rester mesuré — le glow souligne, il n'envahit pas.
- **Photographie / captures :** setups gaming réels, RGB, lumières Philips Hue, ambiances
  tamisées ; teintes froides dominantes cohérentes avec la palette.
- **Formes :** arrondis doux (rayons 8–16 px sur les cartes), beaucoup d'espace négatif,
  composition aérée.

**À éviter :** icônes pleines multicolores incohérentes, dégradés arc-en-ciel hors
signature, fonds clairs criards, skeuomorphisme, surcharge d'effets.

---

## 7. Exemples d'application

### 7.1 Icône d'application

Symbole swirl sur fond `--nx-bg`, glow cyan/violet léger, coins arrondis selon les gabarits
OS (Windows, Linux). Version simplifiée du swirl pour les très petites tailles (favicon).

### 7.2 Bannières réseaux sociaux

- **Format :** fond deep space, dégradé signature en accent (coin ou trait), mot-marque en
  Inter 800, une phrase-bénéfice courte.
- **Instagram / avatar :** symbole seul centré, glow.
- **LinkedIn (bannière profil/page) :** lockup + tagline « jouer, streamer ou chiller sans
  friction », visuel de setup en arrière-plan assombri.
- **Cohérence :** même gabarit, même marge (zone de protection respectée), même
  positionnement du logo d'un post à l'autre.

### 7.3 Captures d'UI (screenshots)

- Toujours présenter l'app en **thème sombre** (thème primaire).
- Encadrer les captures dans une fenêtre stylisée (barre de titre sombre, ombre douce).
- Mettre en valeur l'état « ON » (cyan) et l'effet avant/après (mode activé).
- Ajouter au besoin une légende monospace pour montrer un preset/mode.

### 7.4 Gabarit de post « avant / après »

Split-screen : à gauche le setup « avant » (froid, désordonné) ; à droite « après » un mode
Nexum (lumières réglées, ambiance) ; au centre le swirl + « 1 clic ».

---

## 8. Accessibilité

- **Contraste :** le texte courant sur `--nx-bg` / `--nx-surface` respecte **WCAG AA
  (≥ 4,5:1)**. Vérifier chaque nouvelle combinaison texte/fond.
- **Texte sur aplat cyan :** utiliser un texte **foncé** (`#04211A`), jamais blanc.
- **Ne jamais coder une information par la couleur seule** — toujours coupler à une icône
  ou un label (✓ / ✗, « Actif » / « Inactif »).
- **Taille de texte :** 14 px minimum en corps d'UI ; éviter le texte gris `--nx-muted`
  pour des informations critiques.
- **Glow & animations :** rester sobre ; prévoir le respect de `prefers-reduced-motion`
  pour les effets d'activation.
- **Cibles tactiles / cliquables :** viser 40 px minimum (*Hypothèse*, bonne pratique
  desktop/mobile).

---

## 9. Récapitulatif « do's & don'ts » de marque

| ✅ À faire | ❌ À ne pas faire |
|---|---|
| Thème sombre par défaut, néon en accent | Fonds clairs criards, arc-en-ciel |
| Ton direct, bénéfice d'abord | Superlatifs non prouvés, jargon |
| Dégradé signature réservé aux héros/logo | Dégradé sur du texte courant |
| Respecter tokens `PALETTE.md` à l'identique | Inventer de nouvelles couleurs |
| Coupler couleur + icône/label | Coder l'info par la couleur seule |
| Logo couleur sur fond sombre, sinon mono | Déformer / recolorer / ombrer le logo |
