import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  data: CustomNode,
  ai: CustomNode,
  simulation: CustomNode,
  decision: CustomNode,
  control: CustomNode,
  viz: CustomNode,
};

const initialNodes: Node[] = [
  { id: '1', type: 'data', position: { x: 250, y: 50 }, data: { label: '数据获取', type: 'data' } },
  { id: '2', type: 'ai', position: { x: 250, y: 150 }, data: { label: 'LLM 查询', type: 'ai' } },
  { id: '3', type: 'simulation', position: { x: 250, y: 250 }, data: { label: '场景构建', type: 'simulation' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow/label');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: uuidv4(),
        type,
        position,
        data: { label: label, type: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div className="h-full w-full bg-zinc-950" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
      >
        <Controls className="bg-zinc-800 border-zinc-700 fill-white" />
        <MiniMap className="bg-zinc-900 border-zinc-800" nodeColor="#10b981" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#3f3f46" />
      </ReactFlow>
    </div>
  );
}
