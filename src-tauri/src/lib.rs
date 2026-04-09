pub mod adb;
pub mod ai;
pub mod logcat;
pub mod usbmon;

use crate::logcat::LogManager;
use std::sync::Arc;
use tauri::{AppHandle, State};

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
    log_content: String,
    api_key: String,
) -> Result<String, String> {
    // フィルタ等でズレている可能性があるため、本文で再検索して正しいインデックスを得る
    let real_index = state.find_index_by_content(&log_content).unwrap_or(index);

    let logs = state.get_context(real_index, 100);
    let error_line = log_content.clone();
    let context_strings = logs.iter().map(|l| l.raw.clone()).collect();

    ai::analyze_with_gemini(&api_key, error_line, context_strings).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let log_manager = Arc::new(LogManager::new());

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
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
