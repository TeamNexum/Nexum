//! # nexum-adapters
//!
//! Concrete [`nexum_core::Adapter`] implementations. This is the **only** crate
//! allowed to contain OS/vendor-specific code (behind `#[cfg(...)]`).
//!
//! Status of the V1 adapters:
//!   - [`SystemAdapter`] — launch/close apps, open URLs. Works on Win/Linux/macOS.
//!   - [`GamingAdapter`] — launch a Steam game via `steam://`. Works everywhere Steam does.
//!   - [`AudioAdapter`] — set volume. Works on Linux (PipeWire/Pulse); Windows impl is a
//!     documented TODO (Core Audio) — the old prototype's PowerShell version was a no-op.
//!   - [`DisplayAdapter`] — set brightness. TODO per-OS; slot exists and validates.
//!   - [`MockAdapter`] — succeeds for any action_type you give it; used so the desktop
//!     demo runs end-to-end while real integrations are built.

mod util;

pub mod audio;
pub mod display;
pub mod gaming;
pub mod mock;
pub mod system;

#[cfg(feature = "hue")]
pub mod hue;

pub use audio::AudioAdapter;
pub use display::DisplayAdapter;
pub use gaming::GamingAdapter;
pub use mock::MockAdapter;
pub use system::SystemAdapter;

#[cfg(feature = "hue")]
pub use hue::HueAdapter;
