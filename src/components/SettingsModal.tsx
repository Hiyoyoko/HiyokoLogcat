import React from "react";
import { Settings, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SettingsModalProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  apiKey,
  setApiKey,
  onSave,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h2 className="settings-title">
          <Settings size={20} /> {t("settings.title")}
        </h2>
        <div className="settings-form-group">
          <label>{t("settings.apiKey")}</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="settings-input"
            placeholder={t("settings.apiKeyPlaceholder") || "AIzaSy..."}
          />
        </div>
        <div className="settings-actions">
          <button onClick={onClose} className="btn-cancel">
            {t("settings.close")}
          </button>
          <button onClick={onSave} className="btn-save">
            {t("settings.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
