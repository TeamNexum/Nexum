# Nexum — Feedback utilisateurs

## Comment on s'organise

- **Partie 1** : le questionnaire en ligne. C'est la partie quantitative, pour toucher un maximum de monde.
- **Partie 2** : le guide d'entretien de 20 minutes, pour discuter avec celles et ceux qui ont dit oui à un échange.
- **Partie 3** : la façon dont on analyse tout ça et ce qu'on en fait.
- Les questions marquées **[Joueur]**, **[Streamer]** et **[Travail]** ne s'affichent que selon le profil choisi à la question 1.

## L'outil qu'on utilise : Tally

On fait le questionnaire sur **Tally** (tally.so). Pourquoi lui :

- Il est gratuit pour ce qu'on veut faire : formulaires et réponses illimités.
- Il gère la logique conditionnelle, donc les questions Joueur / Streamer / Travail s'affichent bien selon la question 1.
- Il a un bloc de classement (questions 19 et 21) et accepte les réponses numériques (question 30).
- Il est européen, ce qui nous simplifie la vie côté RGPD, et on peut mettre une case de consentement obligatoire.
- On exporte les réponses en CSV pour les analyser dans un tableur.
- Les réponses sont consultables à plusieurs, donc toute l'équipe voit les résultats.

On a regardé Google Forms : c'est plus connu, mais la logique conditionnelle est limitée et il n'y a pas de vrai classement. On garde Tally. Avant de lancer, on vérifie quand même les limites du plan gratuit.

Pour les entretiens, on utilise une visio (Discord ou Teams), et on note les réponses dans un tableur partagé avec la grille de la partie 2.

---

# PARTIE 1 — Questionnaire en ligne

## Introduction (en haut du formulaire)

> **Aide-nous à construire Nexum.**
> Nexum est un projet étudiant (EIP Epitech) : un outil qui règle ton ordinateur selon ce que tu fais (jouer, streamer, travailler, te détendre). Il n'est pas encore sorti, et c'est justement pour ça qu'on te demande ton avis.
> Ça prend environ 7 minutes. Il n'y a ni bonne ni mauvaise réponse. On utilise tes réponses uniquement pour décider de ce qu'on construit, pas pour te vendre quoi que ce soit.
> On garde tes réponses pour le projet Nexum. Tu peux nous demander de les supprimer quand tu veux. Les détails sont sur la page confidentialité du site.

**Consentement (obligatoire)**
☐ J'accepte que l'équipe Nexum utilise mes réponses pour améliorer le produit.

---

## A. Profil

**1. Tu es plutôt… ** *(choix unique, ça oriente la suite)*
- Je joue sur PC
- Je streame ou je crée du contenu
- Je travaille sur mon ordinateur (télétravail, études)
- Un peu tout ça *(précise ton usage principal)*
- Autre : ______

**2. Quel système tu utilises le plus ?**
- Windows · macOS · Linux · Plusieurs

**3. Ta tranche d'âge** *(facultatif)*
- Moins de 18 ans · 18–24 · 25–34 · 35–44 · 45 et plus

> À décider en équipe : soit on ajoute une mention de consentement parental pour les moins de 18 ans, soit on ferme le questionnaire aux mineurs, selon la réglementation applicable.

**4. Combien d'heures par semaine tu passes sur ton ordinateur pour cette activité ?**
- Moins de 5 h · 5–15 h · 15–30 h · Plus de 30 h

---

## B. Ton setup actuel

**5. Qu'est-ce que tu utilises avec ton ordinateur ?** *(choix multiples)*
- Casque ou enceintes avec logiciel dédié
- Lumières connectées (Philips Hue, Govee, Nanoleaf, bandeaux LED…)
- Clavier / souris avec logiciel du constructeur
- Stream Deck ou boîtier de raccourcis
- Home Assistant ou domotique
- Plusieurs launchers de jeux (Steam, Epic, GOG…)
- Logiciel de streaming (OBS…)
- Messagerie et visio (Discord, Slack, Teams…)
- Rien de tout ça
- Autre : ______

**6. Ton setup (matériel + logiciels) compte combien de marques différentes ?**
- 1 · 2–3 · 4–6 · 7 ou plus

**7. Avant une session (jeu, direct, travail), qu'est-ce que tu règles à la main ?** *(choix multiples)*
- Le volume / la sortie audio
- La luminosité de l'écran
- Les lumières de la pièce
- Fermer des applis
- Ouvrir des applis ou des sites
- Couper les notifications
- Lancer un jeu ou un programme
- Rien, tout est déjà automatique
- Autre : ______

**8. En moyenne, ça te prend combien de temps avant chaque session ?**
- Moins de 1 min · 1–3 min · 3–10 min · Plus de 10 min · Je ne sais pas

**9. De 1 à 5, à quel point cette préparation t'agace ?**
1 (pas du tout) — 5 (énormément)

**10. Concrètement, qu'est-ce qui t'agace le plus sur ton ordinateur ?** *(réponse libre)*
______

---

## C. Ce que tu as déjà essayé

**11. Tu as déjà essayé d'automatiser tout ou partie de ce setup ?**
- Oui, et ça marche encore
- Oui, mais j'ai abandonné
- Non, mais ça m'intéresserait
- Non, ça ne m'intéresse pas

**12. Avec quels outils ?** *(choix multiples, si tu as répondu oui à la question 11)*
- Les logiciels des constructeurs (Razer Synapse, Corsair iCUE, Logitech…)
- Des scripts (AutoHotkey, PowerShell, Python…)
- Les raccourcis macOS / Power Automate
- Stream Deck ou équivalent
- Home Assistant
- Playnite ou un autre launcher unifié
- Autre : ______

**13. Qu'est-ce qui t'a bloqué ou fait abandonner ?** *(choix multiples)*
- Trop technique, il fallait écrire du code
- Ça ne marche qu'avec une seule marque
- Ça cassait après une mise à jour
- Trop long à configurer
- Aucun retour quand une action échouait
- Trop cher
- Autre : ______

---

## D. Ce que tu penses du concept

> **Texte à afficher avant la question 14**
> *« Nexum règle ton PC selon ce que tu fais. Tu choisis un mode (Gaming, Stream, Travail, Chill) et le son, la luminosité, les lumières et tes applis suivent en un clic, quelle que soit la marque de ton matériel. Sans écrire de code. »*
> *(+ un GIF ou une capture de la démo du site)*

**14. En quelques mots, qu'est-ce que tu comprends de Nexum ?** *(réponse libre, ça nous dit si notre message est clair)*
______

**15. À quel point ça te serait utile ?**
1 (pas du tout) — 5 (indispensable)

**16. Si tu utilisais Nexum et qu'il disparaissait demain, tu serais comment ?** *(c'est notre test pour voir si on devient vraiment utile)*
- Très déçu · Assez déçu · Peu déçu · Indifférent

**17. Qu'est-ce qui pourrait t'empêcher de l'utiliser ?** *(choix multiples)*
- La peur pour mon compte de jeu / les anti-cheats
- La confidentialité de mes données
- La fiabilité (peur que ça ne marche pas)
- Trop de configuration
- Je préfère mes outils actuels
- Le prix
- Devoir installer une application
- Autre : ______

**18. Ça te va de laisser une application lancer des programmes et régler le son et la luminosité à ta place ?**
1 (pas du tout) — 5 (totalement)

---

## E. Ce qu'on devrait construire en premier

**19. Quels modes t'intéressent le plus ?** *(classe tes 3 préférés)*
- Gaming · Stream · Travail · Chill · Réunion · Sport / entraînement · Sommeil / soirée · Autre : ______

**20. Parmi ces intégrations, lesquelles tu utilises et aimerais voir en priorité ?** *(choix multiples, 5 maximum)*
- Spotify · Discord · OBS Studio · Philips Hue · Govee · Nanoleaf · Home Assistant · Google Agenda · Outlook · Slack · Teams · Steam / Epic / GOG · Autre : ______

**21. Comment tu aimerais déclencher un mode ?** *(classe du préféré au moins préféré)*
- Un clic dans l'application
- Un raccourci clavier
- À la voix
- Automatiquement au lancement d'un jeu
- À une heure donnée
- Au début d'une réunion
- Depuis mon téléphone

**22. Une action échoue (par exemple une lumière ne répond pas). Tu préfères quoi ?**
- Que Nexum me prévienne et me laisse relancer ou ignorer
- Qu'il réessaie tout seul, puis qu'il me prévienne
- Qu'il ignore l'échec et continue
- Ça dépend (précise) : ______

---

## F. Questions selon ton profil *(selon ta réponse à la question 1)*

### [Joueur]
**23J. Tu joues à quels jeux, ou tu utilises quels launchers ?** *(libre)* ______
**24J. Tu joues à des jeux avec anti-cheat ? Ça t'inquiète qu'un outil lance le jeu à ta place ?**
- Oui, ça m'inquiète · Un peu · Non · Je ne sais pas
**25J. Si on te dit « Nexum ne touche pas aux jeux, il règle ce qu'il y a autour », ça te rassure ?**
- Oui · Plutôt · Pas vraiment · Non (pourquoi ?) ______

### [Streamer]
**23S. Tu diffuses ou tu publies où ?** *(Twitch, YouTube, TikTok, autre)* ______
**24S. Tu fais combien d'étapes à la main avant de lancer un direct ?** ______
**25S. Tu utilises quels outils pour ça aujourd'hui ?** *(OBS, Streamlabs, Stream Deck, bots…)* ______

### [Travail]
**23T. Tu utilises quels outils au quotidien ?** *(Slack, Teams, agenda, visio…)* ______
**24T. Séparer vie perso et vie pro sur le même ordinateur, c'est un problème pour toi ?**
- Oui, souvent · Parfois · Rarement · Jamais
**25T. Tu utiliserais un mode « Travail » ou « Réunion » si l'outil en proposait un ?**
- Oui · Peut-être · Non (pourquoi ?) ______

---

## G. Plateformes et confidentialité

**26. Tu voudrais une application mobile pour lancer tes modes à distance ?**
- Indispensable · Pratique · Sans importance

**27. Où tu préfères qu'on stocke tes modes ?**
- Sur ma machine uniquement (c'est ce que je préfère)
- Synchronisation cloud, mais seulement si c'est optionnel
- Dans le cloud, ça ne me dérange pas

---

## H. Le prix *(en fin de questionnaire, sans engagement)*

> *« Nexum aura une version gratuite pour l'usage de base et une offre payante pour les fonctions avancées (par exemple la synchronisation cloud, l'appli mobile et les déclencheurs avancés). On n'a pas encore fixé les prix. »*

**28. Quelles fonctions avancées te feraient payer ?** *(choix multiples)*
- Synchronisation cloud des modes
- Application mobile
- Déclencheurs automatiques (jeu, agenda, voix)
- Modes premium créés par la communauté
- Support prioritaire
- Aucune, je ne paierais pas
- Autre : ______

**29. Tu paierais pour un outil comme celui-ci ?**
- Oui, en abonnement mensuel · Oui, en abonnement annuel · Oui, en achat unique · Seulement s'il est gratuit

**30. *(Sensibilité au prix : quatre montants en € ou $ par mois)***
- À partir de quel prix tu te dirais « c'est tellement peu cher que je doute de la qualité » ? ______
- À partir de quel prix tu te dirais « c'est une bonne affaire » ? ______
- À partir de quel prix tu te dirais « c'est cher, mais je peux l'envisager » ? ______
- À partir de quel prix tu te dirais « c'est trop cher, je n'achèterais pas » ? ______

---

## I. Pour finir

**31. Y a-t-il quelque chose que Nexum doit absolument faire, ou ne jamais faire ?** *(libre)* ______

**32. Tu veux rejoindre la bêta ?**
- Oui, voici mon e-mail : ______ (avec une case de consentement)
- Non merci

**33. Tu accepterais un entretien de 20 minutes (visio ou message) ?**
- Oui, voici comment me contacter : ______ · Non

**Message de remerciement**
> Merci ! Ton avis va directement influencer les prochains modes de Nexum. On partagera ce qu'on a appris sur le site et sur le Discord.

---

# PARTIE 2 — Guide d'entretien (20 minutes)

## Comment on mène l'entretien

- On pose des questions sur le **passé et le concret** (« la dernière fois que… »), pas sur ce que la personne ferait « peut-être un jour ».
- On écoute plus qu'on ne parle.
- On ne défend pas le produit : on est là pour comprendre, pas pour convaincre.
- Si la personne est d'accord, on enregistre ou on prend des notes.
- On est deux : l'un pose les questions, l'autre note.

| Temps | Séquence | Ce qu'on demande |
|---|---|---|
| **0–2 min** | Accueil | On se présente, on explique l'objectif (comprendre, pas vendre), on demande l'accord pour les notes ou l'enregistrement, et on rappelle qu'on peut s'arrêter à tout moment. |
| **2–8 min** | Contexte et dernière session | « Raconte-nous la dernière fois que tu as lancé une session (jeu, direct, journée de travail). Qu'est-ce que tu as fait, dans quel ordre ? » · « Qu'est-ce qui a été pénible ? » · « Ça faisait combien d'applis, de marques, de réglages ? » |
| **8–12 min** | Ce qu'il a déjà essayé | « Tu as déjà essayé d'automatiser ? Comment, avec quoi ? » · « Qu'est-ce qui a marché ou cassé ? » · « Tu y as passé combien de temps ? » |
| **12–17 min** | Réaction au prototype | On montre la démo du site (ou le prototype). « Qu'est-ce que tu vois ? » · « Où ça te servirait, concrètement ? » · « Qu'est-ce qui te manque ? » · « Qu'est-ce qui te ferait hésiter ? » |
| **17–19 min** | Priorités et prix | « Quels 3 modes ou intégrations tu mettrais en premier ? » · « Pour quoi tu serais prêt à payer, si quelque chose devait l'être ? » |
| **19–20 min** | Clôture | « Il y a quelque chose qu'on n'a pas demandé ? » · On rappelle la suite, on remercie et on demande si la personne veut rejoindre la bêta. |

**Relances qu'on garde sous la main** : « Tu peux nous montrer ? » · « Pourquoi ? » · « Et ensuite ? » · « Comment tu contournes ça aujourd'hui ? »

**Grille de notes (une ligne par entretien)** : profil · système · nombre de marques · irritant principal · outils déjà essayés · raison de l'abandon · réaction à la démo (1–5) · modes souhaités · intégrations souhaitées · objections · fourchette de prix évoquée · citation marquante.

---

# PARTIE 3 — Analyse et décisions

## Ce qu'on calcule

| Question | Ce qu'on regarde | Seuil d'alerte (un repère, qu'on ajustera) |
|---|---|---|
| Q14 | Les gens décrivent-ils Nexum comme on l'imagine ? | Si moins de la moitié comprend, on retravaille le message du site. |
| Q9 + Q8 | Une forte douleur (4–5) et beaucoup de temps perdu | Ce segment devient notre cible prioritaire. |
| Q16 | La part de « très déçu » | On utilise souvent 40 % comme repère, mais on reste prudents : le produit n'existe pas encore. |
| Q13 | Les raisons d'abandon les plus citées | Ça nourrit notre positionnement (code, multi-marques, fiabilité). |
| Q17 + Q24J / Q25J | Les principaux freins | Anti-cheat ? Confiance ? On adapte la FAQ. |
| Q19 à Q21 | Les modes, intégrations et déclencheurs en tête | Ça fixe l'ordre de développement pour l'hiver 2026. |
| Q29 + Q30 | La fourchette de prix acceptable | On s'en sert pour tester 2 ou 3 niveaux de prix. |

## Notre méthode

1. On sépare les réponses par profil (joueur, streamer, travail). On ne fait pas de moyenne globale.
2. On classe les réponses libres par thèmes. Trois d'entre nous relisent un échantillon pour vérifier qu'on est d'accord.
3. On croise les deux sources : le questionnaire nous dit **combien**, les entretiens nous disent **pourquoi**.
4. On résume tout sur une page : 3 enseignements, 3 décisions, 3 questions encore ouvertes. On la publie, puisqu'on a promis d'avancer en public.

## Ce qu'on garde en tête

- Nos répondants viennent surtout de nos réseaux et de nos communautés, donc l'échantillon est biaisé.
- Les gens disent qu'ils paieraient plus souvent qu'ils ne le font vraiment.
- Le produit n'existe pas encore : ce sont des avis hypothétiques.

On s'en sert donc pour s'orienter, pas pour prouver quoi que ce soit.

---

## Variante courte (3 minutes, pour les réseaux)
Questions 1 · 5 · 7 · 9 · 10 · 14 · 15 · 17 · 32 · 33.

## Questionnaire de suivi après la bêta (2027)
1. Tu as créé combien de modes ? Lesquels ?
2. Tu les utilises à quelle fréquence ?
3. Une action a échoué ? Le message t'a aidé ? (1–5)
4. Qu'est-ce que tu ferais si Nexum n'existait pas ?
5. Qu'est-ce qui te manque le plus ?
6. Tu recommanderais Nexum (0–10) ? Pourquoi ?
7. Quelle somme te paraîtrait juste pour les fonctions avancées ?
