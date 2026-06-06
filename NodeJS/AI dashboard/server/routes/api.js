import express from 'express';
import mongoose from 'mongoose';
import { Client, AuditLog, Session, Flow, Permission } from '../models/Schemas.js';

export const router = express.Router();

const isDbConnected = () => mongoose.connection.readyState === 1;

let inMemoryDb = {
  clients: [
    { id: 1, name: "TechCorp Inc.", email: "contact@techcorp.com", status: "Active", amount: 125000, date: "2025-12-15", env: "production" },
    { id: 2, name: "Startup IO", email: "info@startup.io", status: "Pending", amount: 14200, date: "2025-12-16", env: "production" },
    { id: 3, name: "Global Solutions", email: "deals@globalsol.com", status: "Active", amount: 89000, date: "2025-12-17", env: "production" },
    { id: 4, name: "Design Studio", email: "hello@designstudio.co", status: "Cancelled", amount: 11200, date: "2025-12-14", env: "production" },
    { id: 5, name: "Apex Systems", email: "billing@apexsys.net", status: "Active", amount: 94500, date: "2025-12-19", env: "production" },
    { id: 6, name: "Pulse Health", email: "support@pulsehealth.org", status: "Pending", amount: 3400, date: "2025-12-20", env: "production" },
  ],
  sandboxClients: [
    { id: 101, name: "Beta Retailers", email: "test-beta@retailers.com", status: "Active", amount: 15000, date: "2026-01-01", env: "sandbox" },
    { id: 102, name: "Mock Agency LLC", email: "billing@mockagency.net", status: "Pending", amount: 1200, date: "2026-01-02", env: "sandbox" },
    { id: 103, name: "Sandbox Corp Test", email: "admin@sandboxcorp.org", status: "Cancelled", amount: 0, date: "2026-01-03", env: "sandbox" },
  ],
  auditLogs: [
    { id: 'log-1', timestamp: new Date('2026-06-06T09:30:00Z'), actionType: 'SYSTEM_START', actor: 'SYSTEM', details: 'NebulaAI Security Sentinel initiated.', ip: '127.0.0.1', location: 'Local Server' },
    { id: 'log-2', timestamp: new Date('2026-06-06T09:45:00Z'), actionType: 'LOGIN', actor: 'Aayush (Admin)', details: 'Admin logged in through secure SSO gateway.', ip: '192.168.1.102', location: 'Mumbai, India' },
  ],
  sessions: [
    { id: 'session-1', device: 'Windows Desktop (Chrome)', ip: '192.168.1.102', location: 'Mumbai, India', isCurrent: true, activeAt: 'Just now' },
    { id: 'session-2', device: 'iPhone 15 Pro (Safari)', ip: '103.88.22.18', location: 'Delhi, India', isCurrent: false, activeAt: '2 hours ago' },
    { id: 'session-3', device: 'MacBook Pro (Firefox)', ip: '192.168.10.4', location: 'London, UK', isCurrent: false, activeAt: '1 day ago' },
  ],
  flows: [
    { id: 'flow-1', name: 'Slack Alert on High Deal', trigger: 'On Client Added', condition: 'Revenue > $10,000', action: 'Send Slack Notification', active: true, logs: [] },
    { id: 'flow-2', name: 'Daily Backup & PII Masking', trigger: 'Scheduled (Daily)', condition: 'All Records', action: 'Run Masking & Cloud Export', active: false, logs: [] }
  ],
  permissions: [
    { role: 'Admin', read: true, write: true, delete: true, system: true, export: true },
    { role: 'Editor', read: true, write: true, delete: false, system: false, export: true },
    { role: 'Viewer', read: true, write: false, delete: false, system: false, export: false },
    { role: 'Guest', read: true, write: false, delete: false, system: false, export: false }
  ]
};

export const seedDatabase = async () => {
  if (!isDbConnected()) return;
  try {
    const clientsCount = await Client.countDocuments();
    if (clientsCount === 0) {
      await Client.insertMany([
        ...inMemoryDb.clients,
        ...inMemoryDb.sandboxClients
      ]);
      console.log('Database seeded with default clients.');
    }
    
    const logsCount = await AuditLog.countDocuments();
    if (logsCount === 0) {
      await AuditLog.insertMany(inMemoryDb.auditLogs);
    }

    const sessionsCount = await Session.countDocuments();
    if (sessionsCount === 0) {
      await Session.insertMany(inMemoryDb.sessions);
    }

    const flowsCount = await Flow.countDocuments();
    if (flowsCount === 0) {
      await Flow.insertMany(inMemoryDb.flows);
    }

    const permsCount = await Permission.countDocuments();
    if (permsCount === 0) {
      await Permission.insertMany(inMemoryDb.permissions);
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

const logAction = async (actionType, actor, details) => {
  const newLog = {
    actionType,
    actor: actor || 'SYSTEM',
    details,
    timestamp: new Date(),
    ip: '192.168.1.102',
    location: 'Mumbai, India'
  };

  if (isDbConnected()) {
    try {
      await AuditLog.create(newLog);
    } catch (err) {
      console.error('Failed to save audit log to MongoDB:', err);
    }
  } else {
    newLog.id = `log-${Date.now()}`;
    inMemoryDb.auditLogs.unshift(newLog);
  }
};

router.post('/auth/login', async (req, res) => {
  const { name, role } = req.body;
  await logAction('LOGIN', `${name} (${role})`, `User logged in successfully as ${role}`);
  
  const newSession = {
    device: `Chrome / Windows (${name} - ${role})`,
    ip: '192.168.1.102',
    location: 'Mumbai, India',
    isCurrent: true,
    activeAt: 'Just now'
  };

  if (isDbConnected()) {
    try {
      await Session.updateMany({}, { isCurrent: false });
      await Session.create(newSession);
    } catch (err) {
      console.error('Failed to create login session in MongoDB:', err);
    }
  } else {
    inMemoryDb.sessions.forEach(s => s.isCurrent = false);
    inMemoryDb.sessions.unshift({ id: `session-${Date.now()}`, ...newSession });
  }

  res.json({ success: true, user: { name, role, avatar: name.substring(0, 2).toUpperCase() } });
});

router.post('/auth/logout', async (req, res) => {
  const { name } = req.body;
  await logAction('LOGOUT', name, `User signed out`);
  res.json({ success: true });
});

router.get('/clients', async (req, res) => {
  const env = req.query.env || 'production';
  if (isDbConnected()) {
    try {
      const dbClients = await Client.find({ env });
      return res.json(dbClients);
    } catch (err) {
      return res.status(500).json({ error: 'DB Fetch Failed' });
    }
  }
  const memClients = env === 'production' ? inMemoryDb.clients : inMemoryDb.sandboxClients;
  res.json(memClients);
});

router.post('/clients', async (req, res) => {
  const env = req.query.env || 'production';
  const { name, email, status, amount } = req.body;
  const newClient = {
    name,
    email,
    status: status || 'Active',
    amount: parseFloat(amount) || 0,
    date: new Date().toISOString().split('T')[0],
    env
  };

  if (isDbConnected()) {
    try {
      const created = await Client.create(newClient);
      await logAction('CLIENT_CREATE', req.headers['x-actor'], `Added client ${name} with revenue $${amount}`);
      triggerFlows('On Client Added', created);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(400).json({ error: 'Client Creation Failed' });
    }
  }

  
  const mockId = Date.now();
  const createdMock = { id: mockId, ...newClient };
  if (env === 'production') {
    inMemoryDb.clients.unshift(createdMock);
  } else {
    inMemoryDb.sandboxClients.unshift(createdMock);
  }
  await logAction('CLIENT_CREATE', req.headers['x-actor'], `Added client ${name} with revenue $${amount} (Sandbox Sandbox)`);
  triggerFlows('On Client Added', createdMock);
  res.status(201).json(createdMock);
});

router.put('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, status, amount } = req.body;
  const updateData = { name, email, status, amount: parseFloat(amount) || 0 };

  if (isDbConnected()) {
    try {
      const updated = await Client.findByIdAndUpdate(id, updateData, { new: true });
      await logAction('CLIENT_UPDATE', req.headers['x-actor'], `Updated client ${name} details`);
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: 'Client Update Failed' });
    }
  }

  
  const numId = parseInt(id) || id;
  let client = inMemoryDb.clients.find(c => c.id === numId) || inMemoryDb.sandboxClients.find(c => c.id === numId);
  if (client) {
    Object.assign(client, updateData);
    await logAction('CLIENT_UPDATE', req.headers['x-actor'], `Updated client ${name} details`);
    return res.json(client);
  }
  res.status(404).json({ error: 'Client not found' });
});

router.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected()) {
    try {
      const deleted = await Client.findByIdAndDelete(id);
      await logAction('CLIENT_DELETE', req.headers['x-actor'], `Deleted client ${deleted?.name || id}`);
      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: 'Delete failed' });
    }
  }

  const numId = parseInt(id) || id;
  const initialCountProd = inMemoryDb.clients.length;
  inMemoryDb.clients = inMemoryDb.clients.filter(c => c.id !== numId);
  if (inMemoryDb.clients.length === initialCountProd) {
    inMemoryDb.sandboxClients = inMemoryDb.sandboxClients.filter(c => c.id !== numId);
  }
  await logAction('CLIENT_DELETE', req.headers['x-actor'], `Deleted client ID ${id}`);
  res.json({ success: true });
});

router.post('/clients/bulk', async (req, res) => {
  const env = req.query.env || 'production';
  const { filterType, operationType } = req.body;
  const actor = req.headers['x-actor'];

  if (isDbConnected()) {
    try {
      let filter = { env };
      if (filterType === 'pending') filter.status = 'Pending';
      else if (filterType === 'low-revenue') filter.amount = { $lt: 15000 };

      let update = {};
      if (operationType === 'activate') {
        update = { status: 'Active' };
      } else if (operationType === 'clear-pending') {
        update = { status: 'Cancelled' };
      }

      if (operationType === 'bump-revenue') {
        
        const matchClients = await Client.find(filter);
        let affected = 0;
        for (let c of matchClients) {
          c.amount = Math.round(c.amount * 1.15);
          await c.save();
          affected++;
        }
        await logAction('BULK_ACTION', actor, `Bulk bump revenue applied on ${affected} clients`);
        return res.json({ affected });
      }

      const result = await Client.updateMany(filter, update);
      await logAction('BULK_ACTION', actor, `Bulk action: [${operationType}] on [${filterType}] clients (Affected: ${result.modifiedCount})`);
      return res.json({ affected: result.modifiedCount });
    } catch (err) {
      return res.status(500).json({ error: 'Bulk Action failed' });
    }
  }

  
  const clientKey = env === 'production' ? 'clients' : 'sandboxClients';
  let affected = 0;
  inMemoryDb[clientKey] = inMemoryDb[clientKey].map((c) => {
    let matches = false;
    if (filterType === 'all') matches = true;
    else if (filterType === 'pending') matches = c.status === 'Pending';
    else if (filterType === 'low-revenue') matches = c.amount < 15000;

    if (!matches) return c;

    affected++;
    if (operationType === 'activate') return { ...c, status: 'Active' };
    if (operationType === 'clear-pending') return { ...c, status: 'Cancelled' };
    if (operationType === 'bump-revenue') return { ...c, amount: Math.round(c.amount * 1.15) };
    return c;
  });

  await logAction('BULK_ACTION', actor, `Bulk Engine [${operationType}] on [${filterType}] clients (Affected: ${affected})`);
  res.json({ affected });
});

router.post('/clients/import', async (req, res) => {
  const env = req.query.env || 'production';
  const { data } = req.body;
  const actor = req.headers['x-actor'];

  const formatted = data.map((c, idx) => ({
    name: c.name || 'Unnamed Import',
    email: c.email || 'imported@unknown.com',
    status: c.status || 'Active',
    amount: parseFloat(c.amount) || 0,
    date: c.date || new Date().toISOString().split('T')[0],
    env
  }));

  if (isDbConnected()) {
    try {
      const imported = await Client.insertMany(formatted);
      await logAction('DATA_FORGE_IMPORT', actor, `Imported ${imported.length} clients`);
      return res.status(201).json(imported);
    } catch (err) {
      return res.status(400).json({ error: 'Import failed' });
    }
  }

  
  const withIds = formatted.map((c, idx) => ({ id: Date.now() + idx, ...c }));
  if (env === 'production') {
    inMemoryDb.clients = [...withIds, ...inMemoryDb.clients];
  } else {
    inMemoryDb.sandboxClients = [...withIds, ...inMemoryDb.sandboxClients];
  }

  await logAction('DATA_FORGE_IMPORT', actor, `Imported ${formatted.length} clients via Data Forge`);
  res.status(201).json(withIds);
});

router.get('/audit-logs', async (req, res) => {
  if (isDbConnected()) {
    try {
      const logs = await AuditLog.find().sort({ timestamp: -1 });
      return res.json(logs);
    } catch (err) {
      return res.status(500).json({ error: 'Audit Logs fetch failed' });
    }
  }
  res.json(inMemoryDb.auditLogs);
});

router.get('/sessions', async (req, res) => {
  if (isDbConnected()) {
    try {
      const sessions = await Session.find();
      return res.json(sessions);
    } catch (err) {
      return res.status(500).json({ error: 'Sessions fetch failed' });
    }
  }
  res.json(inMemoryDb.sessions);
});

router.delete('/sessions/:id', async (req, res) => {
  const { id } = req.params;
  const actor = req.headers['x-actor'];

  if (isDbConnected()) {
    try {
      const deleted = await Session.findByIdAndDelete(id);
      await logAction('SESSION_TERMINATE', actor, `Terminated device session on ${deleted?.device || id}`);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Session delete failed' });
    }
  }

  const sessionObj = inMemoryDb.sessions.find(s => s.id === id);
  inMemoryDb.sessions = inMemoryDb.sessions.filter(s => s.id !== id);
  await logAction('SESSION_TERMINATE', actor, `Terminated session on ${sessionObj?.device || id}`);
  res.json({ success: true });
});

router.get('/permissions', async (req, res) => {
  if (isDbConnected()) {
    try {
      const perms = await Permission.find();
      return res.json(perms);
    } catch (err) {
      return res.status(500).json({ error: 'Permissions fetch failed' });
    }
  }
  res.json(inMemoryDb.permissions);
});

router.put('/permissions/:role', async (req, res) => {
  const { role } = req.params;
  const { read, write, delete: del, system, export: exp } = req.body;
  const updateData = { read, write, delete: del, system, export: exp };
  const actor = req.headers['x-actor'];

  if (isDbConnected()) {
    try {
      const updated = await Permission.findOneAndUpdate({ role }, updateData, { new: true });
      await logAction('RBAC_CHANGE', actor, `Updated permissions grid for role ${role}`);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: 'Update permissions failed' });
    }
  }

  let record = inMemoryDb.permissions.find(p => p.role === role);
  if (record) {
    Object.assign(record, updateData);
    await logAction('RBAC_CHANGE', actor, `Updated permissions grid for role ${role}`);
    return res.json(record);
  }
  res.status(404).json({ error: 'Role not found' });
});

router.get('/flows', async (req, res) => {
  if (isDbConnected()) {
    try {
      const flows = await Flow.find();
      return res.json(flows);
    } catch (err) {
      return res.status(500).json({ error: 'Flows fetch failed' });
    }
  }
  res.json(inMemoryDb.flows);
});

router.post('/flows', async (req, res) => {
  const { name, trigger, condition, action } = req.body;
  const newFlow = {
    name,
    trigger,
    condition,
    action,
    active: true,
    logs: [`[${new Date().toLocaleTimeString()}] Pipeline initialized.`]
  };

  if (isDbConnected()) {
    try {
      const created = await Flow.create(newFlow);
      await logAction('AUTOMATION_CREATE', req.headers['x-actor'], `Created action flow '${name}'`);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(400).json({ error: 'Flow Creation Failed' });
    }
  }

  
  const mockId = `flow-${Date.now()}`;
  const createdMock = { id: mockId, ...newFlow };
  inMemoryDb.flows.push(createdMock);
  await logAction('AUTOMATION_CREATE', req.headers['x-actor'], `Created action flow '${name}' (in-memory)`);
  res.status(201).json(createdMock);
});

router.post('/flows/:id/toggle', async (req, res) => {
  const { id } = req.params;
  if (isDbConnected()) {
    try {
      const flow = await Flow.findById(id);
      if (flow) {
        flow.active = !flow.active;
        await flow.save();
        return res.json(flow);
      }
    } catch (err) {
      return res.status(500).json({ error: 'Toggle Flow failed' });
    }
  }

  let flow = inMemoryDb.flows.find(f => f.id === id);
  if (flow) {
    flow.active = !flow.active;
    return res.json(flow);
  }
  res.status(404).json({ error: 'Flow not found' });
});

router.post('/flows/:id/manual', async (req, res) => {
  const { id } = req.params;
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] Manual run initiated. Scanning datasets... Match found. Actions dispatched.`;

  if (isDbConnected()) {
    try {
      const flow = await Flow.findById(id);
      if (flow) {
        flow.logs.unshift(logEntry);
        await flow.save();
        await logAction('AUTOMATION_MANUAL', req.headers['x-actor'], `Executed flow '${flow.name}' manually`);
        return res.json(flow);
      }
    } catch (err) {
      return res.status(500).json({ error: 'Manual run failed' });
    }
  }

  let flow = inMemoryDb.flows.find(f => f.id === id);
  if (flow) {
    flow.logs.unshift(logEntry);
    await logAction('AUTOMATION_MANUAL', req.headers['x-actor'], `Executed flow '${flow.name}' manually`);
    return res.json(flow);
  }
  res.status(404).json({ error: 'Flow not found' });
});

const triggerFlows = async (triggerType, clientData) => {
  const activeFlows = isDbConnected() ? await Flow.find({ active: true, trigger: triggerType }) : inMemoryDb.flows.filter(f => f.active && f.trigger === triggerType);

  activeFlows.forEach(async (flow) => {
    let matched = false;
    if (flow.condition.includes('>')) {
      const limit = parseInt(flow.condition.split('>')[1].replace(/[^0-9]/g, '')) || 0;
      if (clientData.amount > limit) matched = true;
    } else if (flow.condition === 'All Records') {
      matched = true;
    }

    if (matched) {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] Flow triggered: Match found. Action [${flow.action}] executed successfully for ${clientData.name}.`;
      
      if (isDbConnected()) {
        const dbFlow = await Flow.findById(flow._id);
        dbFlow.logs.unshift(logEntry);
        await dbFlow.save();
      } else {
        flow.logs.unshift(logEntry);
      }
      await logAction('AUTOMATION_RUN', 'SYSTEM', `Flow '${flow.name}' auto-executed: Action '${flow.action}' succeeded.`);
    }
  });
};

router.get('/telemetry', (req, res) => {
  
  const cpu = Math.floor(Math.random() * 25) + 10; 
  const ram = Math.floor(Math.random() * 10) + 55; 
  const requests = Math.floor(Math.random() * 40) + 15; 
  
  const eventsPool = [
    'API request GET /api/clients - 200 OK',
    'Database connection ping successful',
    'PII Masking applied to analytics views',
    'Audit logs synced to Immutable Storage',
    'Memory cleanup task executed'
  ];
  const randomEvent = eventsPool[Math.floor(Math.random() * eventsPool.length)];
  const timestamp = new Date().toLocaleTimeString();

  res.json({
    cpu,
    ram,
    requests,
    event: `[${timestamp}] ${randomEvent}`
  });
});
