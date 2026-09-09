# Nexum — Fiche projet

**Nexum** — *Jouer, streamer ou chiller sans friction.*

Projet EIP Epitech · Promo 2028 · Campus Marseille · Piste Entrepreneuriat
`eip.epitech.eu/project/1035`

---

### Problème
Préparer son PC avant chaque session (jeu, stream, télétravail) est fragmenté et
chronophage : launchers, logiciels constructeurs et utilitaires système
n'échangent pas entre eux, et aucune solution grand public n'orchestre le tout de
façon contextuelle.

### Solution
Nexum est une application **universelle, no-code et sans marque imposée** qui
synchronise en un clic tout l'environnement numérique (logiciels, système,
périphériques, objets connectés) grâce à des **modes** — et sait les générer à
partir d'une simple phrase.

---

### Marché
- Gaming mondial : **197 Md$ en 2025** ; segment PC : **43 Md$**, **+10,4 %/an** *(Newzoo)*.
- **3,32 Md de joueurs**, dont **~1 Md sur PC** (le PC franchit le milliard en 2026) *(DemandSage)*.
- Software gaming : TCAC **+10,4 % à +12,7 %/an** ; segment abonnement le plus rapide (**~19,5 %**) *(Mordor Intelligence)*.
- Smart home / IoT : **147,5 Md$ (2025) → 848 Md$ (2034)** *(Fortune Business Insights)*.
- **> 50 % des joueurs PC** utilisent **≥ 3 marques** de périphériques → besoin d'une solution agnostique. Cible adressable : **~1 Md d'utilisateurs PC**.

### Différenciation
| | Nexum | Razer/Corsair | AutoHotkey | Launchers (Steam…) |
|---|:---:|:---:|:---:|:---:|
| Sans marque imposée | ✅ | ❌ (verrouillé) | ✅ | ❌ |
| No-code | ✅ | ~ | ❌ (scripts) | ~ |
| Système + logiciels + IoT | ✅ | ❌ | ~ | ❌ |
| IA « Mode-as-Code » | ✅ | ❌ | ❌ | ❌ |

**Notre fossé :** un mode = **des données, jamais du code** → no-code réel,
Marketplace sûre (allowlist + score de risque IA), IA générative, et
cross-platform. Socle **Rust/Tauri** : empreinte minimale.

---

### Business model — Freemium
- **Gratuit** : usage local, 3 modes max (découverte).
- **Premium SaaS ~4,99 €/mois** : modes illimités, sync cloud, automatisations avancées, IA, thèmes, stats.
- **Licence Lifetime ~49 €** : achat unique (public anti-abonnement).
- **Commission Marketplace** sur presets premium communautaires.
- **B2B** : licences volume (salles e-sport, entreprises).

### Traction & roadmap
- **Aujourd'hui :** socle technique fonctionnel (moteur d'orchestration, DSL
  déclaratif, moteur d'automatisation SI/ALORS, analyse de risque Marketplace,
  IA Mode-as-Code, app desktop 4 onglets) — stade **POC → MVP**.
- **Oct. 2026 :** verrouillage des objectifs de track.
- **Janv. 2027 :** rendu du Beta Test Plan.
- **Avr. 2027 :** Greenlight (jury blanc, visio).
- **Juil. 2027 :** Greenlight + Jury RNCP — **démo LIVE obligatoire**.
- Validation marché en cours : **15-20 interviews**, MVP itéré sur **≥ 2 cycles**.

---

### Équipe
- ⚠️ Chef de projet — *nom à compléter*
- ⚠️ Lead technique (Rust/Core) — *nom à compléter*
- ⚠️ Frontend / UX (Tauri + React) — *nom à compléter*
- ⚠️ IA & Cloud — *nom à compléter*
- ⚠️ Business / Marketing — *nom à compléter*
- ⚠️ Mentor / suivi pédagogique Epitech — *à compléter*

### Stade actuel
**POC avancé / début de MVP.** Fondations Windows (prioritaire) + Linux : gestion
des process, lancement de jeux (Steam), audio (Linux), IoT/RGB partiellement
simulés. Prochaines priorités : volume Windows (Core Audio), Philips Hue réel,
persistance SQLite offline-first, éditeur no-code finalisé.

### Notre « ask »
- 🧪 **Bêta-testeurs** : gamers, streamers et télétravailleurs sur PC (Windows/Linux).
- 🧭 **Mentors** : go-to-market SaaS grand public, sécurité anti-cheat, monétisation Marketplace.
- 🤝 **Partenaires** : constructeurs (Philips Hue, SteelSeries, Logitech/Corsair), salles e-sport, créateurs Twitch/YouTube.

---

*Chiffres cohérents avec `docs/eip/_BRIEF_PROJET.md`. Éléments marqués ⚠️ =
placeholders à compléter avant présentation jury.*
