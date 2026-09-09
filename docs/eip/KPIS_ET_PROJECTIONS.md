# KPIs & projections financières — Nexum

> Document EIP (piste **Entrepreneuriat**) — projet **Nexum**, PROMO 2028, campus Marseille.
> Source de vérité : `docs/eip/_BRIEF_PROJET.md`. Langue : français.
> Dernière mise à jour : 2026-07-13.
>
> ⚠️ **AVERTISSEMENT — Tout ce document est PRÉVISIONNEL et HYPOTHÉTIQUE.**
> Nexum est au stade POC/MVP (bêta prévue autour du BTP de janvier 2027). Aucun chiffre
> commercial n'est encore observé. Les valeurs marché (TAM, croissance) proviennent du brief ;
> **toutes** les cibles de KPIs, tailles de base utilisateurs, taux et montants financiers sont des
> **hypothèses de travail** explicitement notées « **Hypothèse** » et destinées à être révisées
> avec les données réelles (interviews, bêta, lancement).

---

## Partie A — KPIs produit

Ces indicateurs mesurent l'**adoption et la qualité d'usage**. Ils servent aussi la piste RNCP Bloc 5 (assurance qualité).

| KPI produit | Définition | Cible (Hypothèse) | Pourquoi c'est clé pour Nexum |
|---|---|---|---|
| **Activation** | % de nouveaux inscrits ayant **créé ET exécuté ≥ 1 mode** sous 24 h | **≥ 40 %** | Vérifie que la promesse « un clic, zéro friction » est atteinte dès l'onboarding. |
| **Rétention D7** | % d'utilisateurs revenus 7 jours après l'install | **≥ 25 %** | Un mode bien réglé est réutilisé → signal de valeur récurrente. |
| **Rétention D30** | % revenus à 30 jours | **≥ 15 %** | Base de la conversion Premium et du LTV. |
| **Modes créés / utilisateur actif** | Nb moyen de modes par MAU | **≥ 2,5** (≥ 4 pour les engagés) | Plus il y a de modes, plus le coût de changement augmente (rétention). |
| **Taux d'erreur d'exécution** | % de steps d'action échoués sur total exécuté | **< 2 %** | Qualité technique = argument de confiance + Bloc RNCP 5. |
| **NPS** | Net Promoter Score | **> 40** | Mesure la recommandation → moteur de la viralité/Marketplace. |
| **Taux d'usage Marketplace** *(Hypothèse)* | % de MAU important ≥ 1 mode partagé | **≥ 20 %** | Valide l'effet de réseau communautaire. |
| **Modes générés par IA** *(Hypothèse)* | % de modes créés via Mode-as-Code | **≥ 15 %** | Valide l'axe différenciant « personnalisation IA ». |

**Lecture.** L'entonnoir produit se lit : *Install → Activation (40 %) → Rétention D7 (25 %) → D30 (15 %) → conversion payant (3–5 %)*. Le **taux d'erreur d'exécution < 2 %** est volontairement mis au niveau d'un KPI produit stratégique : la crédibilité de Nexum devant le jury (démo LIVE obligatoire) repose sur la fiabilité réelle des actions.

---

## Partie B — KPIs business

| KPI business | Définition | Cible / trajectoire (Hypothèse) |
|---|---|---|
| **MRR** (Monthly Recurring Revenue) | Revenu mensuel récurrent (abonnés Premium × 4,99 €) | 524 € (An1) → 5 589 € (An2) → 26 198 € (An3) |
| **ARPU** | Revenu moyen par utilisateur actif / an | ~1,0 € (An1) → ~1,7 € (An2) → ~2,3 € (An3) |
| **ARPPU** | Revenu moyen par **utilisateur payant** / an | ~50–65 € |
| **Taux de conversion free → payant** | Payants / actifs | **3 % (An1) → 4 % (An2) → 5 % (An3)** |
| **CAC** (coût d'acquisition) *(Hypothèse)* | Dépenses marketing / nouveaux payants acquis | **~15 €** (mix organique + payant, décroissant) |
| **LTV** (valeur vie client) *(Hypothèse)* | ARPPU × durée de vie moyenne | **~75 €** (Premium, durée de vie ~18 mois) |
| **Ratio LTV / CAC** | Santé de l'acquisition | **~5** (cible > 3) |
| **Churn mensuel Premium** *(Hypothèse)* | % d'abonnés perdus / mois | **< 5,5 %** (soit ~45 %/an) |

**Lecture.** Le modèle est un **freemium à faible ARPU mais fort volume** : la valeur vient du nombre d'utilisateurs et d'un taux de conversion modeste (3–5 %) vers un Premium peu cher (4,99 €). Le **ratio LTV/CAC ~5** (hypothèse) repose sur une acquisition majoritairement **organique/virale** (créateurs Twitch, Marketplace) qui maintient le CAC bas — c'est le pari économique central.

---

## Partie C — Modèle financier prévisionnel sur 3 ans

**Horizon.** An 1 = année de développement / bêta ; An 2 = lancement commercial ; An 3 = montée en charge.

### C.1 Hypothèses de base (toutes « Hypothèse »)

| Hypothèse | An 1 (dev/bêta) | An 2 (lancement) | An 3 (croissance) |
|---|---|---|---|
| Utilisateurs actifs (fin d'année) | 5 000 | 40 000 | 150 000 |
| Utilisateurs actifs **moyens** sur l'année | ~2 000 | ~20 000 | ~90 000 |
| Taux de conversion payant | 3 % | 4 % | 5 % |
| Utilisateurs payants (fin d'année) | 150 | 1 600 | 7 500 |
| Mix payants : **Premium (abonnement)** | 70 % → 105 | 70 % → 1 120 | 70 % → 5 250 |
| Mix payants : **Lifetime (achat unique)** | 30 % → 45 | 30 % → 480 | 30 % → 2 250 |
| Abonnés Premium **moyens** sur l'année | ~50 | ~600 | ~3 000 |
| Prix Premium | 4,99 €/mois (59,88 €/an) | idem | idem |
| Prix Lifetime | 49 € (unique) | idem | idem |
| Commission Marketplace | 30 % (négligeable en bêta) | activée | activée |
| B2B | — | 2 pilotes | ~10 comptes |

> Repère de marché (brief) : TAM ~1 milliard de joueurs PC. Une base de 150 000 utilisateurs à l'An 3 ≈ **0,015 %** du TAM → hypothèse volontairement **conservatrice**.

### C.2 Compte de résultat prévisionnel (revenus)

| Flux de revenus | An 1 | An 2 | An 3 | Base de calcul |
|---|---:|---:|---:|---|
| Premium (abonnements) | 3 000 € | 36 000 € | 180 000 € | abonnés moyens × 59,88 € |
| Lifetime (achats uniques) | 2 200 € | 23 500 € | 110 000 € | nouveaux acheteurs × 49 € |
| Commission Marketplace | 0 € | 3 000 € | 15 000 € | Hypothèse ~5 % du revenu B2C |
| B2B (licences volume) | 0 € | 6 000 € | 40 000 € | Hypothèse : forfaits pilotes/comptes |
| **Total revenus** | **~5 200 €** | **~68 500 €** | **~345 000 €** | |

### C.3 Structure de coûts prévisionnelle

| Poste de coût | An 1 | An 2 | An 3 | Commentaire |
|---|---:|---:|---:|---|
| Salaires & R&D | 0 € | 120 000 € | 300 000 € | An 1 : fondateurs EIP **non rémunérés** (coût d'opportunité). An 2–3 : 2–3 puis 5–6 personnes chargées (Hypothèse). |
| Infrastructure cloud (AWS/Azure) | 2 000 € | 12 000 € | 40 000 € | Croît avec les MAU (sync, Marketplace). |
| IA (tokens LLM) | 500 € | 4 000 € | 15 000 € | Usage Mode-as-Code (Premium). |
| Marketing & acquisition | 3 000 € | 30 000 € | 90 000 € | Twitch/YouTube + influenceurs. |
| Sécurité & conformité | 1 500 € | 8 000 € | 20 000 € | Anti-cheat, RGPD, audits. |
| Support | 0 € | 6 000 € | 25 000 € | Croît avec la base payante/B2B. |
| Divers / outils | 1 000 € | 10 000 € | 20 000 € | Licences, juridique, comptabilité. |
| **Total coûts** | **~8 000 €** | **~190 000 €** | **~510 000 €** | |

### C.4 Résultat & trésorerie

| Indicateur | An 1 | An 2 | An 3 |
|---|---:|---:|---:|
| Total revenus | ~5 200 € | ~68 500 € | ~345 000 € |
| Total coûts | ~8 000 € | ~190 000 € | ~510 000 € |
| **Résultat net (annuel)** | **≈ −2 800 €** | **≈ −121 500 €** | **≈ −165 000 €** |
| Résultat cumulé | ≈ −2 800 € | ≈ −124 300 € | ≈ −289 300 € |

> **Besoin de financement (Hypothèse).** Le cumul des pertes (~290 k€ sur 3 ans) doit être couvert par une combinaison **love money / concours & subventions / pré-amorçage**, avant d'atteindre l'autofinancement. Ordre de grandeur à sécuriser : **~300–350 k€** pour tenir jusqu'au point mort.

---

## Partie D — Analyse du point mort (break-even)

Le point mort est analysé sur le **run-rate mensuel** (revenu récurrent mensualisé vs coûts mensuels).

| | Fin An 2 | Fin An 3 |
|---|---:|---:|
| Revenu mensuel (run-rate) *(Hypothèse)* | ~8 000 €/mois | ~40 000 €/mois |
| Coûts mensuels | ~16 000 €/mois | ~42 500 €/mois |
| Écart au point mort | −8 000 €/mois | **≈ −2 500 €/mois (quasi-équilibre)** |

**Conclusion.** Avec ces hypothèses, le **run-rate mensuel atteint le quasi-équilibre en toute fin d'An 3**, et le **point mort mensuel est projeté courant An 4**. À ce stade, l'équation de rentabilité est simple :

> Point mort ≈ atteint lorsque **abonnés Premium payants ≈ 8 500** (à 4,99 €/mois), toutes choses égales par ailleurs — soit ~5 % de conversion sur ~170 000 utilisateurs actifs.

**Leviers de sensibilité (à surveiller) :**
- **Taux de conversion** : passer de 4 % à 5 % augmente le revenu récurrent de +25 % sans coût d'acquisition supplémentaire → levier n°1.
- **Churn** : réduire le churn mensuel de 5,5 % à 4 % allonge la durée de vie et fait passer le LTV de ~75 € à ~100 € (+33 %).
- **CAC** : si l'acquisition organique/virale fonctionne (Marketplace, créateurs), le CAC baisse et le point mort se rapproche ; sinon le poste marketing dérape.
- **Mix Lifetime** : le Lifetime apporte de la trésorerie immédiate mais **plafonne le revenu récurrent** → à doser (hypothèse 30 %).

---

## Partie E — Synthèse pour le jury

- Modèle **freemium volume** : faible ARPU (~2 €/an), rentabilité par le nombre et la conversion (3 → 5 %).
- Trajectoire **prudente** : 150 000 utilisateurs à l'An 3 = 0,015 % du TAM (1 Md de joueurs PC).
- **Pertes cumulées ~290 k€** sur 3 ans, **point mort visé en An 4**, besoin de financement ~300–350 k€.
- Levier décisif : **acquisition virale** (créateurs + Marketplace) pour garder un **LTV/CAC ~5**.
- **Tous les chiffres sont des hypothèses prévisionnelles** à confronter aux données réelles (interviews, bêta, lancement).
