//! End-to-end tests for the engine using a local test adapter. These prove the
//! orchestration contract without any OS/hardware dependency — exactly what
//! makes the core CI-friendly (RNCP Block 5: quality assurance).

use std::sync::Arc;

use async_trait::async_trait;
use nexum_core::{
    ActionOutcome, ActionRegistry, Adapter, AdapterError, Capability, Engine, EventBus, StepStatus,
};
use nexum_schema::{ActionStep, Category, Mode, OnError};
use uuid::Uuid;

/// Test adapter: `test.ok` succeeds, `test.fail` reports a soft failure,
/// `test.boom` returns a hard error, `test.gone` finds its device missing.
struct TestAdapter;

#[async_trait]
impl Adapter for TestAdapter {
    fn supported_actions(&self) -> Vec<String> {
        vec![
            "test.ok".into(),
            "test.fail".into(),
            "test.boom".into(),
            "test.gone".into(),
        ]
    }
    async fn is_available(&self) -> Capability {
        Capability::Available
    }
    fn validate(&self, _step: &ActionStep) -> Result<(), AdapterError> {
        Ok(())
    }
    async fn execute(&self, step: &ActionStep) -> Result<ActionOutcome, AdapterError> {
        match step.action_type.as_str() {
            "test.boom" => Err(AdapterError::Execution("boom".into())),
            "test.gone" => Err(AdapterError::Unavailable("no device".into())),
            other => Ok(ActionOutcome {
                action_type: other.to_string(),
                success: other != "test.fail",
                message: other.to_string(),
            }),
        }
    }
}

/// An integration that is switched off on this machine.
struct OffAdapter;

#[async_trait]
impl Adapter for OffAdapter {
    fn supported_actions(&self) -> Vec<String> {
        vec!["off.lights".into()]
    }
    async fn is_available(&self) -> Capability {
        Capability::Unavailable {
            reason: "disabled by the user".into(),
        }
    }
    fn validate(&self, _step: &ActionStep) -> Result<(), AdapterError> {
        Ok(())
    }
    async fn execute(&self, _step: &ActionStep) -> Result<ActionOutcome, AdapterError> {
        unreachable!("the engine never runs an unavailable adapter")
    }
}

fn engine() -> Engine {
    let mut registry = ActionRegistry::new();
    registry.register(Arc::new(TestAdapter));
    registry.register(Arc::new(OffAdapter));
    Engine::new(registry, EventBus::new())
}

fn step(order: u32, ty: &str, on_error: OnError) -> ActionStep {
    ActionStep {
        order,
        action_type: ty.into(),
        params: serde_json::Value::Null,
        enabled: true,
        on_error,
    }
}

fn mode(steps: Vec<ActionStep>) -> Mode {
    Mode {
        id: Uuid::nil(),
        name: "test".into(),
        description: None,
        category: Category::Custom,
        voice_keywords: vec![],
        steps,
    }
}

#[tokio::test]
async fn runs_all_steps_in_order() {
    let report = engine()
        .activate(&mode(vec![
            step(2, "test.ok", OnError::Continue),
            step(1, "test.ok", OnError::Continue),
        ]))
        .await;

    assert!(report.success);
    assert_eq!(report.steps.len(), 2);
    // executed in sorted order
    assert_eq!(report.steps[0].order, 1);
    assert_eq!(report.steps[1].order, 2);
}

#[tokio::test]
async fn continue_policy_keeps_going_after_failure() {
    let report = engine()
        .activate(&mode(vec![
            step(1, "test.fail", OnError::Continue),
            step(2, "test.ok", OnError::Continue),
        ]))
        .await;

    assert!(!report.success); // overall failed
    assert_eq!(report.steps.len(), 2); // but both ran
    assert!(!report.steps[0].success);
    assert!(report.steps[1].success);
}

#[tokio::test]
async fn abort_policy_stops_after_failure() {
    let report = engine()
        .activate(&mode(vec![
            step(1, "test.ok", OnError::Continue),
            step(2, "test.boom", OnError::Abort),
            step(3, "test.ok", OnError::Continue),
        ]))
        .await;

    assert!(!report.success);
    assert_eq!(report.steps.len(), 2); // step 3 never reached
}

#[tokio::test]
async fn disabled_steps_are_skipped() {
    let mut s = step(1, "test.ok", OnError::Continue);
    s.enabled = false;
    let report = engine().activate(&mode(vec![s])).await;
    assert!(report.success);
    assert_eq!(report.steps.len(), 0);
}

#[tokio::test]
async fn unknown_action_type_is_a_failed_step() {
    let report = engine()
        .activate(&mode(vec![step(1, "does.not.exist", OnError::Continue)]))
        .await;
    assert!(!report.success);
    assert_eq!(report.steps.len(), 1);
    assert!(report.steps[0].message.contains("no adapter"));
}

struct UnavailableAdapter;

#[async_trait]
impl Adapter for UnavailableAdapter {
    fn supported_actions(&self) -> Vec<String> {
        vec!["test.unavailable".into()]
    }

    async fn is_available(&self) -> Capability {
        Capability::Unavailable {
            reason: "device disconnected".into(),
        }
    }

    fn validate(&self, _step: &ActionStep) -> Result<(), AdapterError> {
        Ok(())
    }

    async fn execute(&self, _step: &ActionStep) -> Result<ActionOutcome, AdapterError> {
        panic!("unavailable adapter must not execute")
    }
}

#[tokio::test]
async fn unavailable_adapter_reports_failed_step_without_executing() {
    let mut registry = ActionRegistry::new();
    registry.register(Arc::new(UnavailableAdapter));
    let engine = Engine::new(registry, EventBus::new());
    let report = engine
        .activate(&mode(vec![step(1, "test.unavailable", OnError::Continue)]))
        .await;

    assert!(!report.success);
    assert_eq!(report.steps.len(), 1);
    assert_eq!(
        report.steps[0].message,
        "adapter unavailable: device disconnected"
    );
}

#[tokio::test]
async fn tells_failed_steps_from_unavailable_ones() {
    let report = engine()
        .activate(&mode(vec![
            step(1, "test.ok", OnError::Continue),
            step(2, "test.fail", OnError::Continue),
            step(3, "test.boom", OnError::Continue),
            step(4, "test.gone", OnError::Continue),
            step(5, "off.lights", OnError::Continue),
            step(6, "nobody.handles_this", OnError::Continue),
        ]))
        .await;

    let statuses: Vec<StepStatus> = report.steps.iter().map(|s| s.status).collect();
    assert_eq!(
        statuses,
        vec![
            StepStatus::Ok,
            StepStatus::Failed,
            StepStatus::Failed,
            StepStatus::Unavailable,
            StepStatus::Unavailable,
            StepStatus::Unavailable,
        ]
    );
    assert!(report
        .steps
        .iter()
        .all(|s| s.success == (s.status == StepStatus::Ok)));
    assert!(!report.success);
}

#[tokio::test]
async fn reports_which_actions_are_available() {
    let availability = engine().availability().await;
    let off = availability
        .iter()
        .find(|a| a.action_type == "off.lights")
        .unwrap();
    assert!(!off.available);
    assert_eq!(off.reason.as_deref(), Some("disabled by the user"));
    let ok = availability
        .iter()
        .find(|a| a.action_type == "test.ok")
        .unwrap();
    assert!(ok.available && ok.reason.is_none());
}
