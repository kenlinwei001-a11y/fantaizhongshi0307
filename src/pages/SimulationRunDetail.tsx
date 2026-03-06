import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Activity, 
  Terminal, 
  Box, 
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';
import { ThreeViewer } from '../components/ThreeViewer';

// Mock data for charts
const generateResiduals = (steps: number) => {
  const data = [];
  let continuity = 1e-1;
  let xVelocity = 1e-1;
  let yVelocity = 1e-1;
  let energy = 1e-1;

  for (let i = 0; i <= steps; i++) {
    continuity = Math.max(1e-6, continuity * (0.95 + Math.random() * 0.1));
    xVelocity = Math.max(1e-7, xVelocity * (0.92 + Math.random() * 0.12));
    yVelocity = Math.max(1e-7, yVelocity * (0.93 + Math.random() * 0.11));
    energy = Math.max(1e-8, energy * (0.90 + Math.random() * 0.15));

    data.push({
      step: i,
      continuity: Math.log10(continuity),
      xVelocity: Math.log10(xVelocity),
      yVelocity: Math.log10(yVelocity),
      energy: Math.log10(energy),
    });
  }
  return data;
};

const mockLogs = [
  "[INFO] 求解器初始化完成",
  "[INFO] 网格加载成功: 2.5M 单元",
  "[INFO] 边界条件应用: Inlet_Velocity = 15 m/s",
  "[INFO] 开始迭代计算...",
  "[INFO] Step 100: Residuals = 1.2e-2",
  "[INFO] Step 200: Residuals = 4.5e-3",
  "[INFO] Step 300: Residuals = 8.9e-4",
  "[INFO] Step 400: Residuals = 1.2e-4",
  "[INFO] Step 500: Residuals = 5.6e-5",
];

export function SimulationRunDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'running' | 'completed' | 'failed' | 'paused'>('running');
  const [progress, setProgress] = useState(45);
  const [chartData, setChartData] = useState(generateResiduals(50));
  const [logs, setLogs] = useState(mockLogs);
  const [activeTab, setActiveTab] = useState<'residuals' | 'monitors'>('residuals');

  // Simulate real-time updates
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setStatus('completed');
            return 100;
          }
          return prev + 1;
        });

        setChartData(prev => {
          const lastStep = prev[prev.length - 1].step;
          const newStep = lastStep + 10;
          const lastVals = prev[prev.length - 1];
          
          return [...prev, {
            step: newStep,
            continuity: lastVals.continuity - 0.1 * Math.random(),
            xVelocity: lastVals.xVelocity - 0.15 * Math.random(),
            yVelocity: lastVals.yVelocity - 0.12 * Math.random(),
            energy: lastVals.energy - 0.2 * Math.random(),
          }];
        });

        setLogs(prev => [...prev, `[INFO] Step ${chartData[chartData.length - 1].step}: Iterating...`]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, chartData]);

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div>
            <h1 className="font-semibold text-lg flex items-center gap-2">
              仿真任务详情
              <span className="text-zinc-500 font-normal text-sm">#{id}</span>
            </h1>
            <div className="flex items-center gap-3 text-xs">
              <span className={cn(
                "flex items-center gap-1",
                status === 'running' ? "text-emerald-400" : 
                status === 'completed' ? "text-blue-400" : "text-zinc-400"
              )}>
                {status === 'running' && <Activity className="w-3 h-3 animate-pulse" />}
                {status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                {status === 'running' ? '计算中' : status === 'completed' ? '已完成' : '已暂停'}
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">求解器: OpenFOAM (SimpleFoam)</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">核心数: 32</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {status === 'running' ? (
            <button 
              onClick={() => setStatus('paused')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-white/10"
            >
              <Square className="w-4 h-4 fill-current" />
              暂停
            </button>
          ) : (
            <button 
              onClick={() => setStatus('running')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              继续
            </button>
          )}
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-white/10">
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <Download className="w-4 h-4" />
            导出结果
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Visualization & Charts */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
          {/* Top: 3D View */}
          <div className="h-1/2 bg-zinc-900 relative border-b border-white/10">
            <div className="absolute top-4 left-4 z-10 bg-zinc-950/80 backdrop-blur px-3 py-1.5 rounded-md border border-white/10 text-xs font-medium text-zinc-300 flex items-center gap-2">
              <Box className="w-3 h-3 text-blue-400" />
              实时流场预览
            </div>
            <ThreeViewer mode="result" />
          </div>

          {/* Bottom: Charts */}
          <div className="h-1/2 bg-zinc-950 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-white/10">
                <button 
                  onClick={() => setActiveTab('residuals')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    activeTab === 'residuals' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  残差曲线 (Residuals)
                </button>
                <button 
                  onClick={() => setActiveTab('monitors')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    activeTab === 'monitors' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  监控点 (Monitors)
                </button>
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                Step: {chartData[chartData.length - 1].step}
              </div>
            </div>

            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="step" stroke="#666" fontSize={12} tickLine={false} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} domain={[-8, 0]} label={{ value: 'Log10(Residual)', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="continuity" stroke="#ef4444" dot={false} strokeWidth={2} name="Continuity" />
                  <Line type="monotone" dataKey="xVelocity" stroke="#3b82f6" dot={false} strokeWidth={2} name="Ux" />
                  <Line type="monotone" dataKey="yVelocity" stroke="#10b981" dot={false} strokeWidth={2} name="Uy" />
                  <Line type="monotone" dataKey="energy" stroke="#f59e0b" dot={false} strokeWidth={2} name="Energy" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Info & Logs */}
        <div className="w-80 bg-zinc-900 flex flex-col shrink-0">
          {/* Progress Card */}
          <div className="p-6 border-b border-white/10">
            <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              任务进度
            </h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-white">{progress}%</span>
              <span className="text-xs text-zinc-500 mb-1">预计剩余: 12m 30s</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                <div className="text-zinc-500 mb-1">已运行时间</div>
                <div className="font-mono text-zinc-300">01:45:22</div>
              </div>
              <div className="bg-zinc-950 p-3 rounded-lg border border-white/5">
                <div className="text-zinc-500 mb-1">总迭代步数</div>
                <div className="font-mono text-zinc-300">15,000</div>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-zinc-900">
              <div className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                运行日志
              </div>
              <button className="text-[10px] text-blue-400 hover:text-blue-300">下载日志</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 bg-zinc-950">
              {logs.map((log, i) => (
                <div key={i} className="text-zinc-400 break-all">
                  <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              <div className="animate-pulse text-emerald-500">_</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
