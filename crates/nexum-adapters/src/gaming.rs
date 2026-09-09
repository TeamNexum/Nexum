use async_trait::async_trait;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability, ExecContext};
use nexum_schema::action_types::{ids, LaunchEpicParams, LaunchGogParams, LaunchSteamParams};
use nexum_schema::ActionStep;

use crate::util::{deser, ok};

/// Launch games via platform URL schemes: Steam, Epic, GOG. Uses only the
/// official protocol handlers — no game-process injection — which keeps Nexum
/// clear of anti-cheat concerns.
pub struct GamingAdapter;

impl GamingAdapter {
    pub fn new() -> Self {
        Self
    }
}

impl Default for GamingAdapter {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Adapter for GamingAdapter {
    fn name(&self) -> &str {
        "gaming"
    }

    fn supported_actions(&self) -> Vec<String> {
        vec![
            ids::GAMING_LAUNCH_STEAM.into(),
            ids::GAMING_LAUNCH_EPIC.into(),
            ids::GAMING_LAUNCH_GOG.into(),
        ]
    }

    async fn is_available(&self) -> Capability {
        Capability::Available
    }

    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError> {
        match step.action_type.as_str() {
            ids::GAMING_LAUNCH_STEAM => deser::<LaunchSteamParams>(step).map(|_| ()),
            ids::GAMING_LAUNCH_EPIC => deser::<LaunchEpicParams>(step).map(|_| ()),
            ids::GAMING_LAUNCH_GOG => deser::<LaunchGogParams>(step).map(|_| ()),
            other => Err(AdapterError::Unsupported(other.into())),
        }
    }

    async fn execute(
        &self,
        step: &ActionStep,
        ctx: &ExecContext,
    ) -> Result<ActionOutcome, AdapterError> {
        self.validate(step)?;
        let uri = match step.action_type.as_str() {
            ids::GAMING_LAUNCH_STEAM => {
                let p: LaunchSteamParams = deser(step)?;
                format!("steam://run/{}", p.app_id)
            }
            ids::GAMING_LAUNCH_EPIC => {
                let p: LaunchEpicParams = deser(step)?;
                format!("com.epicgames.launcher://apps/{}?action=launch", p.name)
            }
            ids::GAMING_LAUNCH_GOG => {
                let p: LaunchGogParams = deser(step)?;
                format!("goggalaxy://openGameView/{}", p.game_id)
            }
            other => return Err(AdapterError::Unsupported(other.into())),
        };
        if ctx.dry_run {
            return Ok(ok(step, format!("dry-run: would open {uri}")));
        }
        open::that(&uri).map_err(|e| AdapterError::Execution(e.to_string()))?;
        Ok(ok(step, format!("launched {uri}")))
    }
}
