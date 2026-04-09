import React from "react";
import { Virtuoso } from "react-virtuoso";
import { LogLine } from "../types";
import HiyokoIcon from "./HiyokoIcon";

interface LogListProps {
  logs: LogLine[];
  virtuosoRef: React.RefObject<any>;
  onScrollStateChange: (atBottom: boolean) => void;
  onAnalyze: (index: number, content: string) => void;
}

const LogList: React.FC<LogListProps> = ({
  logs,
  virtuosoRef,
  onScrollStateChange,
  onAnalyze,
}) => {
  return (
    <div className="log-list-area">
      <Virtuoso
        ref={virtuosoRef}
        data={logs}
        atBottomStateChange={onScrollStateChange}
        itemContent={(index, log) => (
          <div className={`log-item ${log.level}`}>
            <div className="log-dot" />
            <span
              className="ai-trigger"
              onClick={() => onAnalyze(index, log.raw)}
              title="AI分析"
            >
              <HiyokoIcon size={16} />
            </span>
            <span className="log-text">{log.raw}</span>
          </div>
        )}
      />
    </div>
  );
};

export default LogList;
