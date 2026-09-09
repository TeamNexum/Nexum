# Guide d'entretien utilisateur & questionnaire — Nexum

> Document EIP (piste Entrepreneuriat) — support des **15 à 20 interviews utilisateurs** obligatoires.
> Cohérent avec `_BRIEF_PROJET.md` et `NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`.
> Objectif : **valider (ou invalider) le problème** avant de valider la solution.
> Langue des livrables : français. Dernière mise à jour : 2026-07-13.

---

## 1. Objectifs de la recherche

### 1.1 Question centrale
> Les gamers, streamers et télétravailleurs perdent-ils réellement du temps et de l'énergie à préparer/basculer leur environnement numérique, au point de payer pour l'automatiser ?

### 1.2 Sous-objectifs (ce que l'on cherche à apprendre)
1. **Existence et intensité du problème** : la friction de « mise en condition » (lancer/fermer des logiciels, régler audio/affichage, lumières, périphériques) est-elle vécue comme une vraie douleur ou une simple habitude ?
2. **Situation actuelle (le « comment font-ils aujourd'hui »)** : quels outils, scripts, routines manuelles, launchers, logiciels constructeurs sont utilisés ? Combien de temps cela prend-il réellement ?
3. **Fragmentation multi-marques** : combien de marques/écosystèmes différents cohabitent (hypothèse brief : >50 % des joueurs PC ≥ 3 marques) ? Est-ce vécu comme un problème ?
4. **Déclencheurs et contexte** : quand la douleur survient-elle (avant une session ranked, avant un direct, à la fin de la journée de télétravail) ?
5. **Coût du problème** : temps perdu, charge mentale, sessions ratées, oublis (micro resté coupé, Slack qui notifie pendant un direct…).
6. **Tentatives de solution passées** : ont-ils déjà essayé AutoHotkey, macros, profils Razer/iCUE, Stream Deck, routines domotiques ? Pourquoi ça a tenu ou échoué ?
7. **Appétence & willingness-to-pay** : seraient-ils prêts à installer une app tierce, à lui donner accès au système, à payer (~4,99 €/mois ou ~49 € lifetime) ?
8. **Freins & objections** : sécurité, anti-cheat, confiance, conso CPU/RAM, « je peux le faire moi-même ».
9. **Réaction au concept Nexum** (en fin d'entretien uniquement) : le concept de « modes » agnostiques no-code résonne-t-il ? Quelle fonctionnalité déclenche le « waouh » ?

### 1.3 Hypothèses à tester (formulées pour pouvoir être FAUSSES)
| # | Hypothèse | Comment on la validerait | Comment on l'invaliderait |
|---|---|---|---|
| H1 | La préparation d'une session est une friction ressentie et récurrente. | ≥ 60 % décrivent spontanément une routine pénible et chronophage. | Majorité indifférente / « ça prend 10 s, aucun souci ». |
| H2 | Les utilisateurs jonglent avec ≥ 3 outils/marques non synchronisés. | Comptage effectif d'outils cités ≥ 3 en moyenne. | La plupart n'utilisent qu'un écosystème unifié. |
| H3 | L'automatisation contextuelle (ex. après 18 h) a de la valeur. | Enthousiasme spontané sur le scénario Sarah. | « Je ne veux pas que mon PC décide à ma place. » |
| H4 | Une partie de la cible paierait un abonnement/lifetime. | ≥ 25 % expriment un WTP crédible + justifié. | WTP quasi nul, « seulement si gratuit ». |
| H5 | La barrière anti-cheat/sécurité n'est pas rédhibitoire si API officielles. | Objection levée après explication. | Refus catégorique d'installer une app système. |

> ⚠️ Règle d'or : on cherche à **apprendre**, pas à confirmer. Une interview qui invalide une hypothèse est un **succès** de recherche.

---

## 2. Méthodologie

### 2.1 Approche mixte
- **Qualitatif — entretiens semi-directifs individuels** (15 à 20, objectif obligatoire EIP). Durée cible : **30 à 40 min**. C'est la source principale d'insight (le « pourquoi »).
- **Quantitatif — Google Form** diffusé plus largement (cible ≥ 80-100 réponses). Sert à **mesurer** ce que le qualitatif fait **émerger** (le « combien »). Diffusion : Discord gaming, subreddits (r/pcgaming, r/Twitch, r/homeoffice, r/battlestations), serveurs d'écoles, LinkedIn, réseaux persos.

### 2.2 Principe directeur : le « Mom Test »
On applique les règles de *The Mom Test* (Rob Fitzpatrick) pour éviter de recueillir des compliments polis et sans valeur :
1. **Parler de la vie de l'interviewé, pas de notre idée.** On ne pitche PAS Nexum avant la toute fin.
2. **Poser des questions sur le passé concret, pas sur des opinions/futur hypothétique.** « Raconte-moi la dernière fois que… » et non « Est-ce que tu utiliserais… ».
3. **Chercher les faits et les comportements** (temps, argent déjà dépensé, outils installés), pas les intentions déclarées.
4. **Creuser les émotions** : quand la personne s'agace ou s'anime, demander « pourquoi ça t'embête ? ».
5. **Fuir les compliments et les généralités** (« ça pourrait être cool ») : les recentrer sur un fait vécu.

### 2.3 Déontologie & RGPD
- Consentement oral (et écrit pour le Form) enregistré avant l'entretien ; enregistrement audio **seulement** si accord explicite.
- Anonymisation des verbatims dans les livrables (Prénom + segment + âge).
- Droit de retrait ; pas de données sensibles collectées ; mention RGPD dans le Form (finalité, conservation, contact, suppression sur demande).

### 2.4 Logistique
- Recruteurs : membres de l'équipe EIP. Canal : visio (Discord/Meet) ou présentiel campus Marseille.
- Prise de notes : une personne interroge, une prend des notes (verbatims + timestamps). Sinon, notes immédiates < 2 h après.
- Outillage : trame ci-dessous imprimée, grille d'analyse (§7) remplie après chaque entretien.

---

## 3. Critères de recrutement par segment

Objectif : **couvrir les 3 personas** de façon équilibrée + un peu de diversité. Cible de répartition sur 15-20 entretiens :

| Segment | Persona de référence | Cible entretiens | Critères d'inclusion | Critères d'exclusion |
|---|---|---|---|---|
| **Gamers** | Léo, 22 ans | 6-8 | Joue sur PC ≥ 8 h/sem ; possède ≥ 2 périphériques de marques différentes ; joue à des titres compétitifs OU AAA. | Joue uniquement sur console ; joueur très occasionnel (< 2 h/sem). |
| **Streamers / créateurs** | Maxime, 28 ans | 4-6 | Diffuse en direct (Twitch/YouTube/Kick) ou enregistre du contenu régulièrement ; utilise OBS/Streamlabs + ≥ 2 sources. | N'a jamais streamé ; simple spectateur. |
| **Télétravailleurs** | Sarah, 34 ans | 4-6 | Télétravaille ≥ 2 j/sem sur un PC **aussi** utilisé en perso/loisir ; souhaite une séparation pro/perso. | PC pro fourni verrouillé (pas de droits d'admin, pas d'install possible). |

**Règles de recrutement pour limiter les biais :**
- Recruter **au-delà du cercle d'amis proches** (biais de complaisance). Viser ≥ 50 % d'inconnus / relations faibles.
- Mélanger niveaux techniques (du bidouilleur AutoHotkey au non-technique).
- Inclure des **profils « double casquette »** (ex. gamer + télétravailleur) : ce sont des cas d'usage riches.
- Noter systématiquement le segment pour l'analyse croisée.

---

## 4. Guide d'entretien semi-directif (30-40 min)

> Trame souple : on suit le fil de l'interviewé, on ne récite pas. Objectif de chaque bloc en italique. **On ne parle de Nexum qu'au Bloc 6.**

### Bloc 0 — Cadrage (2 min)
*But : mettre à l'aise, poser le cadre, obtenir le consentement.*
- Merci de ton temps. On fait des recherches sur la façon dont les gens utilisent leur PC ; **il n'y a pas de bonnes ou mauvaises réponses**, on veut juste comprendre ton quotidien.
- On n'a **rien à te vendre** aujourd'hui, sois totalement franc, y compris critique.
- Ça te va si je prends des notes ? / si j'enregistre l'audio (supprimé après analyse) ?

### Bloc 1 — Échauffement & contexte (5 min)
*But : profil, matériel, usage réel. Questions factuelles faciles.*
1. Peux-tu me décrire ton setup ? (PC, écrans, périphériques, marques, objets connectés/lumières.)
2. À quoi te sert principalement ce PC ? (jeu / stream / travail / mix)
3. Une journée type devant ce PC, ça ressemble à quoi ?
4. Combien de « casquettes » différentes ton PC porte-t-il dans une journée ? (travail, jeu, détente…)

### Bloc 2 — Découverte du problème, sans le nommer (10 min)
*But : faire raconter des situations concrètes et récentes. Chercher la friction sans la suggérer.*
5. **Raconte-moi la dernière fois que tu t'es installé pour [jouer sérieusement / lancer un direct / commencer ta journée de travail].** Déroule-moi tout, geste par geste, depuis le moment où tu t'assois.
6. Entre le moment où tu t'assois et le moment où tu es vraiment « dedans », qu'est-ce qui se passe exactement ?
7. Y a-t-il des choses que tu fais **à chaque fois** ? (lancer/fermer des logiciels, régler le son, la luminosité, les lumières, couper des notifs…)
8. La dernière fois, est-ce que quelque chose t'a agacé, ralenti, ou que tu as oublié de faire ? Raconte.
9. (Si friction évoquée) Ça t'arrive souvent ? Combien de temps ça te prend, à la louche ? Qu'est-ce que ça t'a « coûté » (temps, concentration, une manche perdue, un moment gênant en direct) ?
10. Quand tu passes d'une activité à une autre sur le même PC (ex. boulot → jeu), comment ça se passe concrètement ?

### Bloc 3 — Outils actuels & tentatives passées (8 min)
*But : cartographier la « concurrence » réelle (y compris le manuel et le « rien »).*
11. Aujourd'hui, utilises-tu des outils/logiciels pour gérer tout ça ? Lesquels ? (launchers, Razer Synapse, iCUE, Stream Deck, appli lumières, scripts…)
12. Comment tu t'en sers exactement ? Montre-moi si tu peux (partage d'écran).
13. As-tu déjà essayé d'**automatiser** ou de te faire une routine (macros, AutoHotkey, profils, minuteries domotiques) ? Qu'est-ce qui s'est passé ?
14. (Si abandon) Pourquoi tu as arrêté / pourquoi ça ne t'a pas convaincu ?
15. Combien de marques/écosystèmes différents cohabitent dans ton setup ? Est-ce qu'ils « parlent » entre eux ou pas du tout ?
16. As-tu déjà **dépensé de l'argent** (matériel, logiciel, abonnement) pour améliorer ce confort/cette rapidité ? Quoi ?

### Bloc 4 — Impact & priorité (5 min)
*But : mesurer si le problème est « vitamine » ou « antidouleur ».*
17. Sur une échelle où 0 = « aucun souci » et 10 = « ça me pourrit vraiment mes sessions », tu situes ça où ? Pourquoi ce chiffre (et pas un de moins) ?
18. Si tu pouvais faire disparaître UNE friction de ta routine PC d'un claquement de doigts, ce serait laquelle ?
19. Est-ce un truc dont tu as parlé à d'autres, cherché une solution en ligne, ou pas du tout ?

### Bloc 5 — Contexte & automatisation (3 min)
*But : sonder l'appétence pour l'automatique/contextuel, toujours sans pitcher.*
20. Est-ce qu'il y a des moments où tu aimerais que ton environnement « sache » ce que tu vas faire ? (ex. le soir, en début de direct)
21. À l'inverse, y a-t-il des choses que tu ne voudrais **surtout pas** qu'un logiciel décide/change tout seul ?

### Bloc 6 — Réaction au concept Nexum (5-7 min) — **SEULEMENT ICI**
*But : présenter brièvement, puis écouter les réactions honnêtes et les objections.*
- Pitch neutre et court : « Certains imaginent une app qui, en un clic ou automatiquement, synchronise tout ton environnement — logiciels, son, écran, lumières, périphériques — selon ce que tu fais, via des "modes". Sans script, et qui marche avec des marques différentes. »
22. Spontanément, qu'est-ce que ça t'évoque ? (laisser parler, ne pas défendre l'idée)
23. Qu'est-ce qui te semblerait le plus utile là-dedans ? Le plus inutile ?
24. Qu'est-ce qui t'empêcherait de l'installer ou de t'en servir ? (confiance, sécurité, anti-cheat, conso, « je fais déjà sans »)
25. Le scénario « le soir à 18 h, le PC passe seul en mode détente : lumières tamisées, Slack coupé, musique lancée » — ça te parle ou ça te dérange ?
26. **Question d'engagement (test du sérieux) :** est-ce que tu accepterais de tester une bêta et de nous refaire un retour ? Est-ce que tu connais d'autres personnes que je devrais interroger ?

### Bloc 7 — Clôture (1 min)
27. Est-ce qu'il y a quelque chose d'important sur ce sujet que je ne t'ai pas demandé ?
- Merci ! (Demander l'autorisation de recontacter + coordonnées.)

> **Questions à NE PAS poser (biaisées) :** « Tu aimerais une app qui fait X ? », « Tu paierais pour gagner du temps ? », « Tu trouves pas ça génial ? », « Combien tu paierais ? » (avant d'avoir établi la douleur). Ces questions mènent à des réponses de politesse. On les remplace par des questions sur le passé et le concret.

---

## 5. Google Form quantitatif (20-30 questions)

> Introduction du Form : objet, durée (~5 min), anonymat, mention RGPD, consentement. Logique de saut selon le profil.
> Types : QCM (choix unique/multiple), échelle de Likert (1-5), échelle 0-10, champ libre court.

### Section A — Profil & démographie (6)
| # | Question | Type / options |
|---|---|---|
| Q1 | Quel âge as-tu ? | < 18 / 18-24 / 25-34 / 35-44 / 45+ |
| Q2 | Genre (facultatif) | Femme / Homme / Autre / Préfère ne pas dire |
| Q3 | Quel profil te décrit le mieux ? (plusieurs possibles) | Gamer / Streamer-créateur / Télétravailleur / Autre |
| Q4 | Pays / région | Champ libre |
| Q5 | Comment évalues-tu ton niveau technique en informatique ? | 1 (débutant) → 5 (expert) |
| Q6 | Sur quel(s) OS joues/travailles-tu principalement ? | Windows / macOS / Linux / autre (multi) |

### Section B — Équipement & écosystème (6)
| # | Question | Type / options |
|---|---|---|
| Q7 | Combien d'heures/semaine passes-tu sur PC pour le **jeu** ? | 0 / <2 / 2-8 / 8-20 / >20 |
| Q8 | Combien d'heures/semaine pour le **travail** sur ce même PC ? | 0 / <10 / 10-25 / 25-40 / >40 |
| Q9 | Combien de **marques différentes** de périphériques possèdes-tu (souris, clavier, casque, micro, RGB…) ? | 1 / 2 / 3 / 4 / 5+ |
| Q10 | Quelles catégories possèdes-tu ? (multi) | Souris/clavier gaming / Casque-micro / Éclairage RGB / Lampes connectées (Hue…) / Stream Deck / Autres objets connectés / Aucun |
| Q11 | Utilises-tu des lumières/objets connectés dans ton espace PC ? | Oui / Non / J'aimerais |
| Q12 | Ton PC sert-il **à la fois** au travail ET aux loisirs ? | Oui, tous les jours / Parfois / Non, séparés |

### Section C — Habitudes & friction actuelle (8)
| # | Question | Type / options |
|---|---|---|
| Q13 | Avant une session (jeu/stream/travail), combien de temps te prend la « mise en condition » (ouvrir/fermer logiciels, régler son/écran/lumières) ? | Aucune / < 1 min / 1-3 min / 3-5 min / > 5 min |
| Q14 | À quelle fréquence fais-tu ces réglages **manuellement** et **répétitivement** ? | Jamais / Rarement / Souvent / À chaque session |
| Q15 | Combien de logiciels/applis lances-tu ou fermes-tu typiquement au début d'une session ? | 0-1 / 2-3 / 4-6 / 7+ |
| Q16 | À quel point cette préparation t'agace-t-elle ? | 0 (pas du tout) → 10 (énormément) |
| Q17 | T'est-il déjà arrivé d'**oublier** un réglage important (micro coupé, notif pendant un direct, appli oubliée) ? | Jamais / 1-2 fois / Régulièrement / Souvent |
| Q18 | Utilises-tu déjà un outil pour gérer/automatiser tout ça ? (multi) | Non, tout à la main / Launcher (Steam…) / Logiciel constructeur (Synapse, iCUE…) / Stream Deck / Scripts (AutoHotkey…) / Appli domotique / Autre |
| Q19 | As-tu déjà essayé d'automatiser ta routine et **abandonné** ? | Jamais essayé / Essayé et gardé / Essayé et abandonné |
| Q20 | (Si abandon) Pourquoi principalement ? | Trop complexe / Trop long à configurer / Pas fiable / Limité à une marque / Autre |

### Section D — Attentes & réaction au concept (5)
| # | Question | Type / options |
|---|---|---|
| Q21 | Un logiciel qui synchronise tout ton environnement en un clic selon l'activité, ce serait pour toi… | Très utile / Utile / Neutre / Peu utile / Inutile |
| Q22 | Parmi ces fonctions, laquelle t'attire le plus ? (classe / choix unique) | Basculer logiciels & réglages en 1 clic / Automatisation contextuelle (ex. après 18 h) / Contrôle lumières & périphériques multi-marques / Modes décrits en langage naturel (IA) / Partager/importer des modes |
| Q23 | L'automatisation contextuelle (le PC change seul selon l'heure/l'activité), ça te… | Séduit / Intéresse / Indiffère / Inquiète |
| Q24 | Quel serait ton principal frein à installer une telle app ? | Sécurité/confiance / Peur de l'anti-cheat / Conso ressources / Je fais déjà sans / Prix / Aucun |
| Q25 | Accepterais-tu de donner à cette app l'accès système nécessaire (gérer process, audio, écran) ? | Oui / Oui si éditeur de confiance / Plutôt non / Non |

### Section E — Willingness-to-pay (4)
| # | Question | Type / options |
|---|---|---|
| Q26 | Pour un tel outil, tu partirais plutôt sur… | Gratuit uniquement / Abonnement mensuel / Achat unique à vie / Ne sais pas |
| Q27 | Un abonnement à **4,99 €/mois** (modes illimités, sync cloud, IA) te semble… | Trop cher / Un peu cher / Correct / Bon marché |
| Q28 | Une licence **à vie à ~49 €** te semble… | Trop cher / Un peu cher / Correct / Bon marché |
| Q29 | Quel prix mensuel te paraîtrait « juste » pour ce produit ? | 0 € / 1-2 € / 3-5 € / 6-9 € / 10 €+ |
| Q30 | Accepterais-tu de tester une **bêta gratuite** et de nous faire un retour ? | Oui (+ e-mail facultatif) / Non |

> **Notes anti-biais du Form :** proposer systématiquement une option neutre/négative ; ne pas mettre en avant Nexum comme « la solution géniale » ; sur le WTP, tester des paliers (méthode inspirée de Van Westendorp « trop cher / bon marché ») plutôt qu'une question ouverte isolée ; randomiser l'ordre des items en Q22 si possible.

---

## 6. Cohérence prix / marché (rappel brief)
Les paliers testés (Q27-Q29) reprennent le modèle économique du brief : **Freemium** (3 modes max), **Premium ~4,99 €/mois**, **Lifetime ~49 €**. Les réponses alimenteront les **projections financières** et le **Business Model Canvas** (livrables EIP obligatoires).

---

## 7. Grille d'analyse des réponses

### 7.1 Fiche de synthèse par entretien (à remplir après chaque interview)
| Champ | Contenu |
|---|---|
| Code interviewé | ex. G-03 (segment + n°) |
| Segment / persona | Gamer / Streamer / Télétravailleur (+ double casquette ?) |
| Profil & setup | Résumé (marques, nb d'outils, niveau technique) |
| Situation actuelle | Comment il fait aujourd'hui (outils cités) |
| Douleur principale | Verbatim + intensité 0-10 |
| Temps perdu estimé | Déclaré / observé |
| Preuve de douleur réelle | A déjà bricolé/payé/cherché une solution ? (oui/non + quoi) |
| Réaction au concept | Enthousiasme / neutre / sceptique + verbatim |
| Fonction la plus désirée | … |
| Objection principale | … |
| Signal WTP | Fort / moyen / nul + citation |
| Engagement | Accepte bêta ? Réfère quelqu'un ? |
| Hypothèses touchées | H1…H5 : validée / nuancée / invalidée |
| Verbatims marquants | 2-3 citations |
| Surprise / insight | Ce qu'on n'avait pas anticipé |

### 7.2 Analyse qualitative transversale
- **Codage thématique** : regrouper les verbatims par thèmes (friction préparation, fragmentation multi-marques, oublis gênants, refus d'automatisation, peur anti-cheat, WTP…). Compter les occurrences par segment.
- **Matrice douleurs × segments** : quelles douleurs sont universelles vs. propres à un persona.
- **Distinguer déclaratif vs. comportemental** : ne pondérer fortement que les douleurs appuyées par un fait (temps mesuré, argent dépensé, solution déjà tentée). Un « ce serait cool » compte peu.
- **Cartographie des solutions concurrentes réelles** (y compris « rien » et « manuel »).

### 7.3 Tableau de dépouillement des hypothèses
| Hypothèse | Validée (n/N) | Nuancée | Invalidée | Décision |
|---|---|---|---|---|
| H1 friction ressentie | | | | Continuer / pivoter / affiner |
| H2 ≥ 3 marques | | | | |
| H3 valeur de l'automatisation | | | | |
| H4 willingness-to-pay | | | | |
| H5 objection sécurité surmontable | | | | |

### 7.4 Indicateurs quantitatifs à sortir du Google Form
- % ayant une routine manuelle « souvent / à chaque session » (Q14).
- Temps de préparation médian (Q13).
- Score d'agacement moyen 0-10 par segment (Q16).
- % avec ≥ 3 marques de périphériques (Q9) — test direct de la stat « >50 % » du brief.
- % ayant essayé puis abandonné une automatisation (Q19) + raisons (Q20).
- % « très utile / utile » sur le concept (Q21) et fonction la plus désirée (Q22).
- Répartition du modèle de prix préféré (Q26) + prix « juste » médian (Q29) → **WTP**.
- % acceptant une bêta (Q30) → **taille de la liste d'early adopters**.
- Croisements clés : agacement × nb de marques ; WTP × segment ; frein principal × niveau technique.

### 7.5 Critères de décision (sortie de la phase de recherche)
- **Consolidation** (on garde le cap) : H1 + (H2 ou H3) validées ET signal WTP ≥ seuil.
- **Pivot / affinage** : problème confirmé mais cible/fonction prioritaire différente de l'hypothèse (ex. les télétravailleurs plus douloureux que les gamers) → réorienter le MVP.
- **Alerte** : problème peu ressenti et WTP nul → repositionner la proposition de valeur.
> Ces conclusions nourrissent les **2 cycles d'itération MVP** et l'argumentaire « pivot ou consolidation » exigés par l'EIP (voir roadmap §9).

---

## 8. Checklist logistique de campagne
- [ ] Recruter et planifier 15-20 entretiens (répartition §3).
- [ ] Trame imprimée + fiche de synthèse §7.1 prête.
- [ ] Google Form créé, testé, mention RGPD, diffusé sur ≥ 4 canaux.
- [ ] Binôme intervieweur / preneur de notes défini.
- [ ] Tableur de dépouillement (§7.3, §7.4) prêt.
- [ ] Synthèse écrite + décision (§7.5) partagée à l'équipe et au référent EIP.
