import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Wind, 
  ArrowRightLeft, 
  Cpu, 
  Play, 
  Eye, 
  Zap,
  ChevronRight,
  FlaskConical,
  Save,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

import { ThreeViewer } from '../components/ThreeViewer';

// Placeholder components for each step
const GeometryEditor = () => (
  <div className="p-6 h-full flex flex-col">
    <h2 className="text-xl font-semibold text-white mb-4">几何建模</h2>
    <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
      <div className="col-span-1 bg-zinc-900/50 border border-white/10 rounded-xl p-4 overflow-y-auto">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">模型树</h3>
        <div className="space-y-2">
          {['炉体 (Furnace_Body)', '风口_01 (Tuyere_01)', '风口_02 (Tuyere_02)', '排烟道 (Offgas_Duct)'].map(item => (
            <div key={item} className="flex items-center gap-2 text-zinc-300 p-2 hover:bg-white/5 rounded cursor-pointer">
              <Box className="w-4 h-4 text-emerald-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden relative">
        <ThreeViewer mode="geometry" />
      </div>
    </div>
  </div>
);

const MeshStudio = () => (
  <div className="p-6 h-full flex flex-col">
    <h2 className="text-xl font-semibold text-white mb-4">网格划分</h2>
    <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
      <div className="col-span-1 space-y-6 overflow-y-auto">
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">网格参数</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">网格类型</label>
              <select className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300 text-sm">
                <option>非结构化 (Unstructured)</option>
                <option>结构化 (Structured)</option>
                <option>自适应 (Adaptive)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">单元尺寸 (mm)</label>
              <input type="number" defaultValue={5} className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300 text-sm" />
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">质量检查</h3>
          <div className="flex items-center justify-between text-sm text-zinc-300 mb-2">
            <span>偏斜度 (Skewness)</span>
            <span className="text-emerald-500">0.85 (良好)</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[85%]" />
          </div>
        </div>
      </div>
      <div className="col-span-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden relative">
        <ThreeViewer mode="mesh" />
      </div>
    </div>
  </div>
);

const PhysicsSetup = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-white mb-4">物理场设置</h2>
    <div className="grid grid-cols-2 gap-6">
      {[
        { id: 'flow', label: '流体流动', icon: Wind, active: true },
        { id: 'heat', label: '传热', icon: Zap, active: true },
        { id: 'reaction', label: '化学反应', icon: FlaskConical, active: false },
        { id: 'particle', label: '颗粒运动', icon: Box, active: false },
      ].map(model => (
        <div key={model.id} className={`p-6 rounded-xl border cursor-pointer transition-all ${
          model.active 
            ? 'bg-emerald-500/10 border-emerald-500/50' 
            : 'bg-zinc-900/50 border-white/10 hover:border-white/20'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${model.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                <model.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-white">{model.label}</span>
            </div>
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
              model.active ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'
            }`}>
              {model.active && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
          <p className="text-sm text-zinc-400">
            {model.active ? '已启用该物理模型' : '点击启用该物理模型'}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const BoundarySetup = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-white mb-4">边界条件</h2>
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1 space-y-4">
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">边界类型</h3>
          <div className="space-y-2">
            {['入口 (Inlet)', '出口 (Outlet)', '壁面 (Wall)', '热源 (Heat Source)'].map(type => (
              <div key={type} className="flex items-center gap-2 text-zinc-300 p-2 hover:bg-white/5 rounded cursor-pointer border border-transparent hover:border-white/10">
                <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">参数设置</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">速度 (m/s)</label>
              <input type="number" defaultValue={10} className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300 text-sm" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">温度 (K)</label>
              <input type="number" defaultValue={1273} className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300 text-sm" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 bg-zinc-900 border border-white/10 rounded-xl h-[600px] flex items-center justify-center relative">
        <div className="absolute top-4 right-4 bg-zinc-950/80 p-2 rounded text-xs text-zinc-400">
          已选: Inlet_01
        </div>
        <Box className="w-16 h-16 text-zinc-600 opacity-50" />
        <span className="mt-4 text-zinc-500">3D 边界选择视图</span>
      </div>
    </div>
  </div>
);

const SolverControl = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-white mb-4">求解器控制</h2>
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-zinc-400 block mb-2">求解器类型</label>
          <select className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300">
            <option>SIMPLE (稳态压力耦合)</option>
            <option>PISO (瞬态计算)</option>
            <option>Coupled (耦合求解器)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-400 block mb-2">时间步长 (s)</label>
            <input type="number" defaultValue={0.01} className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-400 block mb-2">迭代次数</label>
            <input type="number" defaultValue={1000} className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-400 block mb-2">收敛标准</label>
          <div className="space-y-2">
            {['连续性 (Continuity)', 'X-速度', 'Y-速度', 'Z-速度', '能量 (Energy)'].map(item => (
              <div key={item} className="flex items-center justify-between text-sm text-zinc-300">
                <span>{item}</span>
                <input type="text" defaultValue="1e-4" className="w-24 bg-zinc-950 border border-white/10 rounded px-2 py-1 text-right" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500">
        <Cpu className="w-16 h-16 mb-4 opacity-50" />
        <p>求解器配置预览</p>
      </div>
    </div>
  </div>
);

const SimulationRun = ({ caseId }: { caseId: string | null }) => {
  const [status, setStatus] = useState('ready');
  const [progress, setProgress] = useState(0);

  const handleRun = async () => {
    if (!caseId) return;
    setStatus('running');
    try {
      const res = await fetch(`/api/cases/${caseId}/run`, { method: 'POST' });
      const data = await res.json();
      // Poll for status
      const interval = setInterval(async () => {
        // In a real app, we'd poll /api/cases/:id/runs or similar
        // For now, just simulate progress
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('completed');
            return 100;
          }
          return p + 10;
        });
      }, 1000);
    } catch (error) {
      console.error('Run failed', error);
      setStatus('failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4">运行仿真</h2>
      <div className="space-y-6">
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">算例 ID: {caseId}</h3>
              <p className="text-sm text-zinc-400">状态: {
                status === 'ready' ? '就绪' : 
                status === 'running' ? '运行中' : 
                status === 'completed' ? '已完成' : '失败'
              }</p>
            </div>
            <button 
              onClick={handleRun}
              disabled={status === 'running'}
              className={`px-6 py-3 font-medium rounded-lg flex items-center gap-2 transition-colors ${
                status === 'running' 
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {status === 'running' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {status === 'running' ? '计算中...' : '开始计算'}
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>进度</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 h-[400px] overflow-y-auto font-mono text-sm text-zinc-400">
          <div className="text-emerald-500 mb-2">[INFO] 仿真初始化成功。</div>
          {progress > 10 && <div className="mb-1">时间步 1: 残差 = 1.2e-2</div>}
          {progress > 30 && <div className="mb-1">时间步 2: 残差 = 8.5e-3</div>}
          {progress > 60 && <div className="mb-1">时间步 3: 残差 = 5.1e-3</div>}
          {progress > 90 && <div className="mb-1">...</div>}
          {status === 'running' && <div className="text-zinc-500 mt-2 animate-pulse">计算中...</div>}
          {status === 'completed' && <div className="text-emerald-500 mt-2">计算完成。</div>}
        </div>
      </div>
    </div>
  );
};

const Visualization = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-white mb-4">结果可视化</h2>
    <div className="grid grid-cols-4 gap-6 h-[600px]">
      <div className="col-span-1 bg-zinc-900/50 border border-white/10 rounded-xl p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">显示控制</h3>
          <div className="space-y-2">
            {['切片 (Slice)', '等值面 (Iso-Surface)', '流线 (Streamlines)', '矢量 (Vectors)'].map(item => (
              <label key={item} className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900 text-emerald-500" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">变量选择</h3>
          <select className="w-full bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300 text-sm">
            <option>温度 (Temperature)</option>
            <option>压力 (Pressure)</option>
            <option>速度 (Velocity)</option>
            <option>浓度 (Concentration)</option>
          </select>
        </div>
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">动画控制</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-zinc-800 rounded hover:bg-zinc-700 text-white"><Play className="w-4 h-4" /></button>
            <div className="flex-1 bg-zinc-800 h-1 rounded-full">
              <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center relative">
        <div className="absolute bottom-4 right-4 bg-zinc-950/80 p-4 rounded border border-white/10">
          <div className="text-xs text-zinc-400 mb-2">温度 (K)</div>
          <div className="h-32 w-4 bg-gradient-to-t from-blue-600 via-green-500 to-red-600 rounded-full" />
          <div className="flex flex-col justify-between h-32 text-[10px] text-zinc-500 absolute top-10 right-2">
            <span>1800</span>
            <span>300</span>
          </div>
        </div>
        <Eye className="w-16 h-16 text-zinc-600 opacity-50" />
        <span className="mt-4 text-zinc-500">3D 结果查看器 (VTK.js)</span>
      </div>
    </div>
  </div>
);

const Optimization = () => (
  <div className="p-6">
    <h2 className="text-xl font-semibold text-white mb-4">优化求解</h2>
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">优化目标</h3>
          <div className="flex gap-4">
            <select className="flex-1 bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300">
              <option>最大化效率 (Maximize Efficiency)</option>
              <option>最小化能耗 (Minimize Energy Consumption)</option>
              <option>最大化产量 (Maximize Throughput)</option>
            </select>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">约束条件</h3>
          <div className="space-y-3">
            {['温度 < 1600 K', '压力 < 5 atm', '氧气 > 2%'].map(c => (
              <div key={c} className="flex items-center justify-between bg-zinc-950 border border-white/10 rounded px-3 py-2 text-zinc-300">
                <span>{c}</span>
                <button className="text-zinc-500 hover:text-white">×</button>
              </div>
            ))}
            <button className="w-full py-2 border border-dashed border-zinc-700 text-zinc-500 rounded hover:border-zinc-500 hover:text-zinc-300 text-sm">
              + 添加约束
            </button>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">算法选择</h3>
          <div className="grid grid-cols-3 gap-3">
            {['遗传算法', '粒子群算法', '模拟退火'].map(algo => (
              <div key={algo} className="border border-zinc-700 rounded p-3 text-center text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer">
                {algo}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">优化过程</h3>
        <div className="h-[400px] flex items-end justify-between gap-1 px-4 pb-4 border-b border-zinc-800">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors rounded-t" style={{ height: `${Math.random() * 100}%` }} />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg">
            运行优化
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Removed duplicate import
const steps = [
  { id: 'geometry', label: '几何建模', icon: Box, component: GeometryEditor },
  { id: 'mesh', label: '网格划分', icon: Grid, component: MeshStudio },
  { id: 'physics', label: '物理场设置', icon: Wind, component: PhysicsSetup },
  { id: 'boundary', label: '边界条件', icon: ArrowRightLeft, component: BoundarySetup },
  { id: 'solver', label: '求解器控制', icon: Cpu, component: SolverControl },
  { id: 'run', label: '运行仿真', icon: Play, component: () => null }, // Handled explicitly
  { id: 'viz', label: '结果可视化', icon: Eye, component: Visualization },
  { id: 'opt', label: '优化求解', icon: Zap, component: Optimization },
];

export default function SimulationStudio() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  const [activeStep, setActiveStep] = useState('geometry');
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    if (caseId) {
      fetch(`/api/cases/${caseId}`)
        .then(res => res.json())
        .then(data => setCaseData(data))
        .catch(err => console.error(err));
    }
  }, [caseId]);

  const ActiveComponent = steps.find(s => s.id === activeStep)?.component || GeometryEditor;

  const handleSave = () => {
    console.log('Saving project...');
    // TODO: Implement save logic to backend
    alert('项目已保存');
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="h-16 border-b border-white/10 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <FlaskConical className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              {caseData ? caseData.name : '仿真数值模拟'}
            </h1>
            <p className="text-xs text-zinc-500">
              {caseData ? `算例 ID: ${caseData.id}` : '仿真数值模拟'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            保存项目
          </button>
          <button 
            onClick={() => setActiveStep('run')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            开始计算
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Steps Sidebar */}
        <div className="w-64 border-r border-white/10 bg-zinc-900/30 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-1">
            {steps.map((step, index) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full" />
                  )}
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{step.label}</div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 relative">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {/* Pass caseId to components that need it */}
            {activeStep === 'run' ? (
              <SimulationRun caseId={caseId} />
            ) : (
              <ActiveComponent />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
