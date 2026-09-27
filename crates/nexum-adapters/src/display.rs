use async_trait::async_trait;
#[cfg(any(windows, target_os = "linux"))]
use brightness::Brightness;
#[cfg(any(windows, target_os = "linux"))]
use futures::TryStreamExt;

use nexum_core::{ActionOutcome, Adapter, AdapterError, Capability};
use nexum_schema::action_types::{ids, SetBrightnessParams};
use nexum_schema::ActionStep;

use crate::util::{deser, ok};

/// Set brightness on every display exposed by the operating system.
pub struct DisplayAdapter;

impl DisplayAdapter {
    /// Enumerate and read brightness; never write during a connection check.
    pub async fn probe() -> Result<usize, AdapterError> {
        let count = read_all().await.map_err(|e| {
            AdapterError::Unavailable(format!("Lecture des écrans impossible : {e}"))
        })?;
        if count == 0 {
            return Err(AdapterError::Unavailable(
                "Aucun écran à luminosité contrôlable détecté".into(),
            ));
        }
        Ok(count)
    }

    pub fn new() -> Self {
        Self
    }
}

impl Default for DisplayAdapter {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Adapter for DisplayAdapter {
    fn supported_actions(&self) -> Vec<String> {
        vec![ids::DISPLAY_SET_BRIGHTNESS.into()]
    }

    async fn is_available(&self) -> Capability {
        if cfg!(any(
            target_os = "windows",
            target_os = "linux",
            target_os = "macos"
        )) {
            Capability::Available
        } else {
            Capability::Unavailable {
                reason: "brightness control unsupported on this OS".into(),
            }
        }
    }

    fn validate(&self, step: &ActionStep) -> Result<(), AdapterError> {
        let p: SetBrightnessParams = deser(step)?;
        if p.percent > 100 {
            return Err(AdapterError::InvalidParams {
                action_type: step.action_type.clone(),
                reason: "percent must be between 0 and 100".into(),
            });
        }
        Ok(())
    }

    async fn execute(&self, step: &ActionStep) -> Result<ActionOutcome, AdapterError> {
        self.validate(step)?;
        let p: SetBrightnessParams = deser(step)?;
        let count = set_all(p.percent)
            .await
            .map_err(|e| AdapterError::Execution(format!("brightness control failed: {e}")))?;
        if count == 0 {
            return Err(AdapterError::Unavailable(
                "no controllable displays found".into(),
            ));
        }
        Ok(ok(
            step,
            format!("brightness set to {}% on {count} display(s)", p.percent),
        ))
    }
}

// The `brightness` crate only supports Windows and Linux; macOS goes through
// DisplayServices below. On other targets the adapter reports Unavailable and
// these are never reached by the engine.

#[cfg(any(windows, target_os = "linux"))]
async fn read_all() -> Result<usize, String> {
    brightness::brightness_devices()
        .try_fold(0usize, |count, device| async move {
            let _ = device.get().await?;
            Ok(count + 1)
        })
        .await
        .map_err(|e| e.to_string())
}

#[cfg(any(windows, target_os = "linux"))]
async fn set_all(percent: u32) -> Result<usize, String> {
    brightness::brightness_devices()
        .try_fold(0usize, |count, mut device| async move {
            device.set(percent).await?;
            Ok(count + 1)
        })
        .await
        .map_err(|e| e.to_string())
}

#[cfg(target_os = "macos")]
async fn read_all() -> Result<usize, String> {
    let ds = macos::DisplayServices::load()?;
    Ok(macos::online_displays()?
        .into_iter()
        .filter(|&id| ds.get(id).is_some())
        .count())
}

#[cfg(target_os = "macos")]
async fn set_all(percent: u32) -> Result<usize, String> {
    let ds = macos::DisplayServices::load()?;
    let level = percent as f32 / 100.0;
    // Only displays DisplayServices can read are controllable (the built-in
    // panel); external monitors would need DDC and are skipped.
    let mut count = 0;
    for id in macos::online_displays()? {
        if ds.get(id).is_some() {
            ds.set(id, level)?;
            count += 1;
        }
    }
    Ok(count)
}

#[cfg(not(any(windows, target_os = "linux", target_os = "macos")))]
async fn read_all() -> Result<usize, String> {
    Err("unsupported on this OS".into())
}

#[cfg(not(any(windows, target_os = "linux", target_os = "macos")))]
async fn set_all(_percent: u32) -> Result<usize, String> {
    Err("unsupported on this OS".into())
}

/// macOS has no public brightness API: the built-in panel is driven through
/// the private DisplayServices framework (what the brightness keys use),
/// loaded at runtime so a missing symbol degrades to "unavailable".
#[cfg(target_os = "macos")]
mod macos {
    use std::ffi::{c_char, c_int, c_void, CStr};
    use std::sync::OnceLock;

    type DisplayId = u32;
    type GetFn = unsafe extern "C" fn(DisplayId, *mut f32) -> c_int;
    type SetFn = unsafe extern "C" fn(DisplayId, f32) -> c_int;

    const RTLD_LAZY: c_int = 0x1;
    const FRAMEWORK: &CStr =
        c"/System/Library/PrivateFrameworks/DisplayServices.framework/DisplayServices";

    extern "C" {
        fn dlopen(path: *const c_char, mode: c_int) -> *mut c_void;
        fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void;
    }

    #[link(name = "CoreGraphics", kind = "framework")]
    extern "C" {
        fn CGGetOnlineDisplayList(max: u32, displays: *mut DisplayId, count: *mut u32) -> i32;
    }

    pub struct DisplayServices {
        get: GetFn,
        set: SetFn,
    }

    impl DisplayServices {
        pub fn load() -> Result<&'static DisplayServices, String> {
            static LOADED: OnceLock<Result<DisplayServices, String>> = OnceLock::new();
            LOADED
                .get_or_init(|| unsafe {
                    let handle = dlopen(FRAMEWORK.as_ptr(), RTLD_LAZY);
                    if handle.is_null() {
                        return Err("DisplayServices framework not found".into());
                    }
                    let get = dlsym(handle, c"DisplayServicesGetBrightness".as_ptr());
                    let set = dlsym(handle, c"DisplayServicesSetBrightness".as_ptr());
                    if get.is_null() || set.is_null() {
                        return Err("DisplayServices brightness functions not found".into());
                    }
                    Ok(DisplayServices {
                        get: std::mem::transmute::<*mut c_void, GetFn>(get),
                        set: std::mem::transmute::<*mut c_void, SetFn>(set),
                    })
                })
                .as_ref()
                .map_err(Clone::clone)
        }

        /// Current brightness in 0.0..=1.0, or `None` if this display is not
        /// controllable.
        pub fn get(&self, id: DisplayId) -> Option<f32> {
            let mut level = 0.0f32;
            (unsafe { (self.get)(id, &mut level) } == 0).then_some(level)
        }

        pub fn set(&self, id: DisplayId, level: f32) -> Result<(), String> {
            match unsafe { (self.set)(id, level.clamp(0.0, 1.0)) } {
                0 => Ok(()),
                code => Err(format!(
                    "DisplayServicesSetBrightness returned {code} for display {id}"
                )),
            }
        }
    }

    pub fn online_displays() -> Result<Vec<DisplayId>, String> {
        let mut ids = [0 as DisplayId; 16];
        let mut count = 0u32;
        let err = unsafe { CGGetOnlineDisplayList(ids.len() as u32, ids.as_mut_ptr(), &mut count) };
        if err != 0 {
            return Err(format!("CGGetOnlineDisplayList failed ({err})"));
        }
        Ok(ids[..count as usize].to_vec())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nexum_schema::OnError;
    use serde_json::json;

    fn step(percent: u32) -> ActionStep {
        ActionStep {
            order: 0,
            action_type: ids::DISPLAY_SET_BRIGHTNESS.into(),
            params: json!({ "percent": percent }),
            enabled: true,
            on_error: OnError::Continue,
        }
    }

    #[test]
    fn rejects_brightness_above_100() {
        assert!(DisplayAdapter::new().validate(&step(100)).is_ok());
        assert!(DisplayAdapter::new().validate(&step(101)).is_err());
    }

    /// Sets the built-in panel to its current level, so nothing visibly changes.
    #[cfg(target_os = "macos")]
    #[tokio::test]
    #[ignore = "needs a Mac with a built-in display"]
    async fn macos_brightness_round_trips() {
        let ds = macos::DisplayServices::load().unwrap();
        let id = macos::online_displays()
            .unwrap()
            .into_iter()
            .find(|&id| ds.get(id).is_some())
            .expect("a controllable display");
        let before = ds.get(id).unwrap();

        assert!(DisplayAdapter::probe().await.unwrap() >= 1);
        ds.set(id, before).unwrap();
        assert!((ds.get(id).unwrap() - before).abs() < 0.01);
    }
}
