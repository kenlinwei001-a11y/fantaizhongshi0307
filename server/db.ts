import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'pyroforge.db');
const db = new Database(dbPath);

// Initialize Database Schema
const schema = `
  -- 1. User Permissions Domain
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    email TEXT,
    password_hash TEXT,
    role_id TEXT,
    organization_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS permissions (
    id TEXT PRIMARY KEY,
    code TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS role_permissions (
    role_id TEXT,
    permission_id TEXT,
    PRIMARY KEY (role_id, permission_id)
  );

  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT
  );

  -- 2. Engineering Projects Domain
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    owner_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS simulation_cases (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    name TEXT,
    furnace_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS case_parameters (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    parameter_name TEXT,
    value REAL,
    unit TEXT,
    FOREIGN KEY (case_id) REFERENCES simulation_cases(id)
  );

  CREATE TABLE IF NOT EXISTS geometry_models (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    file_path TEXT,
    mesh_status TEXT,
    FOREIGN KEY (case_id) REFERENCES simulation_cases(id)
  );

  CREATE TABLE IF NOT EXISTS mesh_models (
    id TEXT PRIMARY KEY,
    geometry_id TEXT,
    cell_count INTEGER,
    mesh_type TEXT,
    FOREIGN KEY (geometry_id) REFERENCES geometry_models(id)
  );

  -- 3. Simulation Models Domain
  CREATE TABLE IF NOT EXISTS physics_models (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    model_type TEXT,
    parameters TEXT, -- JSON
    FOREIGN KEY (case_id) REFERENCES simulation_cases(id)
  );

  CREATE TABLE IF NOT EXISTS reaction_models (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    reaction_equation TEXT,
    rate_constant REAL,
    FOREIGN KEY (case_id) REFERENCES simulation_cases(id)
  );

  CREATE TABLE IF NOT EXISTS material_properties (
    id TEXT PRIMARY KEY,
    material_name TEXT,
    density REAL,
    viscosity REAL,
    heat_capacity REAL
  );

  CREATE TABLE IF NOT EXISTS boundary_conditions (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    boundary_name TEXT,
    type TEXT,
    value REAL,
    FOREIGN KEY (case_id) REFERENCES simulation_cases(id)
  );

  CREATE TABLE IF NOT EXISTS initial_conditions (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    field_name TEXT,
    value REAL,
    FOREIGN KEY (case_id) REFERENCES simulation_cases(id)
  );

  CREATE TABLE IF NOT EXISTS solver_configs (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    solver_type TEXT,
    timestep REAL,
    max_iteration INTEGER,
    FOREIGN KEY (case_id) REFERENCES simulation_cases(id)
  );

  CREATE TABLE IF NOT EXISTS simulation_runs (
    id TEXT PRIMARY KEY,
    case_id TEXT,
    status TEXT,
    started_at DATETIME,
    finished_at DATETIME,
    FOREIGN KEY (case_id) REFERENCES simulation_cases(id)
  );

  -- 4. Numerical Computation Domain
  CREATE TABLE IF NOT EXISTS compute_nodes (
    id TEXT PRIMARY KEY,
    hostname TEXT,
    cpu_count INTEGER,
    gpu_count INTEGER,
    memory_gb INTEGER
  );

  CREATE TABLE IF NOT EXISTS job_queue (
    id TEXT PRIMARY KEY,
    run_id TEXT,
    node_id TEXT,
    status TEXT,
    FOREIGN KEY (run_id) REFERENCES simulation_runs(id),
    FOREIGN KEY (node_id) REFERENCES compute_nodes(id)
  );

  CREATE TABLE IF NOT EXISTS solver_iterations (
    id TEXT PRIMARY KEY,
    run_id TEXT,
    iteration INTEGER,
    residual REAL,
    FOREIGN KEY (run_id) REFERENCES simulation_runs(id)
  );

  CREATE TABLE IF NOT EXISTS timestep_results (
    id TEXT PRIMARY KEY,
    run_id TEXT,
    timestep INTEGER,
    result_file TEXT,
    FOREIGN KEY (run_id) REFERENCES simulation_runs(id)
  );

  CREATE TABLE IF NOT EXISTS field_results (
    id TEXT PRIMARY KEY,
    timestep_id TEXT,
    field_name TEXT,
    data_path TEXT,
    FOREIGN KEY (timestep_id) REFERENCES timestep_results(id)
  );

  CREATE TABLE IF NOT EXISTS convergence_metrics (
    id TEXT PRIMARY KEY,
    run_id TEXT,
    metric_name TEXT,
    value REAL,
    FOREIGN KEY (run_id) REFERENCES simulation_runs(id)
  );

  -- 5. Workflow Domain
  CREATE TABLE IF NOT EXISTS workflows (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS workflow_nodes (
    id TEXT PRIMARY KEY,
    workflow_id TEXT,
    node_type TEXT,
    config TEXT, -- JSON
    FOREIGN KEY (workflow_id) REFERENCES workflows(id)
  );

  CREATE TABLE IF NOT EXISTS workflow_edges (
    id TEXT PRIMARY KEY,
    source_node TEXT,
    target_node TEXT
  );

  CREATE TABLE IF NOT EXISTS workflow_runs (
    id TEXT PRIMARY KEY,
    workflow_id TEXT,
    status TEXT,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id)
  );

  CREATE TABLE IF NOT EXISTS workflow_logs (
    id TEXT PRIMARY KEY,
    run_id TEXT,
    log_text TEXT,
    FOREIGN KEY (run_id) REFERENCES workflow_runs(id)
  );

  -- 6. Agent Domain
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT
  );

  CREATE TABLE IF NOT EXISTS agent_tasks (
    id TEXT PRIMARY KEY,
    agent_id TEXT,
    task_type TEXT,
    status TEXT,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS agent_messages (
    id TEXT PRIMARY KEY,
    sender_agent TEXT,
    receiver_agent TEXT,
    content TEXT,
    FOREIGN KEY (sender_agent) REFERENCES agents(id),
    FOREIGN KEY (receiver_agent) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS agent_memory (
    id TEXT PRIMARY KEY,
    agent_id TEXT,
    memory_type TEXT,
    content TEXT, -- JSON
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );

  -- 7. Knowledge Base Domain
  CREATE TABLE IF NOT EXISTS ontology_entities (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS ontology_relations (
    id TEXT PRIMARY KEY,
    source_entity TEXT,
    target_entity TEXT,
    relation_type TEXT,
    FOREIGN KEY (source_entity) REFERENCES ontology_entities(id),
    FOREIGN KEY (target_entity) REFERENCES ontology_entities(id)
  );

  CREATE TABLE IF NOT EXISTS knowledge_documents (
    id TEXT PRIMARY KEY,
    title TEXT,
    file_path TEXT
  );

  CREATE TABLE IF NOT EXISTS knowledge_embeddings (
    id TEXT PRIMARY KEY,
    doc_id TEXT,
    embedding TEXT, -- Vector as TEXT/BLOB
    FOREIGN KEY (doc_id) REFERENCES knowledge_documents(id)
  );
`;

db.exec(schema);

export default db;
