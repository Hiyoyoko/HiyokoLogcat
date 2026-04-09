use tokio::process::Command;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeviceInfo {
    pub serial: String,
    pub status: String,
    pub model: String,
}

pub async fn list_devices() -> Result<Vec<DeviceInfo>, String> {
    let output = Command::new("adb")
        .arg("devices")
        .arg("-l")
        .output()
        .await
        .map_err(|e| format!("Failed to run adb: {}", e))?;

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

            devices.push(DeviceInfo { serial, status, model });
        }
    }

    Ok(devices)
}
