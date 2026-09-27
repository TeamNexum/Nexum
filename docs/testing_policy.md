# Politique de tests

> Document demandé par le guide EIP « Structure your project » (G-EIP-600) : types de tests,
> couverture attendue et place des tests dans le déploiement. La stratégie QA complète (bloc 5 du
> RNCP) est dans [`rncp/QA_TEST_STRATEGY.md`](rncp/QA_TEST_STRATEGY.md).

## 1. Principes

- **Aucune fusion sans CI verte** : chaque pull request passe tous les jobs de
  [`deployment.md`](deployment.md) §3 sur Linux, Windows et macOS.
- **Un changement de comportement arrive avec son test**, dans le même commit.
- **Le cœur se teste sans matériel** : le moteur est testé avec des adaptateurs de test, pour que la
  CI n'ait besoin ni d'écran, ni d'enceintes, ni d'ampoules.
- **Le matériel réel se teste à part**, avec des tests marqués `#[ignore]` lancés en local.
- **Avertissements = erreurs** : `cargo clippy -D warnings`, `cargo fmt --check`, typecheck TypeScript strict.

## 2. Types de tests

| Type | Outil | Où | Exemples |
|---|---|---|---|
| **Unitaires** (Rust) | `cargo test` | modules `#[cfg(test)]` des crates | Validation des paramètres des adaptateurs, import / export de modes, score de risque, conversion du nom des fichiers |
| **Intégration** (Rust) | `cargo test` | `crates/nexum-core/tests/` | Le moteur exécute un mode de bout en bout avec des adaptateurs de test : ordre des étapes, étapes désactivées, politique en cas d'erreur (continuer ou arrêter) |
| **Matériel réel** | `cargo test -- --ignored` | tests `#[ignore]` des adaptateurs | Volume et luminosité sur macOS : réglés à leur niveau actuel pour ne rien changer visiblement |
| **Unitaires** (front) | Vitest + jsdom | `apps/*/src/**/*.test.ts(x)` | Composant d'import de profil, barre de fenêtre, client de synchronisation cloud |
| **Contrat front ↔ back** | ts-rs + CI | job « TS bindings are up to date » | Les types TypeScript générés doivent correspondre au Rust, sinon la CI échoue |
| **Bout en bout** (interface) | Playwright (Chromium) | `apps/desktop/e2e/*.spec.ts` | Navigation, bibliothèque de profils, favoris, recherche, fenêtre étroite |
| **Bout en bout** (app native) | WebDriver + tauri-driver | `apps/desktop/e2e/tauri-smoke.mjs` | Lance la vraie app, crée et active un mode, vérifie le fil d'activité |
| **Sécurité** | clippy, revue de code | CI + PR | À renforcer : audit des dépendances `cargo audit` / `npm audit` + Dependabot (#66) |
| **Performance** | — | — | À mettre en place : temps de démarrage et mémoire mesurés en CI (#71) |

## 3. Couverture

- **Aujourd'hui** : pas encore mesurée automatiquement.
- **Objectif** : mesurer la couverture en CI (`cargo llvm-cov` pour le Rust, `vitest --coverage`
  pour le front) et viser **70 % sur `nexum-core`** (le moteur et les règles métier), sans objectif
  chiffré pour les adaptateurs qui dépendent du matériel.
- Chaque bug corrigé ajoute un test qui l'aurait détecté.

## 4. Tests et déploiement

1. En local avant de pousser : `cargo test --workspace` et `npm test`.
2. Sur chaque PR : la CI complète sur les trois systèmes.
3. Sur `unstable` : tests manuels de l'équipe sur les vrais appareils (Windows, macOS, Hue).
4. Avant une version : smoke test natif + parcours de démo du Greenlight
   ([`DEMO_RUNBOOK.md`](DEMO_RUNBOOK.md)).
5. En bêta : retours utilisateurs mesurés selon le Beta Test Plan (critères de réussite chiffrés).
