# Nexum Cloud API image. Build from the repo root (the service needs the
# workspace crates):
#
#   docker build -f services/nexum-cloud/Dockerfile -t nexum-cloud .
#
# Optional Cargo features, e.g. the Claude-backed Mode-as-Code:
#
#   docker build --build-arg FEATURES=claude ...

# ---- build ------------------------------------------------------------------
FROM rust:1-slim-bookworm AS build
WORKDIR /app

ARG FEATURES=""

COPY Cargo.toml Cargo.lock ./
COPY crates crates
COPY services services

# Cache mounts keep the registry and target dir between builds, so only the
# changed crates recompile. The binary is copied out because the target dir
# is not part of the image layer.
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cargo build --release --locked -p nexum-cloud --features "$FEATURES" \
    && cp target/release/nexum-cloud /usr/local/bin/nexum-cloud

# ---- runtime ----------------------------------------------------------------
FROM debian:bookworm-slim

# CA certificates for outgoing HTTPS (Discord webhook, Claude API).
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --system --uid 10001 --no-create-home nexum
USER nexum

COPY --from=build /usr/local/bin/nexum-cloud /usr/local/bin/nexum-cloud

# Inside a container the API must listen on all interfaces; only the reverse
# proxy publishes a port to the outside.
ENV NEXUM_CLOUD_ADDR=0.0.0.0:8787
EXPOSE 8787

CMD ["nexum-cloud"]
