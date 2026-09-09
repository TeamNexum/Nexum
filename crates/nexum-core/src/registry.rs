use std::collections::HashMap;
use std::sync::Arc;

use crate::adapter::Adapter;

/// Maps each `action_type` to the adapter that handles it.
///
/// Cheap to clone (adapters are behind `Arc`), so it can be shared across
/// tasks and the Tauri command layer.
#[derive(Default, Clone)]
pub struct ActionRegistry {
    handlers: HashMap<String, Arc<dyn Adapter>>,
}

impl ActionRegistry {
    pub fn new() -> Self {
        Self::default()
    }

    /// Register an adapter for every `action_type` it declares support for.
    /// Later registrations override earlier ones for the same action_type.
    pub fn register(&mut self, adapter: Arc<dyn Adapter>) {
        for action_type in adapter.supported_actions() {
            self.handlers.insert(action_type, adapter.clone());
        }
    }

    /// Find the adapter responsible for an `action_type`, if any.
    pub fn resolve(&self, action_type: &str) -> Option<Arc<dyn Adapter>> {
        self.handlers.get(action_type).cloned()
    }

    /// All known action_types (the Marketplace allowlist derives from this).
    pub fn known_action_types(&self) -> Vec<String> {
        self.handlers.keys().cloned().collect()
    }
}
