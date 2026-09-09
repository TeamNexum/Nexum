//! # nexum-core
//!
//! The OS-agnostic heart of Nexum. It knows how to take a declarative
//! [`nexum_schema::Mode`] and run it, but it knows *nothing* about Windows,
//! Linux, Steam or Philips Hue — that lives in `nexum-adapters`.
//!
//! Pieces:
//!   - [`Adapter`]: the trait every integration implements.
//!   - [`ActionRegistry`]: maps `action_type` -> the adapter that handles it.
//!   - [`Engine`]: resolves + executes a mode's steps in order, honoring `on_error`.
//!   - [`EventBus`]: broadcasts real-time execution events to any subscriber
//!     (the desktop UI, logs, the cloud sync queue...).

pub mod adapter;
pub mod ai;
pub mod automation;
pub mod bus;
pub mod engine;
pub mod error;
pub mod marketplace;
pub mod registry;

pub use adapter::{ActionOutcome, Adapter, Capability, ExecContext};
pub use automation::{evaluate, EvalContext};
pub use bus::{EngineEvent, EventBus};
pub use engine::{Engine, ExecutionReport, StepReport};
pub use error::AdapterError;
pub use marketplace::{assess, RiskLevel, RiskReport};
pub use registry::ActionRegistry;
