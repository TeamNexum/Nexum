-- Accounts, synced modes and the remote-command queue.

CREATE TABLE users (
    id          UUID PRIMARY KEY,
    -- Stored lowercased by the API, so UNIQUE is case-insensitive in practice.
    email       TEXT NOT NULL UNIQUE,
    -- Argon2id PHC string (algorithm, parameters and salt included).
    pass_hash   TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE modes (
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    mode_id     UUID NOT NULL,
    position    INT NOT NULL,
    data        JSONB NOT NULL,
    -- Groundwork for per-mode conflict handling; sync is last-write-wins for now.
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
