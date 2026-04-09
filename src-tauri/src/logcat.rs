use std::collections::VecDeque;
use std::sync::{Arc, Mutex};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;
use serde::{Serialize, Deserialize};
use tauri::{AppHandle, Emitter};
use tokio::time::{Duration, interval};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LogLine {
    pub raw: String,
    pub level: String,
}

pub struct LogManager {
    pub ring_buffer: Arc<Mutex<VecDeque<LogLine>>>,
}

impl LogManager {
    pub fn new() -> Self {
        Self {
            ring_buffer: Arc::new(Mutex::new(VecDeque::with_capacity(2000))),
        }
    }

    pub fn add_log(&self, line: LogLine) {
        let mut buffer = self.ring_buffer.lock().unwrap();
        if buffer.len() >= 2000 {
            buffer.pop_front();
        }
        buffer.push_back(line);
    }

    pub fn get_context(&self, around_index: usize, range: usize) -> Vec<LogLine> {
        let buffer = self.ring_buffer.lock().unwrap();
        let start = around_index.saturating_sub(range);
        let end = (around_index + range).min(buffer.len());
        buffer.iter().skip(start).take(end - start).cloned().collect()
    }
}

pub async fn start_logcat_stream(
    app_handle: AppHandle,
    log_manager: Arc<LogManager>,
    serial: Option<String>,
) -> Result<(), String> {
    let mut args = vec!["logcat", "-v", "threadtime"];
    if let Some(s) = &serial {
        args.insert(0, "-s");
        args.insert(0, s);
    }

    let mut child = Command::new("adb")
        .args(&args)
        .stdout(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start adb: {}", e))?;

    let stdout = child.stdout.take().unwrap();
    let mut reader = BufReader::new(stdout).lines();
    
    let mut batch = Vec::new();
    let mut batch_interval = interval(Duration::from_millis(100));

    loop {
        tokio::select! {
            line_res = reader.next_line() => {
                match line_res {
                    Ok(Some(line)) => {
                        let log_line = parse_log_line(line);
                        log_manager.add_log(log_line.clone());
                        batch.push(log_line);
                        
                        if batch.len() >= 500 {
                            let _ = app_handle.emit("log-batch", &batch);
                            batch.clear();
                        }
                    }
                    Ok(None) => break,
                    Err(_) => break,
                }
            }
            _ = batch_interval.tick() => {
                if !batch.is_empty() {
                    let _ = app_handle.emit("log-batch", &batch);
                    batch.clear();
                }
            }
        }
    }

    Ok(())
}

fn parse_log_line(raw: String) -> LogLine {
    // 簡易パース: ログレベルの抽出
    // threadtime 形式の例: "04-09 21:23:45.678  1234  5678 E Tag: Message"
    let level = if raw.contains(" V ") { "V" }
        else if raw.contains(" D ") { "D" }
        else if raw.contains(" I ") { "I" }
        else if raw.contains(" W ") { "W" }
        else if raw.contains(" E ") { "E" }
        else if raw.contains(" F ") { "F" }
        else { "I" }.to_string();

    LogLine { raw, level }
}
