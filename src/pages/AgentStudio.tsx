import React from 'react';
import { 
  Bot, 
  Activity, 
  Zap, 
  ShieldAlert, 
  BrainCircuit, 
  GitPullRequest,
  MessageSquare,
  Play,
  Box,
  Grid,
  Cpu,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'working' | 'offline';
  tasks: number;
  efficiency: number;
  icon: React.ReactNode;
}

const agents: Agent[] = [
  { id: 'geometry', name: '几何智能体', role: '几何处理专家', status: 'active', tasks: 42, efficiency: 95, icon: <Box className="w-5 h-5 text-blue-400" /> },
  { id: 'mesh', name: '网格智能体', role: '网格划分专家', status: 'working', tasks: 18, efficiency: 92, icon: <Grid className="w-5 h-5 text-emerald-400" /> },
  { id: 'physics', name: '物理智能体', role: '物理建模专家', status: 'idle', tasks: 156, efficiency: 98, icon: <Zap className="w-5 h-5 text-yellow-400" /> },
  { id: 'hpc', name: 'HPC 智能体', role: '计算资源调度', status: 'active', tasks: 89, efficiency: 99, icon: <Cpu className="w-5 h-5 text-red-400" /> },
  { id: 'optimization', name: '优化智能体', role: '仿真参数优化', status: 'working', tasks: 45, efficiency: 97, icon: <CalculatorIcon className="w-5 h-5 text-purple-400" /> },
  { id: 'postprocess', name: '分析智能体', role: '结果分析与报告', status: 'idle', tasks: 312, efficiency: 96, icon: <FileText className="w-5 h-5 text-pink-400" /> },
];

const statusMap = {
  active: '在线',
  idle: '空闲',
  working: '工作中',
  offline: '离线',
};

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}

export function AgentStudio() {
  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-emerald-500" />
          <h1 className="font-semibold text-lg">智能体工作室</h1>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
          <Play className="w-4 h-4" />
          部署新智能体
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-zinc-900 border border-white/10 rounded-xl p-5 hover:border-emerald-500/50 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <p className="text-xs text-zinc-400">{agent.role}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium border",
                  agent.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  agent.status === 'working' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                )}>
                  {statusMap[agent.status]}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-zinc-950/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">已处理任务</div>
                  <div className="text-lg font-mono font-medium">{agent.tasks}</div>
                </div>
                <div className="bg-zinc-950/50 rounded-lg p-3">
                  <div className="text-xs text-zinc-500 mb-1">运行效率</div>
                  <div className="text-lg font-mono font-medium text-emerald-400">{agent.efficiency}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-3">
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span>最后活跃: 2分钟前</span>
                </div>
                <div className="flex items-center gap-1 hover:text-white transition-colors">
                  <MessageSquare className="w-3 h-3" />
                  <span>查看日志</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-zinc-400" />
            智能体协作网络
          </h2>
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 h-64 flex items-center justify-center text-zinc-500">
            {/* Placeholder for a D3/Canvas Network Graph */}
            <div className="text-center">
              <BrainCircuit className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>协作拓扑图可视化区域</p>
              <p className="text-xs mt-1">展示智能体之间的消息流转与任务依赖</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
