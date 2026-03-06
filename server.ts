import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './server/db';
import { v4 as uuidv4 } from 'uuid';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // 1. Projects API
  app.get('/api/projects', (req, res) => {
    const stmt = db.prepare('SELECT * FROM projects ORDER BY created_at DESC');
    const projects = stmt.all();
    res.json(projects);
  });

  app.post('/api/projects', (req, res) => {
    const { name, description, owner_id } = req.body;
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO projects (id, name, description, owner_id) VALUES (?, ?, ?, ?)');
    stmt.run(id, name, description, owner_id || 'system');
    res.json({ id, name, description, owner_id });
  });

  app.get('/api/projects/:id', (req, res) => {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const project = stmt.get(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  });

  // 2. Simulation Cases API
  app.get('/api/projects/:projectId/cases', (req, res) => {
    const stmt = db.prepare('SELECT * FROM simulation_cases WHERE project_id = ? ORDER BY created_at DESC');
    const cases = stmt.all(req.params.projectId);
    res.json(cases);
  });

  app.post('/api/cases', (req, res) => {
    const { projectId, name, furnaceType } = req.body;
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO simulation_cases (id, project_id, name, furnace_type) VALUES (?, ?, ?, ?)');
    stmt.run(id, projectId, name, furnaceType || 'Generic');
    
    // Create a default workflow for this case (optional, but good for UX)
    // For now, we just create the case.
    res.json({ id, projectId, name, furnaceType });
  });

  app.get('/api/cases/:id', (req, res) => {
    const stmt = db.prepare('SELECT * FROM simulation_cases WHERE id = ?');
    const simulationCase = stmt.get(req.params.id);
    if (simulationCase) {
      res.json(simulationCase);
    } else {
      res.status(404).json({ error: 'Case not found' });
    }
  });

  // 3. Workflows API
  app.get('/api/workflows', (req, res) => {
    const stmt = db.prepare('SELECT * FROM workflows ORDER BY name');
    const workflows = stmt.all();
    res.json(workflows);
  });

  app.post('/api/workflows', (req, res) => {
    const { name, description } = req.body;
    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO workflows (id, name, description) VALUES (?, ?, ?)');
    stmt.run(id, name, description);
    res.json({ id, name, description });
  });

  app.get('/api/workflows/:id/nodes', (req, res) => {
    const stmt = db.prepare('SELECT * FROM workflow_nodes WHERE workflow_id = ?');
    const nodes = stmt.all(req.params.id).map((n: any) => ({
      id: n.id,
      type: n.node_type,
      data: JSON.parse(n.config || '{}'),
      // Position is not in the schema provided by user, but needed for UI. 
      // We'll assume config has position or we add it to schema? 
      // User schema: config JSONB. We can store position in config.
      position: JSON.parse(n.config || '{}').position || { x: 0, y: 0 }
    }));
    res.json(nodes);
  });

  // 4. Simulation Runs API
  app.post('/api/cases/:id/run', (req, res) => {
    const runId = uuidv4();
    const stmt = db.prepare('INSERT INTO simulation_runs (id, case_id, status, started_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)');
    stmt.run(runId, req.params.id, 'running');
    
    // Simulate background process
    setTimeout(() => {
       const update = db.prepare('UPDATE simulation_runs SET status = ?, finished_at = CURRENT_TIMESTAMP WHERE id = ?');
       update.run('completed', runId);
    }, 5000);

    res.json({ runId, status: 'running' });
  });

  app.get('/api/cases/:id/runs', (req, res) => {
    const stmt = db.prepare('SELECT * FROM simulation_runs WHERE case_id = ? ORDER BY started_at DESC');
    const runs = stmt.all(req.params.id);
    res.json(runs);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
