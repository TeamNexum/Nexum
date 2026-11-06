# Mapping US → capacités du catalogue (réaudit du 06/11/2026)

Estimation de l'auteur du plan, à relire par Raphaël ou Max. Source : catalogue « Nexum Master Technical Feature Universe » (1 176 capacités, 70 pages), relu en entier par tranches de 20 pages (extraction du texte brut, 1 176 identifiants retrouvés, comptes par domaine identiques à ceux annoncés).

**Règle de comptage.** Une capacité n'est comptée pour une US que si cette US en a besoin pour atteindre son « Terminé quand ». Deux capacités du catalogue décrivant la même fonction (par exemple 225 et 084 pour un webhook) sont comptées toutes les deux, avec mention. Les capacités de mesure (durées, résultats) ne sont comptées que lorsque le critère les chiffre. Les US Won't ne comptent pas. **« Hors catalogue » = aucune capacité du catalogue ne correspond ; l'US (ou la part de l'US concernée) n'est pas comptée dans le décompte.** Une capacité utile à plusieurs US n'est comptée qu'une fois dans le total.

## Résultat

| Décompte | Capacités distinctes | BTP candidate | Stretch | Roadmap | Experimental |
|---|---|---|---|---|---|
| Ancien mapping (v3, 53 US engagées) | 121 | 77 | 37 | 7 | 0 |
| Après réaudit seul (mêmes US engagées, 53) | 140 | 90 | 42 | 8 | 0 |
| Après réaudit et nouvelles US 59–68 (63 US engagées) | 171 | 120 | 42 | 9 | 0 |

- **Sous-comptage de l'ancien mapping** : 31 capacités ne figuraient pas dans l'ancien mapping alors que les US engagées en ont besoin (détail ci-dessous).
- **Sur-comptage corrigé** : 12 capacités de l'ancien mapping sont retirées parce que l'US n'en a pas besoin pour son critère (détail ci-dessous).
- **Apport des nouvelles US 59 à 68** : 31 capacités de plus.

### Capacités ajoutées par le réaudit (sous-comptage)

| Capacité | US concernées |
|---|---|
| NX-007 Stop a running mode | US-48 |
| NX-084 Webhook received trigger | US-53 |
| NX-121 Run command | US-54 |
| NX-122 Run PowerShell script | US-54 |
| NX-222 Custom JSON request body | US-53 |
| NX-224 Generic OAuth connector | US-30, US-31, US-32, US-47 |
| NX-247 Extension documentation | US-58 |
| NX-357 OAuth token storage | US-30, US-31, US-32, US-47 |
| NX-359 Operating-system keychain integration | US-30, US-31, US-32, US-47 |
| NX-360 Automatic token refresh | US-30, US-31, US-32, US-39, US-47 |
| NX-364 API secrets vault | US-53 |
| NX-409 Background automation service | US-26, US-27, US-28 |
| NX-410 Event-to-action rules | US-26, US-27, US-28 |
| NX-421 Debounce duplicate events | US-26, US-27 |
| NX-452 Device-to-device command routing | US-41 |
| NX-460 Offline queued commands | US-41 |
| NX-543 Save window position and size | US-57 |
| NX-544 Restore window position and size | US-57 |
| NX-545 Move window to monitor | US-57 |
| NX-552 Launch application into saved position | US-57 |
| NX-553 Save multi-window layout | US-57 |
| NX-554 Restore multi-window layout | US-57 |
| NX-879 Reconnect conflict resolution | US-40 |
| NX-955 Structured application logs | US-43 |
| NX-983 UI font scaling | US-46 |
| NX-984 Color-blind-safe status indicators | US-46 |
| NX-1021 Provider-specific action mapping | US-55 |
| NX-1023 Provider authentication strategy interface | US-03 |
| NX-1024 Provider health and connectivity status | US-02, US-03 |
| NX-1037 Provider-specific game URI resolver | US-55 |
| NX-1066 Spotify provider adapter | US-18 |

### Capacités retirées par le réaudit (sur-comptage)

| Capacité | Raison |
|---|---|
| NX-005 Enable or disable a mode | l'ancien mapping de US-07 comptait « activer ou désactiver un mode » : ce sont des actions d'un mode, pas un mode |
| NX-119 Open file | fichiers : l'ouverture d'un lien (US-15) n'est pas une ouverture de fichier |
| NX-120 Open folder | dossiers : idem |
| NX-161 Philips Hue light control | contrôle de lumières : non requis par l'appairage du pont (US-03) |
| NX-206 Outlook calendar trigger | US-31 lit des e-mails ; le déclencheur d'agenda relève de US-28 (086, 215) |
| NX-208 Teams meeting detection | détection de réunion Teams : non requise pour lire des messages |
| NX-214 Google Calendar integration | US-47 ne compte que le fournisseur retenu pour la planification (1150, Microsoft) ; Google Agenda reste le second choix |
| NX-245 Signed extensions | signature d'extensions : non requise par la politique minimale de US-58 |
| NX-536 Partial workspace restore | restauration partielle : non requise par le critère de US-57 |
| NX-622 Before/after state diff | diff avant/après : non requis par le critère de US-48 |
| NX-1082 Generic scene activation capability | activation de scène générique : US-17 n'a besoin que de Hue (162) |
| NX-1151 Generic CalDAV calendar provider | CalDAV : fournisseur non retenu pour US-47 |

## Détail par US

| US | Capacités NX (ID : intitulé) | Justification par groupe |
|---|---|---|
| US-01 | NX-292 Windows client; NX-293 macOS client; NX-294 Linux client | [292, 293, 294] l'app doit exister et démarrer sur les 3 systèmes (critère : 3 systèmes × 3 machines) |
| US-02 | NX-761 Device capability discovery; NX-1019 Provider discovery and availability scan; NX-1024 Provider health and connectivity status; NX-1026 Provider availability by operating system; NX-1030 Detect installed game launchers | [1019, 1030, 761, 1026] détecter au premier lancement les intégrations et lanceurs réellement disponibles sur la machine (critère : 100 % détectées) ; [1024] afficher l'état de disponibilité de chaque intégration |
| US-03 | NX-181 IoT device discovery; NX-1023 Provider authentication strategy interface; NX-1024 Provider health and connectivity status | [181] trouver le pont sur le réseau ; [1023] appairage = stratégie d'authentification du fournisseur ; [1024] afficher « joignable et authentifié » |
| US-04 | NX-775 Per-integration privacy controls; NX-1017 Provider registry | [1017] registre des intégrations : état activé ou désactivé lu avant chaque action (critère : 0 action exécutée si désactivée) ; [775] contrôle par intégration (proche, intitulé orienté vie privée ; à valider) |
| US-05 (Won't) | NX-230 Extension manager; NX-231 Install extension; NX-233 Enable or disable extension; NX-246 Extension SDK | non comptées (US retirée du périmètre) |
| US-06 | NX-001 Create a mode; NX-002 Edit a mode; NX-003 Delete a mode | [1, 2, 3] créer, modifier, supprimer un mode dans l'éditeur ; l'enregistrement local n'a pas de capacité dédiée dans le catalogue |
| US-07 | NX-015 Drag-and-drop action ordering; NX-017 Sequential actions; NX-021 Continue on failure; NX-022 Stop workflow on failure | [15, 17] ordre des actions respecté à l'exécution ; [21, 22] choisir de continuer ou d'arrêter en cas d'échec |
| US-08 | NX-277 Natural language to mode | [277] phrase → mode ; la validation du mode produit n'a pas de capacité dédiée |
| US-09 | NX-574 Action prerequisite checks; NX-761 Device capability discovery; NX-1026 Provider availability by operating system | [574, 1026, 761] prérequis et disponibilité par système, calculés avant l'exécution |
| US-10 | NX-006 Run a mode; NX-017 Sequential actions; NX-020 Timeout per action; NX-042 Execution duration tracking | [6, 17] exécuter le mode, actions dans l'ordre ; [20] délai maximal par action : une action bloquée ferait dépasser les 3 s pour 5 actions ; [42] durée de chaque action mesurée : le critère « moins de 3 s » est chiffré (vaut pour tous les critères chronométrés) — Examiné et écarté : retries (019) : écartés, relèvent de US-49 ; journal détaillé (041) et mise en évidence des échecs (043) : relèvent de US-24, US-25 et US-51, pas du critère de US-10 |
| US-11 | NX-097 Master volume control | [97] régler le volume principal |
| US-12 | NX-103 Display brightness control | [103] régler la luminosité |
| US-13 | NX-127 Launch process | [127] lancer une application |
| US-14 | NX-126 Kill process | [126] fermer une application |
| US-15 | hors catalogue | [hors catalogue] ouvrir une page ou un lien dans l'app par défaut : aucune capacité du catalogue (119 et 120 concernent fichiers et dossiers, retirés du mapping) |
| US-16 | NX-132 Launch Steam game; NX-1038 Steam provider adapter | [132, 1038] lancer un jeu Steam et son adaptateur ; les adaptateurs Epic et GOG relèvent de US-55 |
| US-17 | NX-162 Philips Hue scene control | [162] appliquer une scène Hue ; l'authentification vient de US-03 |
| US-18 | NX-184 Spotify play; NX-185 Spotify pause; NX-189 Spotify playlist launch; NX-1066 Spotify provider adapter | [184, 185, 189, 1066] lancer une liste et mettre en pause, via l'adaptateur Spotify |
| US-19 (Won't) | NX-148 OBS switch scene | non comptées (US retirée du périmètre) |
| US-20 (Won't) | NX-137 Change Discord status; NX-138 Change Discord activity | non comptées (US retirée du périmètre) |
| US-21 (Won't) | NX-438 Context-aware notification filtering; NX-440 Quiet mode; NX-448 Meeting interruption guard | non comptées (US retirée du périmètre) |
| US-22 | NX-051 Voice command trigger | [51] déclencher un mode à la voix ; le raccourci d'écoute (050) n'est pas compté ici — Examiné et écarté : raccourci push-to-talk (050) : non compté pour US-22 |
| US-23 | NX-049 Keyboard shortcut trigger; NX-050 Global keyboard shortcut trigger | [49, 50] raccourci clavier, y compris global pour l'arrière-plan |
| US-24 | NX-391 Recent activity panel; NX-625 Visual step trace | [625, 391] suivre chaque action et son résultat dans le fil d'activité |
| US-25 | NX-041 Detailed action logs; NX-043 Failed action highlighting | [43, 41] mettre en évidence l'action en échec et donner le détail de la cause |
| US-26 | NX-052 Scheduled-time trigger; NX-053 Recurring schedule trigger; NX-409 Background automation service; NX-410 Event-to-action rules; NX-414 Day-of-week conditions; NX-421 Debounce duplicate events | [52, 53, 414] déclencheur horaire, récurrent, par jour ; [409, 410] service d'arrière-plan et règle événement → mode ; [421] ne pas déclencher deux fois dans la même minute — Examiné et écarté : persistance des règles et interface de création : aucune capacité du catalogue correspondante (hors catalogue) ; conditions horaires avancées (413) : non requises par le critère |
| US-27 | NX-055 Application launched trigger; NX-057 Game launched trigger; NX-409 Background automation service; NX-410 Event-to-action rules; NX-421 Debounce duplicate events | [55, 57] détecter le lancement d'une application ou d'un jeu ; [409, 410, 421] service d'arrière-plan, règle événement → mode, anti-doublon |
| US-28 | NX-086 Calendar event starts trigger; NX-215 Calendar event-start automation; NX-409 Background automation service; NX-410 Event-to-action rules | [86, 215] début d'un événement d'agenda → mode ; [409, 410] service d'arrière-plan et règle événement → mode |
| US-29 (Won't) | NX-900 Mobile geofence context | non comptées (US retirée du périmètre) |
| US-30 | NX-197 Gmail read emails; NX-224 Generic OAuth connector; NX-357 OAuth token storage; NX-359 Operating-system keychain integration; NX-360 Automatic token refresh | [197] lire les e-mails Gmail ; [224, 357, 359, 360] connexion OAuth, stockage du jeton dans le trousseau, renouvellement |
| US-31 | NX-204 Outlook read mail; NX-224 Generic OAuth connector; NX-357 OAuth token storage; NX-359 Operating-system keychain integration; NX-360 Automatic token refresh | [204] lire les e-mails Outlook ; [224, 357, 359, 360] connexion OAuth, jeton, renouvellement |
| US-32 | NX-210 Communication-platform new-message trigger; NX-224 Generic OAuth connector; NX-357 OAuth token storage; NX-359 Operating-system keychain integration; NX-360 Automatic token refresh | [210] lire les nouveaux messages Teams (aucune capacité « lire Teams » exacte ; plus proche : déclencheur de message) ; [224, 357, 359, 360] connexion OAuth, jeton, renouvellement |
| US-33 | NX-437 Unified notification feed; NX-445 Unified inbox view | [445, 437] fil unifié trié des messages de plusieurs comptes |
| US-34 | NX-972 JSON configuration import/export; NX-1000 Versioned Nexum automation schema | [972, 1000] export JSON et format versionné |
| US-35 | NX-1013 Import compatibility checker | [1013] vérifier un fichier avant import ; l'analyse de risque n'a pas de capacité dédiée |
| US-36 | NX-250 Browse modes; NX-263 Install mode from marketplace | [250, 263] parcourir et installer un mode ; le score de risque n'a pas de capacité dédiée — Examiné et écarté : score de risque : aucune capacité du catalogue ; recherche et catégories (252, 253) : présentes dans l'UI mais non requises par le critère |
| US-37 | NX-265 Publish mode; NX-270 Moderation workflow | [265, 270] publier un mode et le recevoir dans la file de modération — Examiné et écarté : score de risque : aucune capacité du catalogue ; file de modération : 270 |
| US-38 | NX-270 Moderation workflow | [270] valider ou refuser un mode publié — Examiné et écarté : score de risque : aucune capacité du catalogue ; éditeur vérifié (271) et signalement (269) : non requis |
| US-39 | NX-360 Automatic token refresh; NX-366 Cloud-enabled mode; NX-368 Login session management | [368, 366] comptes et sessions, mode connecté ; [360] jeton d'accès de 15 minutes renouvelé : sans cela l'app cesse de fonctionner après 15 minutes — Examiné et écarté : trousseau (359) et révocation (361) : implémentés dans la PR #134 mais non requis par « 20 comptes créés, 0 échec » |
| US-40 | NX-304 Synchronize modes; NX-879 Reconnect conflict resolution | [304] synchroniser les modes ; [879] « aucune modification perdue » : résolution de conflit entre deux machines (révisions optimistes de la PR #134) — Examiné et écarté : historique des versions d'un mode (046, 047) : non requis par le critère |
| US-41 | NX-302 Remote mode execution; NX-316 Run mode remotely; NX-368 Login session management; NX-450 Phone as Nexum remote; NX-452 Device-to-device command routing; NX-460 Offline queued commands | [316, 450, 302] activer un mode à distance depuis le téléphone ; [452, 460] acheminer la commande vers le PC et la garder jusqu'à sa lecture ; [368] compte authentifié obligatoire |
| US-42 | NX-295 Android client; NX-296 iOS client | [295, 296] clients Android et iOS ; les actions locales du téléphone n'ont pas de capacité dédiée |
| US-43 | NX-623 Export diagnostic bundle; NX-624 Redacted support bundle; NX-955 Structured application logs | [623, 624, 955] paquet de diagnostic expurgé et journaux de l'app joints au retour |
| US-44 | hors catalogue | [hors catalogue] mises à jour automatiques : aucune capacité du catalogue |
| US-45 | hors catalogue | [hors catalogue] affichage des limites de l'offre gratuite : aucune capacité du catalogue |
| US-46 | NX-979 Keyboard-only navigation; NX-980 Screen-reader labels; NX-981 High-contrast interface; NX-983 UI font scaling; NX-984 Color-blind-safe status indicators | [979, 980, 981] navigation clavier, libellés, contrastes ; [983, 984] agrandissement du texte et statuts non portés par la seule couleur (exigences WCAG AA) |
| US-47 | NX-224 Generic OAuth connector; NX-357 OAuth token storage; NX-359 Operating-system keychain integration; NX-360 Automatic token refresh; NX-1150 Microsoft 365 / Outlook Calendar provider adapter | [1150] adaptateur d'agenda (fournisseur retenu pour la planification : Microsoft, via Microsoft Graph, permission déléguée Calendars.Read ; Google Agenda, NX-214, second choix, non compté) ; [224, 357, 359, 360] connexion OAuth, jeton, renouvellement |
| US-48 | NX-007 Stop a running mode; NX-037 Undo / rollback actions; NX-681 Restore previous state when session ends | [681] restaurer l'état d'avant à la fin ; [37] annuler les actions ; [7] arrêter un mode (c'est lui qui déclenche la restauration) |
| US-49 | NX-019 Retry action on failure; NX-020 Timeout per action; NX-493 Action retry policies | [19, 20, 493] nouvelles tentatives et délai maximal par action |
| US-50 | NX-022 Stop workflow on failure; NX-037 Undo / rollback actions; NX-498 Rollback on partial failure | [498, 37, 22] annuler l'état à moitié appliqué après un échec |
| US-51 | NX-040 Execution history; NX-041 Detailed action logs; NX-042 Execution duration tracking; NX-607 Global event timeline | [40, 41, 42, 607] historique conservé : mode, action, résultat, durée |
| US-52 | NX-038 Dry-run / simulation mode; NX-610 Explain why an action ran; NX-611 Explain why an action was skipped; NX-617 Preview all state changes before execution | [610, 611] expliquer pourquoi une action a tourné ou été ignorée ; [38, 617] simuler un mode et lister les changements prévus |
| US-53 | NX-084 Webhook received trigger; NX-217 Generic HTTP GET action; NX-218 Generic HTTP POST action; NX-221 Custom HTTP headers; NX-222 Custom JSON request body; NX-223 API key / bearer authentication; NX-225 Generic webhook trigger; NX-364 API secrets vault | [217, 218, 221, 222, 223] appels HTTP GET et POST avec en-têtes, corps et authentification ; [225, 84] webhook reçu = déclencheur (deux entrées du catalogue pour la même fonction) ; [364] secrets stockés à part et non journalisés |
| US-54 | NX-121 Run command; NX-122 Run PowerShell script; NX-228 Execute local shell command; NX-229 Execute local script; NX-363 Permission prompts; NX-367 Audit log | [228, 229, 121, 122] lancer une commande ou un script local (PowerShell pour la bêta Windows ; 123 et 124 non comptés) ; [363, 367] permission avant la première exécution et journal d'audit |
| US-55 | NX-1015 Generic capability schema; NX-1016 Provider adapter interface; NX-1017 Provider registry; NX-1019 Provider discovery and availability scan; NX-1021 Provider-specific action mapping; NX-1030 Detect installed game launchers; NX-1032 Generic launch-game capability; NX-1037 Provider-specific game URI resolver; NX-1038 Steam provider adapter; NX-1039 Epic Games Store provider adapter; NX-1040 GOG Galaxy provider adapter | [1015, 1016, 1017, 1021] schéma de capacité, interface d'adaptateur, registre, mapping capacité → fournisseur ; [1019, 1030, 1037] détecter les lanceurs installés et résoudre l'URI de chacun ; [1032, 1038, 1039, 1040] lancer un jeu via Steam, Epic ou GOG — Examiné et écarté : fournisseur préféré (1028) et repli (1027) : non requis par le critère |
| US-56 | NX-050 Global keyboard shortcut trigger; NX-473 Global command palette; NX-474 Search actions by name; NX-477 One-off action execution | [473, 474, 477] palette : chercher et exécuter une action ; [50] raccourci global qui l'ouvre depuis une autre application |
| US-57 | NX-127 Launch process; NX-523 Create a workspace; NX-524 Capture current environment as workspace; NX-525 Restore a workspace; NX-526 Workspace application set; NX-528 Workspace window-layout set; NX-543 Save window position and size; NX-544 Restore window position and size; NX-545 Move window to monitor; NX-552 Launch application into saved position; NX-553 Save multi-window layout; NX-554 Restore multi-window layout | [523, 524, 525, 526] capturer, restaurer un espace et son jeu d'applications ; [528, 543, 544, 545, 552, 553, 554] enregistrer et replacer les fenêtres sur leur écran ; [127] relancer les applications — Examiné et écarté : onglets du navigateur (527) : exclus du critère (« si le temps le permet ») |
| US-58 | NX-235 Extension manifest; NX-236 Extension permissions; NX-247 Extension documentation; NX-270 Moderation workflow; NX-272 Version compatibility checks; NX-362 Extension permission model | [235, 236, 247, 362] manifeste, permissions, documentation et modèle de permissions ; [270, 272] validation (politique, modération) et compatibilité de version |
| US-59 | NX-326 Work context; NX-392 Now active view; NX-399 Manual context switching; NX-403 Context-dependent rules | [392, 399] afficher le mode actif et le fixer à l'activation ; [403, 326] règles conditionnées au contexte « Travail » : la condition « mode actif » existe dans le schéma mais l'app passe une liste vide |
| US-60 | NX-056 Application closed trigger; NX-069 Specific Wi-Fi detected trigger; NX-094 Screen locked trigger; NX-095 Screen unlocked trigger | [56, 94, 95] arrêt d'une application, verrouillage et déverrouillage de la session ; [69] arrivée sur un Wi-Fi donné (remplace la géolocalisation, retirée) |
| US-61 | NX-692 Global execution queue; NX-694 Global concurrency limit; NX-700 Cancel queued execution; NX-705 Last-write-wins resolution policy; NX-707 Ask-user-on-conflict policy | [692, 694] file d'exécution globale et limite à un mode à la fois ; [700] annuler un mode en attente ; [705, 707] politique de conflit : le nouveau mode remplace, ou l'utilisateur choisit |
| US-62 | NX-388 Integration health indicators; NX-431 Integration uptime monitor; NX-1024 Provider health and connectivity status | [388, 431] indicateur de santé par intégration, vérifié périodiquement ; [1024] état de chaque fournisseur (déjà compté en US-02) |
| US-63 | NX-787 Full user-data export; NX-788 Account deletion workflow | [787] exporter toutes les données en un fichier ; [788] supprimer le compte et ses données en ligne |
| US-64 | NX-644 Opt-in anonymous product telemetry; NX-778 Disable telemetry globally | [644, 778] mesure d'usage anonyme avec consentement, désactivable globalement |
| US-65 | NX-343 Failed modes dashboard; NX-344 Most-used modes dashboard; NX-346 Average execution time; NX-347 Failed-action statistics | [343, 344, 346, 347] modes en échec, les plus utilisés, durée moyenne, statistiques d'échec |
| US-66 | NX-714 Mock integration provider; NX-715 Mock device provider; NX-716 Mock clock / time provider; NX-717 Assert expected action executed; NX-718 Assert expected state | [714, 715, 716] fournisseurs, appareils et horloge simulés ; [717, 718] vérifier l'action exécutée et l'état attendu |
| US-67 | NX-727 Crash recovery for running automations; NX-728 Persist execution state before critical actions | [727, 728] reprendre après un arrêt brutal ; état enregistré avant les actions critiques |
| US-68 | NX-499 Safe execution confirmations | [499] confirmation avant une action destructrice |

## Examiné et écarté pour les US citées au cadrage

- **US-10** : retries (019) : écartés, relèvent de US-49 ; journal détaillé (041) et mise en évidence des échecs (043) : relèvent de US-24, US-25 et US-51, pas du critère de US-10.
- **US-26** : persistance des règles et interface de création : aucune capacité du catalogue correspondante (hors catalogue) ; conditions horaires avancées (413) : non requises par le critère.
- **US-36** : score de risque : aucune capacité du catalogue ; recherche et catégories (252, 253) : présentes dans l'UI mais non requises par le critère.
- **US-37** : score de risque : aucune capacité du catalogue ; file de modération : 270.
- **US-38** : score de risque : aucune capacité du catalogue ; éditeur vérifié (271) et signalement (269) : non requis.
- **US-39** : trousseau (359) et révocation (361) : implémentés dans la PR #134 mais non requis par « 20 comptes créés, 0 échec ».
- **US-40** : historique des versions d'un mode (046, 047) : non requis par le critère.

## Hors catalogue et non vérifiable

- Aucune capacité du catalogue ne correspond à : ouverture d'un lien dans l'app par défaut (US-15), mises à jour automatiques (US-44), limites de l'offre gratuite (US-45), score de risque d'un mode (US-35, US-36, US-38), actions locales du téléphone (US-42), enregistrement local des modes et persistance des règles (US-06, US-26). Ces points restent « hors catalogue » : ce n'est pas du sous-comptage, le catalogue ne les décrit pas.
- Le recouvrement reste un jugement de l'auteur du plan sur des intitulés d'une ligne ; le catalogue ne détaille pas les critères d'acceptation de chaque capacité.
