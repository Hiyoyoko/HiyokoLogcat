import { useState, useEffect, useRef, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Virtuoso } from "react-virtuoso";
import { Smartphone, RefreshCw, Cpu, X, Zap, Trash2, Settings, Search, MessageSquare, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { load } from "@tauri-apps/plugin-store";
import "../styles/App.css";

interface LogLine {
  raw: string;
  level: string;
}

interface Device {
  serial: string;
  status: string;
  model: string;
}

function App() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedSerial, setSelectedSerial] = useState<string>("");
  const [isLogging, setIsLogging] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLevels, setActiveLevels] = useState<Set<string>>(new Set(["V", "D", "I", "W", "E", "F"]));
  
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
    return logs.filter(log => {
      const matchLevel = activeLevels.has(log.level);
      const matchSearch = log.raw.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [logs, activeLevels, searchQuery]);

  // Auto-scroll
  useEffect(() => {
    if (scrollTracker.current.isAtBottom && filteredLogs.length > 0) {
      virtuosoRef.current?.scrollToIndex({ index: filteredLogs.length - 1, align: "end", behavior: "auto" });
    }
  }, [filteredLogs.length]);

  const initApp = async () => {
    try {
      const store = await load("settings.json");
      const key = await store.get<{value: string}>("gemini_api_key");
      if (key && key.value) setApiKey(key.value);
      fetchDevices();
    } catch(e) {
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

  const analyzeError = async (index: number) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    setAiResponse(t("ai.analyzing"));
    try {
      const answer = await invoke<string>("analyze_error", { index, apiKey });
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
    } catch (e) {}
  };

  return (
    <div className="log-container">
      {/* Row 1: Title Bar */}
      <div className="title-bar">
        <div className="app-brand">🐣 HiyokoLogcat</div>
      </div>

      {/* Row 2: Unified Toolbar (ASCII Layout) */}
      <div className="unified-toolbar">
        {/* Device Group: [📱device▼][🔄] */}
        <div className="toolbar-group">
          <Smartphone size={14} className="text-muted" />
          <select 
            className="device-select"
            value={selectedSerial} 
            onChange={(e) => setSelectedSerial(e.target.value)}
          >
            {devices.map((d) => <option key={d.serial} value={d.serial}>{d.model}</option>)}
            {devices.length === 0 && <option value="">No Device</option>}
          </select>
          <button onClick={fetchDevices} className="btn-sq" title="Refresh"><RefreshCw size={14} /></button>
        </div>

        <div className="v-divider">|</div>

        {/* Filter Group: [🔴][🟡][🔵] */}
        <div className="toolbar-group">
          <button className={`level-button E ${activeLevels.has("E") ? 'active' : ''}`} onClick={() => toggleLevel("E")} title="Filter Error">
            <span style={{color: '#f7768e'}}>🔴</span>
          </button>
          <button className={`level-button W ${activeLevels.has("W") ? 'active' : ''}`} onClick={() => toggleLevel("W")} title="Filter Warn">
             <span style={{color: '#e0af68'}}>🟡</span>
          </button>
          <button className={`level-button I ${activeLevels.has("I") ? 'active' : ''}`} onClick={() => toggleLevel("I")} title="Filter Info">
             <span style={{color: '#7aa2f7'}}>🔵</span>
          </button>
        </div>

        <div className="v-divider">|</div>

        {/* Search Group: [🔍検索____] */}
        <div className="search-wrap">
          <Search size={14} className="text-muted" />
          <input 
            placeholder={t("search.placeholder") || "Search logs..."} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="v-divider">|</div>

        {/* Action Group: [▶Start][🗑️][⚙️] */}
        <div className="toolbar-group">
          <button 
            className="btn-pill" 
            onClick={startLogging}
            disabled={!selectedSerial || isLogging}
          >
            {isLogging ? <Zap size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            <span>{isLogging ? t("action.logging") : t("action.startLog")}</span>
          </button>
          
          <button onClick={() => setLogs([])} className="btn-sq" title="Clear Logs">
            <Trash2 size={14} />
          </button>

          <button onClick={() => setShowSettings(true)} className="btn-sq" title="Settings">
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Main Content: Log List */}
      <div className="log-list-area">
        <Virtuoso
          ref={virtuosoRef}
          data={filteredLogs}
          atBottomStateChange={(atBottom) => scrollTracker.current.isAtBottom = atBottom}
          itemContent={(index, log) => (
            <div className={`log-item ${log.level}`}>
              <div className="log-dot" />
              <span className="ai-trigger" onClick={() => analyzeError(index)} title="AI分析">🐣</span>
              <span className="log-text">{log.raw}</span>
            </div>
          )}
        />
      </div>

      {/* AI Response Area (Overlay Panel) */}
      {aiResponse && (
        <>
          <div className="settings-overlay" onClick={() => setAiResponse(null)} />
          <div className="ai-overlay">
            <div className="ai-overlay-header">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} />
                <span>Diagnostic Result</span>
              </div>
              <X size={16} className="cursor-pointer" onClick={() => setAiResponse(null)} />
            </div>
            <div className="ai-overlay-content">
               {aiResponse.split("\n").map((line, i) => <p key={i} style={{marginBottom: '10px'}}>{line}</p>)}
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-modal">
            <h2 className="settings-title"><Settings size={20} /> Settings</h2>
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
              <button onClick={() => setShowSettings(false)} className="btn-cancel">Close</button>
              <button onClick={saveSettings} className="btn-save">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
