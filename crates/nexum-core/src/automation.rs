//! Automation engine: given a [`SystemEvent`] and the user's rules, decide which
//! modes should activate. Pure, synchronous, fully testable — no OS access.

use uuid::Uuid;

use nexum_schema::automation::{AutomationRule, Condition, SystemEvent, Trigger};

/// The "now" context conditions are evaluated against.
#[derive(Debug, Default, Clone)]
pub struct EvalContext {
    pub hour: u8,
    pub minute: u8,
    /// 0 = Monday .. 6 = Sunday.
    pub weekday: u8,
    /// Modes currently active (for `ModeActive` conditions and conflict rules).
    pub active_modes: Vec<Uuid>,
}

/// Return the target mode ids of every enabled rule whose trigger matches the
/// event and whose conditions all hold.
pub fn evaluate(event: &SystemEvent, rules: &[AutomationRule], ctx: &EvalContext) -> Vec<Uuid> {
    rules
        .iter()
        .filter(|r| r.enabled)
        .filter(|r| trigger_matches(&r.trigger, event))
        .filter(|r| r.conditions.iter().all(|c| condition_holds(c, ctx)))
        .map(|r| r.target_mode_id)
        .collect()
}

fn trigger_matches(trigger: &Trigger, event: &SystemEvent) -> bool {
    match (trigger, event) {
        (Trigger::TimeOfDay { hour, minute }, SystemEvent::Tick { hour: h, minute: m, .. }) => {
            hour == h && minute == m
        }
        (Trigger::AppLaunched { name }, SystemEvent::AppLaunched { name: n }) => name == n,
        (Trigger::BatteryBelow { percent }, SystemEvent::Battery { percent: p }) => p < percent,
        (Trigger::LocationEntered { place }, SystemEvent::LocationEntered { place: pl }) => {
            place == pl
        }
        _ => false,
    }
}

fn condition_holds(cond: &Condition, ctx: &EvalContext) -> bool {
    match cond {
        Condition::DayOfWeek { days } => days.contains(&ctx.weekday),
        Condition::TimeRange { from_min, to_min } => {
            let now = ctx.hour as u32 * 60 + ctx.minute as u32;
            now >= *from_min && now <= *to_min
        }
        Condition::ModeActive { mode_id } => ctx.active_modes.contains(mode_id),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nexum_schema::automation::{AutomationRule, Condition, Trigger};

    fn chill_after_18h(target: Uuid) -> AutomationRule {
        AutomationRule {
            id: Uuid::from_u128(1),
            name: "Chill after 18:00".into(),
            enabled: true,
            target_mode_id: target,
            trigger: Trigger::TimeOfDay { hour: 18, minute: 0 },
            conditions: vec![Condition::DayOfWeek { days: vec![0, 1, 2, 3, 4] }], // weekdays
        }
    }

    #[test]
    fn fires_when_time_and_conditions_match() {
        let target = Uuid::from_u128(99);
        let rules = vec![chill_after_18h(target)];
        let event = SystemEvent::Tick { hour: 18, minute: 0, weekday: 2 };
        let ctx = EvalContext { hour: 18, minute: 0, weekday: 2, active_modes: vec![] };
        assert_eq!(evaluate(&event, &rules, &ctx), vec![target]);
    }

    #[test]
    fn does_not_fire_on_weekend() {
        let target = Uuid::from_u128(99);
        let rules = vec![chill_after_18h(target)];
        let event = SystemEvent::Tick { hour: 18, minute: 0, weekday: 6 }; // Sunday
        let ctx = EvalContext { hour: 18, minute: 0, weekday: 6, active_modes: vec![] };
        assert!(evaluate(&event, &rules, &ctx).is_empty());
    }

    #[test]
    fn disabled_rule_never_fires() {
        let target = Uuid::from_u128(99);
        let mut rule = chill_after_18h(target);
        rule.enabled = false;
        let event = SystemEvent::Tick { hour: 18, minute: 0, weekday: 2 };
        let ctx = EvalContext { hour: 18, minute: 0, weekday: 2, active_modes: vec![] };
        assert!(evaluate(&event, &[rule], &ctx).is_empty());
    }

    #[test]
    fn battery_below_threshold() {
        let target = Uuid::from_u128(7);
        let rule = AutomationRule {
            id: Uuid::from_u128(2),
            name: "battery saver".into(),
            enabled: true,
            target_mode_id: target,
            trigger: Trigger::BatteryBelow { percent: 20 },
            conditions: vec![],
        };
        let ctx = EvalContext::default();
        assert_eq!(
            evaluate(&SystemEvent::Battery { percent: 15 }, std::slice::from_ref(&rule), &ctx),
            vec![target]
        );
        assert!(evaluate(&SystemEvent::Battery { percent: 50 }, std::slice::from_ref(&rule), &ctx).is_empty());
    }
}
