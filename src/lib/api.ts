import { Project, Simulation, SimulationWorkflow } from '../types';

export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  return res.json();
}

export async function createProject(name: string, description: string): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
}

export async function getProject(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`);
  return res.json();
}

export async function getSimulations(projectId: string): Promise<Simulation[]> {
  const res = await fetch(`/api/projects/${projectId}/simulations`);
  return res.json();
}

export async function createSimulation(projectId: string, name: string, solver: string): Promise<Simulation> {
  const res = await fetch('/api/simulations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, name, solver }),
  });
  return res.json();
}

export async function getWorkflow(simulationId: string): Promise<SimulationWorkflow> {
  const res = await fetch(`/api/simulations/${simulationId}/workflow`);
  return res.json();
}

export async function runSimulation(simulationId: string): Promise<{ status: string }> {
  const res = await fetch(`/api/simulations/${simulationId}/run`, {
    method: 'POST',
  });
  return res.json();
}

export async function getSimulationStatus(simulationId: string): Promise<{ status: string; progress: number }> {
  const res = await fetch(`/api/simulations/${simulationId}/status`);
  return res.json();
}
