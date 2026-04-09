use tauri::{AppHandle, Emitter};
use tokio::sync::mpsc;
use usbwatch_rs::UsbWatcher;

pub fn start_usb_monitoring(app_handle: AppHandle) {
    let (tx, mut rx) = mpsc::channel(100);

    // UsbWatcher instance must be kept alive.
    std::thread::spawn(move || {
        let _watcher = match UsbWatcher::new(tx) {
            Ok(w) => w,
            Err(e) => {
                println!("Failed to start usb watcher: {:?}", e);
                return;
            }
        };

        // Keep thread alive so watcher is not dropped
        loop {
            std::thread::sleep(std::time::Duration::from_secs(3600));
        }
    });

    tauri::async_runtime::spawn(async move {
        while let Some(_event) = rx.recv().await {
            let _ = app_handle.emit("usb-event", "event");
        }
    });
}
