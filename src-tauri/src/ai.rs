use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisRequest {
    pub error_line: String,
    pub context: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisResponse {
    pub answer: String,
}

pub fn mask_sensitive_info(text: &str) -> String {
    // 簡易的なIPアドレスとメールアドレスのマスキング
    let ip_regex = Regex::new(r"(\d{1,3}\.){3}\d{1,3}").unwrap();
    let email_regex = Regex::new(r"[a-zA-Z0-0._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}").unwrap();

    let masked = ip_regex.replace_all(text, "[IP_MASKED]");
    let result = email_regex.replace_all(&masked, "[EMAIL_MASKED]");

    result.to_string()
}

pub async fn analyze_with_gemini(
    api_key: &str,
    error_line: String,
    context: Vec<String>,
) -> Result<String, String> {
    let masked_line = mask_sensitive_info(&error_line);
    let masked_context: Vec<String> = context.iter().map(|s| mask_sensitive_info(s)).collect();

    let prompt = format!(
        "あなたはAndroid開発のスペシャリストです。以下のログからエラー原因と解決策を、日本語で簡潔に回答してください。\n\n対象エラー: {}\n\n文脈ログ:\n{}",
        masked_line,
        masked_context.join("\n")
    );

    let client = reqwest::Client::new();
    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={}",
        api_key
    );

    let payload = serde_json::json!({
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    });

    let response = client
        .post(url)
        .json(&payload)
        .send()
        .await
        .map_err(|e| format!("Network error: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let err_body = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error body".to_string());
        return Err(format!("API error ({}): {}", status, err_body));
    }

    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Parse error: {}", e))?;

    let answer = json["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .ok_or("Failed to parse AI response")?;

    Ok(answer.to_string())
}
