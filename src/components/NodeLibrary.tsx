import React, { useState } from 'react';
import { 
  Database, 
  BrainCircuit, 
  Calculator, 
  GitBranch, 
  BarChart, 
  Settings, 
  Search, 
  ChevronDown, 
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NodeCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  nodes: { id: string; name: string; type: string }[];
}

const nodeCategories: NodeCategory[] = [
  {
    id: 'data',
    name: '数据节点',
    icon: <Database className="w-4 h-4 text-blue-400" />,
    nodes: [
      { id: 'data_fetch', name: '数据获取', type: 'data' },
      { id: 'data_join', name: '数据合并', type: 'data' },
      { id: 'data_filter', name: '数据过滤', type: 'data' },
      { id: 'data_clean', name: '数据清洗', type: 'data' },
      { id: 'feature_build', name: '特征构建', type: 'data' },
      { id: 'dataset_snapshot', name: '数据快照', type: 'data' },
      { id: 'schema_validate', name: 'Schema校验', type: 'data' },
      { id: 'data_transform', name: '数据转换', type: 'data' },
      { id: 'data_aggregate', name: '数据聚合', type: 'data' },
      { id: 'data_export', name: '数据导出', type: 'data' },
    ]
  },
  {
    id: 'ai',
    name: 'AI 节点',
    icon: <BrainCircuit className="w-4 h-4 text-purple-400" />,
    nodes: [
      { id: 'llm_query', name: 'LLM 查询', type: 'ai' },
      { id: 'prompt_node', name: 'Prompt 节点', type: 'ai' },
      { id: 'embedding', name: 'Embedding', type: 'ai' },
      { id: 'vector_search', name: '向量检索', type: 'ai' },
      { id: 'rag_query', name: 'RAG 查询', type: 'ai' },
      { id: 'agent_execute', name: 'Agent 执行', type: 'ai' },
      { id: 'model_predict', name: '模型预测', type: 'ai' },
      { id: 'model_train', name: '模型训练', type: 'ai' },
      { id: 'anomaly_detect', name: '异常检测', type: 'ai' },
      { id: 'forecast', name: '预测', type: 'ai' },
    ]
  },
  {
    id: 'simulation',
    name: '仿真节点',
    icon: <Calculator className="w-4 h-4 text-emerald-400" />,
    nodes: [
      { id: 'scenario_builder', name: '场景构建', type: 'simulation' },
      { id: 'parameter_generator', name: '参数生成', type: 'simulation' },
      { id: 'constraint_builder', name: '约束构建', type: 'simulation' },
      { id: 'monte_carlo', name: '蒙特卡洛', type: 'simulation' },
      { id: 'simulation_run', name: '仿真运行', type: 'simulation' },
      { id: 'optimization_run', name: '优化运行', type: 'simulation' },
      { id: 'solver_node', name: '求解器节点', type: 'simulation' },
      { id: 'sensitivity_analysis', name: '敏感性分析', type: 'simulation' },
    ]
  },
  {
    id: 'decision',
    name: '决策节点',
    icon: <GitBranch className="w-4 h-4 text-yellow-400" />,
    nodes: [
      { id: 'kpi_calculate', name: 'KPI 计算', type: 'decision' },
      { id: 'decision_tree', name: '决策树', type: 'decision' },
      { id: 'what_if', name: 'What-If 分析', type: 'decision' },
    ]
  },
  {
    id: 'control',
    name: '控制节点',
    icon: <Settings className="w-4 h-4 text-zinc-400" />,
    nodes: [
      { id: 'start', name: '开始', type: 'control' },
      { id: 'end', name: '结束', type: 'control' },
      { id: 'if', name: '条件 (If)', type: 'control' },
      { id: 'switch', name: '分支 (Switch)', type: 'control' },
      { id: 'loop', name: '循环 (Loop)', type: 'control' },
      { id: 'parallel', name: '并行 (Parallel)', type: 'control' },
      { id: 'human_approval', name: '人工审批', type: 'control' },
      { id: 'webhook', name: 'Webhook', type: 'control' },
    ]
  },
  {
    id: 'visualization',
    name: '可视化',
    icon: <BarChart className="w-4 h-4 text-pink-400" />,
    nodes: [
      { id: 'chart', name: '图表', type: 'viz' },
      { id: 'dashboard', name: '仪表盘', type: 'viz' },
      { id: 'table', name: '表格', type: 'viz' },
      { id: 'map', name: '地图', type: 'viz' },
      { id: 'heatmap', name: '热力图', type: 'viz' },
      { id: 'network_graph', name: '网络图', type: 'viz' },
    ]
  }
];

export function NodeLibraryPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['data', 'ai', 'simulation']);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeLabel: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow/label', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full bg-zinc-900 flex flex-col w-full">
      <div className="p-3 border-b border-white/10">
        <div className="font-medium text-zinc-400 text-xs uppercase tracking-wider mb-2">
          节点库
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索节点..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 border-none rounded-md py-1.5 pl-8 pr-2 text-xs text-white placeholder-zinc-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {nodeCategories.map((category) => (
          <div key={category.id} className="mb-1">
            <div
              className="flex items-center gap-2 py-1.5 px-3 hover:bg-white/5 cursor-pointer text-sm text-zinc-300 select-none"
              onClick={() => toggleCategory(category.id)}
            >
              <span className="text-zinc-500">
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </span>
              {category.icon}
              <span className="font-medium">{category.name}</span>
            </div>
            
            {expandedCategories.includes(category.id) && (
              <div className="pl-4 pr-2 space-y-1 mt-1">
                {category.nodes
                  .filter(node => node.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((node) => (
                    <div
                      key={node.id}
                      className="flex items-center gap-2 py-1.5 px-3 bg-zinc-800/50 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 rounded cursor-grab active:cursor-grabbing text-xs text-zinc-300 transition-colors"
                      draggable
                      onDragStart={(event) => onDragStart(event, node.type, node.name)}
                    >
                      <GripVertical className="w-3 h-3 text-zinc-600" />
                      {node.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
