# Nexum — Plan de communication & stratégie business

*Projet EIP Epitech · Document de travail · Octobre 2026*
*Base : le site teamnexum.github.io/NexumWebsite (prototype fonctionnel, bêta fermée prévue en 2027, prix non fixés).*

> **Lecture rapide.** Nexum est un produit pas encore sorti, porté par 5 étudiants, avec un budget quasi nul. La stratégie recommandée tient en trois idées : (1) **valider avant de vendre** (entretiens + liste d'attente), (2) **communiquer avec honnêteté et en public** (c'est déjà le ton du site, c'est un avantage), (3) **se concentrer sur une seule cible de départ** pour ne pas diluer l'effort.

---

## 1. Diagnostic de départ

### Ce qui est déjà solide
- **Promesse claire et mémorable** : « Un clic. Tout ton setup. » Le bénéfice est compris en 5 secondes.
- **Ton honnête** : la section Intégrations sépare « disponible » et « prévu », la FAQ admet « pas encore disponible » et « prix non fixés ». C'est rare et ça crée de la confiance.
- **Démo interactive** sur la page (« Active un mode pour voir ») : excellent outil de conversion.
- **Pages dédiées par persona** (joueurs, streamers, télétravail) et **formulaire de bêta** qui collecte e-mail, profil, irritant principal et accord pour un entretien de 20 min.
- **Respect des données** (modes stockés en local, consentement explicite, page confidentialité).

### Points de vigilance
| Sujet | Constat | Risque | Action proposée |
|---|---|---|---|
| **Concurrence citée** | Le tableau compare constructeurs, scripts et launchers. Il ne mentionne pas les alternatives que les visiteurs penseront aussitôt (Stream Deck d'Elgato, SignalRGB / OpenRGB, Power Automate, Raccourcis macOS, Home Assistant, Voicemeeter). | Perte de crédibilité (« ils ne connaissent pas le marché ») | Ajouter 2–3 lignes ou une FAQ « Et Stream Deck / Home Assistant ? » (voir §3) |
| **Trois cibles à la fois** | Joueurs, streamers, télétravail : trois discours, trois canaux. | Dispersion avec 5 personnes | Choisir une cible « tête de pont » (voir §2) |
| **Trois OS annoncés** | Windows, macOS, Linux dans la FAQ, alors que le prototype est « sur ordinateur » sans précision. | Promesse difficile à tenir | Préciser l'ordre de sortie (ex. Windows d'abord) dans la FAQ |
| **Preuve sociale absente** | Aucun témoignage, capture réelle, vidéo ou chiffre. | Frein à l'inscription | Ajouter une courte vidéo de démo (30–45 s) du vrai prototype |
| **Appel à action** | Inscription « bientôt ouverte » dans le bloc bêta. | Trafic sans capture d'e-mails | Ouvrir le formulaire **avant** de lancer la moindre communication |

> ⚠️ Les éléments ci-dessus sont des observations sur le contenu du site à la date de rédaction. Les chiffres de marché ne sont volontairement pas donnés : aucune donnée vérifiée n'a été fournie, à compléter si vous en avez.

---

## 2. Stratégie business

### 2.1 Positionnement
**Énoncé** : *Nexum est la couche « un clic » qui relie jeux, son, lumières et applis, toutes marques confondues, sans écrire une ligne de code.*

**Différenciation** (déjà dans le site, à marteler) :
1. **Multi-marques** (vs logiciels constructeurs, limités à leur matériel)
2. **Sans code** (vs AutoHotkey et scripts)
3. **Au-delà des jeux** (vs launchers) : applis, système, lumières, réunions
4. **Transparence sur l'échec** : chaque action renvoie un résultat visible (étape 3 « Nexum vérifie »). C'est un vrai argument de fiabilité, sous-exploité.

### 2.2 Choix de la cible « tête de pont »
| Cible | Atouts | Limites | Verdict provisoire |
|---|---|---|---|
| **Joueurs PC** | Communautés très accessibles (Discord, Reddit), forte culture « setup », intégrations déjà prêtes (Steam, Epic, GOG, Hue) | Public exigeant, sensible aux anti-cheats et à la fiabilité, beaucoup d'outils gratuits | **Recommandé en premier** : c'est là où le prototype est le plus avancé |
| **Streamers** | Prescripteurs (ils montrent leur setup), besoin récurrent | Dépend d'OBS/Discord/Spotify, encore « prévus » | Deuxième vague (hiver 2026, quand OBS sera intégré) |
| **Télétravail** | Marché large, potentiel B2B | Slack/Teams/Agenda pas encore prêts, concurrence des outils d'entreprise | À explorer par entretiens, pas de campagne pour l'instant |

**À valider par les entretiens** : l'ordre ci-dessus est une hypothèse. Le questionnaire joint (§ document 2) sert précisément à la confirmer ou l'infirmer.

### 2.3 Modèle économique (hypothèses à tester)
Le site annonce : bêta gratuite, **version gratuite pour l'usage de base + offre payante pour les fonctions avancées et le cloud**. Prix non fixés.

| Source de revenu | Description | Horizon | Niveau de confiance |
|---|---|---|---|
| **Abonnement Pro** (freemium) | Synchronisation cloud des modes, appli mobile de télécommande, déclencheurs avancés (voix, calendrier, lancement de jeu), historique | Après la bêta | Moyen — à tester |
| **Packs / modes de la communauté** | Bibliothèque de modes partagés, extensions ; éventuellement commission sur des packs premium | 2027+ | Faible tant que la communauté n'existe pas |
| **Partenariats matériel & services** | Intégrations « certifiées » avec des marques de lumière/audio, co-marketing | 2027+ | Moyen — dépend de la traction |
| **Offre équipes (B2B)** | Modes partagés pour équipes, studios, organisations esport, espaces de coworking | Plus tard | Faible — à explorer via entretiens télétravail |

**Règle de départ** : ne pas monétiser avant d'avoir de l'usage répété. La priorité est la **rétention**, pas le chiffre d'affaires.

**Fixation du prix** : ne pas inventer de montants. Utiliser le questionnaire (questions de sensibilité au prix, section H) pour obtenir une fourchette réelle, puis tester 2 ou 3 niveaux sur la page d'inscription.

### 2.4 Plan de mise sur le marché (aligné sur la feuille de route publique)

| Phase | Période | Objectif | Actions clés | Indicateur de passage |
|---|---|---|---|---|
| **0. Validation** | Automne 2026 (maintenant) | Comprendre les vrais irritants et confirmer la cible | Ouvrir le formulaire ; 20 à 30 entretiens ; diffuser le questionnaire ; vidéo de démo | ≥ 20 entretiens réalisés, cible prioritaire confirmée |
| **1. Construction d'audience** | Hiver 2026 | Constituer une liste d'attente qualifiée | Build in public, contenu « avant/après setup », communautés Discord/Reddit, 5–10 micro-streamers testeurs | Liste d'attente en croissance régulière + 10 testeurs actifs |
| **2. Bêta fermée** | 2027 | Mesurer l'usage et la fiabilité | Invitations par vagues (20 → 100 → 500), canal de feedback dédié, rapports de bugs | Activation et rétention (voir KPI) |
| **3. Ouverture progressive** | Après la bêta | Élargir, tester la monétisation | Lancement public, Product Hunt, tests de prix, premiers partenariats | Conversion gratuit → payant mesurée |

### 2.5 Risques et parades
| Risque | Parade |
|---|---|
| **Fiabilité des intégrations** (API tierces qui changent, lumières hors ligne) | Garder le mécanisme « Nexum vérifie » visible ; ne promettre que ce qui est « disponible » |
| **Perception anti-cheat** | Maintenir et illustrer le message de la FAQ : Nexum lance les jeux, n'injecte rien dans le processus |
| **Dispersion d'une petite équipe** | Une cible, un canal principal, un jalon à la fois |
| **Plateformes multiples** (Windows/macOS/Linux) | Annoncer un ordre de sortie réaliste |
| **Concurrents établis** (Stream Deck, suites constructeurs) | Se positionner comme complémentaire et multi-marques, pas comme remplaçant |
| **Données personnelles** | Rester strict sur le consentement (RGPD ; si audience au Québec, vérifier aussi la Loi 25) |

---

## 3. Plan de communication

### 3.1 Objectifs (SMART, proposés)
| Objectif | Cible suggérée | Échéance |
|---|---|---|
| Réaliser des entretiens utilisateurs | 20 à 30 | Fin 2026 |
| Collecter des réponses au questionnaire | 150 à 300 (au moins 40 par profil) | Fin 2026 |
| Constituer la liste d'attente | 300 à 500 inscrits qualifiés | Fin T1 2027 |
| Recruter des testeurs actifs pour la bêta | 30 à 50 | Au lancement de la bêta |

*Ces cibles sont des repères réalistes pour un projet étudiant sans budget ; à ajuster selon votre réseau réel.*

### 3.2 Cibles et messages

| Cible | Promesse | Preuve à montrer | Canaux prioritaires |
|---|---|---|---|
| **Joueurs** | « Ta partie commence avant le chargement. » | Démo : mode Gaming (son + lumières + Steam) | Discord, Reddit (r/pcgaming, r/pcmasterrace, r/Twitch selon les règles de chaque sub), TikTok/Shorts, YouTube |
| **Streamers** | « Lance ton direct en un clic. » | Mode Stream avec OBS (dès qu'il sera prêt) | Twitch/Discord de petits streamers, X, YouTube |
| **Télétravail** | « Le même PC, deux vies bien séparées. » | Mode Travail (notifs coupées, Slack) | LinkedIn, communautés de télétravail |

**Piliers de message**
1. **Simplicité** : un mode = une liste d'actions, zéro code.
2. **Liberté de marque** : ton matériel, tes services, ensemble.
3. **Honnêteté** : « sans exagérer », feuille de route publique, échecs visibles.
4. **Co-construction** : « dis-nous ce qui t'agace, ça décidera des prochains modes. »

**Ton** : tutoiement, direct, concret, un peu d'humour de setup. Éviter le jargon et les superlatifs (le site ne les utilise pas, gardez cette cohérence).

### 3.3 Canaux et rôle de chacun
| Canal | Rôle | Fréquence conseillée | Format |
|---|---|---|---|
| **Site** | Conversion : inscription + entretien | Mise à jour à chaque jalon | Démo, FAQ, vidéo |
| **Discord (serveur Nexum)** | Communauté, feedback, support bêta | Quotidien (modération légère) | Canaux : #idées, #bugs, #setups |
| **TikTok / YouTube Shorts / Reels** | Découverte | 2 à 3 par semaine | Clips 15–30 s « avant / après » : un clic, tout change |
| **Reddit** | Discussions et retours qualifiés | Hebdomadaire | Posts utiles (pas de pub), AMA « on construit X, que feriez-vous ? » |
| **GitHub** | Crédibilité technique, transparence | À chaque version | Changelog, roadmap, issues |
| **LinkedIn** | Réseau Epitech, partenaires, recrutement de testeurs télétravail | 1 à 2 par semaine | Retours d'expérience, jalons |
| **Micro-streamers** | Prescription | Sur 2–3 mois | Prêt de prototype, mode personnalisé pour eux |
| **E-mail** | Rétention de la liste d'attente | Mensuel, + à chaque jalon | Courte newsletter de progression |

**Choix de focalisation** : avec 5 personnes, ne pas ouvrir tous les canaux en même temps. Commencer par **Site + Discord + 1 format vidéo court + Reddit**. Ajouter LinkedIn et l'e-mail dès que la liste dépasse la centaine.

### 3.4 Calendrier éditorial — 12 semaines (octobre → décembre 2026)

| Semaines | Thème | Actions |
|---|---|---|
| **S1–S2** | Préparer le terrain | Ouvrir le formulaire d'inscription ; publier le questionnaire ; créer le serveur Discord ; filmer la vidéo de démo (30–45 s) ; ajouter FAQ « Et Stream Deck / Home Assistant ? » |
| **S3–S4** | Lancement de la conversation | Post « on construit Nexum, qu'est-ce qui vous agace avant une session ? » (Reddit/Discord) ; 3 premiers clips « un clic = tout le setup » ; recrutement d'entretiens |
| **S5–S6** | Preuve par l'usage | Clip « mode Gaming en vrai » (Steam + Hue) ; thread « ce que les joueurs nous ont dit » (premiers enseignements des entretiens) |
| **S7–S8** | Co-construction | Sondage « quel mode ensuite ? » (Stream / Travail / Chill) ; contacter 10 micro-streamers |
| **S9–S10** | Transparence | Post « Roadmap hiver : déclencheurs, voix, Spotify/Discord/OBS » ; premier e-mail aux inscrits |
| **S11–S12** | Bilan et cap | Synthèse publique des entretiens ; décision sur la cible tête de pont ; annonce des testeurs recrutés |

### 3.5 Idées de contenus (réutilisables)
- **« Mon setup avant / après Nexum »** (vidéo courte, split screen).
- **« 5 applis ouvertes à la main… ou un clic »** (comparaison chronométrée).
- **« On a demandé à 20 joueurs ce qui les énerve »** (résultats d'entretiens).
- **« Nexum vs scripts »** : même résultat, 0 ligne de code.
- **Coulisses** : un échec d'intégration expliqué honnêtement (colle avec la valeur « Nexum vérifie »).
- **Mode du mois** proposé par la communauté.

### 3.6 Recrutement des participants aux entretiens
1. Bloc d'inscription du site (case « OK pour un entretien de 20 minutes »).
2. Message direct aux membres actifs des communautés ciblées (poli, sans démarchage de masse, respecter les règles de chaque serveur/sub).
3. Réseau Epitech et entourage des 5 membres (attention au biais : viser aussi des personnes hors école).
4. Petite contrepartie possible : accès prioritaire à la bêta, remerciement public (avec accord).

### 3.7 Suivi et indicateurs (KPI)
| Étape | KPI | Où le mesurer |
|---|---|---|
| Visibilité | Visites uniques du site, vues vidéos, membres Discord | Statistiques du site, plateformes |
| Intérêt | Taux visite → inscription | Formulaire de bêta |
| Qualification | % d'inscrits qui acceptent l'entretien ; répartition par profil | Formulaire |
| Recherche | Entretiens réalisés, réponses au questionnaire | Tableur de suivi |
| Engagement | Réponses/jour sur Discord, réactions aux clips | Plateformes |
| Bêta (2027) | Activation (a créé et lancé un mode), rétention à 7 et 30 jours, nombre moyen de modes par utilisateur, taux d'échec d'actions | Télémétrie opt-in, à définir en respectant la promesse de confidentialité |

### 3.8 Répartition suggérée dans l'équipe (à adapter)
| Rôle | Responsabilité |
|---|---|
| Responsable recherche | Entretiens, questionnaire, synthèse |
| Responsable contenu | Clips, posts, calendrier |
| Responsable communauté | Discord, Reddit, modération |
| Responsable produit/démo | Vidéos de démo, retours dans la roadmap |
| Responsable données & site | Formulaire, suivi des KPI, conformité (consentement, confidentialité) |

### 3.9 Budget indicatif
Quasi nul au départ : domaine éventuel, outil de sondage (version gratuite), un peu de matériel pour filmer. Réserver une petite enveloppe, si elle existe, pour l'envoi de matériel de test à des micro-streamers ou une contrepartie symbolique pour des participants.

### 3.10 Règles de conduite
- Ne jamais présenter comme disponible ce qui est « prévu ».
- Ne pas faire de promesse de date ferme au-delà de la feuille de route publiée.
- Respecter les règles de chaque communauté (pas de spam, pas de promo cachée).
- Ne garder que les données nécessaires et supprimer sur demande.

---

## 4. Prochaines actions (sous 7 jours)
1. Ouvrir le formulaire d'inscription (le bloc affiche encore « bientôt ouvertes »).
2. Mettre en ligne le questionnaire (document 2) et prévoir 10 premiers entretiens.
3. Filmer une vidéo de démo de 30–45 s avec le vrai prototype.
4. Ajouter la FAQ « Et Stream Deck / Home Assistant ? » et préciser l'ordre des systèmes d'exploitation.
5. Créer le serveur Discord et publier le premier message de présentation.
