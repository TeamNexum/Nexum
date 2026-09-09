## What & why
Describe the change and the motivation. Link the issue (`Closes #…`).

## Type
- [ ] feat
- [ ] fix
- [ ] docs
- [ ] refactor / chore

## Checklist
- [ ] `cargo fmt --all` clean
- [ ] `cargo clippy --workspace --all-targets -- -D warnings` clean
- [ ] `cargo test --workspace` passes (+ `--features sqlite` if store touched)
- [ ] `npm run build` passes (if frontend touched)
- [ ] Docs updated (README / ADR / getting-started) if behavior changed
- [ ] New adapter registered + editor param form added (if applicable)

## Screenshots / notes
