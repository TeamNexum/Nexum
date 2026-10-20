// Creates the English version of the Nexum user survey in Google Forms, with
// the same structure as build-form.gs (French): sections, profile branching,
// validations and a Google Sheet for the answers.
//
// Usage: script.new → paste this file → run buildFormEn() → authorize. The
// links to the form and the sheet are printed in the execution log.
//
// Written for non-technical people: every technical word comes with a short
// explanation, and each question points to one decision (see « Validates: »).

const PRIVACY_URL = 'https://teamnexum.github.io/NexumWebsite/privacy';

function buildFormEn() {
  const form = FormApp.create('Nexum — Help us build it');
  form
    .setDescription(
      'Nexum is a student project (Epitech Innovative Project): an app that sets up your computer for what ' +
        'you are doing, like gaming, working or relaxing. It is not out yet, which is exactly why we need your opinion.\n\n' +
        'About 8 minutes. There are no right or wrong answers, and we will not sell you anything: your answers only ' +
        'help us decide what to build first. You can ask us to delete them at any time.\n' +
        'Privacy: ' + PRIVACY_URL
    )
    .setProgressBar(true)
    .setCollectEmail(false)
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(false)
    .setConfirmationMessage(
      'Thank you. Your answers decide the first features of Nexum. ' +
        'We will share what we learned on Instagram and LinkedIn.'
    );

  // ─── Section 1: consent and age ─────────────────────────────────────────
  form
    .addCheckboxItem()
    .setTitle('Consent')
    .setChoiceValues(['I agree that the Nexum team uses my answers to build the product.'])
    .setRequired(true);
  const age = form
    .addMultipleChoiceItem()
    .setTitle('How old are you?')
    .setHelpText('This survey is for people aged 15 and over.')
    .setRequired(true);

  // ─── Section 2: profile ─────────────────────────────────────────────────
  form.addPageBreakItem().setTitle('About you');
  // Validates: which audience answers the most.
  const usage = form
    .addMultipleChoiceItem()
    .setTitle('What do you mostly use your computer for?')
    .setHelpText('This decides the next questions.')
    .setRequired(true);
  choice(form, 'Which computer system do you use the most?', ['Windows', 'macOS (Apple)', 'Linux', 'Several']);
  // Validates: Android first, iPhone later.
  choice(form, 'Which phone do you have?', ['Android', 'iPhone', 'I don\'t have a smartphone']);
  choice(form, 'How many hours a day do you spend on your computer?', [
    'Less than 2 hours', '2 to 5 hours', '5 to 8 hours', 'More than 8 hours',
  ]);

  // ─── Section 3: main use (for « a bit of everything ») ──────────────────
  const pMain = form.addPageBreakItem().setTitle('Your main use');
  const main = form
    .addMultipleChoiceItem()
    .setTitle('If you had to pick just one?')
    .setRequired(true);

  // ─── Sections 4 to 6: questions for each profile ────────────────────────
  const pGame = form.addPageBreakItem().setTitle('Gaming');
  checks(form, 'Where do you start your games from?', [
    'Steam', 'Epic Games', 'Battle.net', 'Riot Client', 'Xbox app / Game Pass', 'EA app', 'Ubisoft Connect', 'GOG',
  ], { other: true });
  // Validates: the « Nexum never touches your games » message.
  choice(form, 'Do you play games with anti-cheat (Valorant, League of Legends, Fortnite, CS2…)?', [
    'Yes, often', 'Sometimes', 'No', 'I don\'t know',
  ], { help: 'Anti-cheat is software in some online games that blocks cheating programs.' });
  checks(form, 'When you start gaming, what do you change around you?', [
    'Sound output (headset or speakers)', 'Lights or RGB', 'Screen brightness', 'I open Discord', 'I start music',
    'I turn off notifications', 'I close heavy apps', 'Nothing',
  ], { other: true });

  const pStream = form.addPageBreakItem().setTitle('Streaming and content');
  checks(form, 'Where do you stream or post?', ['Twitch', 'YouTube', 'TikTok', 'Kick', 'Instagram'], { other: true });
  number(form, 'How many things do you do by hand before going live?', 'A rough number is fine.');
  checks(form, 'Which tools do you use?', [
    'OBS Studio', 'Streamlabs', 'Stream Deck', 'Elgato gear (lights, capture card)', 'Chat bots', 'Voice effects (Voicemod…)',
  ], { other: true, required: false });

  const pWork = form.addPageBreakItem().setTitle('Work and study');
  // Validates: the « meetings and focus » and « all messages in one place » families.
  checks(form, 'Which apps do you use every day?', [
    'Teams', 'Slack', 'Zoom', 'Google Meet', 'Discord', 'Outlook', 'Gmail', 'Google Calendar', 'Notion', 'WhatsApp',
  ], { other: true });
  choice(form, 'How many different messaging apps do you check each day?', ['1', '2 or 3', '4 or 5', '6 or more']);
  choice(form, 'How many video meetings do you have per week?', ['None', '1 to 3', '4 to 10', 'More than 10']);
  scale(form, 'How much do notifications break your focus?', 'Not at all', 'A lot');

  // ─── Section 7: what annoys people (the 5 feature families) ─────────────
  const pDays = form.addPageBreakItem().setTitle('Your days on the computer');
  // Validates: WHICH FAMILY to build first for the beta.
  form
    .addGridItem()
    .setTitle('How much do these situations annoy you?')
    .setHelpText('1 = not at all, 5 = a lot.')
    .setRows([
      'Setting up my PC before gaming (sound, lights, apps…)',
      'Getting notifications during a meeting or when I need to focus',
      'Opening the same apps, windows and tabs every day to work',
      'Switching between many messaging apps (Discord, Slack, Teams, email…)',
      'Not being able to control my computer or smart home from my phone',
      'Putting my settings back the way they were after a session',
    ])
    .setColumns(['1', '2', '3', '4', '5'])
    .setRequired(true);
  checks(form, 'What do you use with your computer?', [
    'Headset or speakers with their own app', 'Smart lights (Philips Hue, Govee, Nanoleaf, LED strips…)',
    'Keyboard or mouse with the brand\'s app', 'Stream Deck or a shortcut box', 'A smart home system (Home Assistant…)',
    'Several screens', 'None of these',
  ], { other: true });
  choice(form, 'Each day, how long do you spend adjusting settings or opening and closing apps?', [
    'Less than 2 min', '2 to 5 min', '5 to 15 min', 'More than 15 min', 'I don\'t know',
  ]);
  paragraph(form, 'In your own words, what annoys you the most on your computer?');

  // ─── Sections 8 and 9: what already exists ──────────────────────────────
  form.addPageBreakItem().setTitle('What you have tried');
  // Validates: positioning against Zapier, IFTTT, n8n, Power Automate, Stream Deck.
  const tried = form
    .addMultipleChoiceItem()
    .setTitle('Have you ever tried to make your computer do things on its own (shortcuts, apps, small programs)?')
    .setRequired(true);

  const pTools = form.addPageBreakItem().setTitle('Your current tools');
  checks(form, 'Which tools?', [
    'Zapier, IFTTT or n8n (apps that connect other apps)', 'Power Automate or Apple Shortcuts',
    'AutoHotkey or scripts (small programs you write)', 'Stream Deck',
    'Brand apps (Razer Synapse, Corsair iCUE, Logitech G Hub…)', 'Home Assistant (smart home hub)',
    'SignalRGB or OpenRGB (RGB lighting control)',
  ], { other: true });
  checks(form, 'What stopped you, or what is missing?', [
    'Too technical, you need to code', 'Only works with one brand', 'Breaks after an update', 'Takes too long to set up',
    'No warning when something fails', 'Too expensive', 'Too limited in the free version',
  ], { other: true });
  // Validates: willingness to pay (references: SignalRGB Pro, Stream Deck).
  choice(form, 'Have you ever paid for one of these tools?', [
    'Yes, a subscription', 'Yes, a one-time purchase (e.g. a Stream Deck)', 'No',
  ]);

  // ─── Section 10: the concept ────────────────────────────────────────────
  const pConcept = form
    .addPageBreakItem()
    .setTitle('Nexum in two sentences')
    .setHelpText(
      'Nexum notices what you are doing (a game starting, a meeting beginning, a work session) and sets ' +
        'everything up for you: sound, brightness, lights, notifications, apps. When you are done, it puts everything ' +
        'back. It works with your devices whatever their brand, and you never write a line of code.\n\n' +
        'In Nexum, a « mode » is a group of settings for one activity: for example Gaming, Meeting or Focus.'
    );
  // Validates: whether the message is clear.
  paragraph(form, 'In your own words, what would you use it for?', { required: true });
  scale(form, 'How useful would it be for you?', 'Not at all', 'Essential');
  // Validates: the features that make the difference.
  form
    .addGridItem()
    .setTitle('How important are these features to you?')
    .setRows([
      'Noticing on its own what I am doing (game, meeting…)',
      'Putting everything back at the end',
      'Creating my own modes without coding',
      'Working with every brand',
      'Starting a mode with my voice',
      'Starting a mode from my phone',
      'Seeing all my messages in one place',
    ])
    .setColumns(['Not important', 'Nice to have', 'Important', 'Essential'])
    .setRequired(true);
  scale(form, 'Would you be comfortable letting Nexum notice what you do and act on its own?', 'Not at all', 'Totally');
  checks(form, 'What could stop you from using it?', [
    'Fear for my game account (anti-cheat)', 'My personal data', 'Giving access to my email and messages', 'Reliability',
    'Too much setup', 'I prefer my current tools', 'The price', 'Having to install an app',
  ], { other: true, required: false });

  // ─── Section 11: priorities ─────────────────────────────────────────────
  form.addPageBreakItem().setTitle('What we build first');
  ranking(form, 'Your top 3 modes', [
    'Gaming', 'Streaming', 'Work', 'Meeting', 'Focus', 'Chill', 'Evening / sleep', 'Sport',
  ]);
  form
    .addCheckboxItem()
    .setTitle('Which apps and devices should Nexum work with first?')
    .setHelpText('Pick up to 5.')
    .setChoiceValues([
      'Discord', 'Spotify', 'Teams', 'Slack', 'Zoom or Google Meet', 'Gmail', 'Outlook', 'Google Calendar', 'Notion',
      'OBS Studio', 'Philips Hue', 'Govee or Nanoleaf', 'Home Assistant', 'Steam or Epic Games',
    ])
    .showOtherOption(true)
    .setValidation(FormApp.createCheckboxValidation().requireSelectAtMost(5).build());
  // Validates: automatic triggers (part of the paid plan).
  ranking(form, 'How would you like to start a mode? Your top 3', [
    'A click in the app', 'A keyboard shortcut', 'My voice', 'On its own when I start a game',
    'On its own when a meeting starts', 'At a set time', 'From my phone',
  ]);
  choice(form, 'Something fails (a light does not respond, for example). What do you prefer?', [
    'Nexum tells me and lets me retry or skip', 'It retries on its own, then tells me', 'It ignores it and carries on',
  ]);

  // ─── Section 12: marketplace ────────────────────────────────────────────
  form
    .addPageBreakItem()
    .setTitle('Modes shared by the community')
    .setHelpText('We are planning a library where users can share their modes, a bit like an app store for setups.');
  // Validates: the marketplace (high priority) and its moderation.
  choice(form, 'Would you install a mode made by another user?', [
    'Yes, without hesitation', 'Yes, if it has been checked', 'Only if it comes from the Nexum team', 'No',
  ]);
  checks(form, 'What would make you trust it?', [
    'Checked by the Nexum team', 'An automatic security scan', 'Ratings and reviews', 'Many downloads',
    'The code is public',
  ], { other: true, required: false });
  choice(form, 'Would you like to create and share your own modes?', [
    'Yes, for free', 'Yes, if I could earn money', 'Maybe', 'No',
  ]);

  // ─── Section 13: phone and data ─────────────────────────────────────────
  form.addPageBreakItem().setTitle('Your phone and your data');
  choice(form, 'A phone app to start your modes from anywhere would be…', ['Essential', 'Handy', 'Not important']);
  // Validates: cloud sync (paid) versus « everything on my computer ».
  choice(form, 'Where would you like your modes to be saved?', [
    'Only on my computer', 'Online too, so they follow me to another computer, if it\'s optional',
    'Online, I don\'t mind',
  ]);

  // ─── Section 14: price (freemium) ───────────────────────────────────────
  form
    .addPageBreakItem()
    .setTitle('Price')
    .setHelpText(
      'Nexum will have a free version for everyday use and a paid plan for extra features. ' +
        'Prices are not set yet: that is exactly what we want to understand.'
    );
  // Validates: what goes into the paid plan.
  checks(form, 'Which features would you pay for?', [
    'My modes saved online and on all my computers', 'The phone app',
    'Modes that start on their own (game, calendar, voice)', 'Premium modes and add-ons from the community',
    'All my messages in one place', 'Priority support', 'None, I would stay on the free version',
  ]);
  choice(form, 'Which plan would you prefer?', [
    'Monthly subscription', 'Yearly subscription (cheaper)', 'Pay once', 'Only the free version',
  ]);
  // Validates: the price range (Van Westendorp method).
  choice(form, 'Which currency do you think in?', ['€ (euro)', '$ (dollar)', '£ (pound)'], {
    required: false,
    other: true,
  });
  form
    .addSectionHeaderItem()
    .setTitle('Four prices, per month')
    .setHelpText('Answer with a number only. If you are not sure, leave it empty.');
  number(form, 'So cheap that I would doubt the quality, from…');
  number(form, 'A good deal, from…');
  number(form, 'Expensive, but I would think about it, from…');
  number(form, 'Too expensive, I would not buy it, from…');

  // ─── Section 15: beta, community, contact ───────────────────────────────
  form.addPageBreakItem().setTitle('Last questions');
  // Validates: the communication channels for each audience.
  checks(form, 'Where do you follow your favorite creators and projects?', [
    'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Discord', 'Twitch', 'Reddit', 'X (Twitter)',
  ], { other: true, required: false });
  paragraph(form, 'Is there something Nexum must absolutely do, or never do?');
  choice(form, 'Do you want to try the beta as soon as it opens?', ['Yes', 'No thanks']);
  // Validates: the two ways to get first users (followed beta or community).
  choice(form, 'During the beta, you would give feedback…', [
    'Every day (2 minutes)', 'Every week', 'Now and then', 'I would rather just try it',
  ], { required: false });
  choice(form, 'Would you like to join our Discord community to suggest ideas and vote on the next features?', [
    'Yes', 'Maybe', 'No',
  ]);
  choice(form, 'Would you be up for a 20-minute chat with the team (video call or messages)?', ['Yes', 'No']);
  form
    .addTextItem()
    .setTitle('Your email, for the beta, the community or the chat')
    .setHelpText('Only if you said yes to one of the questions above. We only use it for that.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  // ─── Branching ──────────────────────────────────────────────────────────
  age.setChoices([
    age.createChoice('Under 15', FormApp.PageNavigationType.SUBMIT),
    age.createChoice('15 to 17', FormApp.PageNavigationType.CONTINUE),
    age.createChoice('18 to 24', FormApp.PageNavigationType.CONTINUE),
    age.createChoice('25 to 34', FormApp.PageNavigationType.CONTINUE),
    age.createChoice('35 or over', FormApp.PageNavigationType.CONTINUE),
  ]);
  usage.setChoices([
    usage.createChoice('Gaming', pGame),
    usage.createChoice('Streaming or making content', pStream),
    usage.createChoice('Work or study', pWork),
    usage.createChoice('A bit of everything', pMain),
  ]);
  main.setChoices([
    main.createChoice('Gaming', pGame),
    main.createChoice('Streaming or making content', pStream),
    main.createChoice('Work or study', pWork),
  ]);
  // One profile section per person: after gaming or streaming, skip to the annoyances.
  pStream.setGoToPage(pDays);
  pWork.setGoToPage(pDays);
  tried.setChoices([
    tried.createChoice('Yes, and it still works', pTools),
    tried.createChoice('Yes, but I gave up', pTools),
    tried.createChoice('No, but I would be interested', pConcept),
    tried.createChoice('No, not interested', pConcept),
  ]);

  const sheet = SpreadsheetApp.create('Nexum — survey answers (EN)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Form (edit): ' + form.getEditUrl());
  Logger.log('Form (share): ' + form.getPublishedUrl());
  Logger.log('Answers: ' + sheet.getUrl());
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function choice(form, title, values, opts) {
  const o = Object.assign({ required: true, other: false }, opts);
  const item = form
    .addMultipleChoiceItem()
    .setTitle(title)
    .setChoiceValues(values)
    .showOtherOption(o.other)
    .setRequired(o.required);
  if (o.help) item.setHelpText(o.help);
  return item;
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
      FormApp.createTextValidation().setHelpText('A number only.').requireNumberGreaterThanOrEqualTo(0).build()
    );
  if (help) item.setHelpText(help);
  return item;
}

// Ranking: a grid where each column (1st, 2nd, 3rd choice) takes only one answer.
function ranking(form, title, rows) {
  return form
    .addGridItem()
    .setTitle(title)
    .setHelpText('One choice per column.')
    .setRows(rows)
    .setColumns(['1st choice', '2nd choice', '3rd choice'])
    .setValidation(FormApp.createGridValidation().requireLimitOneResponsePerColumn().build());
}
