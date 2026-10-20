// Crée le questionnaire utilisateurs Nexum (v2) dans Google Forms, avec ses
// sections, ses embranchements par profil, ses validations et un Google Sheet
// pour les réponses.
//
// Utilisation : script.new → coller ce fichier → exécuter buildForm() →
// autoriser. Les liens du formulaire et du tableur s'affichent dans le journal.
//
// Chaque question sert à valider une décision précise (voir les commentaires
// « Valide : »), en particulier celles du suivi mentor du 19/10/2026 :
// famille de fonctions de la v1, freemium, marketplace, appli mobile, bêta.

const PRIVACY_URL = 'https://teamnexum.github.io/NexumWebsite/confidentialite/';

function buildForm() {
  const form = FormApp.create('Nexum — Ton avis compte');
  form
    .setDescription(
      'Aide-nous à construire Nexum.\n\n' +
        'Nexum est un projet étudiant (EIP Epitech) : une application qui règle ton ordinateur selon ce que tu fais. ' +
        'Elle n\'est pas encore sortie, et c\'est justement pour ça qu\'on a besoin de ton avis.\n\n' +
        'Environ 8 minutes. Il n\'y a ni bonne ni mauvaise réponse, et on ne te vendra rien : tes réponses servent ' +
        'uniquement à décider de ce qu\'on construit. Tu peux demander leur suppression à tout moment.\n' +
        'Confidentialité : ' + PRIVACY_URL
    )
    .setProgressBar(true)
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(false)
    .setConfirmationMessage(
      'Merci. Tes réponses décident des premières fonctions de Nexum. ' +
        'On partagera ce qu\'on en a appris sur Instagram et LinkedIn.'
    );

  // ─── Section 1 : consentement et âge ────────────────────────────────────
  form
    .addCheckboxItem()
    .setTitle('Consentement')
    .setChoiceValues(['J\'accepte que l\'équipe Nexum utilise mes réponses pour construire le produit.'])
    .setRequired(true);
  const age = form
    .addMultipleChoiceItem()
    .setTitle('Ton âge')
    .setHelpText('Le questionnaire est réservé aux 15 ans et plus.')
    .setRequired(true);

  // ─── Section 2 : profil ─────────────────────────────────────────────────
  const pProfile = form.addPageBreakItem().setTitle('Ton profil');
  // Valide : quelle cible répond le plus (stratégie « du pêcheur »).
  const usage = form
    .addMultipleChoiceItem()
    .setTitle('Tu utilises surtout ton ordinateur pour…')
    .setHelpText('Ça oriente la suite du questionnaire.')
    .setRequired(true);
  choice(form, 'Quel système tu utilises le plus ?', ['Windows', 'macOS', 'Linux', 'Plusieurs']);
  // Valide : Android d'abord, iOS en sideload puis App Store.
  choice(form, 'Ton téléphone ?', ['Android', 'iPhone', 'Je n\'ai pas de smartphone']);
  choice(form, 'Combien d\'heures par jour tu passes sur ton ordinateur ?', [
    'Moins de 2 h', '2 à 5 h', '5 à 8 h', 'Plus de 8 h',
  ]);

  // ─── Section 3 : usage principal (pour « un peu tout ça ») ──────────────
  const pMain = form.addPageBreakItem().setTitle('Ton usage principal');
  const main = form
    .addMultipleChoiceItem()
    .setTitle('Si tu devais n\'en garder qu\'un ?')
    .setRequired(true);

  // ─── Sections 4 à 6 : questions selon le profil ─────────────────────────
  const pGame = form.addPageBreakItem().setTitle('Côté jeu');
  checks(form, 'Tu lances tes jeux depuis…', [
    'Steam', 'Epic Games', 'Battle.net', 'Riot Client', 'Xbox / Game Pass', 'EA app', 'Ubisoft Connect', 'GOG',
  ], { other: true });
  // Valide : le message « Nexum règle ce qu'il y a autour du jeu » (FAQ anti-cheat).
  choice(form, 'Tu joues à des jeux avec un anti-cheat (Valorant, LoL, Fortnite, CS2…) ?', [
    'Oui, souvent', 'Parfois', 'Non', 'Je ne sais pas',
  ]);
  checks(form, 'Quand tu lances une session de jeu, tu changes quoi autour ?', [
    'La sortie audio (casque, enceintes)', 'Les lumières ou le RGB', 'La luminosité de l\'écran',
    'J\'ouvre Discord', 'Je lance de la musique', 'Je coupe les notifications',
    'Je ferme les applis gourmandes', 'Rien',
  ], { other: true });

  const pStream = form.addPageBreakItem().setTitle('Côté stream et création');
  checks(form, 'Tu diffuses ou tu publies où ?', ['Twitch', 'YouTube', 'TikTok', 'Kick', 'Instagram'], {
    other: true,
  });
  number(form, 'Combien d\'étapes tu fais à la main avant de lancer un live ?', 'Un nombre, à peu près.');
  checks(form, 'Tu utilises quels outils ?', [
    'OBS Studio', 'Streamlabs', 'Stream Deck', 'Matériel Elgato (lumières, capture)', 'Bots de chat',
    'Voicemod ou effets audio',
  ], { other: true, required: false });

  const pWork = form.addPageBreakItem().setTitle('Côté travail et études');
  // Valide : familles « réunions et concentration » et « communications centralisées ».
  checks(form, 'Tu utilises quoi au quotidien ?', [
    'Teams', 'Slack', 'Zoom', 'Google Meet', 'Discord', 'Outlook', 'Gmail', 'Google Agenda', 'Notion', 'WhatsApp',
  ], { other: true });
  choice(form, 'Combien de messageries différentes tu consultes chaque jour ?', ['1', '2 ou 3', '4 ou 5', '6 ou plus']);
  choice(form, 'Combien de réunions en visio par semaine ?', ['Aucune', '1 à 3', '4 à 10', 'Plus de 10']);
  scale(form, 'À quel point les notifications cassent ta concentration ?', 'Pas du tout', 'Énormément');

  // ─── Section 7 : les irritants (les 5 familles de fonctions) ────────────
  const pDays = form.addPageBreakItem().setTitle('Tes journées sur l\'ordinateur');
  // Valide : QUELLE FAMILLE construire en premier pour la bêta.
  form
    .addGridItem()
    .setTitle('À quel point ces situations t\'agacent ?')
    .setHelpText('1 = pas du tout, 5 = énormément.')
    .setRows([
      'Préparer mon PC avant de jouer (son, lumières, applis…)',
      'Être dérangé par des notifications en réunion ou quand je me concentre',
      'Rouvrir chaque jour les mêmes applis, fenêtres et onglets pour travailler',
      'Jongler entre plusieurs messageries (Discord, Slack, Teams, mails…)',
      'Ne pas pouvoir contrôler mon PC ou ma maison connectée depuis mon téléphone',
      'Remettre mes réglages comme avant après une session',
    ])
    .setColumns(['1', '2', '3', '4', '5'])
    .setRequired(true);
  checks(form, 'Qu\'est-ce que tu utilises avec ton ordinateur ?', [
    'Casque ou enceintes avec un logiciel dédié', 'Lumières connectées (Hue, Govee, Nanoleaf, LED…)',
    'Clavier ou souris avec le logiciel du constructeur', 'Stream Deck ou boîtier de raccourcis',
    'Home Assistant ou domotique', 'Plusieurs écrans', 'Rien de tout ça',
  ], { other: true });
  choice(form, 'Par jour, combien de temps tu passes à régler ton PC, ouvrir ou fermer des applis, changer de réglages ?', [
    'Moins de 2 min', '2 à 5 min', '5 à 15 min', 'Plus de 15 min', 'Je ne sais pas',
  ]);
  paragraph(form, 'Concrètement, qu\'est-ce qui t\'agace le plus sur ton ordinateur ?');

  // ─── Sections 8 et 9 : ce qui existe déjà ───────────────────────────────
  const pTried = form.addPageBreakItem().setTitle('Ce que tu as déjà essayé');
  // Valide : le positionnement face à Zapier, IFTTT, n8n, Power Automate, Stream Deck.
  const tried = form
    .addMultipleChoiceItem()
    .setTitle('Tu as déjà essayé d\'automatiser ton ordinateur (scripts, raccourcis, logiciels) ?')
    .setRequired(true);

  const pTools = form.addPageBreakItem().setTitle('Tes outils actuels');
  checks(form, 'Avec quels outils ?', [
    'Zapier, IFTTT ou n8n', 'Power Automate ou Raccourcis (macOS)', 'AutoHotkey ou des scripts',
    'Stream Deck', 'Logiciels des constructeurs (Razer, Corsair, Logitech…)', 'Home Assistant',
    'SignalRGB ou OpenRGB',
  ], { other: true });
  checks(form, 'Qu\'est-ce qui t\'a bloqué, ou qui te manque ?', [
    'Trop technique, il faut coder', 'Ça ne marche qu\'avec une marque', 'Ça casse après une mise à jour',
    'Trop long à configurer', 'Aucun retour quand une action échoue', 'Trop cher', 'Limité en version gratuite',
  ], { other: true });
  // Valide : la disposition à payer (références : SignalRGB Pro, Stream Deck).
  choice(form, 'Tu as déjà payé pour un de ces outils ?', [
    'Oui, un abonnement', 'Oui, un achat unique (ex. un Stream Deck)', 'Non',
  ]);

  // ─── Section 10 : le concept ────────────────────────────────────────────
  const pConcept = form
    .addPageBreakItem()
    .setTitle('Nexum, en deux phrases')
    .setHelpText(
      'Nexum reconnaît ce que tu fais (un jeu qui se lance, une réunion qui commence, une session de travail) ' +
        'et règle tout pour toi : son, luminosité, lumières, notifications, applis. Quand tu as fini, il remet tout ' +
        'comme avant. Avec tes appareils, quelle que soit leur marque, et sans écrire une ligne de code.'
    );
  // Valide : la clarté du message du site et des réseaux.
  paragraph(form, 'Avec tes mots, à quoi ça te servirait ?', { required: true });
  scale(form, 'À quel point ça te serait utile ?', 'Pas du tout', 'Indispensable');
  // Valide : les fonctions qui font la différence (détection, restauration, sans code…).
  form
    .addGridItem()
    .setTitle('Ces fonctions, c\'est important pour toi ?')
    .setRows([
      'Détecter automatiquement ce que je fais (jeu, réunion…)',
      'Tout remettre comme avant à la fin',
      'Créer mes propres modes sans coder',
      'Marcher avec toutes les marques',
      'Lancer un mode à la voix',
      'Lancer un mode depuis mon téléphone',
      'Voir tous mes messages au même endroit',
    ])
    .setColumns(['Pas important', 'Sympa', 'Important', 'Indispensable'])
    .setRequired(true);
  scale(form, 'Tu serais à l\'aise de laisser Nexum détecter ce que tu fais et agir tout seul ?', 'Pas du tout', 'Totalement');
  checks(form, 'Qu\'est-ce qui pourrait te freiner ?', [
    'Peur pour mon compte de jeu (anti-cheat)', 'Mes données personnelles', 'Donner accès à mes mails et messageries',
    'La fiabilité', 'Trop de configuration', 'Je préfère mes outils actuels', 'Le prix', 'Devoir installer une application',
  ], { other: true, required: false });

  // ─── Section 11 : priorités ─────────────────────────────────────────────
  const pPrio = form.addPageBreakItem().setTitle('Ce qu\'on construit en premier');
  ranking(form, 'Tes 3 modes préférés', [
    'Gaming', 'Stream', 'Travail', 'Réunion', 'Concentration', 'Chill / détente', 'Soirée / sommeil', 'Sport',
  ]);
  form
    .addCheckboxItem()
    .setTitle('Les intégrations que tu voudrais en priorité')
    .setHelpText('5 maximum.')
    .setChoiceValues([
      'Discord', 'Spotify', 'Teams', 'Slack', 'Zoom ou Google Meet', 'Gmail', 'Outlook', 'Google Agenda', 'Notion',
      'OBS Studio', 'Philips Hue', 'Govee ou Nanoleaf', 'Home Assistant', 'Steam ou Epic Games',
    ])
    .showOtherOption(true)
    .setValidation(FormApp.createCheckboxValidation().requireSelectAtMost(5).build());
  // Valide : les déclencheurs avancés (une partie de l'offre payante).
  ranking(form, 'Comment tu préfères lancer un mode ? Tes 3 favoris', [
    'Un clic dans l\'application', 'Un raccourci clavier', 'À la voix', 'Tout seul quand je lance un jeu',
    'Tout seul au début d\'une réunion', 'À une heure précise', 'Depuis mon téléphone',
  ]);
  choice(form, 'Une action échoue (une lumière ne répond pas, par exemple). Tu préfères…', [
    'Que Nexum me prévienne et me laisse relancer ou ignorer', 'Qu\'il réessaie tout seul, puis me prévienne',
    'Qu\'il ignore l\'échec et continue',
  ]);

  // ─── Section 12 : marketplace ───────────────────────────────────────────
  const pMarket = form
    .addPageBreakItem()
    .setTitle('Les modes de la communauté')
    .setHelpText('On prépare une bibliothèque de modes et d\'extensions créés par les utilisateurs.');
  // Valide : la marketplace (priorité haute) et sa modération.
  choice(form, 'Tu installerais un mode créé par un autre utilisateur ?', [
    'Oui, sans hésiter', 'Oui, s\'il a été vérifié', 'Seulement s\'il vient de l\'équipe Nexum', 'Non',
  ]);
  checks(form, 'Qu\'est-ce qui te mettrait en confiance ?', [
    'Vérifié par l\'équipe Nexum', 'Analyse de sécurité automatique', 'Notes et avis des utilisateurs',
    'Beaucoup de téléchargements', 'Code source visible',
  ], { other: true, required: false });
  choice(form, 'Tu aimerais créer et partager tes propres modes ?', [
    'Oui, gratuitement', 'Oui, si je peux être rémunéré', 'Peut-être', 'Non',
  ]);

  // ─── Section 13 : mobile et données ─────────────────────────────────────
  form.addPageBreakItem().setTitle('Ton téléphone et tes données');
  choice(form, 'Une appli mobile pour lancer tes modes à distance, ce serait…', [
    'Indispensable', 'Pratique', 'Sans importance',
  ]);
  // Valide : la synchronisation cloud (payante) face au « tout en local ».
  choice(form, 'Où tu préfères qu\'on garde tes modes ?', [
    'Uniquement sur mon ordinateur', 'Synchronisés dans le cloud, si c\'est optionnel', 'Dans le cloud, ça ne me dérange pas',
  ]);

  // ─── Section 14 : prix (freemium) ───────────────────────────────────────
  form
    .addPageBreakItem()
    .setTitle('Le prix')
    .setHelpText(
      'Nexum aura une version gratuite pour l\'usage de base et une offre payante pour les fonctions avancées. ' +
        'Les prix ne sont pas fixés : c\'est justement ce qu\'on cherche à comprendre.'
    );
  // Valide : ce qui va dans l'offre payante.
  checks(form, 'Pour quelles fonctions tu serais prêt à payer ?', [
    'La synchronisation cloud de mes modes', 'L\'appli mobile', 'Les déclencheurs automatiques (jeu, agenda, voix)',
    'Des modes et extensions premium de la communauté', 'La messagerie unique', 'Un support prioritaire',
    'Aucune, je resterais sur la version gratuite',
  ]);
  choice(form, 'Quelle formule tu préférerais ?', [
    'Abonnement mensuel', 'Abonnement annuel (moins cher)', 'Achat unique', 'Uniquement la version gratuite',
  ]);
  // Valide : la fourchette de prix (méthode Van Westendorp).
  form
    .addSectionHeaderItem()
    .setTitle('Quatre prix, en € par mois')
    .setHelpText('Réponds avec un nombre seulement. Si tu ne sais pas, laisse vide.');
  number(form, 'Trop bon marché : je douterais de la qualité à partir de…');
  number(form, 'Une bonne affaire à partir de…');
  number(form, 'Cher, mais j\'y réfléchirais à partir de…');
  number(form, 'Trop cher, je n\'achèterais pas à partir de…');

  // ─── Section 15 : bêta, communauté, contact ─────────────────────────────
  form.addPageBreakItem().setTitle('Pour finir');
  // Valide : les canaux de communication par cible.
  checks(form, 'Où tu suis tes créateurs et projets préférés ?', [
    'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Discord', 'Twitch', 'Reddit', 'X (Twitter)',
  ], { other: true, required: false });
  paragraph(form, 'Y a-t-il quelque chose que Nexum doit absolument faire, ou ne jamais faire ?');
  choice(form, 'Tu veux tester la bêta dès qu\'elle ouvre ?', ['Oui', 'Non merci']);
  // Valide : les deux approches pour les premiers utilisateurs (bêta suivie ou communauté).
  choice(form, 'Pendant la bêta, tu donnerais ton avis…', [
    'Chaque jour (2 minutes)', 'Chaque semaine', 'De temps en temps', 'Je préfère juste tester',
  ], { required: false });
  choice(form, 'Tu aimerais rejoindre notre communauté Discord pour proposer des idées et voter pour les prochaines fonctions ?', [
    'Oui', 'Peut-être', 'Non',
  ]);
  choice(form, 'Tu accepterais un entretien de 20 minutes avec l\'équipe (visio ou message) ?', ['Oui', 'Non']);
  form
    .addTextItem()
    .setTitle('Ton e-mail, pour la bêta, la communauté ou l\'entretien')
    .setHelpText('Seulement si tu as dit oui à l\'une des questions précédentes. On ne s\'en sert que pour ça.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  // ─── Embranchements ─────────────────────────────────────────────────────
  age.setChoices([
    age.createChoice('Moins de 15 ans', FormApp.PageNavigationType.SUBMIT),
    age.createChoice('15 à 17 ans', FormApp.PageNavigationType.CONTINUE),
    age.createChoice('18 à 24 ans', FormApp.PageNavigationType.CONTINUE),
    age.createChoice('25 à 34 ans', FormApp.PageNavigationType.CONTINUE),
    age.createChoice('35 ans et plus', FormApp.PageNavigationType.CONTINUE),
  ]);
  usage.setChoices([
    usage.createChoice('Jouer', pGame),
    usage.createChoice('Streamer ou créer du contenu', pStream),
    usage.createChoice('Travailler ou étudier', pWork),
    usage.createChoice('Un peu tout ça', pMain),
  ]);
  main.setChoices([
    main.createChoice('Jouer', pGame),
    main.createChoice('Streamer ou créer du contenu', pStream),
    main.createChoice('Travailler ou étudier', pWork),
  ]);
  // Une seule section de profil par personne : après « jeu » ou « stream »,
  // on saute directement aux irritants.
  pStream.setGoToPage(pDays);
  pWork.setGoToPage(pDays);
  tried.setChoices([
    tried.createChoice('Oui, et ça marche encore', pTools),
    tried.createChoice('Oui, mais j\'ai abandonné', pTools),
    tried.createChoice('Non, mais ça m\'intéresserait', pConcept),
    tried.createChoice('Non, ça ne m\'intéresse pas', pConcept),
  ]);

  // Les réponses arrivent dans un Google Sheet, prêt pour l'analyse.
  const sheet = SpreadsheetApp.create('Nexum — réponses questionnaire');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Formulaire (édition) : ' + form.getEditUrl());
  Logger.log('Formulaire (à partager) : ' + form.getPublishedUrl());
  Logger.log('Réponses : ' + sheet.getUrl());
}

// ─── Aides ────────────────────────────────────────────────────────────────

function choice(form, title, values, opts) {
  const o = Object.assign({ required: true }, opts);
  return form.addMultipleChoiceItem().setTitle(title).setChoiceValues(values).setRequired(o.required);
}

function checks(form, title, values, opts) {
  const o = Object.assign({ required: true, other: false }, opts);
  return form
    .addCheckboxItem()
    .setTitle(title)
    .setChoiceValues(values)
    .showOtherOption(o.other)
    .setRequired(o.required);
}

function scale(form, title, low, high) {
  return form.addScaleItem().setTitle(title).setBounds(1, 5).setLabels(low, high).setRequired(true);
}

function paragraph(form, title, opts) {
  const o = Object.assign({ required: false }, opts);
  return form.addParagraphTextItem().setTitle(title).setRequired(o.required);
}

function number(form, title, help) {
  const item = form
    .addTextItem()
    .setTitle(title)
    .setValidation(
      FormApp.createTextValidation()
        .setHelpText('Un nombre, sans symbole.')
        .requireNumberGreaterThanOrEqualTo(0)
        .build()
    );
  if (help) item.setHelpText(help);
  return item;
}

// Classement : une grille où chaque colonne (1er, 2e, 3e choix) ne prend qu'une réponse.
function ranking(form, title, rows) {
  return form
    .addGridItem()
    .setTitle(title)
    .setHelpText('Un seul choix par colonne.')
    .setRows(rows)
    .setColumns(['1er choix', '2e choix', '3e choix'])
    .setValidation(FormApp.createGridValidation().requireLimitOneResponsePerColumn().build());
}
