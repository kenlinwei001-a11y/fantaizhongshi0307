import React from 'react';
import { Save, Play, Square, Download, GitCompare, Settings, Menu, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface TopBarProps {
  projectName?: string;
  onSave?: () => void;
  onRun?: () => void;
  onStop?: () => void;
  onExport?: () => void;
  onCompare?: () => void;
  onSettings?: () => void;
  isCopilotOpen?: boolean;
  onToggleCopilot?: () => void;
}

export function TopBar({
  projectName = '未命名项目',
  onSave,
  onRun,
  onStop,
  onExport,
  onCompare,
  onSettings,
  isCopilotOpen,
  onToggleCopilot,
}: TopBarProps) {
  return (
    <div className="h-14 border-b border-white/10 bg-zinc-900 flex items-center px-4 justify-between">
      <div className="flex items-center gap-4">
        <div className="font-semibold text-white flex items-center gap-2">
          <Menu className="w-5 h-5 text-zinc-400" />
          {projectName}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onSave} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors">
          <Save className="w-4 h-4" />
          保存
        </button>
        <div className="h-6 w-px bg-white/10 mx-2" />
        <button onClick={onRun} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-colors">
          <Play className="w-4 h-4" />
          运行
        </button>
        <button onClick={onStop} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
          <Square className="w-4 h-4" />
          停止
        </button>
        <div className="h-6 w-px bg-white/10 mx-2" />
        <button 
          onClick={onToggleCopilot} 
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            isCopilotOpen ? "bg-purple-500/20 text-purple-400" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          )}
        >
          <Sparkles className="w-4 h-4" />
          AI 助手
        </button>
        <div className="h-6 w-px bg-white/10 mx-2" />
        <button onClick={onExport} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors" title="导出">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={onCompare} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors" title="对比">
          <GitCompare className="w-4 h-4" />
        </button>
        <button onClick={onSettings} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors" title="设置">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
