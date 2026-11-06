# Reclassement proposé des capacités « BTP candidate » sans US

**Proposition à valider par l'équipe. Le catalogue n'est pas modifié.** Elle part des capacités « BTP candidate » qui n'ont aucune US après réaudit et nouvelles US (voir `annexe-capacites-sans-us.md`). Un reclassement en Stretch ou Roadmap n'enlève rien au catalogue : il dit seulement que la capacité ne fait pas partie du périmètre engagé en J1 à J4. Raisons : hors scénario Travail, dépend d'un tiers, hors délai.

| Domaine | Capacités | Proposition | Raison |
|---|---|---|---|
| Accessibility & localization | NX-982, 985–994 (11) | Stretch | hors scénario Travail ; l'accessibilité de base est couverte par US-46, langues et sens d'écriture ne sont pas exigés avant J4 |
| Advanced rules & state reconciliation | NX-563–573, 575–586 (23) | Stretch | moteur de règles avancé hors scénario Travail ; suppose d'abord le moteur de base (US-26, US-61) |
| Background automation rules | NX-411–413, 415–420, 422–424 (12) | Stretch | conditions au-delà de l'horaire et des jours (US-26) : hors délai |
| Command palette & quick actions | NX-475–476, 478–482 (7) | Stretch | confort au-delà de US-56 |
| Context & presence engine | NX-327 (1) | Stretch | contexte réunion : utile au plan B (famille Réunions réduite) |
| Context & presence engine | NX-325, 328–331 (5) | Roadmap | contextes jeu, streaming, veille et divertissement : hors scénario Travail |
| Contexts & desired state | NX-400, 404–408 (6) | Stretch | dérive et correction d'état : dépendent de fournisseurs d'état absents |
| Contexts & desired state | NX-401–402 (2) | Roadmap | détection automatique du contexte (XL) et score de confiance : dépendent de fournisseurs d'état absents |
| Control Center & dashboards | NX-381–387, 389–390, 393–398 (15) | Stretch | au-delà du tableau de bord minimal de US-65 |
| Core automation & mode engine | NX-4–5, 8–14, 23–36, 39, 44–48 (29) | Stretch | organisation, pause, variables, boucles : hors scénario Travail ; quelques capacités restent candidates (voir exceptions) |
| Core automation & mode engine | NX-16, 18 (2) | Stretch (à réexaminer) | exécution parallèle et délai entre actions : utiles pour lancer des applications, mais aucun « Terminé quand » ne l'exige ; à réexaminer si les entretiens font ressortir ce besoin |
| Dashboard & monitoring | NX-341–342, 345, 348–356 (12) | Stretch | US-65 couvre le minimum ; surveillance CPU, GPU, mémoire hors scénario |
| Data transformation & expression engine | NX-645–670 (26) | Stretch | suppose un langage d'expression ; hors scénario Travail |
| Generic API & developer integrations | NX-219–220, 226–227 (4) | Stretch | au-delà de GET et POST (US-53) : PUT, DELETE, WebSocket, MQTT |
| Monitoring & health | NX-425–430, 432–436 (11) | Stretch | surveillance système et alertes hors scénario ; US-62 couvre la santé des intégrations |
| Operating system & desktop actions | NX-104–120, 123–125, 128–131 (24) | Stretch | actions système avancées (alimentation, services, réseau, VPN, capture) hors scénario Travail ; l'audio (098 à 102) reste candidate |
| Operating system & desktop actions | NX-98–102 (5) | Stretch (à réexaminer) | volume par application, coupure du son, sortie et entrée audio : proches du scénario concentration, mais aucun « Terminé quand » ne l'exige ; à réexaminer si les entretiens font ressortir ce besoin |
| Plugin & extension SDK | NX-230–234, 237–246, 248–249 (17) | Stretch | US-05 est Won't ; seul le format minimal est engagé (US-58) |
| Privacy, local-first & trust | NX-772–774, 780–783, 785–786, 789–791 (12) | Stretch | au-delà de US-63 et US-64 : verrouillage, historique des permissions, confiance des extensions |
| Privacy, local-first & trust | NX-776–777, 779, 784 (4) | Roadmap | chiffrement de bout en bout, IA locale (dépendances lourdes) et déverrouillage biométrique du mobile (mobile hors J1) |
| Queue, concurrency & conflict arbitration | NX-693, 695–699, 701–704, 706, 708–711 (15) | Stretch | US-61 couvre un seul mode à la fois ; le reste suppose plusieurs modes concurrents |
| Reliability & self-healing | NX-494–497, 500–502 (7) | Stretch | repli, circuit breaker, centre de récupération : au-delà de US-49, US-50 et US-67 |
| Security & trust | NX-358, 361, 365, 369–371 (6) | Stretch | double authentification, codes de récupération et révocation d'appareils : hors délai pour une bêta sans paiement |
| Testing & reliability engineering | NX-712–713, 719–726, 729–731 (13) | Stretch | US-66 couvre le minimum ; couverture, bac à sable, injection de pannes hors délai |
| Timeline, explainability & simulation | NX-608–609, 612–616, 618–622, 626 (13) | Stretch | au-delà de US-51 et US-52 : graphe, relecture, causalité |
| Triggers & event detection | NX-54, 58–68, 70–83, 85, 87–90, 92 (32) | Stretch | déclencheurs matériels, fichiers, réseau, ressources : hors scénario Travail ; PC démarré (091), connexion (093) et inactivité (096) restent candidats |
| Triggers & event detection | NX-91, 93, 96 (3) | Stretch (à réexaminer) | PC démarré, connexion, inactivité : proches de « début et fin de journée », mais aucun « Terminé quand » ne l'exige ; à réexaminer si les entretiens font ressortir ce besoin |
| Workspaces & environment restoration | NX-527, 529–542 (15) | Stretch | onglets du navigateur (527), domotique, partage : hors délai ; dépendent d'une extension de navigateur ou d'un tiers |
| Provider abstraction framework | NX-1018, 1020, 1022, 1025, 1027–1028 (6) | Stretch | au-delà du minimum de US-55 (repli, quotas, négociation) |

**Total : 338 capacités sans US** : 327 proposées en Stretch (dont 10 à réexaminer si les entretiens font ressortir ce besoin), 11 en Roadmap, 0 laissée à arbitrer.
