import React from 'react';
import { 
  BarChart3, 
  Filter, 
  Download, 
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../lib/utils';

import { useNavigate } from 'react-router-dom';

const mockChartData = Array.from({ length: 20 }, (_, i) => ({
  time: `T+${i * 5}m`,
  temperature: 1200 + Math.random() * 100 - 50,
  pressure: 500 + Math.random() * 50 - 25,
  efficiency: 85 + Math.random() * 10 - 5,
}));

const mockResults = [
  { id: 'SIM-001', name: '高炉优化_基准', status: 'completed', score: 92.5, duration: '45m', created: '2025-03-15 10:00' },
  { id: 'SIM-002', name: '高炉优化_参数A', status: 'completed', score: 94.2, duration: '48m', created: '2025-03-15 11:30' },
  { id: 'SIM-003', name: '高炉优化_参数B', status: 'failed', score: 0, duration: '12m', created: '2025-03-15 13:15' },
  { id: 'SIM-004', name: '高炉优化_参数C', status: 'running', score: 0, duration: '25m', created: '2025-03-15 14:00' },
  { id: 'SIM-005', name: '转炉提钒_底吹氩气搅拌', status: 'completed', score: 88.5, duration: '35m', created: '2025-03-16 09:00' },
  { id: 'SIM-006', name: '转炉提钒_冷却剂加入策略', status: 'running', score: 0, duration: '15m', created: '2025-03-16 10:30' },
  { id: 'SIM-007', name: '转炉提钒_钒渣氧化动力学', status: 'waiting', score: 0, duration: '-', created: '2025-03-16 11:00' },
];

export function ResultExplorer() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white">
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          <h1 className="font-semibold text-lg">仿真项目</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 border border-white/10">
            <RefreshCw className="w-4 h-4" />
            刷新
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-300">温度与压力变化趋势</h3>
              <select className="bg-zinc-800 border border-white/10 rounded text-xs px-2 py-1 text-zinc-400 outline-none">
                <option>最近 1 小时</option>
                <option>最近 24 小时</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="温度 (°C)" dot={false} />
                  <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} name="压力 (kPa)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-zinc-300">热效率分布</h3>
              <select className="bg-zinc-800 border border-white/10 rounded text-xs px-2 py-1 text-zinc-400 outline-none">
                <option>所有批次</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="efficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="热效率 (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center gap-4">
            <h3 className="font-semibold text-zinc-300">仿真结果列表</h3>
            <div className="flex-1" />
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="筛选结果..." 
                className="bg-zinc-800 border border-white/10 rounded pl-8 pr-3 py-1 text-xs text-white focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400 font-medium border-b border-white/10">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">名称</th>
                <th className="px-6 py-3">状态</th>
                <th className="px-6 py-3">评分</th>
                <th className="px-6 py-3">耗时</th>
                <th className="px-6 py-3">创建时间</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockResults.map((res) => (
                <tr key={res.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-zinc-500">{res.id}</td>
                  <td className="px-6 py-4 font-medium">{res.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs border",
                      res.status === 'completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      res.status === 'running' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      res.status === 'waiting' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                      {res.status === 'completed' ? '完成' : res.status === 'running' ? '运行中' : res.status === 'waiting' ? '等待中' : '失败'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {res.score > 0 ? res.score : '-'}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{res.duration}</td>
                  <td className="px-6 py-4 text-zinc-400">{res.created}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/simulation/${res.id}/status`)}
                      className="text-purple-400 hover:text-purple-300 text-xs font-medium"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
