import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Cpu, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold">系统概览</h1>
        <p className="text-zinc-400">实时监控仿真引擎与智能体网络状态</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">活跃仿真任务</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 运行正常
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">智能体在线</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">24/25</div>
          <div className="text-xs text-zinc-500 mt-1">
            1 个智能体离线 (维护中)
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">计算资源使用率</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">78%</div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '78%' }} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-400 text-sm">系统告警</span>
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold">3</div>
          <div className="text-xs text-yellow-500 mt-1">
            需要关注
          </div>
        </div>
      </div>

      {/* Recent Simulations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">最近仿真任务</h2>
          <div className="space-y-4">
            {[
              { id: 'sim-001', name: '高炉优化_V3', status: 'running', progress: 45, time: '2分钟前' },
              { id: 'sim-002', name: '闪速炉流场分析_Case01', status: 'completed', progress: 100, time: '1小时前' },
              { id: 'sim-003', name: '转炉传热模拟_Test', status: 'completed', progress: 100, time: '3小时前' },
              { id: 'sim-004', name: '喷嘴磨损预测_M12', status: 'failed', progress: 12, time: '5小时前' },
            ].map((sim, i) => (
              <div 
                key={i} 
                onClick={() => navigate(`/simulation/${sim.id}/status`)}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    sim.status === 'running' ? "bg-emerald-500 animate-pulse" :
                    sim.status === 'completed' ? "bg-blue-500" :
                    "bg-red-500"
                  )} />
                  <div>
                    <div className="font-medium text-sm">{sim.name}</div>
                    <div className="text-xs text-zinc-500">{sim.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", 
                        sim.status === 'failed' ? "bg-red-500" : "bg-emerald-500"
                      )} 
                      style={{ width: `${sim.progress}%` }} 
                    />
                  </div>
                  <span className="text-xs text-zinc-400 w-8 text-right">{sim.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">智能体状态</h2>
          <div className="space-y-3">
            {[
              { name: '几何智能体', role: '几何处理', status: 'active' },
              { name: '网格智能体', role: '网格划分', status: 'working' },
              { name: '物理智能体', role: '物理建模', status: 'active' },
              { name: 'HPC 智能体', role: '资源调度', status: 'idle' },
              { name: '求解器智能体', role: '求解计算', status: 'working' },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                    {agent.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{agent.name}</div>
                    <div className="text-xs text-zinc-500">{agent.role}</div>
                  </div>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  agent.status === 'active' ? "bg-emerald-500/10 text-emerald-400" :
                  agent.status === 'working' ? "bg-blue-500/10 text-blue-400" :
                  "bg-zinc-500/10 text-zinc-400"
                )}>
                  {agent.status === 'active' ? '在线' : agent.status === 'working' ? '工作中' : '空闲'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
