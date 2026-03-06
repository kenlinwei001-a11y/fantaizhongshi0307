/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { WorkflowDesigner } from './pages/WorkflowDesigner';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}

import { AgentStudio } from './pages/AgentStudio';
import { DataCatalog } from './pages/DataCatalog';
import { ResultExplorer } from './pages/ResultExplorer';
import { ProjectManager } from './pages/ProjectManager';
import SimulationStudio from './pages/SimulationStudio';
import { CreateSimulationCase } from './pages/CreateSimulationCase';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-8 flex items-center justify-center h-full text-zinc-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-300 mb-2">{title}</h2>
        <p>该模块正在开发中...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workflow" element={<WorkflowDesigner />} />
          <Route path="/data" element={<DataCatalog />} />
          <Route path="/agents" element={<AgentStudio />} />
          {/* Simulation Studio Module */}
          <Route path="/simulation-studio" element={<ProjectManager />} />
          <Route path="/simulation-studio/create" element={<CreateSimulationCase />} />
          <Route path="/simulation-studio/editor" element={<SimulationStudio />} />
          
          <Route path="/results" element={<ResultExplorer />} />
          <Route path="/decision" element={<PlaceholderPage title="决策中心" />} />
          <Route path="/admin" element={<PlaceholderPage title="系统管理" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
