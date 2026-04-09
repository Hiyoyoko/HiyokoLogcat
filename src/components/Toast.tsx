import React, { useEffect } from "react";
import { Info, AlertCircle, CheckCircle } from "lucide-react";
import HiyokoIcon from "./HiyokoIcon";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-success" />;
      case "error":
        return <AlertCircle size={16} className="text-error" />;
      default:
        return <Info size={16} className="text-info" />;
    }
  };

  return (
    <div className={`toast-container ${type}`} onClick={onClose}>
      <HiyokoIcon size={18} className={type === "success" ? "hiyoko-pulse" : ""} />
      <span className="toast-message">{message}</span>
      {getIcon()}
    </div>
  );
};

export default Toast;
