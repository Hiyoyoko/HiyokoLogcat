# 🐣 HiyokoLogcat
> A cute, AI-powered Android Logcat viewer for Mac.

**Android開発をもっと可愛く、もっとスマートに。**

HiyokoLogcatは、Google Geminiの強力なAI診断機能を搭載した、モダンで高速なAndroid Logcatビューアーです。
Androidエンジニアが遭遇する「原因不明のエラー」を、ひよこが最新のAI（Gemini 3 Flash Preview）と共に秒速で解析します。

![Demo](public/demo.gif)

## 動作環境
- macOS 14 Sonoma以降

## ✨ 特徴

- **🐤 最新AIによるエラー診断**: 
  - `Gemini 3 Flash Preview` を採用し、エラー原因と解決策を瞬時に提案します。
  - AIへ送信する前にIPアドレスやメールアドレスを自動でマスキングし、プライバシーに配慮。
- **⚡ 爆速・軽量な仮想スクロール**: 
  - 数万行のログも、React Virtuosoによる仮想スクロールでラグなしに閲覧可能。
- **🐣 まんまるひよこのUI**: 
  - 独自の「まんまるひよこ」アイコンとアニメーションを採用。殺伐としたデバッグ現場に癒やしを届けます。
- **🔔 トースト通知**: 
  - 診断完了や保存成功をトースト通知でお知らせ。
- **🔍 リアルタイムフィルタリング**: 
  - エラーレベル（Error/Warn/Info）やキーワードで瞬時に絞り込み。

## 🚀 クイックスタート

### dmgからインストール（推奨）
1. [Releases](https://github.com/Hiyoyoko/Hiyoko-logcat/releases) から最新の `.dmg` をダウンロード
2. dmgを開いてアプリをApplicationsフォルダへ
3. 起動してADBでAndroidデバイスを接続するだけ！

### ソースからビルド

**前提条件**
- [Rust](https://www.rust-lang.org/)
- [Node.js](https://nodejs.org/)
- [Android SDK (ADB)](https://developer.android.com/studio/releases/platform-tools)

```bash
git clone https://github.com/Hiyoyoko/Hiyoko-logcat.git
cd Hiyoko-logcat
npm install
npm run tauri dev
```

### 🤖 AI診断の設定
1. 設定（歯車アイコン ⚙️）を開く
2. **Gemini API Key** を入力（[Google AI Studio](https://aistudio.google.com/) から無料取得）
3. 「保存する」をクリック
4. ログの横の **🐣** を押せば診断スタート！

> ⚠️ Gemini無料APIを使用する場合、送信したログがGoogleのモデル改善に利用される場合があります。

## 🛠 技術スタック
- **Frontend**: React, TypeScript, Vite, Lucide React, i18next
- **Backend**: Rust, Tauri v2
- **AI Engine**: Google Gemini API (`gemini-3-flash-preview`)
- **Persistence**: Tauri Plugin Store

## 🌎 English Summary
HiyokoLogcat is a high-performance Android Logcat viewer for Mac, integrated with Google Gemini AI (`Gemini 3 Flash Preview`).
It helps developers diagnose complex Android issues instantly, with privacy protection through automatic data masking.
Featuring a cute "Hiyoko" (chick) branding for a more enjoyable debugging experience.

## 📄 License
MIT License - 自由にカスタマイズ・利用してください！

---
Developed with 💖 for Android Developers.