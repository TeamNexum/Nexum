# Pushing Nexum to GitHub

The `nexum/` folder is the repository root (it has `.gitignore`, `LICENSE`,
`README.md`, `.github/` workflows & templates). The old proof-of-concept and the
EIP planning binaries (PDF/DOCX/PNG) live **outside** this folder and are not
part of the repo.

## First push

```bash
cd nexum
git init
git add .
git commit -m "chore: initial commit — Nexum monorepo scaffold"
git branch -M main

# Create the repo on GitHub first (empty, no README), then:
git remote add origin https://github.com/<org-or-user>/nexum.git
git push -u origin main
```

> Tip: an Epitech EIP repo is often provided/linked from the intranet
> (eip.epitech.eu/project/1035). Use that remote if required, otherwise a team
> GitHub org is fine.

## Recommended repo settings

- **Enable GitHub Actions** — the CI in `.github/workflows/ci.yml` runs on push/PR.
- **Branch protection on `main`**: require PR + at least 1 review + green CI before merge.
- **GitHub Projects** (board) with columns To do / In progress / Review / Done — link issues to the roadmap (`docs/eip/ROADMAP_PRODUIT.md`).
- **Labels**: `bug`, `enhancement`, `adapter`, `docs`, `good first issue`, `blocked`.
- Add topics: `tauri`, `rust`, `react`, `automation`, `iot`, `gaming`.

## What gets committed vs ignored

Committed: all source, docs, configs, CI, icons.
Ignored (see `.gitignore`): `target/`, `node_modules/`, `dist/`, `src-tauri/gen/`, `.env`.

## Suggested first issues (from the roadmap)

- `feat(adapters): Windows volume via Core Audio` (fixes the known no-op).
- `chore(schema): wire ts-rs to auto-generate packages/schema-ts`.
- `feat(store): use SqliteStore in the desktop app`.
- `feat(adapters): real Philips Hue scene lookup by name`.
- `test(e2e): Tauri end-to-end smoke test`.
