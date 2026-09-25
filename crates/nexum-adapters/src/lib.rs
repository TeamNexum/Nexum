//! # nexum-adapters
//!
//! Concrete [`nexum_core::Adapter`] implementations. This is the **only** crate
//! allowed to contain OS/vendor-specific code (behind `#[cfg(...)]`).
//!
//! Status of the V1 adapters:
//!   - [`SystemAdapter`] — launch/close apps, open URLs. Works on Win/Linux/macOS.
//!   - [`GamingAdapter`] — launch a Steam game via `steam://`. Works everywhere Steam does.
//!   - [`AudioAdapter`] — set volume through Linux audio tools or Windows Core Audio.
//!   - [`DisplayAdapter`] — set brightness through the OS display API.
//!
//! [`Switchable`] wraps any adapter so the user can turn its integration off.

mod util;

pub mod audio;
pub mod display;
pub mod gaming;
pub mod switchable;
pub mod system;

#[cfg(feature = "hue")]
pub mod hue;

pub use audio::AudioAdapter;
pub use display::DisplayAdapter;
pub use gaming::GamingAdapter;
pub use switchable::Switchable;
pub use system::SystemAdapter;

#[cfg(feature = "hue")]
pub use hue::{HueAdapter, HueConfig, SharedHueConfig};
