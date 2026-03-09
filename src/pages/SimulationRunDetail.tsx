import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Pause,
  Square, 
  RotateCcw, 
  Download, 
  Activity, 
  Terminal, 
  Box, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Zap,
  BarChart3,
  ChevronRight,
  ChevronDown,
  LayoutTemplate,
  Save,
  Cpu,
  Flame
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ScatterChart, 
  Scatter, 
  ZAxis 
} from 'recharts';
import { cn } from '../lib/utils';
import { ThreeViewer } from '../components/ThreeViewer';

// Mock Data for Scenarios
const scenarios = [
  { id: 's1', name: '高炉本体 (Blast Furnace)', type: 'furnace', status: 'running', progress: 45, icon: Flame },
  { id: 's2', name: '热风炉 (Hot Stove)', type: 'heater', status: 'waiting', progress: 0, icon: Wind },
  { id: 's3', name: '除尘系统 (Dust Removal)', type: 'filter', status: 'waiting', progress: 0, icon: Layers },
];

const scenarioData: Record<string, {
  parameters: { label: string; value: string }[];
  indicators: { label: string; value: string; change: string; icon: any; color: string }[];
}> = {
  s1: { // Blast Furnace
    parameters: [
      { label: '物料', value: '铁矿石 (Hematite_01)' },
      { label: '设备', value: '高炉 (BF_2500m³)' },
      { label: '边界:入口温度', value: '1200 K' },
      { label: '求解器', value: 'SimpleFoam' },
    ],
    indicators: [
      { label: '炉腹温度', value: '1,450 K', change: '+1.2%', icon: Thermometer, color: 'text-red-500' },
      { label: '风口压力', value: '320 kPa', change: '0.0%', icon: Wind, color: 'text-blue-500' },
      { label: 'CO 浓度', value: '22.5 %', change: '+0.5%', icon: Droplets, color: 'text-purple-500' },
    ]
  },
  s2: { // Hot Stove
    parameters: [
      { label: '燃料', value: '高炉煤气' },
      { label: '设备', value: '热风炉 (HS_TypeA)' },
      { label: '边界:拱顶温度', value: '1350 K' },
      { label: '求解器', value: 'ReactingFoam' },
    ],
    indicators: [
      { label: '拱顶温度', value: '1,380 K', change: '+0.5%', icon: Thermometer, color: 'text-red-500' },
      { label: '废气温度', value: '350 K', change: '-1.2%', icon: Thermometer, color: 'text-orange-500' },
      { label: '热效率', value: '82.5 %', change: '+0.8%', icon: Zap, color: 'text-emerald-500' },
    ]
  },
  s3: { // Dust Removal
    parameters: [
      { label: '介质', value: '含尘烟气' },
      { label: '设备', value: '布袋除尘器' },
      { label: '边界:入口流速', value: '18 m/s' },
      { label: '求解器', value: 'MPPICFoam' },
    ],
    indicators: [
      { label: '入口压力', value: '150 kPa', change: '+2.1%', icon: Wind, color: 'text-blue-500' },
      { label: '出口含尘', value: '15 mg/m³', change: '-5.0%', icon: Layers, color: 'text-zinc-400' },
      { label: '压差', value: '1200 Pa', change: '+1.5%', icon: Activity, color: 'text-yellow-500' },
    ]
  }
};

// Mock Data for Charts
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

const mockParetoData = [
  { x: 10, y: 80, z: 200 },
  { x: 12, y: 78, z: 210 },
  { x: 15, y: 75, z: 220 },
  { x: 20, y: 70, z: 230 },
  { x: 25, y: 60, z: 240 },
  { x: 18, y: 72, z: 225 }, // Current
];

const mockLogs = [
  "[INFO] 任务初始化: ID #SIM-20240315-001",
  "[INFO] 加载场景: 高炉本体 (Blast Furnace)",
  "[INFO] 求解器初始化完成: OpenFOAM v2306",
  "[INFO] 网格加载成功: 2.5M 单元, 质量检查通过",
  "[INFO] 边界条件应用: Inlet_Velocity = 15 m/s, Temp = 1200K",
  "[INFO] AI优化模块: 遗传算法 (GA) 已就绪",
  "[INFO] 开始迭代计算...",
  "[INFO] Step 100: Residuals = 1.2e-2",
  "[INFO] Step 200: Residuals = 4.5e-3",
  "[INFO] Step 300: Residuals = 8.9e-4",
];

export function SimulationRunDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'running' | 'completed' | 'failed' | 'paused'>('running');
  const [progress, setProgress] = useState(45);
  const [activeScenario, setActiveScenario] = useState('s1');
  const [viewMode, setViewMode] = useState<'3d' | 'charts' | 'table'>('3d');
  const [chartData, setChartData] = useState(generateResiduals(50));
  const [logs, setLogs] = useState(mockLogs);
  const [iteration, setIteration] = useState(12);

  // Simulate real-time updates
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setStatus('completed');
            return 100;
          }
          return prev + 0.5;
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

        if (Math.random() > 0.7) {
          const isWarning = Math.random() > 0.9;
          const msg = isWarning 
            ? `[WARNING] Step ${chartData[chartData.length - 1].step}: Pressure fluctuation detected!` 
            : `[INFO] Step ${chartData[chartData.length - 1].step}: Iterating... Residuals check passed.`;
          setLogs(prev => [...prev, msg]);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, chartData]);

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white">
      {/* 1. Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div>
            <h1 className="font-semibold text-lg flex items-center gap-2">
              高炉优化仿真_V1
              <span className="text-zinc-500 font-normal text-sm">#{id}</span>
            </h1>
            <div className="flex items-center gap-3 text-xs">
              <span className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-opacity-10 border",
                status === 'running' ? "bg-emerald-500 border-emerald-500 text-emerald-400" : 
                status === 'paused' ? "bg-yellow-500 border-yellow-500 text-yellow-400" :
                "bg-blue-500 border-blue-500 text-blue-400"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full", status === 'running' && "animate-pulse bg-emerald-400", status === 'paused' && "bg-yellow-400", status === 'completed' && "bg-blue-400")} />
                {status === 'running' ? '运行中' : status === 'paused' ? '已暂停' : '已完成'}
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">AI 优化: 开启 (GA)</span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400">迭代: {iteration}/50</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {status === 'running' ? (
            <button 
              onClick={() => setStatus('paused')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-white/10"
            >
              <Pause className="w-4 h-4 fill-current" />
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
          <button 
            onClick={() => setStatus('failed')} // Mock stop
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-red-500/20"
          >
            <Square className="w-4 h-4 fill-current" />
            停止
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. Left Sidebar: Scenarios */}
        <div className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">仿真场景</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setActiveScenario(scenario.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors text-left group",
                  activeScenario === scenario.id ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  activeScenario === scenario.id ? "bg-emerald-500/20" : "bg-zinc-800 group-hover:bg-zinc-700"
                )}>
                  <scenario.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{scenario.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scenario.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-zinc-500">{scenario.progress}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-white/10">
            <button className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300 border border-dashed border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors">
              + 添加关联场景
            </button>
          </div>
        </div>

        {/* 3. Center: Main View */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
          {/* Toolbar */}
          <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('3d')}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2",
                  viewMode === '3d' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Box className="w-3.5 h-3.5" />
                3D 可视化
              </button>
              <button 
                onClick={() => setViewMode('charts')}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2",
                  viewMode === 'charts' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                图表分析
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2",
                  viewMode === 'table' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                参数表格
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span>当前迭代参数</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>历史最优</span>
              </div>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 relative overflow-hidden">
            {viewMode === '3d' && (
              <div className="absolute inset-0">
                <div className="absolute top-4 left-4 z-10 space-y-2">
                  <div className="bg-zinc-950/80 backdrop-blur px-3 py-2 rounded-lg border border-white/10 text-xs text-zinc-300">
                    <div className="font-medium text-white mb-1">高炉本体 - 温度场</div>
                    <div className="flex items-center gap-2">
                      <span>Max: 2450 K</span>
                      <span className="w-px h-3 bg-white/20" />
                      <span>Min: 300 K</span>
                    </div>
                  </div>
                </div>
                <ThreeViewer mode="result" />
              </div>
            )}
            
            {viewMode === 'charts' && (
              <div className="absolute inset-0 p-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-zinc-300 mb-4">残差收敛曲线</h3>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="step" stroke="#666" fontSize={12} tickLine={false} />
                          <YAxis stroke="#666" fontSize={12} tickLine={false} domain={[-8, 0]} />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                          <Legend />
                          <Line type="monotone" dataKey="continuity" stroke="#ef4444" dot={false} strokeWidth={2} />
                          <Line type="monotone" dataKey="xVelocity" stroke="#3b82f6" dot={false} strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-zinc-300 mb-4">关键指标监控 (炉温/压力)</h3>
                    <div className="flex-1 min-h-0 flex items-center justify-center text-zinc-500">
                      图表区域占位
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'table' && (
              <div className="absolute inset-0 p-6 overflow-y-auto">
                <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-800 text-zinc-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">参数名称</th>
                        <th className="px-6 py-3 font-medium">当前设定值</th>
                        <th className="px-6 py-3 font-medium">优化建议值</th>
                        <th className="px-6 py-3 font-medium">变化率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { name: '焦炭比例', current: '350 kg/t', optimized: '342 kg/t', change: '-2.3%' },
                        { name: '鼓风量', current: '6000 m³/min', optimized: '6150 m³/min', change: '+2.5%' },
                        { name: '富氧率', current: '3.5%', optimized: '3.8%', change: '+8.5%' },
                        { name: '顶压', current: '220 kPa', optimized: '225 kPa', change: '+2.2%' },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-white/5">
                          <td className="px-6 py-4 text-white">{row.name}</td>
                          <td className="px-6 py-4 text-zinc-300">{row.current}</td>
                          <td className="px-6 py-4 text-emerald-400 font-medium">{row.optimized}</td>
                          <td className={cn("px-6 py-4", row.change.startsWith('-') ? "text-emerald-500" : "text-orange-500")}>
                            {row.change}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Scenario Info Panel (Collapsible) */}
          <div className="h-48 bg-zinc-900 border-t border-white/10 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              场景参数概览
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {scenarioData[activeScenario]?.parameters.map((param, i) => (
                <div key={i} className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <div className="text-xs text-zinc-500 mb-1">{param.label}</div>
                  <div className="font-mono text-white">{param.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Right Panel: Info & Logs */}
        <div className="w-80 bg-zinc-900 border-l border-white/10 flex flex-col shrink-0 overflow-y-auto">
          {/* Real-time Indicators */}
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              实时关键指标
            </h3>
            <div className="space-y-3">
              {scenarioData[activeScenario]?.indicators.map((indicator, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-full bg-opacity-10 flex items-center justify-center", indicator.color.replace('text-', 'bg-').replace('500', '500/10'))}>
                      <indicator.icon className={cn("w-4 h-4", indicator.color)} />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">{indicator.label}</div>
                      <div className="font-mono font-medium text-white">{indicator.value}</div>
                    </div>
                  </div>
                  <div className={cn("text-xs", indicator.change.startsWith('+') ? "text-emerald-500" : indicator.change.startsWith('-') ? "text-red-500" : "text-zinc-500")}>
                    {indicator.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Optimization Status */}
          <div className="p-4 border-b border-white/10">
            <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              AI 优化迭代
            </h3>
            <div className="h-40 w-full mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" dataKey="x" name="产量" stroke="#666" fontSize={10} tickLine={false} />
                  <YAxis type="number" dataKey="y" name="能耗" stroke="#666" fontSize={10} tickLine={false} />
                  <ZAxis type="number" dataKey="z" range={[50, 200]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                  <Scatter name="Pareto" data={mockParetoData} fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-zinc-500 text-center mb-2">Pareto 前沿 (产量 vs 能耗)</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-950 p-2 rounded border border-white/5 text-center">
                <div className="text-zinc-500">当前代数</div>
                <div className="font-mono text-white">Gen 12</div>
              </div>
              <div className="bg-zinc-950 p-2 rounded border border-white/5 text-center">
                <div className="text-zinc-500">收敛度</div>
                <div className="font-mono text-emerald-500">98.2%</div>
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
              <div className="flex items-center gap-2">
                 <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[10px] text-zinc-500">Live</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 bg-zinc-950">
              {logs.map((log, i) => (
                <div key={i} className={cn(
                  "break-all",
                  log.includes("Warning") ? "text-yellow-500" : 
                  log.includes("Error") ? "text-red-500" : "text-zinc-400"
                )}>
                  <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
              <div className="animate-pulse text-emerald-500">_</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Footer */}
      <div className="h-12 bg-zinc-900 border-t border-white/10 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 w-1/3">
          <div className="text-xs text-zinc-400 whitespace-nowrap">总进度</div>
          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="text-xs font-mono text-white w-10">{progress}%</div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-xs text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
            <Save className="w-3.5 h-3.5" />
            保存快照
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button className="text-xs text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
            <Download className="w-3.5 h-3.5" />
            导出数据
          </button>
        </div>
      </div>
    </div>
  );
}
