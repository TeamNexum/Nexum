# Questionnaire quantitatif (Google Form) — prêt à saisir — Nexum

> Document EIP (piste **Entrepreneuriat**) — projet **Nexum**, PROMO 2028, campus Marseille.
> Source de vérité : `docs/eip/_BRIEF_PROJET.md`. Dérivé de la partie quantitative de
> `docs/eip/QUESTIONNAIRE_INTERVIEWS.md` (§5). Langue : français.
> Dernière mise à jour : 2026-07-13.
>
> **But du document.** Spécification prête à recopier telle quelle dans Google Forms. Chaque
> question indique : son **type exact** Google Forms, ses **options exactes**, sa **logique
> conditionnelle** (sauts de section), et son caractère **obligatoire** ou non.
> Cible de diffusion : **≥ 80–100 réponses** (Discord gaming, subreddits, écoles, LinkedIn).
> Durée de remplissage visée : **~5 min**.

---

## 0. Paramètres du formulaire (à régler dans Google Forms)

**Titre du formulaire :**
> **Nexum — Comment prépares-tu ton PC pour jouer, streamer ou travailler ?**

**Description d'introduction (à coller dans le champ description sous le titre) :**

> Merci de participer ! Nous sommes une équipe étudiante Epitech (projet de fin d'études **Nexum**).
> Nous cherchons à comprendre **comment les gens utilisent et préparent leur PC** au quotidien —
> pour le jeu, le streaming ou le travail. **Il n'y a pas de bonnes ou de mauvaises réponses**,
> nous voulons juste comprendre ton usage réel.
>
> ⏱️ **Durée : ~5 minutes.** Le questionnaire est **anonyme** (l'e-mail, en toute fin, est
> facultatif et sert uniquement au recrutement de bêta-testeurs volontaires).
>
> 🔒 **Protection des données (RGPD).** Les réponses sont collectées à des fins de **recherche
> utilisateur** pour ce projet étudiant, **conservées au maximum 12 mois**, puis supprimées.
> Aucune donnée sensible n'est demandée. Tu peux demander la **suppression** de tes réponses à
> tout moment en écrivant à **eip-nexum@epitech.eu** (adresse projet). En cochant la case de
> consentement ci-dessous et en soumettant le formulaire, tu acceptes ce traitement.
>
> **En cas de doute, tu peux fermer cette page : rien n'est enregistré tant que tu n'as pas
> cliqué sur « Envoyer ».**

**Réglages Google Forms recommandés (onglet ⚙️ Paramètres) :**
- **Collecter les adresses e-mail : DÉSACTIVÉ** (l'anonymat est une promesse ; l'e-mail bêta est un champ libre facultatif en fin de form, Q30).
- **Limiter à 1 réponse : DÉSACTIVÉ** (pas de connexion Google exigée → maximise le volume ; risque de doublon accepté).
- **Barre de progression : ACTIVÉE** (form multi-sections).
- **Mélanger l'ordre des questions : NON** au niveau global, mais **« Mélanger l'ordre des options » ACTIVÉ sur Q22** (anti-biais d'ordre).
- **Message de confirmation :** « Merci ! Ton retour nous aide vraiment. Si tu as laissé ton e-mail, on te recontactera pour la bêta. »
- **Thème :** neutre, ne pas survendre Nexum (anti-biais de complaisance).

**Structure en sections (logique de saut) :**
- **Section 1** — Consentement (Q0).
- **Section 2** — Profil & démographie (Q1–Q6). Le champ **Q3 (profil)** pilote l'affichage des blocs.
- **Section 3** — Équipement & écosystème (Q7–Q12).
- **Section 4** — Habitudes & friction (Q13–Q20).
- **Section 5** — Attentes & réaction au concept (Q21–Q25).
- **Section 6** — Prix / willingness-to-pay (Q26–Q29).
- **Section 7** — Recrutement bêta & clôture (Q30 + question ouverte facultative).

> **Note sur les sauts conditionnels.** Google Forms ne permet le saut de section que depuis une
> question à **choix unique** (menu déroulant ou boutons radio) via « Accéder à la section en
> fonction de la réponse ». Le seul saut réellement utilisé ici est piloté par **Q20** (question
> conditionnelle sur l'abandon d'automatisation) — voir la note sous Q19/Q20. Les autres sections
> s'enchaînent linéairement (« Passer à la section suivante »). On garde volontairement peu de
> branches pour ne pas fragiliser le taux de complétion.

---

## Section 1 — Consentement

### Q0 — Consentement RGPD
- **Type Google Forms :** Cases à cocher (une seule case servant de validation obligatoire).
- **Option (unique à cocher) :** « ✅ J'ai lu l'information ci-dessus et j'accepte que mes réponses anonymes soient utilisées pour cette recherche. »
- **Obligatoire :** ✅ **Oui.** (Activer « Réponse obligatoire ». Astuce : on peut ajouter une validation « au moins 1 case cochée ».)
- **Logique :** aucune. → Passer à la section suivante.

---

## Section 2 — Profil & démographie (6 questions)

### Q1 — Âge
- **Type :** Choix multiple (boutons radio, choix unique).
- **Options :** `< 18` / `18-24` / `25-34` / `35-44` / `45+`
- **Obligatoire :** ✅ Oui.

### Q2 — Genre
- **Type :** Choix multiple (choix unique).
- **Options :** `Femme` / `Homme` / `Autre` / `Préfère ne pas dire`
- **Obligatoire :** ❌ Non (question facultative, sensible).

### Q3 — Quel profil te décrit le mieux ? *(plusieurs réponses possibles)*
- **Type :** Cases à cocher (choix multiple).
- **Options :** `Gamer` / `Streamer / créateur de contenu` / `Télétravailleur` / `Autre`
- **Obligatoire :** ✅ Oui.
- **Rôle :** question de **segmentation** clé pour tous les croisements d'analyse. *(Comme c'est une case à cocher, elle ne peut pas piloter de saut de section dans Google Forms ; on garde donc tous les répondants sur le même parcours et on segmente à l'analyse. « Hypothèse » : un même répondant peut cumuler plusieurs casquettes — cas d'usage riche, cf. brief.)*

### Q4 — Pays / région
- **Type :** Réponse courte (texte).
- **Validation :** aucune (laisser libre pour éviter les frictions).
- **Obligatoire :** ❌ Non.

### Q5 — Niveau technique en informatique
- **Type :** Échelle linéaire.
- **Bornes :** `1` = « Débutant » → `5` = « Expert ».
- **Obligatoire :** ✅ Oui.

### Q6 — OS principal utilisé pour jouer / travailler *(plusieurs possibles)*
- **Type :** Cases à cocher (choix multiple).
- **Options :** `Windows` / `macOS` / `Linux` / `Autre`
- **Obligatoire :** ✅ Oui.

---

## Section 3 — Équipement & écosystème (6 questions)

### Q7 — Heures/semaine sur PC pour le **jeu**
- **Type :** Choix multiple (choix unique).
- **Options :** `0` / `< 2 h` / `2-8 h` / `8-20 h` / `> 20 h`
- **Obligatoire :** ✅ Oui.

### Q8 — Heures/semaine sur ce même PC pour le **travail**
- **Type :** Choix multiple (choix unique).
- **Options :** `0` / `< 10 h` / `10-25 h` / `25-40 h` / `> 40 h`
- **Obligatoire :** ✅ Oui.

### Q9 — Nombre de **marques différentes** de périphériques possédées *(souris, clavier, casque, micro, RGB…)*
- **Type :** Choix multiple (choix unique).
- **Options :** `1` / `2` / `3` / `4` / `5+`
- **Obligatoire :** ✅ Oui.
- **Rôle :** test direct de la statistique du brief « **> 50 % des joueurs PC ≥ 3 marques** ».

### Q10 — Quelles **marques** de périphériques / matériel possèdes-tu ? *(plusieurs possibles)*
- **Type :** Cases à cocher (choix multiple).
- **Options :** `Logitech` / `Razer` / `Corsair` / `SteelSeries` / `HyperX` / `Elgato` / `Philips Hue` / `Nanoleaf` / `Marque du PC (Dell, HP, Asus, MSI…)` / `Autre` / `Je ne sais pas`
- **Obligatoire :** ✅ Oui.
- **Note de saisie :** activer l'option **« Autre »** native de Google Forms (champ texte) en plus de la liste.

### Q11 — Quelles **catégories** de périphériques/objets possèdes-tu ? *(plusieurs possibles)*
- **Type :** Cases à cocher (choix multiple).
- **Options :** `Souris / clavier gaming` / `Casque - micro` / `Éclairage RGB (bandeaux, ventilos…)` / `Lampes connectées (Philips Hue, Nanoleaf…)` / `Stream Deck` / `Autres objets connectés (prises, capteurs…)` / `Aucun`
- **Obligatoire :** ✅ Oui.

### Q12 — Utilises-tu des lumières / objets connectés dans ton espace PC ?
- **Type :** Choix multiple (choix unique).
- **Options :** `Oui` / `Non` / `Pas encore, mais j'aimerais`
- **Obligatoire :** ✅ Oui.

### Q13 — Ton PC sert-il **à la fois** au travail ET aux loisirs ?
- **Type :** Choix multiple (choix unique).
- **Options :** `Oui, tous les jours` / `Parfois` / `Non, ils sont séparés`
- **Obligatoire :** ✅ Oui.

---

## Section 4 — Habitudes & friction actuelle (7 questions)

### Q14 — Temps de « mise en condition » avant une session *(ouvrir/fermer logiciels, régler son/écran/lumières)*
- **Type :** Choix multiple (choix unique).
- **Options :** `Aucune préparation` / `< 1 min` / `1-3 min` / `3-5 min` / `> 5 min`
- **Obligatoire :** ✅ Oui.

### Q15 — Fréquence de ces réglages faits **manuellement** et de façon répétitive
- **Type :** Choix multiple (choix unique).
- **Options :** `Jamais` / `Rarement` / `Souvent` / `À chaque session`
- **Obligatoire :** ✅ Oui.

### Q16 — Nombre de logiciels/applis lancés ou fermés au début d'une session
- **Type :** Choix multiple (choix unique).
- **Options :** `0-1` / `2-3` / `4-6` / `7+`
- **Obligatoire :** ✅ Oui.

### Q17 — À quel point cette préparation t'agace-t-elle ?
- **Type :** Échelle linéaire.
- **Bornes :** `0` = « Pas du tout » → `10` = « Énormément ».
- **Obligatoire :** ✅ Oui.
- **Note de saisie :** Google Forms limite l'échelle linéaire à une plage de **0 à 10** — utiliser exactement `0` et `10` comme bornes, avec libellés.

### Q18 — T'est-il déjà arrivé d'**oublier** un réglage important *(micro coupé, notif pendant un direct, appli oubliée)* ?
- **Type :** Choix multiple (choix unique).
- **Options :** `Jamais` / `1-2 fois` / `Régulièrement` / `Souvent`
- **Obligatoire :** ✅ Oui.

### Q19 — Utilises-tu déjà un outil pour gérer/automatiser tout ça ? *(plusieurs possibles)*
- **Type :** Cases à cocher (choix multiple).
- **Options :** `Non, tout à la main` / `Launcher (Steam, Epic…)` / `Logiciel constructeur (Razer Synapse, Corsair iCUE…)` / `Stream Deck` / `Scripts (AutoHotkey, macros…)` / `Appli domotique (Philips Hue, routines…)` / `Autre`
- **Obligatoire :** ✅ Oui.

### Q20 — As-tu déjà essayé d'automatiser ta routine, et gardé ou abandonné ?
- **Type :** Choix multiple (choix unique) — **question pilote de saut**.
- **Options + logique :**
  - `Jamais essayé` → **Aller à la section 5** (saute Q21).
  - `Essayé et gardé` → **Aller à la section 5** (saute Q21).
  - `Essayé puis abandonné` → **Continuer** (affiche Q21).
- **Obligatoire :** ✅ Oui.
- **Note de saisie :** placer Q20 **en dernière question de sa propre sous-section** pour que le saut « Accéder à la section en fonction de la réponse » fonctionne, puis mettre **Q21 seule dans une mini-section conditionnelle** (« Section 4b — Si tu as abandonné »), dont la fin renvoie à la Section 5.

### Q21 — *(Conditionnelle — uniquement si « Essayé puis abandonné » en Q20)* Pourquoi as-tu principalement abandonné ?
- **Type :** Choix multiple (choix unique).
- **Options :** `Trop complexe` / `Trop long à configurer` / `Pas fiable` / `Limité à une seule marque` / `Autre`
- **Obligatoire :** ❌ Non (n'apparaît que pour un sous-ensemble ; ne pas bloquer).
- **Logique :** fin de section → **Aller à la section 5**.

---

## Section 5 — Attentes & réaction au concept (5 questions)

> **Note anti-biais.** Le concept n'est présenté qu'ici, brièvement et sans emphase commerciale.
> Chaque question propose systématiquement une **option neutre/négative** crédible.

**Texte d'intro de section (à coller) :**
> Certaines personnes imaginent une app qui, **en un clic ou automatiquement**, synchronise tout
> ton environnement — logiciels, son, écran, lumières, périphériques — **selon ce que tu fais**,
> via des « modes », **sans script** et **avec des marques différentes**. Les questions suivantes
> portent sur ce concept. Sois franc, y compris critique.

### Q22 — Un logiciel qui synchronise tout ton environnement en un clic selon l'activité, ce serait pour toi…
- **Type :** Choix multiple (choix unique).
- **Options :** `Très utile` / `Utile` / `Neutre` / `Peu utile` / `Inutile`
- **Obligatoire :** ✅ Oui.

### Q23 — Parmi ces fonctions, laquelle t'attire le plus ?
- **Type :** Choix multiple (choix unique).
- **Options :**
  - `Basculer logiciels & réglages en 1 clic`
  - `Automatisation contextuelle (ex. passage auto en mode détente après 18 h)`
  - `Contrôle lumières & périphériques multi-marques`
  - `Modes décrits en langage naturel (IA)`
  - `Partager / importer des modes (communauté)`
- **Obligatoire :** ✅ Oui.
- **Note de saisie :** **activer « Mélanger l'ordre des options »** sur cette question (menu ⋮ de la question) — anti-biais d'ordre.

### Q24 — L'automatisation contextuelle (le PC change seul selon l'heure/l'activité), ça te…
- **Type :** Choix multiple (choix unique).
- **Options :** `Séduit` / `Intéresse` / `Indiffère` / `Inquiète`
- **Obligatoire :** ✅ Oui.

### Q25 — Ton principal **frein** à installer une telle app ?
- **Type :** Choix multiple (choix unique).
- **Options :** `Sécurité / confiance` / `Peur de l'anti-cheat` / `Consommation de ressources (CPU/RAM)` / `Je fais déjà sans` / `Prix` / `Aucun frein`
- **Obligatoire :** ✅ Oui.

### Q26 — Accepterais-tu de donner à cette app l'accès système nécessaire *(gérer process, audio, écran)* ?
- **Type :** Choix multiple (choix unique).
- **Options :** `Oui` / `Oui, si éditeur de confiance` / `Plutôt non` / `Non`
- **Obligatoire :** ✅ Oui.

---

## Section 6 — Willingness-to-pay (4 questions)

> **Note anti-biais (Van Westendorp simplifié).** On teste des **paliers de prix** avec des bornes
> « trop cher » et « bon marché » plutôt qu'une seule question ouverte, pour capter la
> sensibilité-prix sans induire de valeur.

### Q27 — Pour un tel outil, tu partirais plutôt sur…
- **Type :** Choix multiple (choix unique).
- **Options :** `Gratuit uniquement` / `Abonnement mensuel` / `Achat unique à vie` / `Ne sais pas`
- **Obligatoire :** ✅ Oui.

### Q28 — Un abonnement à **4,99 €/mois** (modes illimités, sync cloud, IA) te semble…
- **Type :** Choix multiple (choix unique).
- **Options :** `Trop cher` / `Un peu cher` / `Correct` / `Bon marché`
- **Obligatoire :** ✅ Oui.

### Q29 — Une licence **à vie à ~49 €** te semble…
- **Type :** Choix multiple (choix unique).
- **Options :** `Trop cher` / `Un peu cher` / `Correct` / `Bon marché`
- **Obligatoire :** ✅ Oui.

### Q30 — Quel **prix mensuel** te paraîtrait « juste » pour ce produit ?
- **Type :** Liste déroulante (menu déroulant).
- **Options :** `0 €` / `1-2 €` / `3-5 €` / `6-9 €` / `10 € et +`
- **Obligatoire :** ✅ Oui.

---

## Section 7 — Recrutement bêta & clôture (2 questions)

### Q31 — Accepterais-tu de tester une **bêta gratuite** de Nexum et de nous faire un retour ?
- **Type :** Choix multiple (choix unique).
- **Options :** `Oui, avec plaisir` / `Peut-être` / `Non`
- **Obligatoire :** ✅ Oui.

### Q32 — *(Facultatif)* Ton e-mail, uniquement si tu veux être recontacté pour la bêta
- **Type :** Réponse courte (texte).
- **Validation :** activer la validation **« Adresse e-mail »** de Google Forms (message d'erreur : « Format d'e-mail invalide »).
- **Obligatoire :** ❌ **Non.** (Préserve l'anonymat : l'e-mail est le **seul** champ nominatif et il est optionnel.)
- **Texte d'aide :** « Ton e-mail ne sera utilisé que pour la bêta et jamais partagé. Tu peux demander sa suppression à eip-nexum@epitech.eu. »

### Question ouverte finale *(facultative, bonus qualitatif)*
- **Type :** Paragraphe (texte long).
- **Libellé :** « Un dernier mot ? Une frustration liée à ton setup PC dont on n'a pas parlé ? »
- **Obligatoire :** ❌ Non.

---

## Récapitulatif — couverture thématique (32 items, dont 30 questions de fond)

| Thème | Questions |
|---|---|
| Consentement / RGPD | Q0 |
| Démographie | Q1, Q2, Q4, Q5 |
| Profil / segmentation | Q3, Q6, Q7, Q8 |
| Équipement (marques, nb périphériques) | Q9, Q10, Q11 |
| Objets connectés / usage mixte | Q12, Q13 |
| Habitudes de setup | Q14, Q15, Q16 |
| Temps perdu / frustration | Q17, Q18 |
| Solutions actuelles / tentatives | Q19, Q20, Q21 |
| Intérêt pour le concept | Q22, Q23, Q24 |
| Freins / objections | Q25, Q26 |
| Willingness-to-pay (fourchettes) | Q27, Q28, Q29, Q30 |
| Recrutement bêta (e-mail optionnel) | Q31, Q32 |
| Bonus qualitatif | Question ouverte finale |

> **Indicateurs à extraire** (voir `QUESTIONNAIRE_INTERVIEWS.md` §7.4) : % routine manuelle
> « souvent / à chaque session » (Q15), temps de prépa médian (Q14), agacement moyen 0-10 par
> segment (Q17), % ≥ 3 marques (Q9, test de la stat « > 50 % »), % abandon d'automatisation (Q20)
> + raisons (Q21), % « très utile / utile » (Q22), prix « juste » médian (Q30 → WTP), % bêta (Q31
> → taille de la liste d'early adopters). Croisements : agacement × nb de marques ; WTP × segment ;
> frein × niveau technique.
