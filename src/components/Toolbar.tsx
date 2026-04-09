import React from "react";
import { Smartphone, RefreshCw, Smartphone as Tablet, Zap, Play, Trash2, Settings, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Device } from "../types";

interface ToolbarProps {
  selectedSerial: string;
  setSelectedSerial: (serial: string) => void;
  devices: Device[];
  fetchDevices: () => void;
  activeLevels: Set<string>;
  toggleLevel: (level: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLogging: boolean;
  startLogging: () => void;
  clearLogs: () => void;
  setShowSettings: (show: boolean) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedSerial,
  setSelectedSerial,
  devices,
  fetchDevices,
  activeLevels,
  toggleLevel,
  searchQuery,
  setSearchQuery,
  isLogging,
  startLogging,
  clearLogs,
  setShowSettings,
}) => {
  const { t } = useTranslation();

  return (
    <div className="unified-toolbar">
      {/* Device Group */}
      <div className="toolbar-group">
        <Smartphone size={14} className="text-muted" />
        <select
          className="device-select"
          value={selectedSerial}
          onChange={(e) => setSelectedSerial(e.target.value)}
        >
          {devices.map((d) => (
            <option key={d.serial} value={d.serial}>
              {d.model}
            </option>
          ))}
          {devices.length === 0 && <option value="">No Device</option>}
        </select>
        <button onClick={fetchDevices} className="btn-sq" title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="v-divider">|</div>

      {/* Filter Group */}
      <div className="toolbar-group">
        <button
          className={`level-button E ${activeLevels.has("E") ? "active" : ""}`}
          onClick={() => toggleLevel("E")}
          title="Filter Error"
        >
          <span style={{ color: "#f7768e" }}>🔴</span>
        </button>
        <button
          className={`level-button W ${activeLevels.has("W") ? "active" : ""}`}
          onClick={() => toggleLevel("W")}
          title="Filter Warn"
        >
          <span style={{ color: "#e0af68" }}>🟡</span>
        </button>
        <button
          className={`level-button I ${activeLevels.has("I") ? "active" : ""}`}
          onClick={() => toggleLevel("I")}
          title="Filter Info"
        >
          <span style={{ color: "#7aa2f7" }}>🔵</span>
        </button>
      </div>

      <div className="v-divider">|</div>

      {/* Search Group */}
      <div className="search-wrap">
        <Search size={14} className="text-muted" />
        <input
          placeholder={t("search.placeholder") || "Search logs..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="v-divider">|</div>

      {/* Action Group */}
      <div className="toolbar-group">
        <button
          className="btn-pill"
          onClick={startLogging}
          disabled={!selectedSerial || isLogging}
        >
          {isLogging ? <Zap size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          <span>{isLogging ? t("action.logging") : t("action.startLog")}</span>
        </button>

        <button onClick={clearLogs} className="btn-sq" title="Clear Logs">
          <Trash2 size={14} />
        </button>

        <button onClick={() => setShowSettings(true)} className="btn-sq" title="Settings">
          <Settings size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
