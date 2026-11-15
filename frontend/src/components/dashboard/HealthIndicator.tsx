"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { HealthResponse } from "@/types";
import { RefreshCw, AlertCircle } from "lucide-react";

export function HealthIndicator() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking");

  const checkHealth = useCallback(async () => {
    setStatus("checking");
    try {
      const data = await api.getHealth();
      if (data && data.bigquery && data.bigquery.connected) {
        setHealth(data);
        setStatus("connected");
      } else {
        setHealth(data);
        setStatus("error");
      }
    } catch {
      setHealth(null);
      setStatus("disconnected");
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // 45 seconds polling interval
    const interval = setInterval(checkHealth, 45000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono shadow-sm">
      <div className="flex items-center gap-2">
        {status === "checking" && (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-slate-400">Đang kiểm tra kết nối...</span>
          </>
        )}

        {status === "connected" && health && (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">BigQuery Kết Nối</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{health.bigquery.latency_ms.toFixed(0)}ms</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 hidden xl:inline">{health.bigquery.project_id}</span>
            </div>
          </>
        )}

        {status === "disconnected" && (
          <div className="flex items-center gap-1.5 text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Backend Ngoại Tuyến</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-1.5 text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>BigQuery Gián Đoạn</span>
          </div>
        )}
      </div>

      <button
        onClick={checkHealth}
        disabled={status === "checking"}
        title="Làm mới trạng thái kết nối BigQuery"
        className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-50 transition-colors ml-1"
      >
        <RefreshCw className={`w-3 h-3 ${status === "checking" ? "animate-spin text-cyan-400" : ""}`} />
      </button>
    </div>
  );
}
