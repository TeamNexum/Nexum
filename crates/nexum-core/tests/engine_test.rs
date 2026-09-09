//! End-to-end tests for the engine using a local test adapter. These prove the
//! orchestration contract without any OS/hardware dependency — exactly what
//! makes the core CI-friendly (RNCP Block 5: quality assurance).

use std::sync::Arc;

use async_trait::async_trait;
use nexum_core::{
    ActionOutcome, ActionRegistry, Adapter, AdapterError, Capability, Engine, EventBus, ExecContext,
};
use nexum_schema::{ActionStep, Category, Mode, OnError};
use uuid::Uuid;

/// Test adapter: `test.ok` succeeds, `test.fail` reports a soft failure,
/// `test.boom` returns a hard error.
struct TestAdapter;

#[async_trait]
impl Adapter for TestAdapter {
    fn name(&self) -> &str {
        "test"
    }
    fn supported_actions(&self) -> Vec<String> {
        vec!["test.ok".into(), "test.fail".into(), "test.boom".into()]
    }
    async fn is_available(&self) -> Capability {
        Capability::Available
    }
    fn validate(&self, _step: &ActionStep) -> Result<(), AdapterError> {
        Ok(())
    }
    async fn execute(
        &self,
        step: &ActionStep,
        _ctx: &ExecContext,
    ) -> Result<ActionOutcome, AdapterError> {
        match step.action_type.as_str() {
            "test.boom" => Err(AdapterError::Execution("boom".into())),
            other => Ok(ActionOutcome {
                action_type: other.to_string(),
                success: other != "test.fail",
                message: other.to_string(),
            }),
        }
    }
}

fn engine() -> Engine {
    let mut registry = ActionRegistry::new();
    registry.register(Arc::new(TestAdapter));
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
        steps,
    }
}

#[tokio::test]
async fn runs_all_steps_in_order() {
    let report = engine()
        .activate(
            &mode(vec![
                step(2, "test.ok", OnError::Continue),
                step(1, "test.ok", OnError::Continue),
            ]),
            &ExecContext::default(),
        )
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
        .activate(
            &mode(vec![
                step(1, "test.fail", OnError::Continue),
                step(2, "test.ok", OnError::Continue),
            ]),
            &ExecContext::default(),
        )
        .await;

    assert!(!report.success); // overall failed
    assert_eq!(report.steps.len(), 2); // but both ran
    assert!(!report.steps[0].success);
    assert!(report.steps[1].success);
}

#[tokio::test]
async fn abort_policy_stops_after_failure() {
    let report = engine()
        .activate(
            &mode(vec![
                step(1, "test.ok", OnError::Continue),
                step(2, "test.boom", OnError::Abort),
                step(3, "test.ok", OnError::Continue),
            ]),
            &ExecContext::default(),
        )
        .await;

    assert!(!report.success);
    assert_eq!(report.steps.len(), 2); // step 3 never reached
}

#[tokio::test]
async fn disabled_steps_are_skipped() {
    let mut s = step(1, "test.ok", OnError::Continue);
    s.enabled = false;
    let report = engine().activate(&mode(vec![s]), &ExecContext::default()).await;
    assert!(report.success);
    assert_eq!(report.steps.len(), 0);
}

#[tokio::test]
async fn unknown_action_type_is_a_failed_step() {
    let report = engine()
        .activate(
            &mode(vec![step(1, "does.not.exist", OnError::Continue)]),
            &ExecContext::default(),
        )
        .await;
    assert!(!report.success);
    assert_eq!(report.steps.len(), 1);
    assert!(report.steps[0].message.contains("no adapter"));
}
