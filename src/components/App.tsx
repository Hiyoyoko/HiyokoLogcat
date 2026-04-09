import { useState, useEffect, useRef, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useTranslation } from "react-i18next";
import { load } from "@tauri-apps/plugin-store";

// Components
import Toolbar from "./Toolbar";
import LogList from "./LogList";
import AIPanel from "./AIPanel";
import SettingsModal from "./SettingsModal";
import HiyokoIcon from "./HiyokoIcon";

// Types
import { LogLine, Device } from "../types";

// Styles
import "../styles/App.css";

function App() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedSerial, setSelectedSerial] = useState<string>("");
  const [isLogging, setIsLogging] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLevels, setActiveLevels] = useState<Set<string>>(
    new Set(["V", "D", "I", "W", "E", "F"])
  );

  // AI Diagnostics
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const virtuosoRef = useRef<any>(null);
  const scrollTracker = useRef({ isAtBottom: true });

  useEffect(() => {
    initApp();

    const unlistenLogs = listen<LogLine[]>("log-batch", (event) => {
      setLogs((prev) => [...prev, ...event.payload]);
    });

    const unlistenUsb = listen<string>("usb-event", (event) => {
      fetchDevices();
    });

    return () => {
      unlistenLogs.then((f) => f());
      unlistenUsb.then((f) => f());
    };
  }, []);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchLevel = activeLevels.has(log.level);
      const matchSearch = log.raw.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [logs, activeLevels, searchQuery]);

  // Auto-scroll
  useEffect(() => {
    if (scrollTracker.current.isAtBottom && filteredLogs.length > 0) {
      virtuosoRef.current?.scrollToIndex({
        index: filteredLogs.length - 1,
        align: "end",
        behavior: "auto",
      });
    }
  }, [filteredLogs.length]);

  const initApp = async () => {
    try {
      const store = await load("settings.json");
      const key = await store.get<{ value: string }>("gemini_api_key");
      if (key && key.value) setApiKey(key.value);
      fetchDevices();
    } catch (e) {
      fetchDevices();
    }
  };

  const fetchDevices = async () => {
    try {
      const list = await invoke<Device[]>("get_devices");
      setDevices(list);
      if (list.length > 0 && !selectedSerial) setSelectedSerial(list[0].serial);
    } catch (e) {}
  };

  const startLogging = async () => {
    if (!selectedSerial) return;
    setLogs([]);
    setIsLogging(true);
    try {
      await invoke("start_logging", { serial: selectedSerial });
    } catch (e) {
      setIsLogging(false);
    }
  };

  const toggleLevel = (level: string) => {
    const next = new Set(activeLevels);
    if (next.has(level)) next.delete(level);
    else next.add(level);
    setActiveLevels(next);
  };

  const analyzeError = async (index: number, logContent: string) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    setAiResponse(t("ai.analyzing"));
    try {
      const answer = await invoke<string>("analyze_error", {
        index,
        logContent,
        apiKey,
      });
      setAiResponse(answer);
    } catch (e) {
      setAiResponse(t("ai.failed") + "\n" + e);
    }
  };

  const saveSettings = async () => {
    try {
      const store = await load("settings.json");
      await store.set("gemini_api_key", { value: apiKey });
      await store.save();
      setShowSettings(false);
    } catch (e) {
      console.error("Failed to save settings:", e);
      alert(
        `Failed to save settings: ${e}\n\nThis usually happens if the Store plugin registration or permissions are missing.`
      );
    }
  };

  return (
    <div className="log-container">
      {/* Title Bar */}
      <div className="title-bar">
        <div className="app-brand">
          <HiyokoIcon size={24} className="mr-2" />
          HiyokoLogcat
        </div>
      </div>

      {/* Unified Toolbar */}
      <Toolbar
        selectedSerial={selectedSerial}
        setSelectedSerial={setSelectedSerial}
        devices={devices}
        fetchDevices={fetchDevices}
        activeLevels={activeLevels}
        toggleLevel={toggleLevel}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLogging={isLogging}
        startLogging={startLogging}
        clearLogs={() => setLogs([])}
        setShowSettings={setShowSettings}
      />

      {/* Main Log Area */}
      <LogList
        logs={filteredLogs}
        virtuosoRef={virtuosoRef}
        onScrollStateChange={(atBottom) => (scrollTracker.current.isAtBottom = atBottom)}
        onAnalyze={analyzeError}
      />

      {/* AI Panel Overlay */}
      {aiResponse && <AIPanel response={aiResponse} onClose={() => setAiResponse(null)} />}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          apiKey={apiKey}
          setApiKey={setApiKey}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
