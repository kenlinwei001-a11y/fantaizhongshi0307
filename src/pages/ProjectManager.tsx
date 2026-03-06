import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FileCode, 
  Plus, 
  Search, 
  MoreVertical, 
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

interface SimulationCase {
  id: string;
  project_id: string;
  name: string;
  furnace_type: string;
  created_at: string;
}

export function ProjectManager() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [cases, setCases] = useState<Record<string, SimulationCase[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
      if (data.length > 0) {
        setActiveProject(data[0].id);
        fetchCases(data[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch projects', error);
      setLoading(false);
    }
  };

  const fetchCases = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/cases`);
      const data = await res.json();
      setCases(prev => ({ ...prev, [projectId]: data }));
    } catch (error) {
      console.error('Failed to fetch cases', error);
    }
  };

  const handleProjectClick = (projectId: string) => {
    setActiveProject(projectId);
    if (!cases[projectId]) {
      fetchCases(projectId);
    }
  };

  const handleCreateProject = async () => {
    const name = prompt('请输入项目名称:');
    if (!name) return;
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: '新项目', owner_id: 'current_user' })
      });
      const newProject = await res.json();
      setProjects([newProject, ...projects]);
      setActiveProject(newProject.id);
      setCases(prev => ({ ...prev, [newProject.id]: [] }));
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  const handleCreateCase = async (projectId: string) => {
    navigate('/simulation-studio/create');
  };

  return (
    <div className="h-full flex bg-zinc-950 text-white">
      {/* Sidebar: Projects List */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-zinc-900/50">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-500" />
            工程项目
          </h2>
          <button onClick={handleCreateProject} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="搜索项目..." 
              className="w-full bg-zinc-950 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            {projects.map(project => (
              <div 
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  activeProject === project.id 
                    ? 'bg-blue-500/10 border-blue-500/50' 
                    : 'bg-zinc-900 border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${activeProject === project.id ? 'text-blue-400' : 'text-zinc-300'}`}>
                    {project.name}
                  </span>
                  {activeProject === project.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
                <p className="text-xs text-zinc-500 truncate">{project.description}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-zinc-600">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {project.owner_id}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Cases List */}
      <div className="flex-1 flex flex-col">
        {activeProject ? (
          <>
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-zinc-900">
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {projects.find(p => p.id === activeProject)?.name}
                </h1>
                <p className="text-sm text-zinc-500">项目 ID: {activeProject}</p>
              </div>
              <button 
                onClick={() => handleCreateCase(activeProject)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                新建仿真算例
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <h3 className="text-lg font-medium text-zinc-300 mb-6 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-500" />
                仿真算例列表
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases[activeProject]?.map((simulationCase) => (
                  <div 
                    key={simulationCase.id}
                    className="bg-zinc-900 border border-white/10 rounded-xl p-5 hover:border-emerald-500/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-zinc-950 rounded-lg border border-white/5">
                        <FileCode className="w-6 h-6 text-emerald-500" />
                      </div>
                      <button className="text-zinc-500 hover:text-white">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <h4 className="text-lg font-medium text-white mb-1">{simulationCase.name}</h4>
                    <p className="text-sm text-zinc-500 mb-4">{simulationCase.furnace_type}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-zinc-600">
                        {new Date(simulationCase.created_at).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={() => navigate(`/simulation-studio?caseId=${simulationCase.id}`)}
                        className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1 font-medium"
                      >
                        打开编辑器 <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!cases[activeProject] || cases[activeProject].length === 0) && (
                  <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-zinc-500">暂无仿真算例，请点击右上角新建。</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            请选择一个项目以查看详情
          </div>
        )}
      </div>
    </div>
  );
}
