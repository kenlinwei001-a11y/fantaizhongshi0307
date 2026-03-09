import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Tag, 
  MoreHorizontal, 
  FileSpreadsheet, 
  FileJson, 
  Table as TableIcon,
  Network,
  Box,
  ArrowRight,
  ArrowLeft,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface Dataset {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'sql' | 'parquet' | 'stp';
  size: string;
  rows: number;
  updatedAt: string;
  tags: string[];
  owner: string;
}

const mockDatasets: Dataset[] = [
  { id: '1', name: '2025_Q1_工艺历史数据.csv', type: 'csv', size: '45 MB', rows: 125000, updatedAt: '2025-03-15', tags: ['工艺', '历史', '原始数据'], owner: '系统管理员' },
  { id: '2', name: '设备传感器日志_高炉A.parquet', type: 'parquet', size: '1.2 GB', rows: 4500000, updatedAt: '2025-03-14', tags: ['IoT', '传感器', '高炉'], owner: '设备组' },
  { id: '3', name: '转炉冶炼批次记录.csv', type: 'csv', size: '28 MB', rows: 85000, updatedAt: '2025-03-12', tags: ['转炉', '批次', '生产'], owner: '炼钢部' },
  { id: '4', name: '连铸机结晶器温度场.json', type: 'json', size: '156 MB', rows: 320000, updatedAt: '2025-03-11', tags: ['连铸', '温度场', '热工'], owner: '连铸组' },
  { id: '5', name: '能源消耗基准表.csv', type: 'csv', size: '12 KB', rows: 150, updatedAt: '2025-02-28', tags: ['能源', '基准', '配置'], owner: '能源管理' },
  { id: '6', name: '铜冶炼热力学数据.json', type: 'json', size: '5 MB', rows: 2000, updatedAt: '2025-03-01', tags: ['热力学', '物性', '铜'], owner: '物理智能体' },
  { id: '7', name: '闪速炉几何模型_V4.stp', type: 'stp', size: '85 MB', rows: 342, updatedAt: '2025-03-10', tags: ['几何', 'CAD', '模型'], owner: '几何智能体' },
  { id: '8', name: '钒钛磁铁矿成分分析.csv', type: 'csv', size: '8 MB', rows: 15000, updatedAt: '2025-03-05', tags: ['成分', '化验', '原料'], owner: '化验室' },
];

const ontologyData = {
  Material: ['矿石', '精矿', '金属', '炉渣', '合金', '气体', '杂质', '添加剂'],
  Process: ['焙烧', '熔炼', '还原', '氧化', '精炼', '浇铸', '制粒'],
  Equipment: ['高炉', '闪速炉', '电炉', '转炉', '钢包', '连铸机'],
  Physics: ['流体流动', '传热', '传质', '辐射', '相变'],
  Chemistry: ['反应', '平衡', '动力学', '催化'],
  Product: ['铜', '镍', '铁', '钢', '钒渣', '钛白粉'],
};

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'csv': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    case 'json': return <FileJson className="w-5 h-5 text-yellow-500" />;
    case 'sql': return <Database className="w-5 h-5 text-blue-500" />;
    case 'parquet': return <TableIcon className="w-5 h-5 text-purple-500" />;
    case 'stp': return <Box className="w-5 h-5 text-orange-500" />;
    default: return <Database className="w-5 h-5 text-zinc-500" />;
  }
};

// Generate mock data based on dataset ID
const generateMockData = (datasetId: string) => {
  const rows = [];
  const numRows = 500; // Generate 500 rows for demonstration
  
  const now = new Date();
  
  for (let i = 0; i < numRows; i++) {
    const time = new Date(now.getTime() - i * 5 * 60000).toISOString().replace('T', ' ').substring(0, 19);
    
    if (datasetId === '1') {
      rows.push({
        '时间': time,
        '温度(°C)': (1200 + Math.random() * 50).toFixed(2),
        '压力(kPa)': (350 + Math.random() * 20).toFixed(2),
        '流量(m³/h)': (15000 + Math.random() * 1000).toFixed(0),
        'O2浓度(%)': (21.5 + Math.random() * 2).toFixed(2),
        'CO浓度(%)': (15.2 + Math.random() * 3).toFixed(2),
        '状态': Math.random() > 0.95 ? '异常' : '正常'
      });
    } else if (datasetId === '2') {
      rows.push({
        '时间戳': time,
        '传感器ID': `SENS-BF-A-${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
        '振动频率(Hz)': (45 + Math.random() * 10).toFixed(2),
        '冷却水温(°C)': (35 + Math.random() * 5).toFixed(1),
        '炉顶压力(kPa)': (150 + Math.random() * 15).toFixed(1),
        '信号强度(dBm)': -(60 + Math.random() * 20).toFixed(0),
        '电池电量(%)': (80 + Math.random() * 20).toFixed(0)
      });
    } else if (datasetId === '3') {
      rows.push({
        '批次号': `HEAT-${now.getFullYear()}${String(now.getMonth()+1).padStart(2, '0')}-${String(i+1).padStart(4, '0')}`,
        '开始时间': time,
        '铁水重量(t)': (110 + Math.random() * 10).toFixed(1),
        '废钢重量(t)': (15 + Math.random() * 5).toFixed(1),
        '吹炼时间(min)': (16 + Math.random() * 4).toFixed(1),
        '终点温度(°C)': (1650 + Math.random() * 30).toFixed(1),
        '终点碳(%)': (0.05 + Math.random() * 0.03).toFixed(3),
        '合格判定': Math.random() > 0.9 ? '降级' : '合格'
      });
    } else if (datasetId === '4') {
      rows.push({
        '时间戳': time,
        '测点X(mm)': (Math.random() * 200).toFixed(1),
        '测点Y(mm)': (Math.random() * 1000).toFixed(1),
        '铜板温度(°C)': (150 + Math.random() * 80).toFixed(1),
        '水缝流速(m/s)': (6.5 + Math.random() * 1.5).toFixed(2),
        '热流密度(MW/m²)': (1.2 + Math.random() * 0.8).toFixed(3),
        '结晶器液位(mm)': (80 + Math.random() * 10).toFixed(1)
      });
    } else if (datasetId === '5') {
      const shifts = ['早班', '中班', '晚班'];
      const equipments = ['1#高炉', '2#高炉', '1#烧结机', '2#烧结机', '1#转炉'];
      rows.push({
        '日期': new Date(now.getTime() - i * 24 * 3600000).toISOString().split('T')[0],
        '设备名称': equipments[i % equipments.length],
        '班次': shifts[i % 3],
        '电耗(kWh/t)': (45 + Math.random() * 10).toFixed(2),
        '水耗(t/t)': (0.8 + Math.random() * 0.3).toFixed(2),
        '煤气消耗(m³/t)': (120 + Math.random() * 30).toFixed(1),
        '综合能耗(kgce/t)': (150 + Math.random() * 20).toFixed(1),
        '达标状态': Math.random() > 0.8 ? '超标' : '达标'
      });
    } else if (datasetId === '6') {
      const substances = ['Cu', 'Cu2O', 'CuO', 'Fe', 'FeO', 'Fe2O3', 'Fe3O4', 'SiO2', 'S2', 'SO2'];
      const states = ['s', 'l', 'g'];
      rows.push({
        '物质': substances[i % substances.length],
        '状态': states[i % states.length],
        '温度(K)': (298.15 + i * 50).toFixed(2),
        '焓(kJ/mol)': (Math.random() * 500 - 250).toFixed(2),
        '熵(J/mol·K)': (Math.random() * 200 + 20).toFixed(2),
        '热容(J/mol·K)': (Math.random() * 100 + 10).toFixed(2),
        '吉布斯自由能(kJ/mol)': (Math.random() * -800).toFixed(2)
      });
    } else if (datasetId === '7') {
      const parts = ['炉缸', '炉腹', '炉腰', '炉身', '炉喉', '风口', '铁口', '渣口', '冷却壁'];
      rows.push({
        '部件ID': `PART-${String(i + 1).padStart(4, '0')}`,
        '名称': `${parts[i % parts.length]}_${Math.floor(i/parts.length) + 1}`,
        '体积(m³)': (Math.random() * 50 + 1).toFixed(3),
        '表面积(m²)': (Math.random() * 200 + 5).toFixed(2),
        '网格数': Math.floor(Math.random() * 500000 + 10000),
        '材质': ['耐火砖', '碳砖', '铸铁', '铜', '钢'][i % 5],
        '几何状态': Math.random() > 0.9 ? '需修复' : '完好'
      });
    } else if (datasetId === '8') {
      rows.push({
        '样品编号': `SMP-VTI-${String(i + 1).padStart(5, '0')}`,
        '采样时间': time,
        'TFe(%)': (30 + Math.random() * 5).toFixed(2),
        'V2O5(%)': (0.5 + Math.random() * 0.8).toFixed(3),
        'TiO2(%)': (10 + Math.random() * 5).toFixed(2),
        'S(%)': (0.1 + Math.random() * 0.2).toFixed(3),
        'P(%)': (0.02 + Math.random() * 0.05).toFixed(3),
        'SiO2(%)': (15 + Math.random() * 5).toFixed(2),
        'Al2O3(%)': (8 + Math.random() * 4).toFixed(2),
        '检验员': ['张工', '李工', '王工', '赵工'][i % 4]
      });
    }
  }
  return rows;
};

export function DataCatalog() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'ontology'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const allTags = Array.from(new Set(mockDatasets.flatMap(d => d.tags)));

  const filteredDatasets = mockDatasets.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.every(t => d.tags.includes(t));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const detailData = useMemo(() => {
    if (!selectedDataset) return [];
    return generateMockData(selectedDataset.id);
  }, [selectedDataset]);

  if (selectedDataset) {
    const columns = detailData.length > 0 ? Object.keys(detailData[0]) : [];

    return (
      <div className="h-full flex flex-col bg-zinc-950 text-white animate-in fade-in duration-300">
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedDataset(null)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <div className="flex items-center gap-3">
              <TypeIcon type={selectedDataset.type} />
              <div>
                <h1 className="font-semibold text-lg">{selectedDataset.name}</h1>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{selectedDataset.size}</span>
                  <span>•</span>
                  <span>{selectedDataset.rows.toLocaleString()} 行</span>
                  <span>•</span>
                  <span>更新于 {selectedDataset.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-white/10">
              数据清洗
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出数据
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            {selectedDataset.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-zinc-300">
                {tag}
              </span>
            ))}
            <span className="text-xs text-zinc-500 ml-2">所有者: {selectedDataset.owner}</span>
          </div>

          <div className="flex-1 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="p-3 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">数据预览 (前 100 行)</span>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="在结果中搜索..." 
                  className="bg-zinc-950 border border-white/10 rounded pl-8 pr-3 py-1 text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none w-64"
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-950/50 text-zinc-400 font-medium sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 border-b border-white/10 bg-zinc-950 w-12 text-center">#</th>
                    {columns.map(col => (
                      <th key={col} className="px-4 py-3 border-b border-white/10 bg-zinc-950">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {detailData.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2 text-zinc-600 text-center text-xs">{i + 1}</td>
                      {columns.map(col => (
                        <td key={col} className={cn(
                          "px-4 py-2",
                          row[col] === '异常' || row[col] === '超标' || row[col] === '需修复' ? "text-red-400" : "text-zinc-300"
                        )}>
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white">
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            <h1 className="font-semibold text-lg">数据中心</h1>
          </div>
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                activeTab === 'catalog' ? "bg-zinc-700 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              数据目录
            </button>
            <button
              onClick={() => setActiveTab('ontology')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                activeTab === 'ontology' ? "bg-zinc-700 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              冶金本体
            </button>
          </div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
          + 添加数据源
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'catalog' ? (
          <div className="h-full p-6 overflow-y-auto">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="搜索数据集..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs border transition-colors whitespace-nowrap",
                      selectedTags.includes(tag) 
                        ? "bg-blue-500/20 border-blue-500 text-blue-400" 
                        : "bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/30"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Dataset List */}
            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-zinc-400 font-medium border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3">名称</th>
                    <th className="px-6 py-3">类型</th>
                    <th className="px-6 py-3">大小</th>
                    <th className="px-6 py-3">行数</th>
                    <th className="px-6 py-3">更新时间</th>
                    <th className="px-6 py-3">标签</th>
                    <th className="px-6 py-3">所有者</th>
                    <th className="px-6 py-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDatasets.map((dataset) => (
                    <tr 
                      key={dataset.id} 
                      onClick={() => setSelectedDataset(dataset)}
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <TypeIcon type={dataset.type} />
                          <span className="group-hover:text-blue-400 transition-colors">{dataset.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 uppercase">{dataset.type}</td>
                      <td className="px-6 py-4 text-zinc-400">{dataset.size}</td>
                      <td className="px-6 py-4 text-zinc-400 font-mono">{dataset.rows.toLocaleString()}</td>
                      <td className="px-6 py-4 text-zinc-400">{dataset.updatedAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {dataset.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-zinc-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{dataset.owner}</td>
                      <td className="px-6 py-4">
                        <button 
                          className="p-1 hover:bg-white/10 rounded text-zinc-500 hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more options
                          }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDatasets.length === 0 && (
                <div className="p-8 text-center text-zinc-500">
                  没有找到匹配的数据集
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(ontologyData).map(([category, items]) => (
                <motion.div 
                  key={category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-900 border border-white/10 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Box className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">{category}</h3>
                    <span className="ml-auto text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-400">
                      {items.length} 实体
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <div key={item} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-white/5 rounded-lg text-sm text-zinc-300 transition-colors cursor-default flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {/* Relationship Visualization Placeholder */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-zinc-900 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5 text-emerald-500" />
                  知识图谱关系预览
                </h3>
                <div className="h-64 bg-zinc-950 rounded-lg border border-white/5 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(10,minmax(0,1fr))] opacity-10">
                    {Array.from({ length: 200 }).map((_, i) => (
                      <div key={i} className="border-[0.5px] border-emerald-500/20" />
                    ))}
                  </div>
                  <div className="flex items-center gap-8 z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold">矿石</div>
                      <span className="text-xs text-zinc-500">原料</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-zinc-500">包含</span>
                      <ArrowRight className="w-6 h-6 text-zinc-600" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full border-2 border-purple-500 flex items-center justify-center text-purple-500 font-bold">铜</div>
                      <span className="text-xs text-zinc-500">元素</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-zinc-500">冶炼于</span>
                      <ArrowRight className="w-6 h-6 text-zinc-600" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 text-xs font-bold text-center p-1">闪速炉</div>
                      <span className="text-xs text-zinc-500">设备</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
