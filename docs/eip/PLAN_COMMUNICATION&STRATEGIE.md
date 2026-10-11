# Nexum : stratégie business, Go-To-Market et plan de communication

*Projet EIP Epitech · Version 2 · 11 octobre 2026 · Équipe : Arnaud, Rares, Enzo, Raphaël, Max, *

# PARTIE A : Stratégie business

## 1. Value Proposition

Nexum règle le PC selon ce qu'on est en train de faire, en un clic, avec le matériel et les services qu'on a déjà, sans écrire de code.

**Énoncé de positionnement.** Pour les gens qui jouent, streament ou travaillent sur un PC avec un setup de plusieurs marques, Nexum est l'application de modes qui règle le son, la luminosité, les lumières et les applis en un clic. Contrairement aux logiciels constructeurs (une seule marque), aux scripts (du code) et aux launchers (les jeux seulement), Nexum pilote toutes les marques sans code et montre le résultat de chaque action.

| Bénéfice | Ce qu'on dit | Ce qui le prouve aujourd'hui |
|---|---|---|
| Gain de temps | Un mode remplace les 5 à 10 réglages manuels d'avant session | Démo du site : 5 actions enchaînées en un clic |
| Liberté de marque | Une même action marche avec la marque qu'on possède | Philips Hue, Steam, Epic, GOG déjà dans le prototype |
| Sans code | Un mode, c'est une liste d'actions à cocher | Éditeur de modes du prototype |
| Fiabilité visible | Si une action échoue, on le voit et on peut relancer | Étape « Nexum vérifie » (panne simulée dans la démo) |

**Ce qu'on ne promet pas pour l'instant.** Spotify, Discord, OBS, Slack, Teams : tant qu'ils sont « prévus », on ne les présente pas comme disponibles. Aucune date ferme au-delà de la feuille de route publique. Aucun chiffre de temps gagné avant de l'avoir mesuré (question 8 du questionnaire).

**Phrase d'accroche.** « Un clic. Tout ton setup. » On la garde et on vérifie en entretien que les gens la comprennent comme on l'entend (question 14).

**Un point qu'on exploite plus.** L'étape « Nexum vérifie » est notre meilleur argument de fiabilité et le site la montre peu. On la met en avant dans les vidéos de démo.

## 2. Personas

Trois personas, un par page du site. Ce sont des hypothèses de travail : on les corrige après les 10 premiers entretiens. Les prénoms sont fictifs et aucun chiffre ci-dessous ne vient d'une étude.

| | **Léo, joueur PC** | **Nina, streameuse** | **Sami, télétravailleur** |
|---|---|---|---|
| Profil | 17–28 ans, joue 10 à 25 h par semaine, Windows | 18–30 ans, diffuse 2 à 5 fois par semaine, petite audience | 25–40 ans, 3 à 5 jours de télétravail, ordi perso ou pro |
| Setup | Casque et clavier de 2 marques, lumières connectées, Steam et un autre launcher | OBS, Discord, micro, lumières, parfois un Stream Deck | Slack ou Teams, agenda, visio, casque, parfois une lampe connectée |
| Avant une session | Ferme le navigateur, règle le volume, change les lumières, lance le jeu | Ouvre 4 à 6 applis, vérifie audio et scènes, allume l'éclairage | Coupe les notifs perso, ouvre ses outils, règle le casque |
| Irritant principal | Cinq logiciels pour un seul moment | Oublier une étape juste avant le direct | Mélanger vie perso et pro sur le même PC |
| Déjà essayé | Logiciels constructeurs, Playnite | Stream Deck, raccourcis OBS | Raccourcis du système, modes Concentration |
| Frein probable | Anti-cheat, fiabilité | Dépend d'OBS et Discord, encore prévus | Slack, Teams, Agenda encore prévus |
| Promesse du site | « Ta partie commence avant le chargement. » | « Lance ton direct en un clic. » | « Le même PC, deux vies bien séparées. » |
| Prêt à essayer aujourd'hui ? | Oui (Steam, Epic, GOG, Hue) | Pas encore (OBS prévu hiver 2026) | Pas encore (Slack, Teams prévus) |
| Où le trouver | Discord, Reddit, YouTube | Twitch, Discord, YouTube | LinkedIn, communautés de télétravail |

**Persona d'entrée : Léo.** C'est le seul pour qui le prototype tient déjà la promesse. Nina arrive en deuxième vague, Sami reste une piste à explorer par entretiens.

**Ce qu'on valide pour chacun :** le nombre de marques du setup, le temps perdu avant une session, ce qui a déjà été essayé puis abandonné, et l'envie de payer.

## 3. Ciblage : trouver des clients potentiels qualifiés

On ne cherche pas des inscrits à tout prix. On cherche des gens qui ont déjà le problème et qui ont déjà essayé de le résoudre. Quelqu'un qui a monté un script, un Stream Deck ou Home Assistant pour automatiser son setup vaut plus que 50 curieux.

**Score de qualification (sur 10).** On priorise les prospects à 6 ou plus.

| Critère | Points |
|---|---|
| Setup avec 3 marques ou plus (audio, lumières, périphériques, launchers) | 2 |
| A déjà essayé d'automatiser (script, Stream Deck, Home Assistant, Playnite, SignalRGB) | 3 |
| Préparation manuelle de 3 minutes ou plus avant une session (Q8) | 1 |
| Agacement de 4 ou 5 sur 5 (Q9) | 1 |
| Sous Windows | 1 |
| Utilise Steam, Epic, GOG ou Philips Hue (déjà dans le prototype) | 1 |
| Accepte un entretien de 20 minutes | 1 |

**Où on les cherche.** Ce sont des pistes : avant de poster quoi que ce soit, on vérifie que la communauté existe toujours, sa taille réelle et ses règles sur l'auto-promotion.

| Profil | Où chercher | Pourquoi c'est qualifié | Comment on les approche |
|---|---|---|---|
| Joueurs qui automatisent déjà | Reddit (r/pcmasterrace, r/battlestations, r/AutoHotkey), Discord de Playnite, SignalRGB, OpenRGB | Ils ont déjà investi du temps dans le problème | Question utile dans un fil existant, puis message privé poli si la personne répond |
| Utilisateurs de lumières connectées | Communautés Philips Hue, Govee, Nanoleaf (forums, subreddits) | Setup multi-marques par définition | Demander comment ils lancent leur ambiance avec leur jeu |
| Utilisateurs de Stream Deck | r/StreamDeck, Discord de créateurs | Ils paient déjà pour des raccourcis | Entretien sur ce que le Stream Deck ne fait pas |
| Petits streamers | Twitch (0 à 50 viewers), Discord de streamers, YouTube | Préparent un direct chaque semaine, prescripteurs | Message court, proposition d'un mode sur mesure |
| Francophones | Discord et forums francophones, réseau Epitech et entourage | Plus faciles à joindre pour nous | Entretien en visio, y compris hors école pour limiter le biais |
| Télétravailleurs | LinkedIn, communautés de télétravail, coworkings | Persona à explorer | 5 entretiens d'exploration seulement |

**Rythme.** D'ici fin octobre : 100 prospects identifiés et notés, 30 contactés, 10 entretiens réalisés. On les suit dans un tableur (une ligne par prospect : source, score, date de contact, statut, notes). Le tableur reste privé et on supprime une ligne sur simple demande.

**Respect des gens.** Pas de message de masse, pas de liste achetée, pas de faux compte. On se présente toujours comme l'équipe Nexum.

## 4. Go-To-Market et pricing

On lance d'abord pour les joueurs, on prouve que les gens reviennent, et seulement ensuite on met un prix. On réfléchit au pricing dès maintenant parce qu'il décide de ce qu'on garde gratuit.

> **Conseils du mentor : à compléter.** Ses conseils sur le Go-To-Market et le pricing ne sont pas dans nos notes. Chacun colle ici les 3 conseils qu'il a retenus, et on ajuste cette section en conséquence :
> 1. …
> 2. …
> 3. …

### Les phases

| Phase | Période | Objectif | Condition pour passer à la suivante |
|---|---|---|---|
| 0. Validation | oct.–nov. 2026 | Confirmer que le problème existe et que Nexum le résout | 20 entretiens faits, persona d'entrée confirmé |
| 1. Audience | déc. 2026–janv. 2027 | Liste d'attente qualifiée, 10 testeurs | 300 inscrits dont au moins 30 % avec un score de 6 ou plus |
| 2. Bêta fermée | 2027 | Mesurer usage et fiabilité | Au moins 40 % des testeurs actifs à 30 jours |
| 3. Ouverture | après la bêta | Tester les prix | Conversion gratuit → payant mesurée sur 3 mois |

Les seuils sont des repères posés par l'équipe, à revoir avec le mentor.

### Réflexion pricing

1. **Ce qu'on garde gratuit.** Les modes de base, les actions locales (applis, son, luminosité, lancement de jeux), les modes stockés sur la machine. Si le gratuit est trop pauvre, personne ne crée de mode et on n'a rien à vendre.
2. **Ce qu'on fera payer.** Ce qui coûte quelque chose à faire tourner ou qui sert surtout aux gros utilisateurs : synchronisation cloud, appli mobile, déclencheurs avancés (voix, agenda, lancement d'un jeu), historique. C'est déjà ce qu'annonce le site.
3. **Les repères de marché qu'on a trouvés.**

| Repère | Chiffre | Ce que ça nous dit |
|---|---|---|
| SignalRGB Pro | 45 $ par an, soit 3,75 $ par mois ([source tierce, avril 2026](https://aurasync.net/signalrgb-free-vs-pro/), pas vérifié chez l'éditeur) | Un logiciel d'ambiance de bureau se vend en abonnement annuel, avec une version gratuite utile |
| Stream Deck 15 touches (Elgato) | 149,99 $ en matériel ([page officielle](https://www.elgato.com/us/en/p/stream-deck)) | Les gens paient déjà pour des raccourcis, mais en matériel et une seule fois |
| Conversion gratuit → payant (logiciels freemium) | 3 à 5 % médiane, 8 à 12 % au 75e percentile ([ChartMogul via Artisan, févr. 2026](https://www.artisangrowthstrategies.com/blog/freemium-conversion-rate-benchmarks)) | Enquête auto-déclarée de 200 éditeurs de logiciels : un repère, pas une promesse |

4. **Les prix qu'on teste.** Aucun prix n'est décidé. On teste trois niveaux dans le questionnaire (méthode des quatre questions de prix, Q30) puis sur la page d'inscription : environ 2,99 €, 4,99 € et 7,99 € par mois, avec une remise pour l'abonnement annuel. Ce sont des hypothèses autour du repère SignalRGB, pas des résultats.
5. **Questions à trancher avec le mentor.** Abonnement ou achat unique ? Tarif étudiant ? Le payant vise-t-il d'abord les particuliers ou les équipes ?
6. **Ce qu'on ne fait pas.** Aucune pub, aucune revente de données, aucun prix lié à Jarvis tant que c'est une hypothèse.

### Autres sources de revenu à explorer plus tard

| Source | Idée | Confiance |
|---|---|---|
| Packs de modes de la communauté | Bibliothèque de modes partagés, éventuellement des packs premium | Faible tant qu'il n'y a pas de communauté |
| Partenariats matériel et services | Intégrations certifiées avec des marques de lumière ou d'audio | Moyenne, dépend de la traction |
| Offre équipes | Modes partagés pour studios, équipes esport, coworkings | Faible, à explorer par les entretiens télétravail |

## 5. Financial Forecast

Dans le scénario de base, on perd environ 2 900 € cumulés fin 2028 et on repasse au-dessus de zéro en 2029, avec 5 200 € de résultat cumulé. Tout repose sur la conversion en abonnés et sur le nombre d'utilisateurs actifs. Ce sont des hypothèses, pas des prévisions : on les remplace par les vrais chiffres de la bêta dès qu'on les a.

### Hypothèses par scénario

| Hypothèse | Prudent | Base | Optimiste |
|---|---|---|---|
| Actifs gratuits fin 2027 (bêta) | 500 | 1 000 | 2 000 |
| Actifs gratuits fin 2028 | 2 000 | 5 000 | 12 000 |
| Actifs gratuits fin 2029 | 5 000 | 15 000 | 40 000 |
| Conversion vers le payant | 2 % | 4 % | 8 % |
| Abonnés payants fin 2028 | 40 | 200 | 960 |
| Abonnés payants fin 2029 | 100 | 600 | 3 200 |
| Revenu 2028 | 900 € | 4 500 € | 21 600 € |
| Revenu 2029 | 3 150 € | 18 000 € | 93 600 € |

**Communs aux trois scénarios.**
- Pas de revenu en 2027 : la bêta est gratuite.
- Revenu moyen de 45 € par an et par abonné, soit environ 3,75 € par mois après remises annuelles et tarif étudiant, au niveau du repère SignalRGB.
- Le revenu d'une année se calcule sur le nombre moyen d'abonnés entre le début et la fin de l'année.
- Frais de paiement et de plateformes : 5 % du revenu.
- Les 4 % de la base restent dans la fourchette de 3 à 5 % relevée pour les logiciels freemium (section 4). Un outil grand public peut être en dessous.

### Coûts (identiques dans les trois scénarios)

| Poste | 2027 | 2028 | 2029 |
|---|---|---|---|
| Domaine, outils, hébergement du site | 300 € | 800 € | 1 500 € |
| Comptes développeur et signature du code (Windows, Apple) | 300 € | 700 € | 700 € |
| Marketing et matériel de test pour les streamers | 600 € | 3 000 € | 4 300 € |
| Comptabilité, juridique, structure | 0 € | 1 500 € | 2 500 € |
| **Total** | **1 200 €** | **6 000 €** | **9 000 €** |

Ce sont des estimations de l'équipe, à vérifier poste par poste. Personne n'est rémunéré dans ce modèle : si ça change un jour, on refait les calculs.

### Résultat net cumulé à la fin de chaque année

| Scénario | Fin 2027 | Fin 2028 | Fin 2029 |
|---|---|---|---|
| Prudent | -1 200 € | -6 345 € | -12 352 € |
| Base | -1 200 € | -2 925 € | +5 175 € |
| Optimiste | -1 200 € | +13 320 € | +93 240 € |

Formule : résultat de l'année = revenu × (1 − 5 %) − coûts de l'année ; le cumul additionne les années.

**Ce qu'on en retient.** Le scénario prudent ne rentre jamais dans ses frais d'ici 2029. Un point de conversion en plus en 2029 (base) ajoute environ 150 abonnés, soit 6 750 € par an : c'est la variable qu'on mesure en premier pendant la bêta.

**Deux questions ouvertes.** Le statut juridique (association, micro-entreprise ou société) change les frais. L'appli mobile iOS peut ajouter une commission de la plateforme sur les abonnements.

## 6. Jarvis (IA) : une hypothèse, un grand peut-être

On envisage d'implémenter Jarvis, mais ce n'est ni décidé ni promis. Tant que les conditions ci-dessous ne sont pas remplies, Jarvis reste une idée de recherche : on n'en parle pas sur le site comme d'une fonction, on ne l'ajoute pas à la feuille de route publique et on ne le compte dans aucun revenu du forecast.

**L'idée.** Un assistant qui comprend une demande en langage naturel (« prépare-moi pour jouer ») et compose ou déclenche le bon mode. Il prolonge la commande vocale déjà prévue. La définition exacte (ce qu'il fait, où il tourne) reste à préciser par l'équipe.

| Condition | Question à laquelle on répond | Comment on le saura |
|---|---|---|
| Le cœur est fiable | Les modes se lancent-ils sans échec silencieux ? | Taux d'échec d'actions en bêta (section 11) |
| Il y a une demande | Les gens veulent-ils parler à Nexum plutôt que cliquer ? | Famille D du guide d'entretien, et Q21 du questionnaire |
| La vie privée est tenable | Peut-on le faire sans envoyer les données du PC dans un cloud ? | Revue technique : modèle local ou service externe, et ce que ça change pour la promesse « modes stockés sur ta machine » |
| Le coût est supportable | Que coûte chaque requête et qui paie ? | Estimation à faire, hors forecast actuel |
| L'équipe a la capacité | Peut-on le faire sans retarder la bêta 2027 ? | Décision à la revue du 18 décembre |

**Notre règle.** Si une seule condition n'est pas remplie, on ne le construit pas. Si elles le sont toutes, on commence par un prototype interne, jamais par une annonce.

---

# PARTIE B : Plan de communication

## 7. Plan de communication

### 7.1 Ce qu'on a déjà de solide, et ce qu'on corrige

Déjà solide : la promesse « Un clic. Tout ton setup. », le ton honnête (« disponible » séparé de « prévu », prix non fixés), la démo interactive, les pages par persona, le formulaire de bêta et le respect des données.

| Point à corriger | Pourquoi | Ce qu'on fait |
|---|---|---|
| Inscription « bientôt ouverte » | Le trafic ne laisse aucun contact | On ouvre le formulaire avant toute communication |
| Concurrence incomplète | Le tableau ne cite pas Stream Deck, Home Assistant, Power Automate | On ajoute une entrée de FAQ « Et Stream Deck / Home Assistant ? » |
| Trois systèmes annoncés | Windows, macOS et Linux dans la FAQ sans ordre de sortie | On précise l'ordre de sortie dans la FAQ (à décider avec Rares) |
| Pas de preuve | Aucune vidéo, aucun témoignage | Vidéo de démo de 30 à 45 secondes avec le vrai prototype |
| Trois cibles à la fois | Trois discours, trois canaux pour cinq personnes | Une cible d'entrée : les joueurs |

### 7.2 Objectifs

| Objectif | Cible | Échéance |
|---|---|---|
| Entretiens utilisateurs réalisés | 20 à 30 | 4 décembre 2026 |
| Réponses complètes au questionnaire | 150 à 300 (au moins 40 par profil) | 4 décembre 2026 |
| Liste d'attente qualifiée | 300 à 500 inscrits | fin du T1 2027 |
| Testeurs actifs pour la bêta | 30 à 50 | au lancement de la bêta |

Ces chiffres sont des repères réalistes pour un projet étudiant sans budget. On les ajuste selon notre réseau réel.

### 7.3 Messages

| Cible | Promesse | Preuve à montrer | Canaux |
|---|---|---|---|
| Joueurs | « Ta partie commence avant le chargement. » | Mode Gaming (son + lumières + Steam) | Discord, Reddit, TikTok/Shorts, YouTube |
| Streamers | « Lance ton direct en un clic. » | Mode Stream avec OBS, quand il sera prêt | Discord et Twitch de petits streamers, YouTube |
| Télétravail | « Le même PC, deux vies bien séparées. » | Mode Travail | LinkedIn, communautés de télétravail |

**Quatre idées qu'on répète.** Simplicité (un mode est une liste d'actions, zéro code). Liberté de marque (ton matériel, tes services, ensemble). Honnêteté (feuille de route publique, échecs visibles). Co-construction (« dis-nous ce qui t'agace, ça décidera des prochains modes »).

**Ton.** On tutoie, on reste direct et concret, avec un peu d'humour de setup. On évite le jargon et les superlatifs, comme le fait déjà le site. On écrit en « on » et en « nous » : c'est l'équipe qui parle.

### 7.4 Canaux

On n'ouvre pas tous les canaux en même temps : avec 5 personnes, on démarre avec **site + Discord + un format vidéo court + Reddit**. LinkedIn et l'e-mail s'ajoutent quand la liste dépasse 100 inscrits.

| Canal | Rôle | Rythme | Format |
|---|---|---|---|
| Site | Conversion : inscription et entretien | À chaque jalon | Démo, FAQ, vidéo |
| Discord Nexum | Communauté, feedback, support de la bêta | Tous les jours, modération légère | Salons #idées, #bugs, #setups |
| TikTok / YouTube Shorts | Découverte | 2 à 3 par semaine | Clips de 15 à 30 s « avant / après » |
| Reddit | Retours qualifiés | 1 post par semaine | Posts utiles, pas de pub |
| GitHub | Crédibilité technique, transparence | À chaque version | Changelog, roadmap, issues |
| LinkedIn | Réseau Epitech, testeurs télétravail | 1 à 2 par semaine | Jalons, retours d'expérience |
| Micro-streamers | Prescription | Sur 2 à 3 mois | Prêt de prototype, mode sur mesure |
| E-mail | Garder la liste d'attente au chaud | 1 par mois et à chaque jalon | Courte newsletter |

### 7.5 Calendrier : 12 semaines à partir du 12 octobre 2026

| Semaines | Thème | Ce qu'on fait |
|---|---|---|
| 12 oct. – 25 oct. | Préparer le terrain | Ouvrir le formulaire d'inscription, publier le questionnaire, créer le Discord, ajouter la FAQ concurrents et systèmes |
| 26 oct. – 8 nov. | Lancer la conversation | Post « on construit Nexum, qu'est-ce qui t'agace avant une session ? », 3 premiers clips, contact des 30 premiers prospects |
| 9 nov. – 22 nov. | Preuve par l'usage | Clip « mode Gaming en vrai » (Steam + Hue), vidéo de démo, premiers enseignements des entretiens |
| 23 nov. – 6 déc. | Co-construction | Sondage « quel mode ensuite ? », contact de 10 micro-streamers, synthèse des entretiens |
| 7 déc. – 20 déc. | Transparence | Post roadmap de l'hiver, premier e-mail aux inscrits, décision sur la cible d'entrée |
| 21 déc. – 3 janv. | Pause et bilan | Bilan interne, préparation de la liste d'attente |

### 7.6 Contenus à réutiliser

« Mon setup avant / après Nexum » (split screen). « 5 applis ouvertes à la main… ou un clic » (comparaison chronométrée). « On a demandé à 20 joueurs ce qui les énerve ». « Nexum vs scripts » : même résultat, zéro ligne de code. Une coulisse : un échec d'intégration expliqué honnêtement, ce qui colle avec « Nexum vérifie ». Le « mode du mois » choisi par la communauté.

### 7.7 Règles de conduite

- Jamais présenter comme disponible ce qui est « prévu ».
- Aucune date ferme au-delà de la feuille de route publiée.
- Respecter les règles de chaque communauté : pas de spam, pas de promo cachée.
- Ne garder que les données nécessaires et supprimer sur demande (RGPD ; si l'audience est au Québec, on vérifie aussi la Loi 25).

---

# PARTIE C : Tech et traçabilité

## 8. Tech, mobile et traçabilité

### 8.1 Mobile et iOS : ce qu'on peut affirmer aujourd'hui

- **Le prototype tourne sur ordinateur.** Il n'existe pas d'application mobile aujourd'hui, ni iOS ni Android.
- **Le site annonce** une application de bureau pour Windows, macOS et Linux, et une appli mobile « prévue » pour lancer les modes à distance. Aucune date n'est donnée.
- **À préciser par Rares :** le système d'exploitation du prototype actuel, l'ordre de sortie des systèmes, et le choix entre iOS d'abord, Android d'abord ou une web-app.
- **Contrainte technique à garder en tête (à confirmer par Rares).** Sur un téléphone, une appli ne peut pas lancer ou fermer des applications du PC. L'appli mobile serait donc une télécommande qui envoie des ordres à Nexum sur le PC. Elle suppose un lien entre le téléphone et le PC, ce qui pèse sur la vie privée et sur le coût du cloud.
- **Formulation proposée pour le site (FAQ).** « Aujourd'hui, Nexum tourne sur ordinateur. Une appli mobile pour lancer tes modes à distance est prévue, sans date, et on ne sait pas encore si elle sortira d'abord sur iOS ou sur Android. »

### 8.2 Tracer le travail : issues et Pull Requests

On n'a pas touché au dépôt GitHub : tout ce qui suit est une convention à appliquer, pas quelque chose qui a été créé.

- **Une issue par livrable ou par tâche**, avec un responsable, une date et une étiquette (`business`, `communication`, `recherche`, `tech`, `eip`).
- **Un document par Pull Request.** Chaque modification des documents (stratégie, questionnaire, rapports) passe par une branche et une PR relue par au moins une autre personne.
- **Lien systématique.** La PR cite l'issue (`Closes #n`), et l'issue renvoie vers le document ou le fichier concerné.
- **Titres de commit** au présent, courts : « Ajoute le forecast base et prudent ».

**Modèle de description de PR**

```
## Ce que cette PR change
(2 à 3 lignes)

## Issue liée
Closes #

## Comment relire
(sections à vérifier, chiffres à recalculer)

## Livrable EIP concerné
(voir le tableau de la section 9)
```

**Issues à créer** (numéros à reporter une fois créées)

| Issue | Étiquette | Responsable proposé | Échéance |
|---|---|---|---|
| Value Proposition validée | business | Enzo | 18 oct. |
| Personas validés après 10 entretiens | recherche | Raphaël | 30 oct. |
| Financial Forecast v2 avec premiers chiffres | business | Enzo | 6 nov. |
| Pricing : tester 3 niveaux | business | Enzo | 20 nov. |
| Fiche technique du prototype | tech | Rares | 21 oct. |
| Décision mobile / iOS | tech | Rares | 20 nov. |
| Formulaire d'inscription ouvert | tech | Rares | 16 oct. |
| Vidéo de démo | communication | Max | 6 nov. |
| Questionnaire en ligne | recherche | Raphaël | 21 oct. |
| Support de restitution des interviews | recherche | Raphaël | 4 déc. |

### 8.3 Donner plus d'infos sur le code

On n'a pas lu le code, donc on ne décrit pas son architecture ici. Rares remplit cette fiche, et on la met dans le dépôt (par exemple `docs/fiche-technique.md`) :

| Champ | À compléter |
|---|---|
| Langage et framework de l'application | |
| Plateforme(s) supportée(s) aujourd'hui | |
| Modules (actions, modes, intégrations, vérification) et ce que chacun fait | |
| Intégrations disponibles et comment elles sont branchées (Steam, Epic, GOG, Hue) | |
| Où sont stockés les modes (local) | |
| Comment installer et lancer le prototype | |
| Limites connues et bugs ouverts | |
| Ce qu'on a vérifié sur les anti-cheats (ce que Nexum fait et ne fait pas) | |

### 8.4 Récaps des réunions techniques

Après chaque réunion technique, on écrit un récap de 10 lignes maximum, dans `docs/reunions/AAAA-MM-JJ.md`, rédigé par la personne qui n'a pas parlé le plus.

```
# Réunion technique du JJ/MM/AAAA
Présents : 
Décisions prises : 
Problèmes ouverts : 
Actions (qui, quoi, pour quand) : 
Issues liées : #
```

---

# PARTIE D : Organisation et rendu EIP

## 9. Mapping : quel livrable répond à quel besoin du rendu EIP

La colonne « besoin du rendu EIP » est notre lecture. **À confirmer avec la grille officielle** avant d'afficher ce tableau dans le rendu.

| Livrable | Où | Besoin du rendu EIP couvert (à confirmer) | Responsable proposé | Échéance |
|---|---|---|---|---|
| Value Proposition | Section 1 | Proposition de valeur et différenciation | Enzo | 18 oct. |
| Personas | Section 2 | Connaissance des utilisateurs cibles | Raphaël, Enzo | 30 oct. |
| Ciblage et prospection | Section 3 | Marché et premiers clients | Enzo, Raphaël | 30 oct. |
| Go-To-Market et pricing | Section 4 | Stratégie de mise sur le marché et modèle économique | Enzo, avec le mentor | 20 nov. |
| Financial Forecast | Section 5 | Viabilité financière | Enzo | 6 nov. |
| Jarvis (hypothèse) | Section 6 | Vision produit et risques | Arnaud, Rares | 18 déc. |
| Plan de communication | Section 7 | Communication et visibilité | Max, Enzo | 21 oct. |
| Fiche technique, récaps, issues et PR | Section 8 | Documentation technique et traçabilité du projet | Rares | 21 oct. |
| Planning et rôles | Section 10 | Gestion de projet et organisation de l'équipe | Arnaud | 14 oct. |
| KPIs | Section 11 | Suivi des résultats et décisions | Arnaud, Enzo | 21 oct. |
| Questionnaire et guide d'entretien | Fichier `Nexum_Questionnaire_Utilisateurs.md` | Recherche utilisateur et validation du besoin | Raphaël | 21 oct. |
| Support de restitution des interviews | Fichier questionnaire, partie 4 | Retour d'expérience et preuves | Raphaël | 4 déc. |

## 10. Planning : qui fait quoi et quand

Les rôles sont proposés d'après ce qu'on se partage à peu près déjà. Chacun les confirme ou les change à la prochaine réunion.

| Qui | Rôle proposé | Responsable de |
|---|---|---|
| Arnaud | Pilotage du projet et suivi du rendu EIP | Planning, mapping EIP, KPIs, relation avec le mentor |
| Rares | Responsable technique | Code, fiche technique, formulaire d'inscription, décision mobile / iOS |
| Raphaël | Recherche utilisateur | Questionnaire, entretiens, support de restitution |
| Max | Produit, démo et contenu | Vidéo de démo, clips, FAQ du site |
| Enzo | Business et communication | Value Proposition, personas, forecast, pricing, plan de communication |

### Deadlines

| Date | Livrable | Responsable |
|---|---|---|
| Mer. 14 oct. | Rôles confirmés, outil de questionnaire créé (Tally) | Arnaud, Raphaël |
| Ven. 16 oct. | Formulaire d'inscription ouvert sur le site | Rares |
| Dim. 18 oct. | Value Proposition et prix à tester relus par toute l'équipe | Enzo |
| Mer. 21 oct. | Questionnaire en ligne, 30 prospects contactés, fiche technique remplie, FAQ concurrents et systèmes | Raphaël, Enzo, Rares, Max |
| Ven. 30 oct. | 10 entretiens réalisés, personas mis à jour | Raphaël |
| Ven. 6 nov. | Vidéo de démo en ligne, Financial Forecast v2 | Max, Enzo |
| Ven. 20 nov. | 20 entretiens, décision mobile / iOS, tests de prix lancés | Raphaël, Rares, Enzo |
| Ven. 4 déc. | Support de restitution présenté à l'équipe et au mentor, décision sur la cible d'entrée | Raphaël, tous |
| Ven. 18 déc. | Revue de fin d'année : Jarvis go ou no-go, roadmap de l'hiver, bilan des KPIs | Arnaud, tous |

**Point d'équipe** : chaque lundi, 30 minutes. On met à jour les issues, on lit les récaps, on décale ou on coupe ce qui ne tiendra pas.

## 11. KPIs : définitions précises

Chaque indicateur a une définition, une formule, une source et un seuil de départ. Les seuils sont des repères à ajuster avec le mentor. Tant que la bêta n'existe pas, on suit les trois premières familles.

### Visibilité et inscription

| KPI | Définition | Formule | Source | Fréquence | Seuil de départ |
|---|---|---|---|---|---|
| Visiteurs uniques | Personnes différentes qui ouvrent le site dans la semaine, comptées une fois | Nombre de visiteurs uniques sur 7 jours | Statistiques du site | Hebdo | À mesurer en octobre pour fixer la base |
| Taux d'inscription | Part des visiteurs qui valident le formulaire de bêta | Inscrits de la semaine ÷ visiteurs uniques de la semaine | Formulaire et statistiques du site | Hebdo | 3 % |
| Inscrits qualifiés | Inscrits dont le score de qualification est de 6 ou plus (section 3) | Nombre d'inscrits avec score ≥ 6 | Tableur de suivi | Hebdo | 30 % des inscrits |
| Accord d'entretien | Part des inscrits qui cochent « OK pour un entretien de 20 minutes » | Inscrits qui acceptent ÷ inscrits | Formulaire | Hebdo | 20 % |

### Recherche utilisateur

| KPI | Définition | Formule | Source | Fréquence | Seuil de départ |
|---|---|---|---|---|---|
| Entretiens réalisés | Entretiens de 20 minutes terminés et notés dans la grille | Cumul depuis le 12 octobre | Grille de notes | Hebdo | 10 au 30 oct., 20 au 20 nov. |
| Réponses complètes | Questionnaires avec consentement et au moins 80 % des questions répondues | Cumul, par profil | Outil de questionnaire | Hebdo | 40 par profil |
| Compréhension du concept | Part des réponses à la Q14 qui décrivent Nexum comme prévu, jugées par deux personnes | Réponses jugées correctes ÷ réponses à Q14 | Q14, codage à deux | À la fin de chaque lot | 50 % |
| Douleur forte | Part des répondants qui notent 4 ou 5 à la Q9 | Réponses 4 ou 5 ÷ réponses Q9 | Questionnaire | À la fin de chaque lot | 40 % |
| « Très déçu » | Part des répondants « très déçus » si Nexum disparaissait (Q16) | Très déçus ÷ réponses Q16, par profil | Questionnaire | À la fin de chaque lot | 40 %, à manier avec prudence sur un produit pas encore utilisé |

### Bêta (2027)

| KPI | Définition | Formule | Source | Fréquence | Seuil de départ |
|---|---|---|---|---|---|
| Activation | Part des testeurs qui créent et lancent au moins un mode dans les 7 jours après l'installation | Testeurs qui ont lancé ≥ 1 mode dans les 7 jours ÷ testeurs installés | Mesure d'usage avec accord explicite | Hebdo | 60 % |
| Rétention à 30 jours | Part des testeurs qui lancent au moins un mode entre le jour 28 et le jour 35 | Testeurs actifs entre J28 et J35 ÷ testeurs installés depuis au moins 30 jours | Mesure d'usage | Mensuel | 40 % |
| Modes par testeur actif | Nombre moyen de modes lancés au moins une fois dans le mois | Modes distincts lancés ÷ testeurs actifs du mois | Mesure d'usage | Mensuel | 2 |
| Taux d'échec d'actions | Part des actions lancées qui renvoient une erreur ou aucune réponse | Actions en échec ÷ actions lancées sur 7 jours | Mesure d'usage | Hebdo | Moins de 5 % |
| Recommandation (NPS) | Part de promoteurs moins part de détracteurs | % des notes 9–10 − % des notes 0–6 à la question « Recommanderais-tu Nexum ? » | Questionnaire de suivi | À chaque vague | Supérieur à 0 |
| Conversion payante | Part des utilisateurs actifs qui souscrivent à l'offre payante | Abonnés payants ÷ utilisateurs actifs sur 90 jours | Paiement et mesure d'usage | Mensuel (après la bêta) | 4 % |

**Respect de la promesse de confidentialité.** La mesure d'usage reste facultative et expliquée avant l'installation, et on ne collecte rien qui ne serve pas à ces indicateurs.

---

## Sources

- [SignalRGB Free vs Pro](https://aurasync.net/signalrgb-free-vs-pro/) : prix de SignalRGB Pro, article tiers d'avril 2026, pas vérifié chez l'éditeur.
- [Elgato Stream Deck](https://www.elgato.com/us/en/p/stream-deck) : prix du modèle 15 touches (149,99 $).
- [Freemium Conversion Rate Benchmarks 2026](https://www.artisangrowthstrategies.com/blog/freemium-conversion-rate-benchmarks) : repères de conversion repris du 2026 Conversion Report de ChartMogul, Growth Unhinged et ProductLed (200 réponses, auto-déclarées).
- [Site Nexum](https://teamnexum.github.io/NexumWebsite/) : contenu consulté le 5 octobre 2026.

