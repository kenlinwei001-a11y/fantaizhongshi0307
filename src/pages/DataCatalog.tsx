import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

interface Dataset {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'sql' | 'parquet';
  size: string;
  rows: number;
  updatedAt: string;
  tags: string[];
  owner: string;
}

const mockDatasets: Dataset[] = [
  { id: '1', name: '2025_Q1_工艺历史数据.csv', type: 'csv', size: '45 MB', rows: 125000, updatedAt: '2025-03-15', tags: ['工艺', '历史', '原始数据'], owner: '系统管理员' },
  { id: '2', name: '设备传感器日志_高炉A.parquet', type: 'parquet', size: '1.2 GB', rows: 4500000, updatedAt: '2025-03-14', tags: ['IoT', '传感器', '高炉'], owner: '设备组' },
  { id: '5', name: '能源消耗基准表.csv', type: 'csv', size: '12 KB', rows: 150, updatedAt: '2025-02-28', tags: ['能源', '基准', '配置'], owner: '能源管理' },
  { id: '6', name: '铜冶炼热力学数据.json', type: 'json', size: '5 MB', rows: 2000, updatedAt: '2025-03-01', tags: ['热力学', '物性', '铜'], owner: '物理智能体' },
  { id: '7', name: '闪速炉几何模型_V4.stp', type: 'sql', size: '85 MB', rows: 0, updatedAt: '2025-03-10', tags: ['几何', 'CAD', '模型'], owner: '几何智能体' },
];

const ontologyData = {
  Material: ['矿石', '精矿', '金属', '炉渣', '合金', '气体', '杂质', '添加剂'],
  Process: ['焙烧', '熔炼', '还原', '氧化', '精炼', '浇铸', '制粒'],
  Equipment: ['高炉', '闪速炉', '电炉', '转炉', '钢包', '连铸机'],
  Physics: ['流体流动', '传热', '传质', '辐射', '相变'],
  Chemistry: ['反应', '平衡', '动力学', '催化'],
  Product: ['铜', '镍', '铁', '钢'],
};

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'csv': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    case 'json': return <FileJson className="w-5 h-5 text-yellow-500" />;
    case 'sql': return <Database className="w-5 h-5 text-blue-500" />;
    case 'parquet': return <TableIcon className="w-5 h-5 text-purple-500" />;
    default: return <Database className="w-5 h-5 text-zinc-500" />;
  }
};

export function DataCatalog() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'ontology'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
                    <tr key={dataset.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        <TypeIcon type={dataset.type} />
                        {dataset.name}
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
                        <button className="p-1 hover:bg-white/10 rounded text-zinc-500 hover:text-white transition-colors">
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
