// Prevents an extra console window on Windows in release. DO NOT REMOVE.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Fix white/blank screen on some Linux/Wayland setups (WebKitGTK on AMD GPUs).
    // Must be set before GTK/WebKit init.
    #[cfg(target_os = "linux")]
    {
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
    }

    nexum_desktop_lib::run()
}
