-- Accounts, sessions, synced modes and the remote-command queue.

CREATE TABLE users (
    id          UUID PRIMARY KEY,
    -- Stored lowercased by the API, so UNIQUE is case-insensitive in practice.
    email       TEXT NOT NULL UNIQUE,
    -- Argon2id PHC string (algorithm, parameters and salt included).
    pass_hash   TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rotating refresh tokens. Only a hash is stored, so a database leak gives no
-- usable session. A used token stays until it expires: seeing it again means it
-- was stolen, and revokes its whole family (one sign-in on one device).
CREATE TABLE refresh_tokens (
    token_hash  TEXT PRIMARY KEY,
    family_id   UUID NOT NULL,
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX refresh_tokens_family_id_idx ON refresh_tokens (family_id);
CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens (user_id);

-- Every write to a mode takes a new revision, which clients send back to prove
-- they saw the latest version. From a sequence rather than a per-row counter, so
-- a mode deleted and re-created never reuses a revision.
CREATE SEQUENCE mode_revisions;

CREATE TABLE modes (
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    mode_id     UUID NOT NULL,
    position    INT NOT NULL,
    data        JSONB NOT NULL,
    revision    BIGINT NOT NULL DEFAULT nextval('mode_revisions'),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, mode_id)
);

CREATE TABLE commands (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    payload     JSONB NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX commands_user_id_idx ON commands (user_id, id);
