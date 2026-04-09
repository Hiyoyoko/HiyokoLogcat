use serde::{Deserialize, Serialize};
use tokio::process::Command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeviceInfo {
    pub serial: String,
    pub status: String,
    pub model: String,
}

pub fn resolve_adb_path() -> String {
    let common_paths = [
        "/opt/homebrew/bin/adb",
        "/usr/local/bin/adb",
        "/usr/bin/adb",
    ];

    // 1. 標準的なインストールパスをチェック
    for path in common_paths {
        if std::path::Path::new(path).exists() {
            return path.to_string();
        }
    }

    // 2. Android SDK (HOME) をチェック
    if let Ok(home) = std::env::var("HOME") {
        let sdk_path = format!("{}/Library/Android/sdk/platform-tools/adb", home);
        if std::path::Path::new(&sdk_path).exists() {
            return sdk_path;
        }
    }

    // 3. 環境変数 (ANDROID_HOME) をチェック
    if let Ok(sdk_home) = std::env::var("ANDROID_HOME") {
        let path = format!("{}/platform-tools/adb", sdk_home);
        if std::path::Path::new(&path).exists() {
            return path;
        }
    }

    "adb".to_string() // フォールバック
}

pub async fn list_devices() -> Result<Vec<DeviceInfo>, String> {
    let adb_path = resolve_adb_path();
    let output = Command::new(adb_path)
        .arg("devices")
        .arg("-l")
        .output()
        .await
        .map_err(|e| format!("Failed to run adb ({}): {}", resolve_adb_path(), e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut devices = Vec::new();

    for line in stdout.lines() {
        if line.starts_with("List of devices") || line.trim().is_empty() {
            continue;
        }

        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() >= 2 {
            let serial = parts[0].to_string();
            let status = parts[1].to_string();
            let mut model = "Unknown".to_string();

            for part in parts {
                if part.starts_with("model:") {
                    model = part.replace("model:", "");
                }
            }

            devices.push(DeviceInfo {
                serial,
                status,
                model,
            });
        }
    }

    Ok(devices)
}
