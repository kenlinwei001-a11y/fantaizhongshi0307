import React from 'react';
import { Settings2 } from 'lucide-react';

export function PropertiesPanel() {
  return (
    <div className="h-full bg-zinc-900 border-l border-white/10 flex flex-col w-72">
      <div className="p-3 border-b border-white/10 font-medium text-zinc-400 text-xs uppercase tracking-wider flex items-center gap-2">
        <Settings2 className="w-3 h-3" />
        属性配置
      </div>
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Mock Properties for a Physics Node */}
        <div>
          <h3 className="text-sm font-medium text-white mb-3">传热模型</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-800" />
              热传导
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-800" />
              热对流
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800" />
              热辐射
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-3">流体模型</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-800" />
              纳维-斯托克斯方程
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-800" />
              湍流模型
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-white mb-3">湍流模型选择</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="radio" name="turbulence" defaultChecked className="border-zinc-700 bg-zinc-800" />
              k-epsilon
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="radio" name="turbulence" className="border-zinc-700 bg-zinc-800" />
              k-omega
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="radio" name="turbulence" className="border-zinc-700 bg-zinc-800" />
              LES
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
