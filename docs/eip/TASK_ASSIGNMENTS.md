# Nexum — Attribution des tâches par membre

> Répartition des issues GitHub **ouvertes** par phase, telle qu'elle est sur GitHub au
> **2026-09-25** (après le premier suivi pédagogique, voir
> `docs/eip/meetings/2026-09-25-suivi-pedagogique.md`). La source de vérité reste GitHub et le
> board https://github.com/orgs/TeamNexum/projects/1 : ce fichier est un instantané pour les
> suivis et le dossier RNCP (bloc 7).

## Équipe et rôles (décidés au suivi du 2026-09-25)

| Prénom | Nom complet | Compte GitHub | Rôle |
|---|---|---|---|
| Arnaud | Arnaud Jouan | `Arjouan` | Product owner / lead ; Front en soutien + compatibilité macOS / iOS ; comms (avec Rares) |
| Rares | Rares Dragomir | `RaresFZ` | **Front principal** ; comms (avec Arnaud) ; messagerie centralisée |
| Raphaël | Raphael Grissonnanche | `Raphie10` | Back ; installateur et mises à jour |
| Max | Max Epinat | `Max-Epinat` (= `MaxCrimson`) | Back ; architecture plugins ; Android |
| Enzo | ⚠️ nom à compléter | `MAD-TEK` | Business / KPI ; Database + CI/CD |

Les tickets sont souvent en binôme « responsable + aide » : on ajoute un co-assigné plutôt que
de retirer un ticket à quelqu'un.

## Charge actuelle

69 issues ouvertes, 27 fermées. Issues ouvertes par personne (un ticket en binôme compte pour les deux) :

| Personne | Issues ouvertes |
|---|---|
| Rares | 24 |
| Arnaud | 24 |
| Max | 13 |
| Enzo | 10 |
| Raph | 7 |
| ⚠️ personne | 14 |

## Phase 0 — Fondations

| # | Titre | Assigné |
|---|---|---|
| [#24](../../../issues/24) | business: interviews utilisateurs (15–20) + synthèse + décision pivot/consolidation | Enzo |
| [#25](../../../issues/25) | business: étude de marché + BMC avec les vrais chiffres | Enzo |
| [#26](../../../issues/26) | eip: choix de la track + groupe intra + objectifs figés (octobre 2026) | Enzo, Rares, Arnaud, Max |
| [#27](../../../issues/27) | comms: choix du logo + mini charte graphique | Rares, Arnaud |
| [#28](../../../issues/28) | comms: réserver les comptes réseaux sociaux (Instagram, LinkedIn, TikTok/X) | Rares, Arnaud |
| [#46](../../../issues/46) | eip: process des suivis pédagogiques et des sessions de mentorat | Arnaud |
| [#98](../../../issues/98) | chore(iot): acheter un kit Philips Hue + pont (budget EIP) | Rares, Max |

## Phase 1 — MVP + BTP

| # | Titre | Assigné |
|---|---|---|
| [#6](../../../issues/6) | feat: Unified inbox — aggregate messages & emails in one place | Rares |
| [#7](../../../issues/7) | feat(ui): hub centralisé de gestion des modes | Rares |
| [#8](../../../issues/8) | feat(ui): gestion granulaire par élément dans un mode | Rares |
| [#9](../../../issues/9) | feat(ui): panneau de contrôle par app façon Task Manager | Rares |
| [#10](../../../issues/10) | feat(core): notifications contextuelles selon le mode actif | Max |
| [#11](../../../issues/11) | feat(setup): onboarding au premier lancement — détection des intégrations + appairage Hue | Rares, Arnaud |
| [#13](../../../issues/13) | feat(ui): éditeur no-code pour créer un mode | Rares |
| [#14](../../../issues/14) | feat(cloud): auth + sync cloud minimale (axum/PostgreSQL) | Enzo |
| [#21](../../../issues/21) | chore(release): installeurs Windows/Linux signés | Raph |
| [#23](../../../issues/23) | feat(extensions): système d'extensions installables à la demande (« modèle DLC ») | Max, Raph |
| [#29](../../../issues/29) | business: KPIs + modèle financier avec données réelles | Enzo |
| [#30](../../../issues/30) | eip: BTP v1 — rendu le 07/02/2027 | Arnaud |
| [#31](../../../issues/31) | eip(rncp): documenter la stratégie de déploiement / CI-CD (bloc 6) et le plan QA (bloc 5) | Enzo |
| [#32](../../../issues/32) | legal: vérifier la disponibilité de la marque « Nexum » (INPI) | Arnaud |
| [#33](../../../issues/33) | feat(adapters): support macOS du volume et de la luminosité | Arnaud, Raph |
| [#34](../../../issues/34) | feat(mobile): socle app native Tauri 2 (iOS + Android) | Max, Arnaud |
| [#35](../../../issues/35) | feat(mobile): build iOS + installation en sideload | Arnaud |
| [#36](../../../issues/36) | feat(mobile): build Android + APK installable | Max |
| [#47](../../../issues/47) | feat(ui): rendre visibles les actions qui échouent ou sont indisponibles | Rares |
| [#48](../../../issues/48) | chore(deploy): déployer nexum-cloud (hébergement, nom de domaine, HTTPS) | Enzo |
| [#49](../../../issues/49) | ci: ajouter macOS à la CI | Enzo |
| [#50](../../../issues/50) | feat(desktop): mises à jour automatiques de l'app (Tauri updater) | Raph |
| [#52](../../../issues/52) | chore(iot): inventaire des objets connectés de l'équipe | ⚠️ personne |
| [#58](../../../issues/58) | question: garder ou abandonner la simulation dry_run ? | Max, Arnaud |
| [#61](../../../issues/61) | feat(desktop): lancer Nexum au démarrage de l'ordinateur | Max |
| [#66](../../../issues/66) | ci(security): mises à jour de sécurité des dépendances (Dependabot, cargo audit, npm audit) | Enzo |
| [#69](../../../issues/69) | feat(desktop): raccourcis clavier globaux par mode, réglables | Max |
| [#95](../../../issues/95) | feat(inbox): intégration Gmail dans la messagerie centralisée | Rares |
| [#96](../../../issues/96) | feat(inbox): intégration Outlook dans la messagerie centralisée | Rares |
| [#97](../../../issues/97) | feat(inbox): intégration Teams dans la messagerie centralisée | Rares |

## Phase 2 — Itérations + Greenlight blanc

| # | Titre | Assigné |
|---|---|---|
| [#15](../../../issues/15) | feat(core): moteur d'automatisation SI/ALORS (event-driven) | Raph |
| [#16](../../../issues/16) | feat(marketplace): partage + import de modes (v1) | Rares, Arnaud |
| [#17](../../../issues/17) | feat(marketplace): validation par allowlist + score de risque IA + modération | Rares, Arnaud |
| [#18](../../../issues/18) | feat(mobile): télécommande — activer un mode à distance + contexte géoloc | Rares, Arnaud |
| [#37](../../../issues/37) | business: recruter ≥ 20 bêta-testeurs + circuit de feedback | Enzo |
| [#38](../../../issues/38) | business: cycles d'itération 1 et 2 documentés | Rares, Arnaud |
| [#39](../../../issues/39) | comms: lancer les réseaux + calendrier éditorial | Rares, Arnaud |
| [#40](../../../issues/40) | comms: compléter le pitch deck (noms de l'équipe + chiffres réels) | Rares, Arnaud |
| [#45](../../../issues/45) | eip: BTP version finale — rendu le 04/04/2027 | Arnaud |
| [#51](../../../issues/51) | feat(security): stocker les secrets dans le trousseau de l'OS | Max |
| [#53](../../../issues/53) | feat(adapters): intégration Govee / Tuya (lumières et prises) | ⚠️ personne |
| [#54](../../../issues/54) | feat(adapters): intégration Elgato Key Light | ⚠️ personne |
| [#55](../../../issues/55) | feat(adapters): intégration Spotify | ⚠️ personne |
| [#56](../../../issues/56) | feat(adapters): intégration OBS (obs-websocket) | ⚠️ personne |
| [#57](../../../issues/57) | feat(adapters): intégration Discord | ⚠️ personne |
| [#62](../../../issues/62) | feat(beta): bouton « Envoyer un retour » dans l'app, logs joints | Rares, Raph |
| [#63](../../../issues/63) | feat(i18n): application en français et en anglais | ⚠️ personne |
| [#64](../../../issues/64) | feat(a11y): accessibilité — navigation au clavier et contrastes | ⚠️ personne |
| [#65](../../../issues/65) | feat(mobile): notifications sur le téléphone quand un mode se lance sur le PC | Max, Arnaud |
| [#67](../../../issues/67) | comms: landing page + inscription à la bêta | Rares, Arnaud |
| [#68](../../../issues/68) | feat(desktop): désinstallation propre | ⚠️ personne |
| [#70](../../../issues/70) | docs: tutoriel de démarrage pour les bêta-testeurs | ⚠️ personne |
| [#71](../../../issues/71) | perf: mesurer le temps de démarrage et la mémoire dans la CI | ⚠️ personne |
| [#94](../../../issues/94) | feat(voice): commande vocale pour lancer un mode | Rares, Arnaud, Raph |
| [#100](../../../issues/100) | feat(ui): thèmes de couleur au choix (sombre, clair, variantes) | ⚠️ personne |

## Phase 3 — Finalisation + Greenlight

| # | Titre | Assigné |
|---|---|---|
| [#19](../../../issues/19) | feat(ai): démonstrateur Mode-as-Code (NL → LLM → JSON DSL → validate() → activation) | Max |
| [#20](../../../issues/20) | chore(hardening): gestion d'erreurs et dégradation propre des adapters | Max |
| [#41](../../../issues/41) | legal: faire valider CGU, politique de confidentialité et mentions légales | ⚠️ personne |
| [#42](../../../issues/42) | legal: décider de la structure juridique (si commercialisation) | Rares, Arnaud |
| [#43](../../../issues/43) | eip: démo live — plan B, matériel, répétitions chronométrées | Arnaud |
| [#44](../../../issues/44) | eip: finaliser les dossiers Greenlight et RNCP | Arnaud |
| [#59](../../../issues/59) | feat(ai): assistant vocal « Jarvis » + orbe 3D animée | ⚠️ personne |

## À trancher en équipe

- Les issues sans responsable (⚠️ personne) : surtout les intégrations bonus (Govee/Tuya,
  Elgato, Spotify, OBS, Discord), les docs légales, l'i18n, l'accessibilité et le « Jarvis »
  complet (#59). À répartir en réunion selon la charge.
- Arnaud et Rares portent beaucoup de tickets (dont la comms) : à rééquilibrer si le Back
  avance plus vite.
