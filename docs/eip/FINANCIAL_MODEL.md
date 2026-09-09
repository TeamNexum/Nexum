# Modèle financier détaillé — Nexum

> Document EIP (piste **Entrepreneuriat**) — projet **Nexum**, PROMO 2028, campus Marseille.
> Source de vérité des hypothèses : `docs/eip/KPIS_ET_PROJECTIONS.md` et `docs/eip/_BRIEF_PROJET.md`.
> Langue : français. Dernière mise à jour : 2026-07-13.
>
> ⚠️ **AVERTISSEMENT — TOUT CE DOCUMENT EST PRÉVISIONNEL ET HYPOTHÉTIQUE.**
> Nexum est au stade **POC/MVP** (bêta prévue autour du **BTP de janvier 2027**). **Aucun chiffre
> commercial n'est encore observé.** Les valeurs de marché (TAM, croissance) viennent du brief ;
> **toutes** les tailles de base utilisateurs, taux, prix et montants ci-dessous sont des
> **hypothèses de travail** (« **Hypothèse** ») destinées à être révisées avec les données réelles
> (interviews, bêta, lancement). Ce modèle est présenté comme une **feuille de calcul** (tableaux) :
> les totaux peuvent varier de quelques euros du fait des arrondis.
>
> **Horizon.** **An 1** = développement / bêta ; **An 2** = lancement commercial ; **An 3** = montée
> en charge. Les agrégats annuels sont **strictement cohérents** avec `KPIS_ET_PROJECTIONS.md`.

---

## 1. Hypothèses de base (feuille « Hypothèses »)

*(Toutes « Hypothèse ». Reprises telles quelles de `KPIS_ET_PROJECTIONS.md` §C.1.)*

| Paramètre | An 1 (dev/bêta) | An 2 (lancement) | An 3 (croissance) |
|---|---:|---:|---:|
| Utilisateurs actifs (fin d'année) | 5 000 | 40 000 | 150 000 |
| Utilisateurs actifs **moyens** sur l'année | ~2 000 | ~20 000 | ~90 000 |
| Taux de conversion payant | 3 % | 4 % | 5 % |
| Utilisateurs payants (fin d'année) | 150 | 1 600 | 7 500 |
| — dont **Premium** (abonnement, 70 %) | 105 | 1 120 | 5 250 |
| — dont **Lifetime** (achat unique, 30 %) | 45 | 480 | 2 250 |
| Abonnés Premium **moyens** sur l'année | ~50 | ~600 | ~3 000 |
| Prix Premium | 4,99 €/mois (59,88 €/an) | idem | idem |
| Prix Lifetime | 49 € (unique) | idem | idem |
| Commission Marketplace | 30 % (négligeable en bêta) | activée | activée |
| B2B | — | 2 pilotes | ~10 comptes |
| ARPU (revenu/actif/an) | ~1,0 € | ~1,7 € | ~2,3 € |
| ARPPU (revenu/payant/an) | ~50–65 € | ~50–65 € | ~50–65 € |
| CAC (coût d'acquisition/payant) *(Hypothèse)* | ~15 € | ~15 € (décroissant) | ~15 € (décroissant) |
| LTV (Premium, durée ~18 mois) *(Hypothèse)* | ~75 € | ~75 € | ~75 € |
| Churn mensuel Premium *(Hypothèse)* | < 5,5 % (~45 %/an) | idem | idem |

> **Repère de marché.** 150 000 utilisateurs à l'An 3 ≈ **0,015 %** du TAM (~1 Md de joueurs PC,
> brief) → hypothèse volontairement **conservatrice**.

---

## 2. MRR / ARR (revenu récurrent)

Le **MRR** ne compte que le récurrent **Premium** (abonnés fin de période × 4,99 €). Le Lifetime,
le B2B forfaitaire et la Marketplace ne sont pas récurrents par abonné et n'entrent pas dans le MRR.

| Indicateur | Fin An 1 | Fin An 2 | Fin An 3 | Base de calcul |
|---|---:|---:|---:|---|
| Abonnés Premium (fin de période) | 105 | 1 120 | 5 250 | cf. §1 |
| **MRR** (récurrent mensuel) | **524 €** | **5 589 €** | **26 198 €** | abonnés × 4,99 € |
| **ARR** (récurrent annualisé) | **6 288 €** | **67 068 €** | **314 376 €** | MRR × 12 |

> Cohérent avec `KPIS_ET_PROJECTIONS.md` §B (MRR 524 → 5 589 → 26 198 €).

---

## 3. Compte de résultat mensuel — An 1 (dev / bêta)

**Logique de la montée en charge (Hypothèse).** La monétisation démarre progressivement pendant la
bêta : les utilisateurs actifs montent de ~0 à **5 000** (fin An 1), les abonnés Premium de 0 à
**105**, les acheteurs Lifetime cumulés atteignent **45**. Les fondateurs EIP ne sont **pas
rémunérés** (coût d'opportunité, hors trésorerie).

### 3.1 Volumes mensuels (fin de mois)

| Mois | Actifs (fin) | Abonnés Premium (fin) | Nouveaux Lifetime | Lifetime cumulés |
|---|---:|---:|---:|---:|
| M1 | 50 | 0 | 0 | 0 |
| M2 | 150 | 2 | 0 | 0 |
| M3 | 350 | 8 | 1 | 1 |
| M4 | 600 | 18 | 2 | 3 |
| M5 | 1 000 | 30 | 3 | 6 |
| M6 | 1 500 | 45 | 4 | 10 |
| M7 | 2 100 | 60 | 5 | 15 |
| M8 | 2 800 | 72 | 6 | 21 |
| M9 | 3 500 | 82 | 6 | 27 |
| M10 | 4 100 | 92 | 6 | 33 |
| M11 | 4 600 | 100 | 6 | 39 |
| M12 | 5 000 | 105 | 6 | 45 |
| **Moy./Total** | **~2 060 moy.** | **~51 moy.** | **45 total** | **45** |

### 3.2 Revenus mensuels (€)

| Mois | Premium (abonn. × 4,99 €) | Lifetime (nouveaux × 49 €) | Marketplace | B2B | **Total revenus** |
|---|---:|---:|---:|---:|---:|
| M1 | 0 | 0 | 0 | 0 | **0** |
| M2 | 10 | 0 | 0 | 0 | **10** |
| M3 | 40 | 49 | 0 | 0 | **89** |
| M4 | 90 | 98 | 0 | 0 | **188** |
| M5 | 150 | 147 | 0 | 0 | **297** |
| M6 | 225 | 196 | 0 | 0 | **421** |
| M7 | 299 | 245 | 0 | 0 | **544** |
| M8 | 359 | 294 | 0 | 0 | **653** |
| M9 | 409 | 294 | 0 | 0 | **703** |
| M10 | 459 | 294 | 0 | 0 | **753** |
| M11 | 499 | 294 | 0 | 0 | **793** |
| M12 | 524 | 294 | 0 | 0 | **818** |
| **Total An 1** | **~3 060 €** | **~2 205 €** | **0 €** | **0 €** | **~5 265 €** |

> Arrondi cohérent avec l'agrégat brief : **Premium ~3 000 €**, **Lifetime ~2 200 €**,
> **Total revenus ~5 200 €**. (Marketplace et B2B nuls en An 1 : bêta.)

### 3.3 Coûts mensuels (€)

| Mois | Cloud | IA (LLM) | Marketing | Sécurité & conformité | Divers/outils | Salaires | **Total coûts** |
|---|---:|---:|---:|---:|---:|---:|---:|
| M1 | 100 | 0 | 100 | 300 | 80 | 0 | **580** |
| M2 | 100 | 0 | 150 | 200 | 80 | 0 | **530** |
| M3 | 120 | 20 | 200 | 150 | 80 | 0 | **570** |
| M4 | 140 | 30 | 250 | 100 | 80 | 0 | **600** |
| M5 | 160 | 40 | 300 | 100 | 80 | 0 | **680** |
| M6 | 170 | 50 | 300 | 100 | 85 | 0 | **705** |
| M7 | 180 | 50 | 300 | 100 | 85 | 0 | **715** |
| M8 | 190 | 60 | 300 | 90 | 85 | 0 | **725** |
| M9 | 200 | 60 | 300 | 90 | 85 | 0 | **735** |
| M10 | 210 | 60 | 300 | 90 | 85 | 0 | **745** |
| M11 | 210 | 65 | 250 | 90 | 90 | 0 | **705** |
| M12 | 220 | 65 | 250 | 90 | 85 | 0 | **710** |
| **Total An 1** | **~2 000** | **~500** | **~3 000** | **~1 500** | **~1 000** | **0** | **~8 000 €** |

> Cohérent avec `KPIS_ET_PROJECTIONS.md` §C.3 (An 1 : cloud 2 000, IA 500, marketing 3 000,
> sécurité 1 500, divers 1 000, salaires 0, **total ~8 000 €**). Support = 0 en An 1.

### 3.4 Résultat & cash-flow cumulé mensuel — An 1

| Mois | Revenus | Coûts | **Résultat net** | **Cash-flow cumulé** |
|---|---:|---:|---:|---:|
| M1 | 0 | 580 | −580 | **−580** |
| M2 | 10 | 530 | −520 | **−1 100** |
| M3 | 89 | 570 | −481 | **−1 581** |
| M4 | 188 | 600 | −412 | **−1 993** |
| M5 | 297 | 680 | −383 | **−2 376** |
| M6 | 421 | 705 | −284 | **−2 660** |
| M7 | 544 | 715 | −171 | **−2 831** |
| M8 | 653 | 725 | −72 | **−2 903** |
| M9 | 703 | 735 | −32 | **−2 935** *(creux de trésorerie)* |
| M10 | 753 | 745 | +8 | **−2 927** |
| M11 | 793 | 705 | +88 | **−2 839** |
| M12 | 818 | 710 | +108 | **−2 731** |
| **An 1** | **~5 265** | **~8 000** | **≈ −2 800 €** | **≈ −2 800 €** |

> **Lecture.** Le **creux de trésorerie** de l'An 1 est atteint vers **M9 (~−2 935 €)** ; à partir
> de M10 le résultat mensuel redevient légèrement positif (la bêta convertit assez pour couvrir des
> coûts encore faibles, salaires non rémunérés). Le résultat annuel **≈ −2 800 €** est aligné avec
> `KPIS_ET_PROJECTIONS.md`. **Ce répit disparaît en An 2** dès que les salaires apparaissent.

---

## 4. Compte de résultat annuel — An 2 & An 3

*(Agrégats repris de `KPIS_ET_PROJECTIONS.md` §C.2–C.4. An 1 rappelé pour lecture.)*

### 4.1 Revenus

| Flux de revenus | An 1 | An 2 | An 3 | Base de calcul |
|---|---:|---:|---:|---|
| Premium (abonnements) | ~3 000 € | 36 000 € | 180 000 € | abonnés moyens × 59,88 €/an |
| Lifetime (achats uniques) | ~2 200 € | 23 500 € | 110 000 € | nouveaux acheteurs × 49 € |
| Commission Marketplace | 0 € | 3 000 € | 15 000 € | Hypothèse ~5 % du revenu B2C |
| B2B (licences volume) | 0 € | 6 000 € | 40 000 € | Hypothèse : forfaits pilotes/comptes |
| **Total revenus** | **~5 200 €** | **~68 500 €** | **~345 000 €** | |

### 4.2 Coûts

| Poste de coût | An 1 | An 2 | An 3 | Commentaire |
|---|---:|---:|---:|---|
| Salaires & R&D | 0 € | 120 000 € | 300 000 € | An 1 fondateurs non rémunérés ; An 2–3 : 2–3 puis 5–6 personnes chargées (Hyp.) |
| Infrastructure cloud | 2 000 € | 12 000 € | 40 000 € | Croît avec les MAU (sync, Marketplace) |
| IA (tokens LLM) | 500 € | 4 000 € | 15 000 € | Usage Mode-as-Code (Premium) |
| Marketing & acquisition | 3 000 € | 30 000 € | 90 000 € | Twitch/YouTube + influenceurs |
| Sécurité & conformité | 1 500 € | 8 000 € | 20 000 € | Anti-cheat, RGPD, audits |
| Support | 0 € | 6 000 € | 25 000 € | Croît avec la base payante/B2B |
| Divers / outils | 1 000 € | 10 000 € | 20 000 € | Licences, juridique, comptabilité |
| **Total coûts** | **~8 000 €** | **~190 000 €** | **~510 000 €** | |

### 4.3 Résultat & cash-flow cumulé (annuel)

| Indicateur | An 1 | An 2 | An 3 |
|---|---:|---:|---:|
| Total revenus | ~5 200 € | ~68 500 € | ~345 000 € |
| Total coûts | ~8 000 € | ~190 000 € | ~510 000 € |
| **Résultat net (annuel)** | **≈ −2 800 €** | **≈ −121 500 €** | **≈ −165 000 €** |
| **Cash-flow cumulé** | ≈ −2 800 € | ≈ −124 300 € | **≈ −289 300 €** |

> **Besoin de financement (Hypothèse).** Le cumul des pertes (**~290 k€ sur 3 ans**) doit être
> couvert par un mix **love money / concours & subventions / pré-amorçage** avant l'autofinancement.
> Ordre de grandeur à sécuriser : **~300–350 k€** pour tenir jusqu'au point mort.

---

## 5. Structure de coûts — vue analytique

| Poste | An 1 | An 2 | An 3 | Part An 3 | Type |
|---|---:|---:|---:|---:|---|
| Salaires & R&D | 0 | 120 000 | 300 000 | 59 % | Fixe (masse salariale) |
| Marketing | 3 000 | 30 000 | 90 000 | 18 % | Semi-variable (acquisition) |
| Cloud | 2 000 | 12 000 | 40 000 | 8 % | Variable (∝ MAU) |
| Support | 0 | 6 000 | 25 000 | 5 % | Semi-variable |
| Sécurité & conformité | 1 500 | 8 000 | 20 000 | 4 % | Fixe/réglementaire |
| Divers / outils | 1 000 | 10 000 | 20 000 | 4 % | Fixe |
| IA (LLM) | 500 | 4 000 | 15 000 | 3 % | Variable (∝ usage Premium) |
| **Total** | **~8 000** | **~190 000** | **~510 000** | **100 %** | |

> **Lecture.** La **masse salariale** (≈ 59 % des coûts An 3) est le poste structurant : c'est elle
> qui creuse les pertes une fois le développement industrialisé. Les coûts **variables** (cloud + IA
> ≈ 11 %) restent contenus grâce à l'architecture **offline-first / Rust-Tauri** à faible empreinte
> (brief). Le **marketing** est le levier le plus discrétionnaire — d'où le pari de l'acquisition
> organique/virale (créateurs + Marketplace) pour tenir un CAC ~15 €.

---

## 6. Point mort (break-even)

Analysé sur le **run-rate mensuel** (revenu récurrent mensualisé vs coûts mensuels), cohérent avec
`KPIS_ET_PROJECTIONS.md` §D.

| | Fin An 2 | Fin An 3 |
|---|---:|---:|
| Revenu mensuel (run-rate) *(Hypothèse)* | ~8 000 €/mois | ~40 000 €/mois |
| Coûts mensuels | ~16 000 €/mois | ~42 500 €/mois |
| **Écart au point mort** | −8 000 €/mois | **≈ −2 500 €/mois (quasi-équilibre)** |

**Conclusion.** Le run-rate mensuel atteint le **quasi-équilibre en toute fin d'An 3**, et le
**point mort mensuel est projeté courant An 4**. Équation de rentabilité :

> Point mort ≈ atteint lorsque **abonnés Premium payants ≈ 8 500** (à 4,99 €/mois), toutes choses
> égales par ailleurs — soit **~5 % de conversion sur ~170 000 utilisateurs actifs**.

**Leviers de sensibilité :**
- **Conversion** : 4 % → 5 % = **+25 %** de revenu récurrent sans coût d'acquisition additionnel → **levier n°1**.
- **Churn** : 5,5 % → 4 %/mois allonge la durée de vie → LTV ~75 € → ~100 € (**+33 %**).
- **CAC** : si le viral fonctionne, le CAC baisse et le point mort se rapproche ; sinon le marketing dérape.
- **Mix Lifetime** : trésorerie immédiate mais **plafonne le récurrent** → doser (Hypothèse 30 %).

---

## 7. Trois scénarios (pessimiste / réaliste / optimiste)

> Le scénario **Réaliste** est le cas de base des §1–6 (aligné `KPIS_ET_PROJECTIONS.md`). Les
> scénarios Pessimiste et Optimiste font varier les **3 leviers** : taille de base, conversion,
> churn/CAC. **Tous « Hypothèse ».**

### 7.1 Drivers par scénario

| Driver (fin An 3) | 🔴 Pessimiste | 🟡 Réaliste (base) | 🟢 Optimiste |
|---|---:|---:|---:|
| Utilisateurs actifs (fin An 3) | 80 000 | 150 000 | 220 000 |
| Taux de conversion payant | 3,5 % | 5 % | 5,5 % |
| Churn mensuel Premium | ~7 % | ~5,5 % | ~4 % |
| CAC (par payant) | ~25 € | ~15 € | ~10 € |
| Hypothèse d'acquisition | virale faible, marketing payant lourd | mix organique + payant | viral fort (créateurs + Marketplace) |

### 7.2 Résultats par scénario

| Indicateur (An 3) | 🔴 Pessimiste | 🟡 Réaliste | 🟢 Optimiste |
|---|---:|---:|---:|
| Utilisateurs payants (fin An 3) | ~2 800 | 7 500 | ~12 100 |
| Total revenus An 3 | ~150 000 € | ~345 000 € | ~560 000 € |
| Total coûts An 3 | ~470 000 € | ~510 000 € | ~540 000 € |
| Résultat net An 3 | ≈ −320 000 € | ≈ −165 000 € | ≈ +20 000 € |
| **Cash-flow cumulé 3 ans** | **≈ −480 000 €** | **≈ −290 000 €** | **≈ −150 000 €** |
| **Point mort mensuel projeté** | An 5+ | courant An 4 | fin An 3 |
| **Besoin de financement** | ~500–550 k€ | ~300–350 k€ | ~180–220 k€ |

### 7.3 Lecture des scénarios
- **🔴 Pessimiste.** Le viral ne prend pas : le CAC grimpe (~25 €), le churn se dégrade, la base
  plafonne à 80 k. Les pertes se creusent (~−480 k€ cumulés) et le point mort recule au-delà de
  l'An 5. **Signal d'alerte** : dépendance excessive au marketing payant → revoir l'acquisition ou
  le positionnement (cf. critères de décision des interviews).
- **🟡 Réaliste.** Cas de base : freemium volume, conversion 3 → 5 %, LTV/CAC ~5, point mort en An 4,
  besoin ~300–350 k€. C'est la trajectoire présentée au jury.
- **🟢 Optimiste.** L'effet Marketplace + créateurs Twitch fait baisser le CAC (~10 €) et le churn
  (~4 %) ; la base atteint 220 k. Le résultat An 3 devient **légèrement positif** et le besoin de
  financement tombe à ~200 k€. C'est le scénario que les **KPIs viraux** (NPS > 40, usage Marketplace
  ≥ 20 %) cherchent à déclencher.

> **Fourchette de besoin de financement (Hypothèse) : ~180 k€ (optimiste) à ~550 k€ (pessimiste),
> point médian ~300–350 k€.**

---

## 8. Synthèse pour le jury
- Modèle **freemium volume** : faible ARPU (~1 → 2,3 €/an), rentabilité par le **nombre** et la
  **conversion** (3 → 5 %) vers un Premium peu cher (4,99 €) + Lifetime (49 €) pour la trésorerie.
- **MRR** 524 € → 5 589 € → 26 198 € ; **ARR** ~6,3 k€ → ~67 k€ → ~314 k€ (fin An 3).
- Trajectoire **prudente** : 150 000 utilisateurs à l'An 3 = 0,015 % du TAM (1 Md de joueurs PC).
- **Pertes cumulées ~290 k€** (cas réaliste) sur 3 ans, **point mort visé en An 4**, besoin de
  financement **~300–350 k€** (fourchette 180–550 k€ selon scénario).
- Levier décisif : **acquisition virale** (créateurs + Marketplace) pour tenir un **LTV/CAC ~5**.
- **Tous les chiffres sont des hypothèses prévisionnelles** à confronter aux données réelles
  (interviews, bêta, lancement) — voir `docs/eip/KPIS_ET_PROJECTIONS.md`.
