import React from "react";
import { MessageSquare, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import HiyokoIcon from "./HiyokoIcon";

interface AIPanelProps {
  response: string;
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ response, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="ai-overlay">
        <div className="ai-overlay-header">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} />
            <span>{t("ai.title")}</span>
          </div>
          <X size={16} className="cursor-pointer" onClick={onClose} />
        </div>
        <div className="ai-overlay-content">
          {response.split("\n").map((line, i) => {
            const isAnalyzing = line.includes("analyzing") || line.includes("診断中");
            return (
              <p key={i} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                {line}
                {isAnalyzing && <HiyokoIcon size={18} className="hiyoko-pulse" />}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AIPanel;
