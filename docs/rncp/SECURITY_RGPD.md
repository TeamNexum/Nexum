# Sécurité & conformité RGPD — Nexum

> Document de référence sécurité et protection des données personnelles pour le jury EIP / RNCP (Bloc 5 — assurance qualité, Bloc 6 — déploiement).
> Cohérent avec [`_BRIEF_PROJET.md`](../eip/_BRIEF_PROJET.md) et [`NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`](../../../NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md).
>
> Dernière mise à jour : 2026-07-13.
>
> **Note de statut** — Nexum est au stade POC/MVP. Ce document décrit **à la fois** ce qui est **déjà implémenté** (noté ✅, vérifiable dans le code) et ce qui relève de la **conception cible** à livrer d'ici juillet 2027 (noté 🎯). Les valeurs non encore arbitrées sont marquées « **Hypothèse** ».

---

## 1. Résumé pour le jury

Nexum est une application de bureau qui **orchestre l'environnement numérique de l'utilisateur** (processus système, applications, périphériques, objets connectés) à partir de « modes ». Cette capacité — agir sur le système et piloter du matériel — est précisément ce qui définit sa **surface d'attaque** et ses **obligations de conformité**.

La thèse de sécurité de Nexum tient en une phrase :

> **Un mode est de la donnée déclarative, jamais du code.** Un mode partagé n'est qu'une liste d'actions typées issues d'une *allowlist*. Il n'existe donc aucun vecteur d'exécution de code arbitraire dans le contenu partagé entre utilisateurs.

Ce choix d'architecture (voir [ADR 0001](../adr/0001-modele-mode-action-declaratif.md) et [ADR 0004](../adr/0004-marketplace-sandbox-declaratif.md)) transforme un problème de sécurité classiquement très dur (exécuter du contenu tiers non fiable) en un problème beaucoup plus simple et vérifiable (**valider de la donnée contre une liste blanche**).

---

## 2. Modèle de menace (STRIDE léger)

### 2.1 Actifs à protéger

| Actif | Sensibilité | Localisation |
|---|---|---|
| Données personnelles compte (email, identifiant) | Élevée | Cloud (PostgreSQL, UE) |
| Modes de l'utilisateur (config, actions) | Moyenne | Local (SQLite) + Cloud |
| Jetons d'authentification (JWT, refresh) | Critique | Local (stockage sécurisé OS) |
| Secrets d'intégration (clé pont Hue, tokens OAuth) | Critique | Local + Cloud chiffré |
| Intégrité du système hôte de l'utilisateur | Critique | Poste utilisateur |
| Réputation de la Marketplace (modes partagés) | Moyenne | Cloud |

### 2.2 Acteurs de menace

- **M1 — Créateur de mode malveillant** : publie un mode « piégé » sur la Marketplace pour nuire aux autres utilisateurs.
- **M2 — Attaquant réseau** : intercepte / altère le trafic entre client et cloud.
- **M3 — Attaquant cloud** : cible l'API et la base de données (compromission de comptes, exfiltration).
- **M4 — Logiciel malveillant local** : déjà présent sur le poste, tente d'abuser de Nexum comme d'un « levier » de privilèges.
- **M5 — Éditeur anti-triche** : détecte à tort Nexum comme un outil de triche (menace « métier », voir §7).

### 2.3 Analyse STRIDE par surface

Légende impact/probabilité : F=faible, M=moyen, É=élevé.

| # | Menace (catégorie STRIDE) | Surface | Acteur | Prob. | Impact | Contre-mesure |
|---|---|---|---|---|---|---|
| T1 | **S**poofing — usurpation de compte | Auth cloud | M3 | M | É | JWT signés + OAuth (Google/Discord), refresh rotatif, hachage mots de passe Argon2id 🎯 |
| T2 | **T**ampering — mode partagé altéré / piégé | Marketplace | M1 | É | É | Validation déclarative allowlist + score de risque ✅ ; modération 🎯 |
| T3 | **T**ampering — trafic sync modifié | Réseau | M2 | M | É | TLS 1.3 obligatoire, HSTS, épinglage optionnel 🎯 |
| T4 | **R**epudiation — action non traçable | Cloud + local | M3 | F | M | Journal d'exécution `MODE_EXECUTIONS`, logs API horodatés 🎯 |
| T5 | **I**nformation disclosure — fuite de données perso | Cloud DB | M3 | M | É | Chiffrement au repos, minimisation, cloisonnement par `user_id`, secrets hors DB 🎯 |
| T6 | **I**nformation disclosure — vol de jetons locaux | Poste | M4 | M | É | Stockage via coffre OS (DPAPI Windows / Secret Service Linux) 🎯 |
| T7 | **D**enial of service — API saturée | Cloud | M2/M3 | M | M | Rate limiting, quotas par compte, offline-first (l'app marche sans cloud) 🎯 |
| T8 | **D**oS local — mode qui tue des process critiques | Moteur local | M1 (via T2) | M | É | `system.close_app` scoré risque élevé, allowlist de process protégés 🎯 |
| T9 | **E**levation of privilege — exécution de code arbitraire via un mode | Marketplace / IA | M1 | **Éliminée par conception** | — | Aucun code dans un mode : uniquement des `action_type` d'une allowlist ✅ |
| T10 | **E**levation — abus de l'IA Mode-as-Code | Service IA | M1 | F | M | Le LLM ne produit que du DSL, revalidé (allowlist + capacités + simulation) avant activation 🎯 |

> **Point fort jury** : la menace la plus grave d'une application extensible (T9, exécution de code tiers) est **structurellement supprimée**, pas seulement atténuée. C'est le bénéfice direct du modèle déclaratif.

---

## 3. Surface d'attaque

Nexum présente quatre surfaces distinctes, par ordre décroissant de criticité.

### 3.1 Application locale avec accès système

C'est la surface la plus puissante : Nexum peut lancer/fermer des applications, régler le volume, la luminosité, piloter des périphériques. Principes de réduction :

- **Moindre privilège** : Nexum tourne en tant qu'utilisateur courant, **jamais** avec des privilèges élevés par défaut. Aucune action V1 ne requiert l'élévation.
- **Bridge Tauri restreint** : la communication front → cœur passe par des **commandes Tauri explicitement déclarées** et des *capabilities* (fichier `src-tauri/capabilities/`). Le frontend ne peut pas invoquer d'API système arbitraire ; il n'accède qu'aux commandes exposées.
- **Pas d'API `shell.open` généralisée** : les actions système passent par des handlers d'adapters typés, pas par une exécution shell libre.
- **Isolation du cœur** : `nexum-core` est **OS-agnostique et sans effet de bord** ; seuls les `nexum-adapters` touchent le système, derrière `#[cfg(target_os = ...)]`.

### 3.2 Plugins / Adapters

Chaque intégration est un **Adapter** implémentant un trait Rust (`Adapter`) — voir [ADR 0003](../adr/0003-architecture-adapters.md). En V1, **tous les adapters sont écrits et compilés par l'équipe Nexum** : il n'y a **pas** encore de plugins tiers exécutables. Le contrat d'adapter impose :

- `supported_actions()` — les seuls `action_type` qu'il déclare gérer ;
- `validate()` — validation des params **sans effet de bord** (sert aussi à la simulation et au scoring) ;
- `is_available()` — vérifie la disponibilité du matériel/API **avant** exécution ;
- `execute()` — respecte `ctx.dry_run` (aucun effet en mode simulation).

> **Hypothèse (post-EIP)** : si un SDK de plugins tiers *exécutables* est ouvert, il faudra une vraie isolation (processus séparé, WASM sandboxé, permissions déclarées). Tant que ce n'est pas le cas, la surface « plugin exécutable tiers » **n'existe pas**.

### 3.3 Marketplace (partage de modes)

Surface d'ingestion de contenu tiers. Comme un mode partagé n'est **que du JSON déclaratif**, la validation est une analyse statique de données (détaillée en §4).

### 3.4 Synchronisation cloud

API réseau (axum + PostgreSQL) : auth, sync des modes, Marketplace, service IA. Surface réseau classique, traitée en §5.

---

## 4. Sécurité par conception

### 4.1 Modes = données déclaratives, pas de code arbitraire

Le format d'un mode est un **DSL JSON** : une liste ordonnée d'`ActionStep`, chacun portant un `action_type` **namespacé** et des `params` typés. Il n'y a **aucune primitive de contrôle de flux, aucune expression, aucun script**. Un mode ne peut donc rien exprimer d'autre que « exécute telle action connue avec tels paramètres ».

Conséquence de sécurité : le pire qu'un mode puisse faire est **limité à l'union des actions de l'allowlist**, chacune bornée par la validation de ses params dans l'adapter. Il n'existe pas d'échappatoire vers du code.

### 4.2 Isolation en couches

```
Frontend React  →  Bridge Tauri (commandes + capabilities)  →  nexum-core (pur, sans I/O système)
                                                                      │
                                                            nexum-adapters (#[cfg] par OS)  →  Système / HW
```

- Le **cœur** ne fait aucune I/O système : il est testable en CI sans matériel (atout Bloc RNCP 5).
- Les **adapters** concentrent tout le code sensible et sont la seule couche à privilèges effectifs.
- Le **frontend** est non fiable par principe : il ne peut agir que via les commandes Tauri exposées.

### 4.3 Allowlist + score de risque (déjà implémentés dans `nexum-core::marketplace`) ✅

Le module `crates/nexum-core/src/marketplace.rs` implémente et **teste** l'évaluation d'un mode partagé :

1. **Analyse statique / allowlist** : tout `action_type` absent de l'allowlist (dérivée de `ActionRegistry::known_action_types()`) fait passer le mode au niveau **`Rejected`** — il **ne peut pas être publié**.
2. **Score de risque pondéré** : chaque action a un poids d'impact. Extrait réel des poids :

   | Action | Poids | Justification |
   |---|---|---|
   | `system.close_app` | 30 | Peut tuer des processus de l'utilisateur |
   | `system.launch_app` | 25 | Lance un binaire local par chemin |
   | `system.open_url` | 10 | Ouvre une URL |
   | `gaming.launch_steam` | 5 | Lance un jeu via `steam://` |
   | `audio.set_volume`, `display.set_brightness`, `iot.hue.activate_scene`, `peripheral.apply_rgb_profile` | 2 | Impact cosmétique / réversible |
   | *(action connue non classée)* | 15 | Prudence par défaut |

3. **Niveaux dérivés** : `Rejected` si actions inconnues ; sinon `High` (score ≥ 80), `Medium` (≥ 40), `Low`. Les actions de poids ≥ 30 génèrent un `issue` « high-impact action » signalé à la modération.

Cette logique est couverte par des tests unitaires (`safe_mode_is_low_risk`, `unknown_action_is_rejected`, `many_high_impact_actions_raise_the_level`).

> **Démonstration jury** : montrer qu'un mode contenant une action fictive `evil.rm_rf` est **automatiquement rejeté** (test `unknown_action_is_rejected`) illustre en une ligne la sécurité par conception.

### 4.4 Défense en profondeur additionnelle 🎯

- **Allowlist de processus protégés** : `system.close_app` refusera les processus critiques OS/sécurité (antivirus, services système). *(Hypothèse : liste à figer en Phase 2.)*
- **Confirmation utilisateur** pour les modes importés de niveau `Medium`/`High` avant première exécution.
- **Simulation (`dry_run`)** systématiquement proposée avant d'activer un mode importé.

---

## 5. Sécurité cloud

Le cloud (`services/nexum-cloud`, axum + PostgreSQL) est aujourd'hui un **squelette** (routes `/health`, `/api/modes`). La cible sécurité pour le déploiement :

### 5.1 Authentification & autorisation 🎯
- Email + **OAuth Google/Discord** (pertinent pour la cible gaming), sessions par **JWT** signés (courte durée) + **refresh token rotatif**.
- Mots de passe hachés avec **Argon2id** (jamais en clair, jamais réversibles).
- Autorisation par ressource : chaque requête est cloisonnée par `user_id` ; un utilisateur ne peut lire/écrire que ses propres modes.

### 5.2 Chiffrement
- **En transit** : **TLS 1.3** obligatoire sur toutes les routes, **HSTS**, redirection HTTP→HTTPS. Épinglage de certificat côté client en option.
- **Au repos** : chiffrement disque de la base PostgreSQL (au niveau volume/hébergeur) ; les champs les plus sensibles (secrets d'intégration) chiffrés au niveau applicatif avant stockage.

### 5.3 Gestion des secrets
- Secrets serveur (clés JWT, identifiants DB, clés OAuth) via variables d'environnement / gestionnaire de secrets de l'hébergeur — **jamais** dans le dépôt Git.
- Secrets utilisateur locaux (jeton pont Hue, tokens OAuth) stockés dans le **coffre du système** (DPAPI sous Windows, Secret Service/keyring sous Linux), pas en clair dans SQLite.

### 5.4 Durcissement API 🎯
- **Rate limiting** et quotas par compte (anti-DoS, anti-abus Marketplace).
- Validation stricte des entrées (désérialisation typée `serde` + bornes), en-têtes de sécurité (CSP, `X-Content-Type-Options`, etc.).
- Journalisation horodatée des accès et des actions sensibles (non-répudiation).
- **Offline-first** comme filet de sécurité : une panne ou attaque du cloud **ne bloque pas** l'usage local (SQLite).

---

## 6. Conformité RGPD

### 6.1 Rôles
- **Responsable de traitement** : l'équipe Nexum (projet EIP). *(Hypothèse : entité juridique à constituer avant commercialisation.)*
- **Sous-traitants** : hébergeur cloud (UE), fournisseurs OAuth, éventuel fournisseur LLM pour l'IA Mode-as-Code (voir §6.7).

### 6.2 Données collectées & finalités

| Donnée | Finalité | Base légale | Conservation |
|---|---|---|---|
| Email, identifiant | Création/gestion du compte | Exécution du contrat (art. 6.1.b) | Durée du compte + 30 j |
| Mot de passe (haché) | Authentification | Exécution du contrat | Durée du compte |
| Modes, actions, règles | Fonctionnement + sync cloud | Exécution du contrat | Durée du compte |
| Logs d'exécution (`MODE_EXECUTIONS`) | Feedback, débogage | Intérêt légitime (art. 6.1.f) | 90 j glissants *(Hypothèse)* |
| Modes partagés + ratings | Marketplace | Consentement | Jusqu'à retrait |
| Prompts IA Mode-as-Code | Génération de modes | Consentement | Non conservés au-delà de la requête *(Hypothèse cible)* |
| Contexte mobile (géoloc pour triggers) | Automatisation | **Consentement explicite** | Non persisté côté serveur (relais) |

> **Minimisation** : Nexum **ne collecte pas** le contenu des applications de l'utilisateur, ni ses fichiers, ni sa navigation. Il ne connaît que les **noms d'actions et paramètres** des modes qu'il exécute. La géolocalisation n'est utilisée que comme **déclencheur** et n'est pas stockée côté serveur.

### 6.3 Consentement
- Consentement **granulaire et distinct** par finalité optionnelle (Marketplace, IA, géolocalisation) — cases **non pré-cochées**, révocables à tout moment.
- Le mode **local/offline** (freemium) fonctionne **sans compte** : aucune donnée personnelle ne quitte le poste tant que l'utilisateur n'active pas la sync.

### 6.4 Droits des utilisateurs 🎯
- **Accès & portabilité** : export de **toutes** les données du compte (modes, règles, profil) dans un format ouvert (JSON) — cohérent avec le DSL déjà en place.
- **Suppression (« droit à l'oubli »)** : suppression du compte et effacement en cascade (modes, règles, logs, modes partagés dépubliés/anonymisés).
- **Rectification** : édition du profil et des modes depuis l'app.
- **Opposition / retrait** : désactivation d'une finalité optionnelle sans perte des fonctions de base.
- Délai de réponse cible : **≤ 30 jours** (obligation légale).

### 6.5 Sécurité des traitements
Voir §5 (chiffrement transit/repos, minimisation, cloisonnement, journalisation). Notification de violation de données à la CNIL sous **72 h** en cas d'incident (procédure à formaliser).

### 6.6 DPA & hébergement UE
- **Hébergement dans l'Union européenne** (ex. fournisseur UE ou région UE d'un cloud). *(Hypothèse : fournisseur à arbitrer — le brief évoque AWS/Azure, à cadrer sur région UE.)*
- **DPA (Data Processing Agreement)** signé avec chaque sous-traitant (hébergeur, OAuth, LLM). En l'absence de transfert hors UE ; si un transfert est inévitable (LLM US, p. ex.), recours aux **clauses contractuelles types (CCT)** et évaluation d'impact.

### 6.7 IA Mode-as-Code & données
Le pipeline est : *langage naturel → LLM → DSL JSON → validation → activation*. Points de conformité :
- Le prompt utilisateur peut contenir des données personnelles → transmis à un LLM sous **consentement**, idéalement via un fournisseur UE ou un modèle auto-hébergé. *(Hypothèse à trancher.)*
- La sortie du LLM est **uniquement du DSL déclaratif revalidé** : pas de code, pas d'exécution directe → pas de fuite d'exécution.

---

## 7. Certification / compatibilité anti-cheat

Le risque « anti-cheat » (Nexum détecté comme outil de triche) est identifié dans le SWOT et les risques du plan technique. Approche défensive :

- **API officielles uniquement** : lancement de jeux via `steam://` et SDK officiels (Logitech, Corsair, SteelSeries, Philips Hue). ✅ (`gaming.launch_steam` déjà implémenté ainsi.)
- **Aucune injection** : Nexum n'injecte **jamais** de code, ne lit/écrit **jamais** la mémoire d'un jeu, n'accroche (hook) **aucun** processus de jeu, ne manipule **aucun** input in-game.
- **Séparation temporelle** : les actions de Nexum s'exécutent **autour** de la session (avant/après lancement), pas pendant le gameplay compétitif.
- **Transparence** : code des adapters gaming auditable, comportement documenté — de quoi rassurer un éditeur anti-cheat ou le jury.

> **Argument jury** : Nexum se situe volontairement du côté « launcher/utilitaire système » (comme Razer Synapse ou iCUE), pas du côté « overlay/mod injecté ». C'est ce qui le rend **compatible anti-cheat par conception**.

---

## 8. Politique de divulgation responsable (Responsible Disclosure)

Pour rassurer utilisateurs et jury, Nexum adopte une politique publique :

- **Point de contact** : `security@nexum.app` *(Hypothèse : adresse à créer)*, réponse sous **72 h**.
- **Périmètre** : application desktop, adapters, service cloud, Marketplace.
- **Engagement** : pas de poursuite envers un chercheur agissant de bonne foi (safe harbour), respect d'un délai raisonnable de correction (**90 jours**) avant divulgation publique.
- **Ce qui est hors périmètre** : tests de charge/DoS sur la prod, ingénierie sociale du staff.
- **Reconnaissance** : mention dans un fichier `SECURITY.md` / hall of fame. *(Hypothèse : pas de bug bounty monétaire au stade EIP.)*

> Un fichier `SECURITY.md` à la racine du dépôt rendra cette politique découvrable (standard GitHub).

---

## 9. Traçabilité RNCP & état d'avancement

| Exigence | Preuve | Statut |
|---|---|---|
| Sécurité par conception | Modèle déclaratif ([ADR 0001](../adr/0001-modele-mode-action-declaratif.md), [0004](../adr/0004-marketplace-sandbox-declaratif.md)) | ✅ implémenté |
| Analyse de risque contenu tiers | `nexum-core::marketplace` (allowlist + score, testé) | ✅ implémenté |
| Isolation des privilèges | Cœur pur + adapters `#[cfg]` + capabilities Tauri | ✅ (cœur) / 🎯 (durcissement) |
| Auth & chiffrement cloud | Section §5 | 🎯 conception |
| Conformité RGPD (droits, DPA, UE) | Section §6 | 🎯 conception |
| Compatibilité anti-cheat | API officielles, zéro injection | ✅ principe / 🎯 doc formelle |
| Divulgation responsable | Section §8 + futur `SECURITY.md` | 🎯 à publier |

---

## 10. Références

- [`NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`](../../../NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md) — architecture, roadmap, risques.
- [`docs/adr/`](../adr/README.md) — décisions d'architecture (ADR 0001–0004).
- Code de référence : `crates/nexum-core/src/marketplace.rs`, `crates/nexum-core/src/adapter.rs`, `crates/nexum-schema/src/action_types.rs`.
- RGPD : Règlement (UE) 2016/679 ; recommandations CNIL.
