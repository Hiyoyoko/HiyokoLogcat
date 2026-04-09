import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app.title": "Hiyoko Logcat",
      "devices.empty": "No devices connected",
      "action.refresh": "Refresh Devices",
      "action.startLog": "Start Logcat",
      "action.logging": "Logging...",
      "action.clear": "Clear Logs",
      "action.settings": "Settings",
      "filter.error": "Filter Error",
      "filter.warn": "Filter Warn",
      "filter.info": "Filter Info",
      "ai.analyzing": "Hiyoko is analyzing...",
      "ai.failed": "Diagnosis failed piyo.",
      "ai.title": "Hiyoko AI Diagnosis",
      "ai.completed": "Analysis completed!",
      "settings.title": "Settings",
      "settings.apiKey": "Gemini API Key",
      "settings.apiKeyPlaceholder": "AIzaSy...",
      "settings.save": "Save",
      "settings.saveFailed": "Failed to save settings: ",
      "settings.close": "Close",
      "settings.saved": "Settings saved successfully!"
    }
  },
  ja: {
    translation: {
      "app.title": "Hiyoko Logcat",
      "devices.empty": "デバイスが未接続です",
      "action.refresh": "リスト更新",
      "action.startLog": "開始",
      "action.logging": "取得中",
      "action.clear": "ログ消去",
      "action.settings": "設定",
      "filter.error": "エラーのみ表示",
      "filter.warn": "警告のみ表示",
      "filter.info": "情報のみ表示",
      "ai.analyzing": "ひよこが診断中...",
      "ai.failed": "診断に失敗しましたぴよ。",
      "ai.title": "Hiyoko AI 診断結果",
      "ai.completed": "診断完了！",
      "settings.title": "設定",
      "settings.apiKey": "Gemini API キー",
      "settings.apiKeyPlaceholder": "AIzaSy...",
      "settings.save": "保存する",
      "settings.saveFailed": "保存失敗: ",
      "settings.close": "閉じる",
      "settings.saved": "設定を保存しましたぴよ！"
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
