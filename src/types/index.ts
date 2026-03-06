export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Simulation {
  id: string;
  project_id: string;
  name: string;
  status: 'draft' | 'running' | 'completed' | 'failed';
  solver: string;
  progress: number;
  created_at: string;
}

export interface WorkflowNodeData {
  label: string;
  [key: string]: any;
}

export interface WorkflowNode {
  id: string;
  type: string;
  data: WorkflowNodeData;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface SimulationWorkflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
