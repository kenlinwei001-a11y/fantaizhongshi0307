import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Database, 
  BrainCircuit, 
  Calculator, 
  GitBranch, 
  Settings, 
  BarChart 
} from 'lucide-react';
import { cn } from '../lib/utils';

const NodeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'data': return <Database className="w-4 h-4" />;
    case 'ai': return <BrainCircuit className="w-4 h-4" />;
    case 'agent': return <BrainCircuit className="w-4 h-4" />;
    case 'simulation': return <Calculator className="w-4 h-4" />;
    case 'decision': return <GitBranch className="w-4 h-4" />;
    case 'control': return <Settings className="w-4 h-4" />;
    case 'viz': return <BarChart className="w-4 h-4" />;
    default: return <Settings className="w-4 h-4" />;
  }
};

const NodeColor = ({ type }: { type: string }) => {
  switch (type) {
    case 'data': return 'border-blue-500 bg-blue-500/10 text-blue-400';
    case 'ai': return 'border-purple-500 bg-purple-500/10 text-purple-400';
    case 'agent': return 'border-indigo-500 bg-indigo-500/10 text-indigo-400';
    case 'simulation': return 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
    case 'decision': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
    case 'control': return 'border-zinc-500 bg-zinc-500/10 text-zinc-400';
    case 'viz': return 'border-pink-500 bg-pink-500/10 text-pink-400';
    default: return 'border-zinc-500 bg-zinc-500/10 text-zinc-400';
  }
};

export const CustomNode = memo(({ data, type, selected }: NodeProps) => {
  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md border-2 min-w-[150px] transition-all",
      NodeColor({ type: data.type as string }),
      selected ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900" : ""
    )}>
      <div className="flex items-center">
        <div className={cn(
          "rounded-full p-1 mr-2", 
          // NodeColor({ type: data.type as string }).replace('border-', 'bg-').replace('text-', 'text-white ') 
          // Simplified for now
          "bg-white/10"
        )}>
          <NodeIcon type={data.type as string} />
        </div>
        <div className="text-sm font-bold">{data.label as string}</div>
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-zinc-400" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-zinc-400" />
    </div>
  );
});
