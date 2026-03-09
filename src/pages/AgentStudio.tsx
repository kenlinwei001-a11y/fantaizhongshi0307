import React, { useState } from 'react';
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
  FileText,
  ArrowLeft,
  Settings,
  Terminal,
  Save,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'working' | 'offline';
  tasks: number;
  efficiency: number;
  icon: React.ReactElement;
  description: string;
  capabilities: string[];
}

const agents: Agent[] = [
  { id: 'geometry', name: '几何智能体', role: '几何处理专家', status: 'active', tasks: 42, efficiency: 95, icon: <Box className="w-5 h-5 text-blue-400" />, description: '负责解析和处理高炉、热风炉等冶金设备的CAD几何模型，自动修复几何缺陷。', capabilities: ['CAD解析', '几何修复', '边界提取'] },
  { id: 'mesh', name: '网格智能体', role: '网格划分专家', status: 'working', tasks: 18, efficiency: 92, icon: <Grid className="w-5 h-5 text-emerald-400" />, description: '根据物理场需求，自动生成高质量的六面体/四面体网格，并对局部特征进行自适应加密。', capabilities: ['网格生成', '自适应加密', '网格质量检查'] },
  { id: 'physics', name: '物理智能体', role: '物理建模专家', status: 'idle', tasks: 156, efficiency: 98, icon: <Zap className="w-5 h-5 text-yellow-400" />, description: '配置多相流、传热传质、化学反应等复杂的火法冶金物理模型参数。', capabilities: ['多相流配置', '反应动力学', '热力学计算'] },
  { id: 'hpc', name: 'HPC 智能体', role: '计算资源调度', status: 'active', tasks: 89, efficiency: 99, icon: <Cpu className="w-5 h-5 text-red-400" />, description: '智能调度集群计算资源，优化并行计算策略，监控节点健康状态。', capabilities: ['负载均衡', '节点监控', '容错处理'] },
  { id: 'optimization', name: '优化智能体', role: '仿真参数优化', status: 'working', tasks: 45, efficiency: 97, icon: <CalculatorIcon className="w-5 h-5 text-purple-400" />, description: '基于遗传算法、粒子群算法等，对高炉操作参数进行多目标寻优。', capabilities: ['多目标优化', '参数空间搜索', 'Pareto前沿分析'] },
  { id: 'postprocess', name: '分析智能体', role: '结果分析与报告', status: 'idle', tasks: 312, efficiency: 96, icon: <FileText className="w-5 h-5 text-pink-400" />, description: '自动提取仿真结果的关键指标，生成可视化图表和分析报告。', capabilities: ['数据提取', '可视化生成', '报告撰写'] },
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
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setView('detail');
  };

  const renderListView = () => (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} onClick={() => handleAgentClick(agent)} className="bg-zinc-900 border border-white/10 rounded-xl p-5 hover:border-emerald-500/50 transition-colors cursor-pointer group">
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
                <span>查看详情</span>
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
          <div className="text-center">
            <BrainCircuit className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>协作拓扑图可视化区域</p>
            <p className="text-xs mt-1">展示智能体之间的消息流转与任务依赖</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetailView = () => {
    if (!selectedAgent) return null;
    return (
      <div className="flex-1 p-6 overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
              {React.cloneElement(selectedAgent.icon as React.ReactElement<any>, { className: "w-8 h-8" })}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
              <p className="text-zinc-400">{selectedAgent.role}</p>
            </div>
            <div className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2",
              selectedAgent.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
              selectedAgent.status === 'working' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
              "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
            )}>
              <div className={cn("w-2 h-2 rounded-full", selectedAgent.status === 'active' ? "bg-emerald-400" : selectedAgent.status === 'working' ? "bg-blue-400 animate-pulse" : "bg-zinc-400")} />
              {statusMap[selectedAgent.status]}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Info & Stats */}
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
                <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  智能体描述
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {selectedAgent.description}
                </p>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
                <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  核心能力
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.capabilities.map((cap, i) => (
                    <span key={i} className="px-2.5 py-1 bg-zinc-800 border border-white/5 rounded-md text-xs text-zinc-300">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
                <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  运行统计
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-500">任务成功率</span>
                      <span className="text-emerald-400">{selectedAgent.efficiency}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedAgent.efficiency}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                      <div className="text-xs text-zinc-500">累计处理</div>
                      <div className="text-lg font-mono text-white">{selectedAgent.tasks}</div>
                    </div>
                    <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                      <div className="text-xs text-zinc-500">平均耗时</div>
                      <div className="text-lg font-mono text-white">1.2s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Configuration & Logs */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    模型配置
                  </h3>
                  <button className="text-xs text-emerald-500 hover:text-emerald-400">编辑</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">基础大模型</label>
                    <div className="bg-zinc-950 border border-white/5 px-3 py-2 rounded-lg text-sm text-zinc-300">
                      Gemini 2.5 Pro
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">系统提示词 (System Prompt)</label>
                    <div className="bg-zinc-950 border border-white/5 px-3 py-2 rounded-lg text-sm text-zinc-300 font-mono text-xs h-32 overflow-y-auto">
                      You are an expert in pyrometallurgical numerical simulation, specifically acting as the {selectedAgent.name}.
                      Your primary responsibility is to {selectedAgent.description}
                      Always ensure physical consistency and adhere to mass and energy conservation laws...
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-xl p-5 h-64 flex flex-col">
                <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  实时日志
                </h3>
                <div className="flex-1 bg-zinc-950 border border-white/5 rounded-lg p-3 font-mono text-xs text-zinc-400 overflow-y-auto space-y-2">
                  <div>[10:23:41] 智能体已就绪，等待任务分配...</div>
                  {selectedAgent.status === 'working' && (
                    <>
                      <div>[10:24:05] 接收到新任务: 优化高炉送风制度</div>
                      <div>[10:24:06] 正在调用遗传算法模块...</div>
                      <div className="text-emerald-400">[10:24:10] 第 1 代种群评估完成，最佳适应度: 0.85</div>
                      <div className="animate-pulse text-blue-400">_ 正在执行交叉变异操作...</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCreateView = () => (
    <div className="flex-1 p-6 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">部署新智能体</h2>
          <p className="text-zinc-400">配置并部署一个专门用于火法数值模拟的新智能体。</p>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">智能体名称 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="例如: 燃烧分析智能体"
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">角色定位 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="例如: 燃烧过程建模专家"
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">基础大模型</label>
              <select className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>Gemini 2.5 Pro (推荐，适合复杂推理)</option>
                <option>Gemini 2.5 Flash (适合快速响应)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">系统提示词 (System Prompt)</label>
              <textarea 
                rows={6}
                placeholder="定义智能体的行为准则、专业知识边界和输出格式..."
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-400">挂载工具 (Tools)</label>
              <div className="grid grid-cols-2 gap-3">
                {['OpenFOAM 接口', 'Cantera 燃烧动力学库', 'Python 数据分析环境', '知识库检索 (RAG)'].map((tool, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-zinc-950 border border-white/5 rounded-lg cursor-pointer hover:border-white/20 transition-colors">
                    <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500" />
                    <span className="text-sm text-zinc-300">{tool}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setView('list')} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              取消
            </button>
            <button onClick={() => setView('list')} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              保存并部署
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-4">
          {view !== 'list' && (
            <button onClick={() => setView('list')} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-500" />
            <h1 className="font-semibold text-lg">智能体</h1>
          </div>
        </div>
        {view === 'list' && (
          <button onClick={() => setView('create')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            部署新智能体
          </button>
        )}
      </div>

      {view === 'list' && renderListView()}
      {view === 'detail' && renderDetailView()}
      {view === 'create' && renderCreateView()}
    </div>
  );
}
