import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Play, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  History, 
  ChevronRight,
  FileText,
  Settings,
  Database,
  Layers,
  Cpu,
  Users,
  Lock,
  ClipboardCheck,
  FileCheck,
  Box,
  Zap,
  Repeat,
  BrainCircuit,
  GitBranch
} from 'lucide-react';
import { cn } from '../lib/utils';

// Types
interface SimulationConfig {
  project_name: string;
  project_id: string;
  description: string;
  owner: string;
  department: string;
  simulation_type: string[];
  workflow_template: string;
  agents: string[];
  materials: string[];
  equipment: { type: string; height: number; diameter: number };
  boundary_conditions: { temperature: number; pressure: number; flow_rate: number };
  solver_parameters: { mesh_size: number; time_step: number; tolerance: number };
  optimization_task: {
    input_variables: { name: string; min: number; max: number; step: number }[];
    objective_functions: { type: 'single' | 'multi'; metrics: string[]; weights: number[] }[];
    algorithm: { type: string; parameters: { iterations: number; population: number; convergence_threshold: number } };
  };
  iteration_results: {
    iteration_id: number;
    input_values: any;
    objective_values: any;
    status: 'completed' | 'running';
  }[];
  optimization_result: {
    best_input_values: any;
    best_objective_values: any;
    pareto_front: any[];
  };
  physical_verification: {
    verification_id: string;
    type: string;
    data_source: string;
    metrics: { temperature: number; composition: string; flow: number };
    timestamp: string;
  }[];
  advanced_settings: { parallel_nodes: number; output_frequency: number };
  permissions: { read: string[]; write: string[] };
  version: string;
  status: 'saved' | 'running' | 'completed' | 'verified' | 'optimized';
}

const steps = [
  { id: 0, key: 'basic', title: '基本信息', icon: FileText },
  { id: 1, key: 'type', title: '仿真类型', icon: Layers },
  { id: 2, key: 'workflow', title: '工作流配置', icon: GitBranch },
  { id: 3, key: 'agent', title: '智能体配置', icon: BrainCircuit },
  { id: 4, key: 'material', title: '物料配置', icon: Database },
  { id: 5, key: 'equipment', title: '设备配置', icon: Settings },
  { id: 6, key: 'boundary', title: '边界条件', icon: AlertCircle },
  { id: 7, key: 'solver', title: '仿真参数', icon: Cpu },
  { id: 8, key: 'optimization', title: '优化任务', icon: Zap },
  { id: 9, key: 'iteration', title: '多轮迭代', icon: Repeat },
  { id: 10, key: 'verification', title: '物理验证', icon: ClipboardCheck },
  { id: 11, key: 'advanced', title: '高级设置', icon: Settings },
  { id: 12, key: 'permission', title: '权限与版本', icon: Lock },
];

const mockMaterials = [
  { id: 'mat_01', name: '铁矿石 (Hematite)', density: 5.26, specific_heat: 0.65 },
  { id: 'mat_02', name: '焦炭 (Coke)', density: 1.90, specific_heat: 1.20 },
  { id: 'mat_03', name: '石灰石 (Limestone)', density: 2.71, specific_heat: 0.91 },
  { id: 'mat_04', name: '铜精矿 (Copper Concentrate)', density: 4.20, specific_heat: 0.55 },
];

const mockAgents = [
  { id: 'agent_01', name: '热力学平衡智能体', type: '分析', description: '用于计算复杂多相体系的平衡组成' },
  { id: 'agent_02', name: '高炉配料优化智能体', type: '优化', description: '基于成本和质量目标优化炉料结构' },
  { id: 'agent_03', name: '流场异常检测智能体', type: '监控', description: '实时分析流场数据并预警异常状态' },
  { id: 'agent_04', name: '转炉终点预测智能体', type: '预测', description: '预测转炉吹炼终点温度和碳含量' },
];

const mockEquipmentTemplates = [
  { id: 'eq_01', name: '高炉 (Blast Furnace) - 2500m³', type: 'furnace', default_h: 30, default_d: 12 },
  { id: 'eq_02', name: '转炉 (Converter) - 120t', type: 'converter', default_h: 10, default_d: 6 },
  { id: 'eq_03', name: '闪速炉 (Flash Furnace)', type: 'furnace', default_h: 15, default_d: 8 },
];

export function CreateSimulationCase() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SimulationConfig>({
    project_name: '',
    project_id: `SIM-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${Math.floor(Math.random()*1000)}`,
    description: '',
    owner: '当前用户',
    department: '冶金部',
    simulation_type: ['FVM'],
    workflow_template: '',
    agents: [],
    materials: [],
    equipment: { type: '', height: 0, diameter: 0 },
    boundary_conditions: { temperature: 1200, pressure: 101.3, flow_rate: 50 },
    solver_parameters: { mesh_size: 0.01, time_step: 0.001, tolerance: 1e-6 },
    optimization_task: {
      input_variables: [
        { name: '入口风温', min: 1000, max: 1300, step: 10 },
        { name: '富氧率', min: 21, max: 30, step: 1 }
      ],
      objective_functions: [
        { type: 'single', metrics: ['产量'], weights: [1.0] }
      ],
      algorithm: { 
        type: 'GA', 
        parameters: { iterations: 50, population: 20, convergence_threshold: 0.001 } 
      }
    },
    iteration_results: [],
    optimization_result: { best_input_values: {}, best_objective_values: {}, pareto_front: [] },
    physical_verification: [],
    advanced_settings: { parallel_nodes: 4, output_frequency: 100 },
    permissions: { read: ['public'], write: ['owner'] },
    version: '1.0.0',
    status: 'saved'
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Real-time validation
  useEffect(() => {
    const errors: string[] = [];
    if (!formData.project_name) errors.push('基本信息: 项目名称不能为空');
    if (formData.simulation_type.length === 0) errors.push('仿真类型: 至少选择一种仿真类型');
    if (!formData.workflow_template) errors.push('工艺流程: 请选择工艺流程模板');
    if (formData.materials.length === 0) errors.push('物料配置: 至少选择一种物料');
    if (!formData.equipment.type) errors.push('设备配置: 请选择设备模型');
    
    // Physics check
    if (formData.boundary_conditions.temperature > 3000) errors.push('边界条件: 温度过高 (>3000K)，请确认是否合理');
    if (formData.boundary_conditions.pressure < 0) errors.push('边界条件: 压力不能为负值');

    setValidationErrors(errors);
  }, [formData]);

  const handleInputChange = (section: keyof SimulationConfig, field: string, value: any) => {
    setFormData(prev => {
      if (section === 'project_name' || section === 'description' || section === 'owner' || section === 'department' || section === 'workflow_template' || section === 'version') {
        return { ...prev, [section]: value };
      }
      // Handle arrays
      if (section === 'simulation_type' || section === 'materials' || section === 'agents') {
         // Logic handled in specific handlers usually, but for generic:
         return { ...prev, [section]: value };
      }
      // Handle nested objects
      return {
        ...prev,
        [section]: {
          ...(prev[section] as object),
          [field]: value
        }
      };
    });
  };

  const handleSave = () => {
    // Mock save
    alert('项目已保存！ID: ' + formData.project_id);
    navigate('/simulation-studio');
  };

  const handleRun = () => {
    if (validationErrors.length > 0) {
      alert('请先修复验证错误');
      return;
    }
    // alert('仿真任务已提交至调度队列！');
    navigate(`/simulation/${formData.project_id}/status`);
  };

  const renderStepContent = () => {
    switch (steps[currentStep].key) {
      case 'basic': // Basic Info
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">项目名称 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.project_name}
                  onChange={(e) => handleInputChange('project_name', '', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="例如：高炉优化仿真_V1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">项目编号 (自动生成)</label>
                <input 
                  type="text" 
                  value={formData.project_id}
                  disabled
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2 text-zinc-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">负责人</label>
                <input 
                  type="text" 
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', '', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">所属部门</label>
                <select 
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', '', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="冶金部">冶金部</option>
                  <option value="研发中心">研发中心</option>
                  <option value="工程部">工程部</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-zinc-400">项目描述</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', '', e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                  placeholder="请输入项目背景、目标及预期成果..."
                />
              </div>
            </div>
          </div>
        );
      case 'type': // Simulation Type
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['FVM (有限体积法)', 'FEM (有限元法)', 'DEM (离散元法)'].map((type) => {
                const val = type.split(' ')[0];
                const isSelected = formData.simulation_type.includes(val);
                return (
                  <div 
                    key={val}
                    onClick={() => {
                      const newTypes = isSelected 
                        ? formData.simulation_type.filter(t => t !== val)
                        : [...formData.simulation_type, val];
                      handleInputChange('simulation_type', '', newTypes);
                    }}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5",
                      isSelected ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-white/10 text-zinc-400"
                    )}
                  >
                    <div className="font-semibold mb-2">{type}</div>
                    <div className="text-xs opacity-70">
                      {val === 'FVM' && '适用于流体流动、传热传质分析。'}
                      {val === 'FEM' && '适用于结构应力、热变形分析。'}
                      {val === 'DEM' && '适用于颗粒流动、散料堆积分析。'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">混合算法提示</p>
                <p className="opacity-80">选择多种算法将自动启用多物理场耦合求解器 (Coupled Solver)。例如 FVM + DEM 可用于气固两相流模拟（如高炉风口回旋区）。</p>
              </div>
            </div>
          </div>
        );
      case 'workflow': // Process Flow
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['高炉炼铁流程', '转炉炼钢流程', '铜闪速熔炼流程', '连铸流程'].map((template) => (
                <div 
                  key={template}
                  onClick={() => handleInputChange('workflow_template', '', template)}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between hover:bg-white/5",
                    formData.workflow_template === template ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-white/10 text-zinc-400"
                  )}
                >
                  <span className="font-medium">{template}</span>
                  {formData.workflow_template === template && <CheckCircle2 className="w-5 h-5" />}
                </div>
              ))}
            </div>
            {formData.workflow_template && (
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-4">流程预览: {formData.workflow_template}</h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {['原料准备', '加料', '熔炼/反应', '渣金分离', '排渣/出铁'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div className="px-4 py-2 bg-zinc-800 rounded-lg text-sm whitespace-nowrap border border-white/5">
                        {step}
                      </div>
                      {i < 4 && <div className="w-8 h-px bg-zinc-700 shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'agent': // Agent Configuration
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">选择参与仿真的智能体</h3>
              <button className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                <BrainCircuit className="w-4 h-4" />
                从智能体工作室导入
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAgents.map((agent) => {
                const isSelected = formData.agents.includes(agent.id);
                return (
                  <div 
                    key={agent.id}
                    onClick={() => {
                      const newAgents = isSelected 
                        ? formData.agents.filter(a => a !== agent.id)
                        : [...formData.agents, agent.id];
                      handleInputChange('agents', '', newAgents);
                    }}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5 flex flex-col h-full",
                      isSelected ? "bg-emerald-500/10 border-emerald-500" : "bg-zinc-900 border-white/10"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-2 rounded-lg", isSelected ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-400")}>
                          <BrainCircuit className="w-4 h-4" />
                        </div>
                        <span className={cn("font-medium", isSelected ? "text-emerald-400" : "text-white")}>{agent.name}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div className="text-xs text-zinc-500 mb-2 flex-1">{agent.description}</div>
                    <div className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-800/50 text-xs text-zinc-400 border border-white/5 self-start">
                      {agent.type}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'material': // Material
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">选择物料</h3>
              <button className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                <Database className="w-4 h-4" />
                从物料库导入
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {mockMaterials.map((mat) => {
                const isSelected = formData.materials.includes(mat.id);
                return (
                  <div 
                    key={mat.id}
                    onClick={() => {
                      const newMats = isSelected 
                        ? formData.materials.filter(m => m !== mat.id)
                        : [...formData.materials, mat.id];
                      handleInputChange('materials', '', newMats);
                    }}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between hover:bg-white/5",
                      isSelected ? "bg-emerald-500/10 border-emerald-500" : "bg-zinc-900 border-white/10"
                    )}
                  >
                    <div>
                      <div className={cn("font-medium", isSelected ? "text-emerald-400" : "text-white")}>{mat.name}</div>
                      <div className="text-xs text-zinc-500 mt-1">
                        密度: {mat.density} g/cm³ | 比热: {mat.specific_heat} J/(g·K)
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'equipment': // Equipment
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-400">选择设备模型</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockEquipmentTemplates.map((eq) => (
                  <div 
                    key={eq.id}
                    onClick={() => {
                      handleInputChange('equipment', 'type', eq.type);
                      handleInputChange('equipment', 'height', eq.default_h);
                      handleInputChange('equipment', 'diameter', eq.default_d);
                    }}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5",
                      formData.equipment.type === eq.type ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-zinc-900 border-white/10 text-zinc-400"
                    )}
                  >
                    <div className="font-semibold">{eq.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">高度 (m)</label>
                <input 
                  type="number" 
                  value={formData.equipment.height}
                  onChange={(e) => handleInputChange('equipment', 'height', parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">直径/宽度 (m)</label>
                <input 
                  type="number" 
                  value={formData.equipment.diameter}
                  onChange={(e) => handleInputChange('equipment', 'diameter', parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 flex items-center justify-center h-48 text-zinc-500">
              <div className="text-center">
                <Box className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>设备 3D 预览区域</p>
              </div>
            </div>
          </div>
        );
      case 'boundary': // Boundary
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">入口温度 (K)</label>
                <input 
                  type="number" 
                  value={formData.boundary_conditions.temperature}
                  onChange={(e) => handleInputChange('boundary_conditions', 'temperature', parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <p className="text-xs text-zinc-500">建议范围: 300K - 2000K</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">操作压力 (kPa)</label>
                <input 
                  type="number" 
                  value={formData.boundary_conditions.pressure}
                  onChange={(e) => handleInputChange('boundary_conditions', 'pressure', parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">入口流量 (kg/s)</label>
                <input 
                  type="number" 
                  value={formData.boundary_conditions.flow_rate}
                  onChange={(e) => handleInputChange('boundary_conditions', 'flow_rate', parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 'solver': // Solver
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">网格基础尺寸 (m)</label>
                <input 
                  type="number" 
                  value={formData.solver_parameters.mesh_size}
                  onChange={(e) => handleInputChange('solver_parameters', 'mesh_size', parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">时间步长 (s)</label>
                <input 
                  type="number" 
                  value={formData.solver_parameters.time_step}
                  onChange={(e) => handleInputChange('solver_parameters', 'time_step', parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">收敛精度 (Tolerance)</label>
                <input 
                  type="number" 
                  value={formData.solver_parameters.tolerance}
                  onChange={(e) => handleInputChange('solver_parameters', 'tolerance', parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 'optimization': // Optimization
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">输入变量设置</h3>
                <button className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                  + 添加变量
                </button>
              </div>
              <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-800/50 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">变量名称</th>
                      <th className="px-4 py-3 font-medium">最小值</th>
                      <th className="px-4 py-3 font-medium">最大值</th>
                      <th className="px-4 py-3 font-medium">步长</th>
                      <th className="px-4 py-3 font-medium text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {formData.optimization_task.input_variables.map((variable, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white">{variable.name}</td>
                        <td className="px-4 py-3 font-mono text-zinc-300">{variable.min}</td>
                        <td className="px-4 py-3 font-mono text-zinc-300">{variable.max}</td>
                        <td className="px-4 py-3 font-mono text-zinc-300">{variable.step}</td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-zinc-500 hover:text-red-400 transition-colors">删除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">目标函数</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">优化目标</label>
                    <select className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                      <option value="single">单目标优化</option>
                      <option value="multi">多目标优化 (Pareto)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">关注指标</label>
                    <div className="flex flex-wrap gap-2">
                      {['产量', '质量', '能耗', '排放'].map((metric) => (
                        <button
                          key={metric}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                            formData.optimization_task.objective_functions[0].metrics.includes(metric)
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                              : "bg-zinc-900 border-white/10 text-zinc-400 hover:bg-white/5"
                          )}
                        >
                          {metric}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">算法配置</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">优化算法</label>
                    <select 
                      value={formData.optimization_task.algorithm.type}
                      onChange={(e) => handleInputChange('optimization_task', 'algorithm', { ...formData.optimization_task.algorithm, type: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="GA">遗传算法 (Genetic Algorithm)</option>
                      <option value="Bayesian">贝叶斯优化 (Bayesian Optimization)</option>
                      <option value="RL">强化学习 (Reinforcement Learning)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">迭代次数</label>
                      <input 
                        type="number" 
                        value={formData.optimization_task.algorithm.parameters.iterations}
                        className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">种群规模</label>
                      <input 
                        type="number" 
                        value={formData.optimization_task.algorithm.parameters.population}
                        className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'iteration': // Iteration
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Repeat className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">多轮迭代策略配置</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
                系统将根据优化算法自动生成参数组合，并提交多轮仿真任务。请配置迭代执行策略。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                  <div className="text-zinc-500 text-xs mb-1">并行策略</div>
                  <div className="font-medium text-white">异步并行 (Async)</div>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                  <div className="text-zinc-500 text-xs mb-1">最大并发数</div>
                  <div className="font-medium text-white">4 任务</div>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                  <div className="text-zinc-500 text-xs mb-1">失败处理</div>
                  <div className="font-medium text-white">自动重试 (3次)</div>
                </div>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden">
              <div className="bg-zinc-800/50 px-4 py-3 border-b border-white/10 font-medium text-sm text-zinc-300">
                预估迭代计划
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/10">1</div>
                  <div className="flex-1">
                    <div className="text-white">初始种群生成</div>
                    <div className="text-zinc-500 text-xs">生成 20 组初始参数组合</div>
                  </div>
                  <div className="text-zinc-500">预计耗时: 2h</div>
                </div>
                <div className="w-0.5 h-4 bg-zinc-800 ml-4"></div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/10">2</div>
                  <div className="flex-1">
                    <div className="text-white">并行仿真计算</div>
                    <div className="text-zinc-500 text-xs">调用求解器进行数值模拟</div>
                  </div>
                  <div className="text-zinc-500">动态调度</div>
                </div>
                <div className="w-0.5 h-4 bg-zinc-800 ml-4"></div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border border-white/10">3</div>
                  <div className="flex-1">
                    <div className="text-white">收敛性判断 & 进化</div>
                    <div className="text-zinc-500 text-xs">根据目标函数值生成下一代参数</div>
                  </div>
                  <div className="text-zinc-500">自动循环</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'verification': // Verification
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">物理验证数据关联</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const newVerification = {
                      verification_id: `VER-${Math.floor(Math.random() * 1000)}`,
                      type: '实验数据',
                      data_source: 'Exp_Data_2024.csv',
                      metrics: { temperature: 1450, composition: 'Fe: 95%, C: 4%', flow: 12.5 },
                      timestamp: new Date().toLocaleDateString()
                    };
                    handleInputChange('physical_verification', '', [...formData.physical_verification, newVerification]);
                  }}
                  className="text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  上传实验数据
                </button>
                <button className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1 px-3 py-1.5 border border-emerald-500/20 rounded-lg bg-emerald-500/10 transition-colors">
                  <Database className="w-4 h-4" />
                  从数据库选择
                </button>
              </div>
            </div>

            {formData.physical_verification.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 bg-white/5">
                <ClipboardCheck className="w-12 h-12 mb-3 opacity-20" />
                <p>暂无关联的物理验证数据</p>
                <p className="text-xs mt-1 opacity-50">上传实验数据或关联物理模拟结果以进行验证比对</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.physical_verification.map((ver, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          {ver.verification_id}
                          <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">{ver.type}</span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-1 flex items-center gap-3">
                          <span>来源: {ver.data_source}</span>
                          <span>|</span>
                          <span>时间: {ver.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-zinc-400">
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">温度</div>
                        <div className="font-mono text-white">{ver.metrics.temperature} K</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">流量</div>
                        <div className="font-mono text-white">{ver.metrics.flow} kg/s</div>
                      </div>
                      <button 
                        onClick={() => {
                          const newVer = formData.physical_verification.filter((_, i) => i !== idx);
                          handleInputChange('physical_verification', '', newVer);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10 mt-4">
              <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                验证说明
              </h3>
              <p className="text-xs text-blue-300/80 leading-relaxed">
                关联物理验证数据后，系统将在仿真完成后自动生成误差分析报告。支持上传 CSV/Excel 格式的实验数据，或直接关联物理模拟实验库中的项目。
              </p>
            </div>
          </div>
        );
      case 'advanced': // Advanced
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">并行计算节点数</label>
                <select 
                  value={formData.advanced_settings.parallel_nodes}
                  onChange={(e) => handleInputChange('advanced_settings', 'parallel_nodes', parseInt(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="1">1 (Serial)</option>
                  <option value="4">4 Cores</option>
                  <option value="8">8 Cores</option>
                  <option value="16">16 Cores</option>
                  <option value="32">32 Cores (HPC)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">结果输出频率 (Steps)</label>
                <input 
                  type="number" 
                  value={formData.advanced_settings.output_frequency}
                  onChange={(e) => handleInputChange('advanced_settings', 'output_frequency', parseInt(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 'permission': // Permission
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">版本号</label>
              <input 
                type="text" 
                value={formData.version}
                onChange={(e) => handleInputChange('version', '', e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl">
              <h3 className="font-medium mb-3">权限概览</h3>
              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <span className="text-zinc-400">所有者</span>
                <span>{formData.owner} (读/写)</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                <span className="text-zinc-400">所在部门</span>
                <span>{formData.department} (只读)</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2">
                <span className="text-zinc-400">公开性</span>
                <span className="text-emerald-400">内部公开</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/simulation-studio')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">{formData.project_name || '新建仿真算例'}</h1>
            <div className="text-xs text-zinc-500 flex items-center gap-2">
              <span>ID: {formData.project_id}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span>{validationErrors.length === 0 ? '就绪' : '配置中'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/simulation-studio')} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            取消
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-white/10">
            <Save className="w-4 h-4" />
            保存草稿
          </button>
          <button onClick={handleRun} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Play className="w-4 h-4" />
            立即仿真
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Steps */}
        <div className="w-64 bg-zinc-900/50 border-r border-white/10 overflow-y-auto py-6">
          <div className="px-4 mb-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">配置步骤</div>
          <div className="space-y-1">
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all relative",
                    isActive ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  )}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs border shrink-0 transition-colors",
                    isActive ? "border-emerald-500 bg-emerald-500 text-white" : 
                    isCompleted ? "border-emerald-500/50 text-emerald-500" : "border-zinc-700 text-zinc-500"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
                  </div>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Main Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-950 relative">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-emerald-500" })}
                {steps[currentStep].title}
              </h2>
              <p className="text-zinc-400">配置仿真项目的{steps[currentStep].title}参数。</p>
            </div>
            
            {renderStepContent()}

            <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/10">
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一步
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="px-6 py-2 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                下一步
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Info */}
        <div className="w-72 bg-zinc-900 border-l border-white/10 p-6 overflow-y-auto hidden xl:block">
          <div className="space-y-8">
            {/* Validation */}
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                校验信息
              </h3>
              {validationErrors.length > 0 ? (
                <div className="space-y-2">
                  {validationErrors.map((err, i) => (
                    <div key={i} className="text-xs text-orange-400 bg-orange-500/10 p-2 rounded border border-orange-500/20">
                      {err}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  所有参数校验通过
                </div>
              )}
            </div>

            {/* Verification Preview */}
            {currentStep === 9 && formData.physical_verification.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                  验证数据预览
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-zinc-800/50 border border-white/5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-500">关键指标匹配度</span>
                      <span className="text-emerald-400">98.5%</span>
                    </div>
                    <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98.5%' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-zinc-800 rounded border border-white/5">
                      <div className="text-zinc-500">实验温度</div>
                      <div className="font-mono text-white">1450 K</div>
                    </div>
                    <div className="p-2 bg-zinc-800 rounded border border-white/5">
                      <div className="text-zinc-500">模拟设定</div>
                      <div className="font-mono text-zinc-300">1450 K</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                历史引用
              </h3>
              <div className="space-y-2">
                <div className="p-2 rounded bg-zinc-800/50 border border-white/5 hover:border-white/20 cursor-pointer transition-colors">
                  <div className="text-xs font-medium text-zinc-300">高炉_Case_2024_Final</div>
                  <div className="text-[10px] text-zinc-500 mt-1">引用了相同的物料参数</div>
                </div>
                <div className="p-2 rounded bg-zinc-800/50 border border-white/5 hover:border-white/20 cursor-pointer transition-colors">
                  <div className="text-xs font-medium text-zinc-300">转炉_V2_Template</div>
                  <div className="text-[10px] text-zinc-500 mt-1">边界条件模板</div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10">
              <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                小贴士
              </h3>
              <p className="text-xs text-blue-300/80 leading-relaxed">
                在配置边界条件时，建议先参考历史项目的收敛情况。对于高炉仿真，入口风温的微小变化可能显著影响炉腹煤气体积。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
