# Déploiement de nexum-cloud

L'API cloud tourne en **Docker Compose**:

| Service      | Image                               | Rôle                                                                                                                            |
| ------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `cloud`    | `services/nexum-cloud/Dockerfile` | L'API (axum), port 8787, **non exposée** directement                                                                      |
| `postgres` | `postgres:17-alpine`              | Base de données (volume `pgdata`)                                                                                            |
| `caddy`    | `caddy:2-alpine`                  | HTTPS automatique (Let's Encrypt) sur ports 80/443, relaie vers `cloud` (Fonctionne comme un reverse proxy un peu comme nginx) |

## Tester en local

```bash
cd deploy
cp .env.example .env
# Dans .env : NEXUM_DOMAIN=localhost, plus un NEXUM_JWT_SECRET et un POSTGRES_PASSWORD
docker compose up -d --build
curl -k https://localhost/health
```

`-k` car Caddy utilise un certificat local pour `localhost`. Pour tout arrêter : `docker compose down`.

## Sur le serveur

1. Installer Docker (`curl -fsSL https://get.docker.com | sh`).
2. Faire pointer le domaine (ex. `api.<domaine>`) vers l'IP du serveur (enregistrement A/AAAA),
   et ouvrir les ports 80 et 443.
3. Copier `deploy/` sur le serveur, créer `deploy/.env` à partir de `.env.example` avec les vraies
   valeurs (`openssl rand -base64 48` pour les secrets).
4. `docker compose up -d --build`

Caddy obtient le certificat HTTPS au premier démarrage, une fois le domaine résolu.

## Mettre à jour

```bash
git pull && docker compose up -d --build cloud
```

## Variables

Voir [`.env.example`](.env.example). `NEXUM_JWT_SECRET`, `POSTGRES_PASSWORD` et `NEXUM_DOMAIN` sont
obligatoires : Compose refuse de démarrer sans elles.
