# 🐣 HiyokoLogcat

HiyokoLogcat is a professional, high-performance Android Logcat viewer designed for developers who value both aesthetics and efficiency. It features integrated AI diagnostics powered by Google Gemini, real-time filtering, and a sleek modern interface.

![HiyokoLogcat Screenshot](public/screenshot.png) <!-- Note: User should replace this with an actual screenshot -->

## ✨ Features

- **🐣 AI Diagnostic**: Instantly analyze error logs with Gemini 1.5/2.0. Get root cause analysis and solutions directly in the UI.
- **⚡ Super Fast**: Handles thousands of log lines with 0 lag using virtualization.
- **🔍 Real-time Filtering**: Filter by Level (Error, Warn, Info) or Search query instantly.
- **📱 Device Management**: Auto-detects USB-connected Android devices.
- **🎨 Premium UI**: Dark mode, vibrant color coding, and smooth animations.

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/)
- [Node.js](https://nodejs.org/)
- [Android SDK (ADB)](https://developer.android.com/studio/releases/platform-tools)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Hiyoyoko/Hiyoko-logcat.git
    cd Hiyoko-logcat
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run in development mode:
    ```bash
    npm run tauri dev
    ```

### AI Configuration

1.  Open **Settings** (Gear icon ⚙️).
2.  Enter your **Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/)).
3.  Click **Save**.
4.  Click the **🐣 icon** next to any log line to start diagnosis!

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, Lucide React
- **Backend**: Rust, Tauri v2
- **AI Engine**: Google Gemini API
- **Persistence**: Tauri Plugin Store

## 📄 License

MIT License

---
Developed with 💖 for Android Developers.
