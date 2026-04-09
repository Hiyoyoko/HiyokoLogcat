# HiyokoLogcat 🐣

> 重いIDEはいらない。ひよこが解決する超速・高機能Logcatビューア。

**HiyokoLogcat** は、Tauri (Rust) と React を用いて構築された、全く新しい Android ログキャットビューアです。Android Studio を立ち上げる必要はなく、一瞬で起動し、数万行のログが流れても決してフリーズしない「超速」の世界を実現します。

## ✨ 特徴 (Features)

🚀 **超速ストリーミング & バッファリング**
Rustの並行処理 (`tokio`) を駆使し、ADBからの標準出力を瞬時にキャプチャ。100ms/500行単位での高度なバッファリングにより、フロントエンドへの描画負荷を極小化しています。

📜 **仮想スクロールによる無限ログ**
フロントエンドには `react-virtuoso` を採用。数万、数十万の行数が流れても、DOMレンダリングを画面内に限定することで、常に60FPSの滑らかなスクロールを維持します。

🐣 **Gemini API 連携による「1クリックAI診断」**
ログの海で迷う必要はありません。エラー行の隣にある「🐣ボタン」をクリックするだけで、Rust側のメモリにある「前後100行」の文脈を瞬時に抽出し、Google Gemini API が日本語で原因と解決策を提案します。

🛡 **セキュアなプライバシーフィルタ**
AIへログを送信する前に、Rustレイヤーの正規表現フィルタが**IPアドレスやメールアドレスを自動でマスキング**。機密情報漏洩の心配なくAI診断を利用できます。APIキーは `tauri-plugin-store` を用いてローカルに安全に暗号化保存されます。

🎨 **ひよこカラー & プレミアムダークデザイン**
V(Verbose), D(Debug), I(Info), W(Warn), E(Error), F(Fatal) ごとに見やすく設計されたカスタムカラーテーマ（ひよこカラー）。

## 🛠 技術構成 (The Stack)

- **Core**: Rust (Tauri v2)
- **Frontend**: React 18 / TypeScript
- **State/Async**: tokio, tauri-plugin-store
- **AI**: Gemini 1.5 Flash API (by Google AI Studio)
- **Localization**: i18next (English & Japanese)

## 🚀 インストール & 起動 (Getting Started)

### 開発環境での実行
\`\`\`bash
# 依存関係のインストール
npm install

# 開発用サーバーの起動 (Vite + Tauri)
npm run tauri dev
\`\`\`

### ビルド (プロトタイプ配布用)
\`\`\`bash
npm run tauri build
\`\`\`
*(ビルドには Mac の場合 Xcode Command Line Tools, Windows の場合は C++ Build Tools が必要です)*

## 🔐 AI診断機能の使用方法
1. アプリ右上の「⚙ (Settings)」ボタンをクリック。
2. Google AI Studio で取得した **Gemini API Key** を入力して保存。
3. デバイスから流れてくるログのエラー行（E や F など）にマウスをホバーし、現れる 🐣 アイコンをクリック！
4. ひよこがログの文脈を読み取り、数秒で日本語の解決案を提示します。

## 🤝 貢献 (Contributing)
Issue や Pull Request は随時歓迎です。
Let's make Android debugging fast, fun, and adorable! 🐤
