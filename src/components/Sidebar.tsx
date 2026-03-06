import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  GitFork, 
  Bot, 
  Box, 
  BarChart3, 
  BrainCircuit, 
  Settings,
  Menu,
  FlaskConical
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/' },
  { icon: Database, label: '数据目录', path: '/data' },
  { icon: GitFork, label: '工作流设计', path: '/workflow' },
  { icon: Bot, label: '智能体工作室', path: '/agents' },
  { icon: Box, label: '仿真模型', path: '/simulation' },
  { icon: FlaskConical, label: '仿真工作室', path: '/simulation-studio' },
  { icon: BarChart3, label: '结果探索', path: '/results' },
  { icon: BrainCircuit, label: '决策中心', path: '/decision' },
  { icon: Settings, label: '系统管理', path: '/admin' },
];

export function Sidebar() {
  return (
    <div className="h-screen w-16 md:w-64 bg-zinc-950 border-r border-white/10 flex flex-col shrink-0">
      <div className="h-14 flex items-center px-4 border-b border-white/10">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <span className="ml-3 font-bold text-white hidden md:block truncate">
          AI 仿真操作系统
        </span>
      </div>

      <div className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border-r-2 border-emerald-500"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="ml-3 hidden md:block">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
            AD
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-white">管理员</div>
            <div className="text-xs text-zinc-500">admin@company.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
