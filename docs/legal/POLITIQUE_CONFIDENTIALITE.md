# Politique de confidentialité — Nexum

> ⚠️ **AVERTISSEMENT — DOCUMENT BROUILLON (projet étudiant Epitech EIP).**
> Ce document est un **modèle de travail** rédigé dans le cadre du projet étudiant Nexum. Il **ne constitue pas un avis juridique** et **doit impérativement être relu et validé par un professionnel du droit / DPO** avant toute mise en production. Les mentions marquées ⚠️ sont des **espaces réservés (placeholders)** à compléter. Il doit être mis en cohérence avec le document interne `docs/rncp/SECURITY_RGPD.md`.
>
> Dernière mise à jour du modèle : 2026-07-13. Version : 0.1 (brouillon EIP).

---

## 1. Introduction

La présente Politique de confidentialité décrit la manière dont l'application **Nexum** (ci-après le « **Service** ») collecte et traite les données à caractère personnel, dans le respect du **Règlement (UE) 2016/679 (RGPD)** et de la **loi n° 78-17 du 6 janvier 1978** (Informatique et Libertés).

**Principe de minimisation :** Nexum fonctionne en **offline-first**. En l'absence de compte et de synchronisation, **aucune donnée personnelle ne quitte le poste de l'utilisateur**. Nexum ne collecte **pas** le contenu des applications de l'utilisateur, ni ses fichiers, ni sa navigation : il ne connaît que les noms d'actions et paramètres des « modes » qu'il exécute.

---

## 2. Responsable de traitement

- **Responsable de traitement :** ⚠️ *[Raison sociale / entité juridique — ex. SAS Nexum]*
- **Adresse :** ⚠️ *[Siège social]*
- **Contact :** ⚠️ *[e-mail — ex. privacy@nexum.app]*
- **Délégué à la protection des données (DPO), le cas échéant :** ⚠️ *[nom / e-mail — ex. dpo@nexum.app]*

⚠️ *L'entité juridique responsable de traitement reste à constituer avant commercialisation.*

---

## 3. Données collectées, finalités et bases légales

Nexum ne traite des données personnelles que lorsque l'utilisateur active des fonctionnalités en ligne.

| Catégorie de données | Finalité | Base légale (art. 6 RGPD) | Conservation |
|---|---|---|---|
| **Compte** : e-mail, identifiant, mot de passe (haché Argon2id) ou identifiant OAuth (Google/Discord) | Création et gestion du compte, authentification | Exécution du contrat (art. 6.1.b) | Durée du compte + 30 jours ⚠️ |
| **Modes, actions, règles d'automatisation** | Fonctionnement du Service et synchronisation cloud | Exécution du contrat (art. 6.1.b) | Durée du compte |
| **Journaux d'exécution (télémétrie optionnelle)** | Débogage, amélioration, statistiques d'usage | Intérêt légitime (art. 6.1.f) **ou** consentement selon la nature ⚠️ | 90 jours glissants ⚠️ |
| **Modes partagés + évaluations (Marketplace)** | Publication et notation communautaire | Consentement (art. 6.1.a) | Jusqu'au retrait |
| **Prompts « IA Mode-as-Code »** | Génération assistée de modes | Consentement (art. 6.1.a) | Non conservés au-delà de la requête ⚠️ |
| **Contexte mobile / géolocalisation (déclencheurs)** | Automatisation contextuelle | Consentement explicite (art. 6.1.a) | Non persisté côté serveur (simple relais) |
| **Données de paiement** | Gestion des abonnements Premium/Lifetime | Exécution du contrat + obligation légale (comptabilité) | Traitées par le prestataire de paiement ; durées légales comptables ⚠️ |

⚠️ *Les données de paiement (numéro de carte, etc.) sont traitées directement par le prestataire de paiement ⚠️ [nom] et ne sont pas stockées par l'Éditeur.*

### Consentement granulaire
Le consentement est **distinct par finalité optionnelle** (Marketplace, IA, géolocalisation), via des cases **non pré-cochées**, et **révocable à tout moment** sans perte des fonctions de base.

---

## 4. Destinataires et sous-traitants

Les données ne sont **ni vendues ni louées**. Elles peuvent être communiquées à :

- **Hébergeur cloud (UE)** : ⚠️ *[nom du fournisseur d'hébergement — région UE]*, pour l'hébergement de l'API et de la base de données ;
- **Fournisseurs d'identité OAuth** : Google, Discord (uniquement si l'utilisateur choisit ce mode de connexion) ;
- **Prestataire de paiement** : ⚠️ *[nom — ex. Stripe]*, pour la gestion des abonnements ;
- **Fournisseur de modèle d'IA (LLM)** : ⚠️ *[nom — privilégier un fournisseur UE ou un modèle auto-hébergé]*, uniquement pour la fonctionnalité IA et sous consentement ;
- **Autorités** : sur réquisition légale.

Chaque sous-traitant est lié par un **accord de traitement des données (DPA)** conforme à l'article 28 du RGPD. ⚠️ *[Tenir à jour la liste des sous-traitants.]*

---

## 5. Durées de conservation

Les durées figurent au tableau de l'article 3. À l'expiration, les données sont **supprimées ou anonymisées**. Les données strictement nécessaires au respect d'obligations légales (facturation) sont conservées pendant les durées légales applicables.

---

## 6. Transferts hors Union européenne

L'hébergement est réalisé **au sein de l'Union européenne**. En principe, **aucun transfert hors UE** n'est effectué. Si un transfert devenait inévitable (ex. fournisseur LLM situé hors UE), il serait encadré par des **garanties appropriées** : clauses contractuelles types (CCT) de la Commission européenne, décision d'adéquation, et analyse d'impact des transferts. ⚠️ *[À arbitrer selon les prestataires retenus.]*

---

## 7. Droits des personnes concernées

Conformément aux articles 15 à 22 du RGPD, l'utilisateur dispose des droits suivants :

- **Droit d'accès** — obtenir une copie des données le concernant ;
- **Droit de rectification** — corriger des données inexactes (édition du profil et des modes depuis l'Application) ;
- **Droit à l'effacement (« droit à l'oubli »)** — suppression du compte avec effacement en cascade (modes, règles, journaux ; modes partagés dépubliés ou anonymisés) ;
- **Droit à la portabilité** — export de l'ensemble des données dans un format ouvert (JSON) ;
- **Droit d'opposition et de limitation** — s'opposer à un traitement fondé sur l'intérêt légitime, désactiver une finalité optionnelle ;
- **Droit de retirer son consentement** à tout moment, sans effet rétroactif ;
- **Droit de définir des directives** relatives au sort des données après le décès.

**Exercice des droits :** par e-mail à ⚠️ *[privacy@nexum.app / dpo@nexum.app]* ou directement depuis l'Application. L'Éditeur répond dans un délai maximal de **un (1) mois** (art. 12 RGPD), prorogeable de deux mois en cas de complexité. Une pièce justificative d'identité peut être demandée en cas de doute raisonnable.

---

## 8. Cookies et traceurs (site web)

⚠️ *Cette section concerne le **site web** de présentation. L'application de bureau ne dépose pas de cookies publicitaires.*

Le site peut utiliser :

- des **cookies strictement nécessaires** (fonctionnement, session) — exemptés de consentement ;
- des **cookies de mesure d'audience / analytics** — soumis au consentement préalable ⚠️ *[préciser l'outil ; privilégier une solution exemptée ou anonymisée conformément aux recommandations CNIL]* ;
- le cas échéant, des cookies liés aux fonctions de partage.

Un **bandeau de consentement** permet d'accepter, de refuser ou de personnaliser les traceurs non essentiels, avec la même facilité pour accepter et refuser. Le choix est conservé et révisable à tout moment. ⚠️ *[Compléter la liste précise des cookies, leur finalité et leur durée.]*

---

## 9. Sécurité des traitements

L'Éditeur met en œuvre des mesures techniques et organisationnelles appropriées (art. 32 RGPD), notamment :

- **chiffrement en transit** (TLS 1.3, HSTS) et **au repos** ;
- **hachage des mots de passe** (Argon2id) ;
- **stockage des secrets locaux** dans le coffre du système d'exploitation (DPAPI sous Windows, Secret Service/keyring sous Linux) ;
- **cloisonnement des données par utilisateur**, contrôle d'accès et journalisation ;
- **minimisation** et sécurité par conception (les modes partagés ne contiennent aucun code exécutable).

En cas de **violation de données** susceptible d'engendrer un risque pour les personnes, l'Éditeur notifie la CNIL dans les **72 heures** et, le cas échéant, informe les personnes concernées (art. 33 et 34 RGPD).

---

## 10. Traitements concernant les mineurs

⚠️ *Le Service n'est pas destiné aux enfants en dessous de l'âge du consentement numérique applicable (15 ans en France). Voir l'article 2.3 des CGU.*

---

## 11. Modifications de la politique

La présente Politique peut être mise à jour. Toute modification substantielle est portée à la connaissance des utilisateurs ⚠️ *[modalités — ex. notification in-app]*. La date de dernière mise à jour figure en tête de document.

---

## 12. Contact et réclamation

- **Contact / DPO :** ⚠️ *[privacy@nexum.app / dpo@nexum.app]*
- **Autorité de contrôle :** l'utilisateur a le droit d'introduire une réclamation auprès de la **Commission Nationale de l'Informatique et des Libertés (CNIL)** — 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — www.cnil.fr.

---

*Fin du document — modèle brouillon à faire valider par un professionnel du droit / DPO.*
