import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Plus, 
  MoreVertical, 
  GitCommit, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Model {
  id: string;
  name: string;
  type: 'system_dynamics' | 'discrete_event' | 'optimization' | 'agent_based';
  version: string;
  status: 'ready' | 'training' | 'draft' | 'error';
  lastModified: string;
  author: string;
  description: string;
}

const mockModels: Model[] = [
  { 
    id: 'MOD-001', 
    name: '全厂产能规划模型', 
    type: 'optimization', 
    version: 'v2.1.0', 
    status: 'ready', 
    lastModified: '2025-03-14 15:30', 
    author: '生产智能体',
    description: '基于线性规划 (LP) 的多产线产能分配模型，目标最大化吞吐量。'
  },
  { 
    id: 'MOD-002', 
    name: '物流AGV调度仿真', 
    type: 'discrete_event', 
    version: 'v1.0.5', 
    status: 'ready', 
    lastModified: '2025-03-12 09:15', 
    author: '物流组',
    description: '车间AGV路径规划与避障模拟，评估物流瓶颈。'
  },
  { 
    id: 'MOD-003', 
    name: '供应链风险传导模型', 
    type: 'system_dynamics', 
    version: 'v0.9.0', 
    status: 'draft', 
    lastModified: '2025-03-15 11:00', 
    author: '风险智能体',
    description: '分析上游原材料波动对交付周期的非线性影响。'
  },
  { 
    id: 'MOD-004', 
    name: '高炉能耗预测模型', 
    type: 'agent_based', 
    version: 'v3.0.0', 
    status: 'training', 
    lastModified: '2025-03-15 14:20', 
    author: 'AI 实验室',
    description: '基于多智能体的复杂热力学反应过程模拟。'
  },
];

const TypeBadge = ({ type }: { type: string }) => {
  const labels: Record<string, string> = {
    system_dynamics: '系统动力学',
    discrete_event: '离散事件',
    optimization: '优化求解',
    agent_based: '多智能体'
  };
  
  const colors: Record<string, string> = {
    system_dynamics: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    discrete_event: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    optimization: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    agent_based: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-xs border", colors[type] || colors.optimization)}>
      {labels[type] || type}
    </span>
  );
};

export function SimulationModel() {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-orange-500" />
          <h1 className="font-semibold text-lg">仿真模型</h1>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新建模型
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockModels.map((model) => (
            <div 
              key={model.id} 
              onClick={() => navigate(`/simulation/${model.id}/status`)}
              className="bg-zinc-900 border border-white/10 rounded-xl p-5 hover:border-orange-500/50 transition-colors group relative cursor-pointer"
            >
              <div className="absolute top-5 right-5">
                <button className="text-zinc-500 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg group-hover:text-orange-400 transition-colors">{model.name}</h3>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2 h-10">{model.description}</p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <TypeBadge type={model.type} />
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs border flex items-center gap-1",
                  model.status === 'ready' ? "bg-zinc-800 text-zinc-300 border-zinc-700" :
                  model.status === 'training' ? "bg-blue-900/20 text-blue-300 border-blue-800" :
                  "bg-zinc-800 text-zinc-500 border-zinc-700 border-dashed"
                )}>
                  {model.status === 'ready' && <CheckCircle2 className="w-3 h-3" />}
                  {model.status === 'training' && <Clock className="w-3 h-3 animate-spin" />}
                  {model.status === 'draft' && <GitCommit className="w-3 h-3" />}
                  {model.status === 'ready' ? '就绪' : model.status === 'training' ? '训练中' : '草稿'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-4">
                <div className="flex items-center gap-1">
                  <span className="font-mono bg-white/5 px-1.5 rounded">{model.version}</span>
                </div>
                <div>
                  更新于 {model.lastModified}
                </div>
              </div>
            </div>
          ))}

          {/* New Model Card Placeholder */}
          <button className="border border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/30 transition-colors bg-white/5 hover:bg-white/10 h-full min-h-[200px]">
            <Plus className="w-8 h-8 mb-3 opacity-50" />
            <span className="font-medium">创建新模型</span>
            <span className="text-xs mt-1 opacity-50">支持导入 FMU / Modelica</span>
          </button>
        </div>
      </div>
    </div>
  );
}
