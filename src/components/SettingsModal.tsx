import React from "react";
import { Settings, X } from "lucide-react";

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
  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h2 className="settings-title">
          <Settings size={20} /> Settings
        </h2>
        <div className="settings-form-group">
          <label>Gemini API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="settings-input"
            placeholder="AIzaSy..."
          />
        </div>
        <div className="settings-actions">
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
          <button onClick={onSave} className="btn-save">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
