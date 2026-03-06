import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { TopBar } from '../components/TopBar';
import { NodeLibraryPanel } from '../components/NodeLibrary';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { CopilotPanel } from '../components/CopilotPanel';
import { BottomPanel } from '../components/BottomPanel';
import { WorkflowCanvas } from '../components/WorkflowCanvas';
import { ThreeViewer } from '../components/ThreeViewer';
import { Layers, Box } from 'lucide-react';
import { cn } from '../lib/utils';
import { createProject, createSimulation, runSimulation, getSimulationStatus } from '../lib/api';
import { Project } from '../types';

function WorkflowDesignerContent() {
  const [activeTab, setActiveTab] = useState<'workflow' | '3d'>('workflow');
  const [logs, setLogs] = useState<string[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const { getNodes, getEdges } = useReactFlow();

  // Initialize a default project and simulation on mount
  useEffect(() => {
    async function init() {
      try {
        const newProject = await createProject('演示项目', '由 AI 创建');
        setProject(newProject);
        const simulation = await createSimulation(newProject.id, '运行 001', 'OpenFOAM');
        setSimulationId(simulation.id);
        setLogs(prev => [...prev, `项目已初始化: ${newProject.name}`, `模拟已创建: ${simulation.name}`]);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  const handleRun = async () => {
    if (!simulationId || isRunning) return;
    
    setIsRunning(true);
    setLogs(prev => [...prev, '开始模拟...']);
    
    try {
      await runSimulation(simulationId);
      
      // Poll for status
      const interval = setInterval(async () => {
        const status = await getSimulationStatus(simulationId);
        if (status.status === 'running') {
           setLogs(prev => [...prev, `运行中... 进度: ${status.progress}%`]);
        } else if (status.status === 'completed') {
           setLogs(prev => [...prev, '模拟成功完成！']);
           setIsRunning(false);
           clearInterval(interval);
        } else if (status.status === 'failed') {
           setLogs(prev => [...prev, '模拟失败。']);
           setIsRunning(false);
           clearInterval(interval);
        }
      }, 1000);
    } catch (e) {
      console.error(e);
      setLogs(prev => [...prev, '启动模拟出错']);
      setIsRunning(false);
    }
  };

  const handleSave = useCallback(() => {
    const nodes = getNodes();
    const edges = getEdges();
    console.log('Saving workflow:', { nodes, edges });
    setLogs(prev => [...prev, `工作流已保存: ${nodes.length} 节点, ${edges.length} 连接`]);
    // TODO: Save to backend API
  }, [getNodes, getEdges]);

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white overflow-hidden">
      <TopBar projectName={project?.name} onRun={handleRun} onSave={handleSave} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Node Library (Replaces Project Panel) */}
        <NodeLibraryPanel />

        {/* Center: Canvas / 3D Viewer */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Tabs */}
          <div className="h-10 bg-zinc-900 border-b border-white/10 flex items-center px-2 gap-1">
            <button
              onClick={() => setActiveTab('workflow')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-colors",
                activeTab === 'workflow' ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Layers className="w-3 h-3" />
              工作流
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-2 transition-colors",
                activeTab === '3d' ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Box className="w-3 h-3" />
              3D 视图
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 relative bg-zinc-950">
            {activeTab === 'workflow' ? (
              <WorkflowCanvas />
            ) : (
              <div className="absolute inset-0">
                <ThreeViewer />
              </div>
            )}
          </div>

          {/* Bottom Panel */}
          <BottomPanel logs={logs} />
        </div>

        {/* Right: Copilot & Properties */}
        <div className="flex h-full border-l border-white/10">
          <CopilotPanel />
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export function WorkflowDesigner() {
  return (
    <ReactFlowProvider>
      <WorkflowDesignerContent />
    </ReactFlowProvider>
  );
}
