# Architecture — Nexum

Living technical overview. The full rationale is in
[`../../NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md`](../../NEXUM_PLAN_TECHNIQUE_ET_ROADMAP.md);
key decisions are recorded as [ADRs](adr/).

## Guiding idea

> Everything is a typed **Action**, executed by a platform **Adapter**,
> orchestrated by an event-driven **Engine**, from a declarative **Mode/Action
> JSON DSL** shared by every component. A mode is *data, never code*.

## Component view

```mermaid
flowchart TB
    subgraph Client["Nexum Desktop (Tauri 2)"]
        UI["React UI<br/>Dashboard · Editor · Automations · Marketplace"]
        Bridge["Tauri bridge (commands + events)"]
        subgraph Core["nexum-core (Rust, OS-agnostic)"]
            Engine["Engine"]
            Auto["Automation evaluator"]
            Market["Marketplace risk"]
            AI["AI Mode-as-Code"]
            Bus["Event Bus"]
            Reg["Action Registry"]
        end
        subgraph Adapters["nexum-adapters (#cfg per OS)"]
            A1["System"]:::a
            A2["Audio"]:::a
            A3["Gaming"]:::a
            A4["Display"]:::a
            A5["Hue (feature)"]:::a
            A6["Mock"]:::a
        end
        Store["nexum-store<br/>InMemory · SQLite (feature)"]
    end
    subgraph Cloud["nexum-cloud (axum + PostgreSQL)"]
        API["REST API"]
        CMarket["Marketplace + moderation"]
        CAI["AI service (Claude API)"]
    end
    Mobile["Nexum Mobile (Phase 2)"]

    UI <--> Bridge <--> Engine
    Engine --> Reg --> Adapters
    Engine <--> Bus
    Auto <--> Bus
    Engine <--> Store
    Store <-->|sync| API
    API --> CMarket
    API --> CAI
    Mobile <--> API

    classDef a fill:#1e2530,stroke:#2a323f,color:#e7eaf0;
```

## Crate dependency graph

```mermaid
flowchart LR
    schema[nexum-schema]
    core[nexum-core]
    adapters[nexum-adapters]
    store[nexum-store]
    cloud[nexum-cloud]
    desktop[apps/desktop]

    core --> schema
    adapters --> core
    adapters --> schema
    store --> schema
    cloud --> core
    cloud --> schema
    desktop --> core
    desktop --> adapters
    desktop --> store
    desktop --> schema
```

## Mode activation (runtime)

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant E as Engine
    participant R as Registry
    participant A as Adapter
    participant B as Event Bus
    U->>E: activate(mode)
    B-->>U: mode_started
    loop each enabled step (in order)
        E->>R: resolve(action_type)
        R->>A: execute(step)
        A-->>E: outcome / error
        B-->>U: step_finished (live)
        Note over E: honor on_error (continue / abort)
    end
    B-->>U: mode_finished
    E-->>U: ExecutionReport
```

## Data model (DSL)

```mermaid
erDiagram
    MODE ||--|{ ACTION_STEP : contains
    AUTOMATION_RULE }o--|| MODE : activates
    AUTOMATION_RULE ||--|| TRIGGER : has
    AUTOMATION_RULE ||--o{ CONDITION : guards

    MODE { uuid id; string name; string category; }
    ACTION_STEP { u32 order; string action_type; json params; bool enabled; enum on_error; }
    AUTOMATION_RULE { uuid id; string name; bool enabled; uuid target_mode_id; }
    TRIGGER { string kind; json data; }
    CONDITION { string kind; json data; }
```

## Why this shape

| Concern | How the architecture handles it |
|---|---|
| No-code | The editor manipulates the DSL; no scripting. |
| Cross-platform | Only adapters carry OS code; the mode never knows its OS. |
| Extensible | New integration = new adapter + registry entry; the engine is untouched. |
| Safe Marketplace | Shared modes are declarative data validated against an allowlist. |
| AI Mode-as-Code | The LLM emits the same DSL, then it's simulated + capability-checked. |
| Testable / QA | `nexum-core` is pure and OS-free → fast CI (RNCP Block 5). |
