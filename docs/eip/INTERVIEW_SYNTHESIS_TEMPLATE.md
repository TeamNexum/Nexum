# Gabarit de synthèse d'entretiens — Nexum

> Document EIP (piste **Entrepreneuriat**) — projet **Nexum**, PROMO 2028, campus Marseille.
> Source de vérité : `docs/eip/_BRIEF_PROJET.md`. Support amont : `docs/eip/QUESTIONNAIRE_INTERVIEWS.md`.
> Langue : français. Dernière mise à jour : 2026-07-13.
>
> **But.** Gabarit **réutilisable** pour dépouiller les **15 à 20 entretiens** obligatoires de la
> phase de validation marché. On applique la règle d'or du *Mom Test* : ne pondérer fortement que
> les douleurs **appuyées par un fait** (temps mesuré, argent dépensé, solution déjà tentée) ; un
> « ce serait cool » compte peu.
>
> **Mode d'emploi.** 1) Remplir **une fiche §2 par entretien** (< 2 h après). 2) Reporter chaque
> fiche dans la **grille transversale §3**. 3) Regrouper les verbatims dans la **matrice d'affinité
> §4**. 4) Trancher dans **§5 (insights & décisions)** selon des critères chiffrés.
>
> ⚠️ Anonymisation RGPD : identifier par **code** (segment + n°), jamais par nom complet.
> Format du code : `G-01` (Gamer), `S-01` (Streamer), `T-01` (Télétravailleur), suffixe `+` si
> double casquette (ex. `G-03+` = gamer aussi télétravailleur).

---

## 1. Table de suivi des entretiens

| Code | Date | Segment | Double casquette | Durée | Canal | Intervieweur / Notes | Fiche remplie |
|---|---|---|---|---|---|---|---|
| G-01 | | Gamer | | | | | ☐ |
| G-02 | | Gamer | | | | | ☐ |
| … | | | | | | | ☐ |

> Cible de répartition (cf. `QUESTIONNAIRE_INTERVIEWS.md` §3) : **6-8 Gamers**, **4-6 Streamers**,
> **4-6 Télétravailleurs**, dont **≥ 50 % d'inconnus / relations faibles** (anti-biais de complaisance).

---

## 2. Fiche de synthèse par entretien *(dupliquer ce bloc pour chaque interview)*

### Fiche — `[CODE]`

| Champ | Contenu |
|---|---|
| **Code interviewé** | ex. G-03 |
| **Date / durée / canal** | |
| **Segment / persona** | Gamer (Léo) / Streamer (Maxime) / Télétravailleur (Sarah) — + double casquette ? |
| **Profil & setup** | Âge, marques citées, nb de périphériques, nb d'écrans, objets connectés, niveau technique 1-5 |
| **Usage du PC** | Jeu / stream / travail / mix — nb de « casquettes » par jour |
| **Situation actuelle** | Comment il/elle fait aujourd'hui (outils cités : launchers, Synapse, iCUE, Stream Deck, scripts, domotique, ou « rien / manuel ») |
| **Douleur principale** | Description + **intensité 0-10** (Q17 du guide) |
| **Temps perdu estimé** | Déclaré / observé (min par session, fréquence) |
| **Preuve de douleur réelle** | A déjà **bricolé / payé / cherché** une solution ? (oui/non + quoi) — *pondération forte* |
| **Réaction au concept** | Enthousiaste / neutre / sceptique (+ verbatim) — **recueilli en fin d'entretien uniquement** |
| **Fonction la plus désirée** | 1 clic / automatisation contextuelle / multi-marques / IA langage naturel / partage |
| **Fonction jugée inutile** | |
| **Objection principale** | Sécurité / anti-cheat / conso / « je fais déjà sans » / prix / autre |
| **Signal WTP** | Fort / moyen / nul (+ citation ; palier évoqué : gratuit / 4,99 € / 49 € lifetime) |
| **Engagement** | Accepte la bêta ? (oui/non) — Réfère quelqu'un ? (oui/non) |
| **Hypothèses touchées** | H1…H5 : validée / nuancée / invalidée (voir §3.2) |
| **Verbatims marquants** | 2-3 citations textuelles entre guillemets |
| **Surprise / insight** | Ce qu'on n'avait pas anticipé |

---

### Fiche — `G-01` — Léo B. « EXEMPLE »

> ⚠️ **EXEMPLE illustratif** (persona brief, non issu d'un vrai entretien) — à remplacer par des données réelles.

| Champ | Contenu |
|---|---|
| **Code interviewé** | G-01 |
| **Date / durée / canal** | 2026-09-14 / 34 min / Discord visio |
| **Segment / persona** | Gamer compétitif (persona Léo) — pas de double casquette |
| **Profil & setup** | 22 ans, étudiant. Souris Razer, clavier Corsair, casque HyperX, bandeau RGB Nanoleaf, 2 écrans. Niveau technique **4/5**. **4 marches différentes**. |
| **Usage du PC** | 90 % jeu (Valorant, LoL, quelques AAA), ~20 h/sem. 1 seule « casquette » claire. |
| **Situation actuelle** | Lance Steam + Riot Client à la main, coupe Chrome/Discord notifications, ouvre Razer Synapse pour le profil souris, allume les LED via l'appli Nanoleaf séparée. **Rien de synchronisé.** |
| **Douleur principale** | Le rituel avant une ranked : « je perds toujours 2-3 min à tout fermer pour ne pas lagguer ». Intensité **7/10**. |
| **Temps perdu estimé** | ~3 min/session, plusieurs fois/jour → déclaré crédible. |
| **Preuve de douleur réelle** | **Oui** : a bricolé un `.bat` pour tuer des process, abandonné car « ça relançait des trucs ». A acheté un clavier plus cher « pour les profils ». → *signal fort*. |
| **Réaction au concept** | Enthousiaste sur le 1 clic. « Si ça ferme tout le superflu et met mon profil souris d'un coup, je prends. » |
| **Fonction la plus désirée** | Basculer logiciels & réglages en 1 clic. |
| **Fonction jugée inutile** | L'IA en langage naturel : « je sais déjà ce que je veux, pas besoin de parler à mon PC ». |
| **Objection principale** | **Anti-cheat** : « si Vanguard flag ton app, c'est mort ». |
| **Signal WTP** | **Moyen-fort** : « 5 € par mois si ça marche vraiment, oui. Mais je préfèrerais payer une fois. » → penche Lifetime 49 €. |
| **Engagement** | Bêta : **oui**. Réfère : oui, 2 coéquipiers de son équipe amateur. |
| **Hypothèses touchées** | H1 **validée**, H2 **validée** (4 marques), H3 nuancée (peu d'intérêt auto contextuelle), H4 **validée** (WTP crédible + preuve), H5 **nuancée** (anti-cheat = frein réel mais levé si SDK officiels). |
| **Verbatims marquants** | « Je perds toujours 2-3 min à tout fermer. » / « Si Vanguard flag ton app, c'est mort. » |
| **Surprise / insight** | Le gamer compétitif se moque de l'automatisation « intelligente » ; il veut du **déterministe et rapide**, pas du contextuel. |

---

### Fiche — `T-01` — Sarah M. « EXEMPLE »

> ⚠️ **EXEMPLE illustratif** (persona brief, non issu d'un vrai entretien) — à remplacer par des données réelles.

| Champ | Contenu |
|---|---|
| **Code interviewé** | T-01 |
| **Date / durée / canal** | 2026-09-16 / 38 min / présentiel campus |
| **Segment / persona** | Télétravailleuse (persona Sarah) — **double casquette** : joue aussi le soir (T-01+). |
| **Profil & setup** | 34 ans, développeuse. Souris Logitech, clavier Logitech, casque Bose, lampes Philips Hue, 3 écrans. Niveau technique **5/5**. **3 marques**. |
| **Usage du PC** | Même PC pour coder (~40 h/sem) **et** se détendre le soir. 2-3 casquettes/jour. |
| **Situation actuelle** | Le soir, ferme Slack/Teams à la main, baisse les Hue depuis le téléphone, lance Spotify. Le matin, rebranche tout. « C'est mécanique mais ça marque mal la coupure pro/perso. » |
| **Douleur principale** | Pas de frontière nette travail/détente → charge mentale. Intensité **6/10**. |
| **Temps perdu estimé** | ~2 min matin + soir, mais surtout **coût mental** (oublie de couper Slack → notifs le soir). |
| **Preuve de douleur réelle** | **Oui** : a créé des routines Hue par minuterie, et un raccourci pour fermer Slack, mais « ça ne coupe pas les notifs de Teams ». A payé l'abonnement Philips Hue étendu. → *signal fort*. |
| **Réaction au concept** | Très séduite par le **scénario 18 h automatique** (lumières tamisées, Slack coupé, musique). « C'est exactement mon besoin. » |
| **Fonction la plus désirée** | Automatisation contextuelle (mode Chill après 18 h). |
| **Fonction jugée inutile** | Le partage de modes communautaires : « je ne partagerai pas ma config perso ». |
| **Objection principale** | **Confiance / sécurité** : une app avec accès système sur une machine qui a du code client. « Il me faut un éditeur clair et du RGPD carré. » |
| **Signal WTP** | **Fort** : « 4,99 €/mois, oui sans hésiter si ça me rend mes soirées. » → penche Abonnement. |
| **Engagement** | Bêta : **oui**. Réfère : oui, 1 collègue en télétravail. |
| **Hypothèses touchées** | H1 **validée**, H2 nuancée (3 marques mais pas vécu comme LE problème), H3 **validée** (enthousiasme spontané auto), H4 **validée**, H5 **nuancée** (sécurité = condition, pas rédhibitoire). |
| **Verbatims marquants** | « Ça ne marque pas la coupure entre le boulot et chez moi. » / « Le mode 18 h, c'est exactement mon besoin. » |
| **Surprise / insight** | La douleur des télétravailleurs est **plus émotionnelle (charge mentale, frontière pro/perso)** que chronométrique → argument produit différent des gamers. Piste de **pivot de messaging**. |

---

## 3. Synthèse transversale

### 3.1 Grille récapitulative des N entretiens *(1 ligne par interview)*

| Code | Segment | Nb marques | Intensité douleur (0-10) | Preuve réelle (bricolé/payé) | Fonction désirée | Objection | Signal WTP | Palier prix | Bêta ? |
|---|---|---:|---:|---|---|---|---|---|---|
| G-01 *(ex.)* | Gamer | 4 | 7 | Oui | 1 clic | Anti-cheat | Moyen-fort | Lifetime | Oui |
| T-01 *(ex.)* | Télétrav.+ | 3 | 6 | Oui | Auto 18 h | Sécurité | Fort | Abonnement | Oui |
| … | | | | | | | | | |
| **Synthèse** | — | **moy. = ___** | **moy. = ___** | **__ / N oui** | *mode dominant* | *top objection* | *__% fort* | *répartition* | **__ / N oui** |

**Chiffres clés à calculer une fois la grille remplie :**
- Intensité de douleur **moyenne** (et par segment).
- **Nb moyen de marques** → test de la stat brief « > 50 % ≥ 3 marques ».
- **% avec preuve de douleur réelle** (a bricolé / payé / cherché) → indicateur de sérieux le plus fiable.
- **% signal WTP « fort »** et répartition Abonnement / Lifetime / Gratuit.
- **% acceptant la bêta** → taille de la liste d'early adopters.
- Fonction désirée dominante **par segment** (pour prioriser le MVP).

### 3.2 Tableau de dépouillement des hypothèses

> Renseigner `n/N` = nombre d'entretiens validant sur nombre total exploitables.

| Hypothèse | Validée (n/N) | Nuancée | Invalidée | Seuil de validation | Décision |
|---|---:|---:|---:|---|---|
| **H1** — friction ressentie & récurrente | | | | ≥ 60 % décrivent une routine pénible | Continuer / affiner / pivoter |
| **H2** — ≥ 3 outils/marches non synchronisés | | | | comptage moyen ≥ 3 | |
| **H3** — valeur de l'automatisation contextuelle | | | | enthousiasme spontané sur scénario Sarah | |
| **H4** — une partie paierait (abo/lifetime) | | | | ≥ 25 % WTP crédible + justifié | |
| **H5** — objection sécurité/anti-cheat surmontable | | | | objection levée après explication API officielles | |

---

## 4. Matrice d'affinité (regroupement thématique)

> Coller chaque verbatim marquant sous le thème qui lui correspond (codage thématique). Compter les
> **occurrences** et repérer les **segments** concernés. Un thème cité par plusieurs segments =
> douleur **universelle** (priorité produit forte) ; un thème mono-segment = douleur **de niche**.

| Thème (cluster) | Verbatims regroupés | Occurrences (n) | Segments touchés | Universel / niche |
|---|---|---:|---|---|
| **Friction de préparation** (temps perdu au lancement) | « Je perds 2-3 min à tout fermer » … | | G / S / T ? | |
| **Fragmentation multi-marques** (apps qui ne se parlent pas) | | | | |
| **Oublis gênants** (micro coupé, notif en direct) | | | | |
| **Charge mentale / frontière pro-perso** | « Ça ne marque pas la coupure boulot / chez moi » … | | surtout T | |
| **Refus / méfiance de l'automatisation** (« pas mon PC qui décide ») | | | | |
| **Peur anti-cheat / sécurité** | « Si Vanguard flag ton app, c'est mort » … | | surtout G / S | |
| **Willingness-to-pay & modèle** (abo vs lifetime vs gratuit) | | | | |
| **Échecs des solutions passées** (scripts, macros abandonnés) | | | | |

> **Lecture attendue (à confirmer par la donnée réelle).** « Hypothèse » : la friction de préparation
> et la fragmentation multi-marques ressortent comme **transversales**, tandis que la charge mentale
> pro/perso est **propre aux télétravailleurs** et la peur anti-cheat **propre aux gamers/streamers**.

---

## 5. Insights & décisions

### 5.1 Insights principaux (à rédiger après dépouillement)
1. **Insight #1** — *(ex. rédigé : « Les gamers veulent du déterministe/rapide, pas de l'IA contextuelle ; les télétravailleurs veulent l'inverse. » — à confirmer par n/N.)*
2. **Insight #2** — …
3. **Insight #3** — …

### 5.2 Critères de décision chiffrés (sortie de phase de recherche)

| Décision | Condition (critères chiffrés) | Verdict |
|---|---|---|
| **CONSOLIDER** (garder le cap) | H1 **ET** (H2 **ou** H3) validées (seuils §3.2) **ET** ≥ 25 % de signal WTP « fort » **ET** ≥ 40 % avec preuve de douleur réelle | ☐ |
| **PIVOTER (cible/fonction)** | Problème confirmé (H1 ok) **mais** segment ou fonction prioritaire ≠ hypothèse initiale (ex. télétravailleurs plus douloureux que gamers → réorienter le MVP) | ☐ |
| **REPOSITIONNER (alerte)** | Douleur faible (H1 < 60 %) **ET** WTP quasi nul (< 25 %) → revoir la proposition de valeur | ☐ |

### 5.3 Conséquences opérationnelles
- **Priorité MVP** (fonction n°1 à construire pour le cycle d'itération 1) : ______________
- **Segment cible prioritaire** pour la bêta : ______________
- **Ajustement pricing** (au vu du WTP observé vs 4,99 € / 49 €) : ______________
- **Objections à traiter en priorité** (messaging + technique) : ______________
- **Taille de la liste d'early adopters** (bêta acceptée) : ______________

> Ces conclusions alimentent les **2 cycles d'itération MVP** et l'argumentaire **« pivot ou
> consolidation »** exigés par l'EIP, ainsi que le **Business Model Canvas** et les **projections
> financières** (`docs/eip/KPIS_ET_PROJECTIONS.md`, `docs/eip/FINANCIAL_MODEL.md`).

---

## 6. Checklist de dépouillement
- [ ] Une fiche §2 remplie par entretien (< 2 h après), verbatims anonymisés.
- [ ] Toutes les fiches reportées dans la grille §3.1.
- [ ] Chiffres clés §3.1 calculés (moyennes, %, répartitions).
- [ ] Hypothèses H1–H5 dépouillées §3.2 avec n/N.
- [ ] Matrice d'affinité §4 remplie et occurrences comptées.
- [ ] Décision §5.2 tranchée sur critères chiffrés et partagée au référent EIP.
