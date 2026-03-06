import React from 'react';
import { Terminal, Activity } from 'lucide-react';

interface BottomPanelProps {
  logs?: string[];
}

export function BottomPanel({ logs = [] }: BottomPanelProps) {
  return (
    <div className="h-48 bg-zinc-900 border-t border-white/10 flex flex-col">
      <div className="flex border-b border-white/10">
        <button className="px-4 py-2 text-xs font-medium text-white border-b-2 border-emerald-500 flex items-center gap-2 bg-white/5">
          <Terminal className="w-3 h-3" />
          求解日志
        </button>
        <button className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-2">
          <Activity className="w-3 h-3" />
          结果时间轴
        </button>
      </div>
      <div className="flex-1 p-2 font-mono text-xs text-zinc-400 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-zinc-600 italic">准备运行模拟...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={log.includes('Error') ? 'text-red-400' : log.includes('Starting') || log.includes('Completed') ? 'text-emerald-400' : ''}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
