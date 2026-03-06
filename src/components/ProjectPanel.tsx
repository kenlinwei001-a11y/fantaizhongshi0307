import React from 'react';
import { Folder, FileCode, Box, Layers, Zap, Database, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: React.ReactNode;
  children?: ProjectItem[];
}

const mockProjectStructure: ProjectItem[] = [
  {
    id: 'geometry',
    name: '几何模型',
    type: 'folder',
    icon: <Box className="w-4 h-4 text-blue-400" />,
    children: [
      { id: 'furnace.stp', name: '高炉.stp', type: 'file' },
    ],
  },
  {
    id: 'mesh',
    name: '网格',
    type: 'folder',
    icon: <Layers className="w-4 h-4 text-purple-400" />,
    children: [
      { id: 'mesh_3M_cells', name: '300万网格', type: 'file' },
    ],
  },
  {
    id: 'materials',
    name: '材料',
    type: 'folder',
    icon: <Database className="w-4 h-4 text-yellow-400" />,
    children: [
      { id: 'molten_iron', name: '铁水', type: 'file' },
      { id: 'slag', name: '炉渣', type: 'file' },
    ],
  },
  {
    id: 'boundary',
    name: '边界条件',
    type: 'folder',
    icon: <Zap className="w-4 h-4 text-red-400" />,
    children: [
      { id: 'inlet', name: '入口', type: 'file' },
      { id: 'outlet', name: '出口', type: 'file' },
      { id: 'wall', name: '壁面', type: 'file' },
    ],
  },
  {
    id: 'results',
    name: '结果',
    type: 'folder',
    icon: <FileCode className="w-4 h-4 text-green-400" />,
    children: [
      { id: 'run_001', name: '运行_001', type: 'file' },
      { id: 'run_002', name: '运行_002', type: 'file' },
    ],
  },
];

const ProjectTreeItem = ({ item, level = 0 }: { item: ProjectItem; level?: number }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 hover:bg-white/5 cursor-pointer text-sm text-zinc-300 select-none",
          level > 0 && "pl-6"
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren && (
          <span className="text-zinc-500">
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        {!hasChildren && <span className="w-3" />}
        {item.icon || <Folder className="w-4 h-4 text-zinc-500" />}
        <span>{item.name}</span>
      </div>
      {isOpen && item.children?.map((child) => (
        <ProjectTreeItem key={child.id} item={child} level={level + 1} />
      ))}
    </div>
  );
};

export function ProjectPanel() {
  return (
    <div className="h-full bg-zinc-900 border-r border-white/10 flex flex-col w-64">
      <div className="p-3 border-b border-white/10 font-medium text-zinc-400 text-xs uppercase tracking-wider">
        项目资源管理器
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {mockProjectStructure.map((item) => (
          <ProjectTreeItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
