use thiserror::Error;

/// Errors an [`crate::Adapter`] can raise while validating or executing.
#[derive(Debug, Error)]
pub enum AdapterError {
    #[error("invalid params for {action_type}: {reason}")]
    InvalidParams { action_type: String, reason: String },

    #[error("action not supported by this adapter: {0}")]
    Unsupported(String),

    #[error("underlying api/hardware unavailable: {0}")]
    Unavailable(String),

    #[error("execution failed: {0}")]
    Execution(String),
}
