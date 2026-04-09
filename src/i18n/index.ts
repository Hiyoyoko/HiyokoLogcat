import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app.title": "Hiyoko Logcat",
      "devices.empty": "No devices connected",
      "action.startLog": "Start Logcat",
      "action.logging": "Logging...",
      "action.clear": "Clear Logs",
      "action.settings": "Settings",
      "search.placeholder": "Search logs...",
      "ai.analyzing": "Hiyoko is analyzing... 🐣",
      "ai.failed": "Diagnosis failed piyo.",
      "ai.title": "Hiyoko AI Diagnosis",
      "settings.title": "Settings",
      "settings.apiKey": "Gemini API Key",
      "settings.apiKeyPlaceholder": "AIzaSy...",
      "settings.save": "Save",
      "settings.close": "Close",
      "settings.saved": "Settings saved successfully!"
    }
  },
  ja: {
    translation: {
      "app.title": "Hiyoko Logcat",
      "devices.empty": "デバイスが未接続です",
      "action.startLog": "開始",
      "action.logging": "取得中",
      "action.clear": "ログ消去",
      "action.settings": "設定",
      "search.placeholder": "ログを検索...",
      "ai.analyzing": "ひよこが診断中...🐣",
      "ai.failed": "診断に失敗しましたぴよ。",
      "ai.title": "Hiyoko AI 診断結果",
      "settings.title": "設定",
      "settings.apiKey": "Gemini API キー",
      "settings.apiKeyPlaceholder": "AIzaSy...",
      "settings.save": "保存する",
      "settings.close": "閉じる",
      "settings.saved": "設定を保存しました！"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
