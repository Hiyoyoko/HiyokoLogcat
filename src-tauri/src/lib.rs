pub mod adb;
pub mod logcat;
pub mod ai;
pub mod usbmon;

use std::sync::Arc;
use tauri::{AppHandle, Manager, State};
use crate::logcat::LogManager;

#[tauri::command]
async fn get_devices() -> Result<Vec<adb::DeviceInfo>, String> {
    adb::list_devices().await
}

#[tauri::command]
async fn start_logging(
    app_handle: AppHandle,
    state: State<'_, Arc<LogManager>>,
    serial: Option<String>,
) -> Result<(), String> {
    let log_manager = state.inner().clone();
    tokio::spawn(async move {
        let _ = logcat::start_logcat_stream(app_handle, log_manager, serial).await;
    });
    Ok(())
}

#[tauri::command]
async fn analyze_error(
    state: State<'_, Arc<LogManager>>,
    index: usize,
    api_key: String,
) -> Result<String, String> {
    let logs = state.get_context(index, 100);
    let error_line = logs.iter().enumerate()
        .find(|(i, _)| *i == 100 || *i == logs.len() / 2) // 中心（対象行）を見つける
        .map(|(_, l)| l.raw.clone())
        .unwrap_or_default();
    
    let context_strings = logs.iter().map(|l| l.raw.clone()).collect();
    ai::analyze_with_gemini(&api_key, error_line, context_strings).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let log_manager = Arc::new(LogManager::new());

    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            crate::usbmon::start_usb_monitoring(handle);
            Ok(())
        })
        .manage(log_manager)
        .invoke_handler(tauri::generate_handler![
            get_devices,
            start_logging,
            analyze_error
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
