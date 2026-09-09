use async_trait::async_trait;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability, ExecContext};
use nexum_schema::action_types::{ids, CloseAppParams, LaunchAppParams, OpenUrlParams};
use nexum_schema::ActionStep;

use crate::util::{deser, ok};

/// Launch/close processes and open URLs. Cross-platform.
pub struct SystemAdapter;

impl SystemAdapter {
    pub fn new() -> Self {
        Self
    }
}

impl Default for SystemAdapter {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Adapter for SystemAdapter {
    fn name(&self) -> &str {
        "system"
    }

    fn supported_actions(&self) -> Vec<String> {
        vec![
            ids::SYSTEM_LAUNCH_APP.into(),
            ids::SYSTEM_CLOSE_APP.into(),
            ids::SYSTEM_OPEN_URL.into(),
        ]
    }

    async fn is_available(&self) -> Capability {
        Capability::Available
    }

    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError> {
        match step.action_type.as_str() {
            ids::SYSTEM_LAUNCH_APP => deser::<LaunchAppParams>(step).map(|_| ()),
            ids::SYSTEM_CLOSE_APP => deser::<CloseAppParams>(step).map(|_| ()),
            ids::SYSTEM_OPEN_URL => deser::<OpenUrlParams>(step).map(|_| ()),
            other => Err(AdapterError::Unsupported(other.into())),
        }
    }

    async fn execute(
        &self,
        step: &ActionStep,
        ctx: &ExecContext,
    ) -> Result<ActionOutcome, AdapterError> {
        self.validate(step)?;

        match step.action_type.as_str() {
            ids::SYSTEM_LAUNCH_APP => {
                let p: LaunchAppParams = deser(step)?;
                if ctx.dry_run {
                    return Ok(ok(step, format!("dry-run: would launch {}", p.path)));
                }
                std::process::Command::new(&p.path)
                    .args(&p.args)
                    .spawn()
                    .map_err(|e| AdapterError::Execution(e.to_string()))?;
                Ok(ok(step, format!("launched {}", p.path)))
            }
            ids::SYSTEM_OPEN_URL => {
                let p: OpenUrlParams = deser(step)?;
                if ctx.dry_run {
                    return Ok(ok(step, format!("dry-run: would open {}", p.url)));
                }
                open::that(&p.url).map_err(|e| AdapterError::Execution(e.to_string()))?;
                Ok(ok(step, format!("opened {}", p.url)))
            }
            ids::SYSTEM_CLOSE_APP => {
                let p: CloseAppParams = deser(step)?;
                if ctx.dry_run {
                    return Ok(ok(step, format!("dry-run: would close {}", p.name)));
                }
                close_app(&p.name)?;
                Ok(ok(step, format!("closed {}", p.name)))
            }
            other => Err(AdapterError::Unsupported(other.into())),
        }
    }
}

fn close_app(name: &str) -> Result<(), AdapterError> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("taskkill")
            .args(["/IM", name, "/F"])
            .status()
            .map_err(|e| AdapterError::Execution(e.to_string()))?;
        Ok(())
    }
    #[cfg(not(target_os = "windows"))]
    {
        std::process::Command::new("pkill")
            .arg("-f")
            .arg(name)
            .status()
            .map_err(|e| AdapterError::Execution(e.to_string()))?;
        Ok(())
    }
}
