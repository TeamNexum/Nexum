use serde::de::DeserializeOwned;

use nexum_core::{ActionOutcome, AdapterError};
use nexum_schema::ActionStep;

/// Deserialize a step's `params` into a typed struct, mapping errors to
/// [`AdapterError::InvalidParams`].
pub(crate) fn deser<T: DeserializeOwned>(step: &ActionStep) -> Result<T, AdapterError> {
    serde_json::from_value(step.params.clone()).map_err(|e| AdapterError::InvalidParams {
        action_type: step.action_type.clone(),
        reason: e.to_string(),
    })
}

/// Build a successful [`ActionOutcome`] for a step.
pub(crate) fn ok(step: &ActionStep, message: impl Into<String>) -> ActionOutcome {
    ActionOutcome {
        action_type: step.action_type.clone(),
        success: true,
        message: message.into(),
    }
}
