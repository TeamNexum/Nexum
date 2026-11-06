# Matrice des compétences de l'équipe

> Livrable du workshop **Context, audit & compliance** (G-EIP-600), partie 4 « Team Skills Audit »
> (#110) : liste des compétences techniques et humaines nécessaires, comparaison avec celles de
> l'équipe, plan pour combler les manques. Ce document sert à collecter les réponses ; le résultat
> va sur la diapositive « Skills Matrix » du support du workshop (avec le benchmark concurrentiel,
> l'état de l'art et le rapport de conformité).
> Arnaud prépare le tableau et le plan ; **chacun remplit sa colonne** avant le 06/11/2026.

## Comment remplir

Note de 0 à 3 pour **ce que tu sais faire toi-même aujourd'hui**, sans aide :

| Note | Signification |
|---|---|
| 0 | Jamais pratiqué |
| 1 | Notions : je comprends, je peux modifier avec de l'aide |
| 2 | Autonome : je livre une tâche de ce type seul |
| 3 | Référent : je peux expliquer, relire et débloquer les autres |

Ajoute **❤** à côté d'une note si tu veux progresser sur ce sujet cette année.

## Compétences dont le projet a besoin

| Domaine | Compétence | Où le projet en a besoin |
|---|---|---|
| Technique | Rust | Cœur, intégrations, API cloud, commande vocale |
| Technique | React + TypeScript | Interface desktop et mobile |
| Technique | Mobile iOS (Swift, Xcode) | App iPhone, plugin matériel, installation |
| Technique | Mobile Android (Kotlin) | App Android |
| Technique | API et bases de données (axum, PostgreSQL) | Comptes, synchronisation, marketplace |
| Technique | Infra et déploiement (OVH, HTTPS, installeurs signés) | Mise en ligne du cloud, distribution de l'app |
| Technique | CI/CD (GitHub Actions) | Build et tests à chaque push, sur chaque système |
| Technique | Tests et qualité | Tests unitaires et e2e, critères du BTP, bloc RNCP 5 |
| Technique | Intégrations système et objets connectés | Volume, luminosité, Philips Hue, Steam, OBS, Spotify |
| Technique | IA (voix, langage naturel) | Commande vocale locale, mode généré à partir d'une phrase |
| Technique | Sécurité (OAuth, secrets, analyse de risque) | Comptes Gmail/Outlook/Teams, marketplace |
| Produit | Design UI / UX (Figma) | Maquettes, charte Galaxy appliquée à l'app |
| Produit | Gestion de projet | Planning, répartition, suivis mentor, bloc RNCP 7 |
| Business | Étude de marché et interviews | Objectif obligatoire « validation marché » |
| Business | Modèle économique et finances (BMC, coûts, projections) | Objectif obligatoire « outils entrepreneuriaux » |
| Business | Communication et réseaux sociaux | Objectif C « Image et message » |
| Business | Pitch et présentation orale | Suivis, Greenlight, démo live |
| Juridique | RGPD, CGU, licences | Données des utilisateurs, comptes connectés, marketplace |
| Humain | Communication dans l'équipe | Dire tôt ce qui bloque, tenir les autres informés |
| Humain | Organisation et respect des délais | Tâches du bot Discord, échéances EIP |
| Humain | Autonomie | Avancer seul sur sa partie entre deux réunions |
| Humain | Travail en équipe et gestion des désaccords | Relectures, décisions communes, répartition |
| Humain | Écoute des utilisateurs | Interviews, retours des bêta-testeurs |
| Humain | Anglais | Documentation technique, outils, échanges avec des experts |

## Matrice

| Compétence | Arnaud | Enzo | Rares | Max | Raph |
|---|---|---|---|---|---|
| Rust | 1 | | | | |
| React + TypeScript | 2 | | | | |
| Mobile iOS (Swift, Xcode) | 1 ❤ | | | | |
| Mobile Android (Kotlin) | 0 | | | | |
| API et bases de données | 1 | | | | |
| Infra et déploiement | 1 ❤ | | | | |
| CI/CD | 2 | | | | |
| Tests et qualité | 2 | | | | |
| Intégrations système et objets connectés | 2 | | | | |
| IA (voix, langage naturel) | 1 ❤ | | | | |
| Sécurité | 1 | | | | |
| Design UI / UX | 1 | | | | |
| Gestion de projet | 3 | | | | |
| Étude de marché et interviews | 2 | | | | |
| Modèle économique et finances | 2 | | | | |
| Communication et réseaux sociaux | 2 | | | | |
| Pitch et présentation orale | 2 | | | | |
| RGPD, CGU, licences | 0 ❤ | | | | |
| Communication dans l'équipe | 2 | | | | |
| Organisation et respect des délais | 2 | | | | |
| Autonomie | 2 | | | | |
| Travail en équipe et gestion des désaccords | 2 | | | | |
| Écoute des utilisateurs | 1 ❤ | | | | |
| Anglais | 3 | | | | |

> Colonne d'Arnaud : proposition à relire et ajuster par Arnaud (même règle que pour tout le monde :
> ce qu'il sait faire seul aujourd'hui).

## Analyse individuelle

Chacun liste ses forces (notes de 2 ou plus), ses manques utiles au projet (0 ou 1) et ce qu'il
fait pour progresser. Ces analyses alimentent l'analyse d'équipe ci-dessous.

### Arnaud

**Forces (2 ou plus).** Gestion de projet (3) ; anglais (3, bilingue) ; React + TypeScript,
CI/CD, tests, intégrations système ; étude de marché et interviews, modèle économique et
finances ; communication et réseaux sociaux, pitch ; compétences humaines (communication,
organisation, autonomie, travail en équipe).

**Manques utiles au projet (0 ou 1).**

| Compétence | Note | Pourquoi c'est important pour Nexum |
|---|---|---|
| RGPD, CGU, licences | 0 | Comptes connectés (Gmail, Outlook, Teams), marketplace : obligatoire avant la bêta |
| Rust | 1 | Langage du cœur, des intégrations et du cloud : le PO doit pouvoir relire et corriger seul |
| Infra et déploiement | 1 | Mise en ligne de l'API chez OVH, nécessaire au jalon J1 (décembre) |
| Mobile iOS (Swift, Xcode) | 1 | Arnaud porte l'app iPhone : il doit pouvoir la faire évoluer seul |
| Écoute des utilisateurs | 1 | Le PO doit entendre lui-même les utilisateurs pour arbitrer le produit |
| IA (voix, langage naturel) | 1 | Commande vocale et génération de modes (jalons J3 et J4) |
| API et bases de données, sécurité | 1 | Comptes et synchronisation (J2) ; rapport de conformité du workshop (OWASP) |
| Mobile Android | 0 | Pas de manque à combler : Max porte l'app Android |

**Plan.**

| Compétence | Levier | Action concrète | Échéance |
|---|---|---|---|
| RGPD et sécurité | Formation | Suivre le MOOC « L'atelier RGPD » de la CNIL et lire l'OWASP Top 10, puis rédiger l'inventaire des données personnelles de Nexum (partie conformité du workshop) | 30/11/2026 |
| Écoute des utilisateurs | Binôme avec Enzo | Mener 3 des interviews de #24 avec Enzo | 06/11/2026 |
| Rust | Formation + binôme avec Max | Faire les exercices Rustlings, puis relire chaque semaine une pull request Rust de Max | J2, 07/02/2027 |
| Infra et déploiement | Binôme avec Max | Faire avec Max la mise en ligne de l'API chez OVH (#48) | J1, début décembre 2026 |
| Mobile iOS | Formation + pratique | Ajouter seul une action au plugin Swift de l'app iPhone, avec relecture | J2, 07/02/2027 |
| IA | Pratique | Prendre part au démonstrateur de génération de modes (#19) | J3, 04/04/2027 |

## Points forts de l'équipe

À compléter une fois les 5 colonnes remplies : les compétences où **au moins deux personnes ont
2 ou plus** (l'équipe peut livrer et se relire).

| Compétence | Qui |
|---|---|
| | |

## Analyse des manques

À compléter une fois les 5 colonnes remplies. Pour chaque compétence, on regarde la meilleure note
de l'équipe :

- **Manque** : personne n'a 2 ou plus → personne ne peut livrer seul.
- **Fragile** : une seule personne a 2 ou plus → si elle est absente, le sujet bloque.

| Compétence | Meilleure note | Qui | Statut (manque / fragile / couvert) |
|---|---|---|---|
| | | | |

## Plan pour combler les manques

Une ligne par manque ou compétence fragile. Leviers possibles : **formation** (cours, tutoriels,
temps dédié), **binôme** (le référent fait avec quelqu'un qui apprend), **aide extérieure**
(Epitech, mentor, contacts, école d'art), **recrutement d'un profil** (un étudiant d'une autre
filière, un freelance, un contributeur), **réduction du périmètre** (on retire ou repousse la
fonctionnalité concernée).

| Compétence | Levier | Qui | Action concrète | Échéance |
|---|---|---|---|---|
| | | | | |

À surveiller dès maintenant, d'après le périmètre : **RGPD, CGU et licences** (comptes connectés et
marketplace, aucune compétence identifiée à ce jour), **infra et déploiement** (mise en ligne chez
OVH avant la bêta de décembre) et **IA** (commande vocale et génération de modes).
