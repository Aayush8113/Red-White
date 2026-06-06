import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // 1. UI Shell State
  isSidebarOpen: true,
  isAiOpen: false,
  isSearchOpen: false,
  isInboxOpen: false,
  theme: localStorage.getItem('aetherforge_theme') || 'dark',
  environment: 'production', // 'production' | 'sandbox'
  isMaskingEnabled: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleAi: () => set((state) => ({ isAiOpen: !state.isAiOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  toggleInbox: () => set((state) => ({ isInboxOpen: !state.isInboxOpen })),
  closeAi: () => set({ isAiOpen: false }),
  setTheme: (theme) => {
    localStorage.setItem('aetherforge_theme', theme);
    set({ theme });
  },
  
  setEnvironment: async (environment) => {
    set({ environment });
    await get().addAuditLog('ENVIRONMENT_SWITCH', `Switched environment to ${environment}`);
    get().fetchClients();
  },

  setMaskingEnabled: async (isMaskingEnabled) => {
    set({ isMaskingEnabled });
    await get().addAuditLog('PII_MASKING_TOGGLE', `PII Data Masking set to ${isMaskingEnabled}`);
  },

  // 2. Authentication State
  user: (() => {
    try {
      const saved = localStorage.getItem('aetherforge_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  })(),
  isAuthenticated: !!localStorage.getItem('aetherforge_user'),
  isMfaEnabled: false,
  isSsoEnabled: false,
  sessions: [],

  login: async (name, role) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('aetherforge_user', JSON.stringify(data.user));
        set({ user: data.user, isAuthenticated: true });
        get().syncData();
      }
    } catch (err) {
      // Offline fallback
      const userObj = { name, role, avatar: name.substring(0, 2).toUpperCase() };
      localStorage.setItem('aetherforge_user', JSON.stringify(userObj));
      set({ user: userObj, isAuthenticated: true });
      get().addAuditLog('LOGIN', `User ${name} logged in offline as ${role}`);
    }
  },

  logout: async () => {
    const currentUser = get().user;
    localStorage.removeItem('aetherforge_user');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentUser?.name })
      });
    } catch (err) {
      get().addAuditLog('LOGOUT', `User ${currentUser?.name || 'Unknown'} logged out (offline)`);
    }
    set({ user: null, isAuthenticated: false, impersonatedUser: null });
  },

  toggleMfa: () => set((state) => {
    const next = !state.isMfaEnabled;
    get().addAuditLog('SECURITY_SETTING', `Multi-Factor Authentication (MFA) set to ${next}`);
    return { isMfaEnabled: next };
  }),

  toggleSso: () => set((state) => {
    const next = !state.isSsoEnabled;
    get().addAuditLog('SECURITY_SETTING', `Single Sign-On (SSO) set to ${next}`);
    return { isSsoEnabled: next };
  }),

  terminateSession: async (sessionId) => {
    try {
      await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'x-actor': get().user?.name || 'Unknown' }
      });
      get().fetchSessions();
      get().fetchAuditLogs();
    } catch (err) {
      set((state) => ({
        sessions: state.sessions.filter((s) => s.id !== sessionId),
      }));
      get().addAuditLog('SESSION_TERMINATE', `Terminated session (offline)`);
    }
  },

  // 3. User Impersonation (Ghost Mode)
  impersonatedUser: null,
  startImpersonation: (role) => {
    const mockImpersonated = {
      name: `Ghost ${role}`,
      role,
      avatar: role.substring(0, 2).toUpperCase(),
    };
    set({ impersonatedUser: mockImpersonated });
    get().addAuditLog('IMPERSONATION_START', `Impersonating ${role} role`);
  },
  stopImpersonation: () => {
    get().addAuditLog('IMPERSONATION_STOP', `Ended user impersonation`);
    set({ impersonatedUser: null });
  },

  getActiveRole: () => {
    const state = get();
    if (state.impersonatedUser) return state.impersonatedUser.role;
    return state.user?.role || 'Guest';
  },

  // 4. Matrix Auth (RBAC permissions grid)
  matrixAuth: {
    Admin: { read: true, write: true, delete: true, system: true, export: true },
    Editor: { read: true, write: true, delete: false, system: false, export: true },
    Viewer: { read: true, write: false, delete: false, system: false, export: false },
    Guest: { read: true, write: false, delete: false, system: false, export: false },
  },

  fetchPermissions: async () => {
    try {
      const res = await fetch('/api/permissions');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Convert backend array [{ role, read, write, ... }] to frontend object map
        const mapped = {};
        data.forEach(item => {
          mapped[item.role] = {
            read: item.read,
            write: item.write,
            delete: item.delete,
            system: item.system,
            export: item.export
          };
        });
        set({ matrixAuth: mapped });
      }
    } catch (err) {
      // Keep initial local permissions
    }
  },

  updateMatrixPermission: async (role, permKey, value) => {
    try {
      const currentRolePerms = get().matrixAuth[role];
      const payload = { ...currentRolePerms, [permKey]: value };
      
      const res = await fetch(`/api/permissions/${role}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-actor': get().user?.name || 'Unknown'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        get().fetchPermissions();
        get().fetchAuditLogs();
      }
    } catch (err) {
      set((state) => {
        const updatedRolePerms = { ...state.matrixAuth[role], [permKey]: value };
        get().addAuditLog('RBAC_CHANGE', `Updated permission ${permKey} to ${value} for role ${role} (offline)`);
        return {
          matrixAuth: { ...state.matrixAuth, [role]: updatedRolePerms },
        };
      });
    }
  },

  hasPermission: (permKey) => {
    const state = get();
    const role = state.getActiveRole();
    return state.matrixAuth[role]?.[permKey] || false;
  },

  // 5. Data Tables (MERN CRUD integration)
  productionClients: [],
  sandboxClients: [],

  getClients: () => {
    const state = get();
    return state.environment === 'production' ? state.productionClients : state.sandboxClients;
  },

  fetchClients: async () => {
    const env = get().environment;
    try {
      const res = await fetch(`/api/clients?env=${env}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        if (env === 'production') {
          set({ productionClients: data });
        } else {
          set({ sandboxClients: data });
        }
      }
    } catch (err) {
      // offline default values if empty
      if (env === 'production' && get().productionClients.length === 0) {
        set({ productionClients: [
          { id: 1, name: "TechCorp Inc.", email: "contact@techcorp.com", status: "Active", amount: 125000, date: "2025-12-15" },
          { id: 2, name: "Startup IO", email: "info@startup.io", status: "Pending", amount: 14200, date: "2025-12-16" },
          { id: 3, name: "Global Solutions", email: "deals@globalsol.com", status: "Active", amount: 89000, date: "2025-12-17" },
        ]});
      }
    }
  },

  addClient: async (client) => {
    const env = get().environment;
    try {
      const res = await fetch(`/api/clients?env=${env}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-actor': get().user?.name || 'Unknown'
        },
        body: JSON.stringify(client)
      });
      if (res.ok) {
        get().fetchClients();
        get().fetchAuditLogs();
        get().fetchFlows();
      }
    } catch (err) {
      // Fallback
      const isProd = env === 'production';
      const newId = Date.now();
      const newClient = { ...client, id: newId, amount: parseFloat(client.amount) || 0, date: new Date().toISOString().split('T')[0] };
      if (isProd) {
        set((state) => ({ productionClients: [newClient, ...state.productionClients] }));
      } else {
        set((state) => ({ sandboxClients: [newClient, ...state.sandboxClients] }));
      }
      get().addAuditLog('CLIENT_CREATE', `Added client ${client.name} (offline)`);
    }
  },

  updateClient: async (updatedClient) => {
    try {
      const res = await fetch(`/api/clients/${updatedClient._id || updatedClient.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-actor': get().user?.name || 'Unknown'
        },
        body: JSON.stringify(updatedClient)
      });
      if (res.ok) {
        get().fetchClients();
        get().fetchAuditLogs();
      }
    } catch (err) {
      // Offline fallback
      const env = get().environment;
      const isProd = env === 'production';
      const clientsList = isProd ? get().productionClients : get().sandboxClients;
      const updated = clientsList.map(c => (c.id === updatedClient.id || c._id === updatedClient._id) ? updatedClient : c);
      if (isProd) {
        set({ productionClients: updated });
      } else {
        set({ sandboxClients: updated });
      }
      get().addAuditLog('CLIENT_UPDATE', `Updated client ${updatedClient.name} (offline)`);
    }
  },

  deleteClient: async (id) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
        headers: { 'x-actor': get().user?.name || 'Unknown' }
      });
      if (res.ok) {
        get().fetchClients();
        get().fetchAuditLogs();
      }
    } catch (err) {
      // Offline fallback
      const env = get().environment;
      const isProd = env === 'production';
      const clientKey = isProd ? 'productionClients' : 'sandboxClients';
      set((state) => ({ [clientKey]: state[clientKey].filter(c => c.id !== id && c._id !== id) }));
      get().addAuditLog('CLIENT_DELETE', `Deleted client ${id} (offline)`);
    }
  },

  // 6. Bulk Engine (MERN API)
  executeBulkAction: async (filterType, operationType) => {
    const env = get().environment;
    try {
      const res = await fetch(`/api/clients/bulk?env=${env}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-actor': get().user?.name || 'Unknown'
        },
        body: JSON.stringify({ filterType, operationType })
      });
      if (res.ok) {
        get().fetchClients();
        get().fetchAuditLogs();
      }
    } catch (err) {
      // Offline fallback
      set((state) => {
        const clientKey = env === 'production' ? 'productionClients' : 'sandboxClients';
        let affected = 0;
        const updated = state[clientKey].map((c) => {
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
        get().addAuditLog('BULK_ACTION', `Bulk executed (offline): ${operationType} on ${filterType} (Affected: ${affected})`);
        return { [clientKey]: updated };
      });
    }
  },

  // 7. Data Forge Import (MERN API)
  importClients: async (parsedClients) => {
    const env = get().environment;
    try {
      const res = await fetch(`/api/clients/import?env=${env}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-actor': get().user?.name || 'Unknown'
        },
        body: JSON.stringify({ data: parsedClients })
      });
      if (res.ok) {
        get().fetchClients();
        get().fetchAuditLogs();
      }
    } catch (err) {
      // Offline fallback
      const withIds = parsedClients.map((c, idx) => ({
        id: Date.now() + idx,
        name: c.name || 'Unnamed Import',
        email: c.email || 'imported@unknown.com',
        status: c.status || 'Active',
        amount: parseFloat(c.amount) || 0,
        date: c.date || new Date().toISOString().split('T')[0]
      }));
      const clientKey = env === 'production' ? 'productionClients' : 'sandboxClients';
      set((state) => ({ [clientKey]: [...withIds, ...state[clientKey]] }));
      get().addAuditLog('DATA_FORGE_IMPORT', `Imported ${withIds.length} rows (offline)`);
    }
  },

  // 8. Immutable Audit Logging (Black Box)
  auditLogs: [],
  
  fetchAuditLogs: async () => {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ auditLogs: data });
      }
    } catch (err) {
      // offline placeholder
    }
  },

  fetchSessions: async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ sessions: data });
      }
    } catch (err) {
      // offline fallback
      if (get().sessions.length === 0) {
        set({ sessions: [
          { id: 'session-1', device: 'Windows Desktop (Chrome)', ip: '192.168.1.102', location: 'Mumbai, India', isCurrent: true, activeAt: 'Just now' },
          { id: 'session-2', device: 'iPhone 15 Pro (Safari)', ip: '103.88.22.18', location: 'Delhi, India', isCurrent: false, activeAt: '2 hours ago' },
        ]});
      }
    }
  },

  addAuditLog: async (actionType, details) => {
    // Standard trigger in store, makes a local-fallback audit log write
    const activeRole = get().getActiveRole();
    const activeActor = get().user ? `${get().user.name} (${activeRole})` : 'SYSTEM';
    
    // We can also post it directly to the server if needed, or trigger via backend routing actions.
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actionType,
      actor: activeActor,
      details,
      ip: '192.168.1.102',
      location: 'Mumbai, India',
    };
    
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
  },

  // 9. Flex Board Layout
  widgets: [
    { id: 'stats', name: 'Key Telemetry', size: 'lg', type: 'stats' },
    { id: 'revenue', name: 'Revenue Analytics', size: 'lg', type: 'chart' },
    { id: 'live-pulse', name: 'Live Telemetry Pulse', size: 'md', type: 'logs' },
    { id: 'traffic', name: 'Traffic Sources', size: 'md', type: 'progress' },
  ],

  reorderWidgets: (newWidgets) => set({ widgets: newWidgets }),
  removeWidget: (id) => set((state) => {
    get().addAuditLog('WIDGET_REMOVED', `Removed widget ${id} from Flex Board`);
    return { widgets: state.widgets.filter(w => w.id !== id) };
  }),

  addWidget: (type) => set((state) => {
    const widgetNames = {
      stats: 'Key Telemetry',
      revenue: 'Revenue Analytics',
      'live-pulse': 'Live Telemetry Pulse',
      traffic: 'Traffic Sources',
      'quick-query': 'AI Copilot Widget',
    };
    const newWidget = {
      id: `${type}-${Date.now()}`,
      name: widgetNames[type] || 'New Widget',
      size: type === 'revenue' || type === 'stats' ? 'lg' : 'md',
      type
    };
    get().addAuditLog('WIDGET_ADDED', `Added widget ${newWidget.name} to Flex Board`);
    return { widgets: [...state.widgets, newWidget] };
  }),

  // 10. Inbox Hub & Alerts
  inboxAlerts: [
    { id: 1, type: 'alert', title: 'High API Latency Detected', description: 'Referral traffic source API latency rose above 450ms.', category: 'Telemetry', read: false, time: '10m ago' },
    { id: 2, type: 'task', title: 'Verify Matrix Auth settings', description: 'Ensure the Guest role cannot perform client exports.', category: 'Security', read: false, time: '1h ago' },
    { id: 3, type: 'info', title: 'Data Forge Sync Completed', description: 'Smart Copilot imported 24 rows into Sandbox database.', category: 'Import', read: true, time: '1d ago' }
  ],

  markAllAlertsAsRead: () => set((state) => ({
    inboxAlerts: state.inboxAlerts.map(a => ({ ...a, read: true }))
  })),

  dismissAlert: (id) => set((state) => ({
    inboxAlerts: state.inboxAlerts.filter(a => a.id !== id)
  })),

  addInboxAlert: (alert) => set((state) => ({
    inboxAlerts: [
      { id: Date.now(), read: false, time: 'Just now', ...alert },
      ...state.inboxAlerts
    ]
  })),

  // 11. Action Flows state (MERN integration)
  actionFlows: [],

  fetchFlows: async () => {
    try {
      const res = await fetch('/api/flows');
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ actionFlows: data });
      }
    } catch (err) {
      // fallback
    }
  },

  toggleFlowActive: async (flowId) => {
    try {
      await fetch(`/api/flows/${flowId}/toggle`, { method: 'POST' });
      get().fetchFlows();
    } catch (err) {
      set((state) => ({
        actionFlows: state.actionFlows.map(f => f.id === flowId ? { ...f, active: !f.active } : f)
      }));
    }
  },

  runFlowManual: async (flowId) => {
    try {
      await fetch(`/api/flows/${flowId}/manual`, {
        method: 'POST',
        headers: { 'x-actor': get().user?.name || 'Unknown' }
      });
      get().fetchFlows();
      get().fetchAuditLogs();
    } catch (err) {
      // Offline fallback log entry
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] Manual run initiated. Scanning datasets... Match found. Action executed.`;
      set((state) => ({
        actionFlows: state.actionFlows.map(f => f.id === flowId ? { ...f, logs: [logEntry, ...(f.logs || [])] } : f)
      }));
    }
  },

  createFlow: async (flow) => {
    try {
      const res = await fetch('/api/flows', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-actor': get().user?.name || 'Unknown'
        },
        body: JSON.stringify(flow)
      });
      if (res.ok) {
        get().fetchFlows();
        get().fetchAuditLogs();
      }
    } catch (err) {
      const newFlow = { 
        id: `flow-${Date.now()}`, 
        logs: [`[${new Date().toLocaleTimeString()}] Pipeline initialized (offline).`], 
        active: true, 
        ...flow 
      };
      set((state) => ({ actionFlows: [...state.actionFlows, newFlow] }));
      get().addAuditLog('AUTOMATION_CREATE', `Created action flow ${flow.name} (offline)`);
    }
  },

  // 12. Live Pulse Telemetry (MERN integration)
  telemetry: { cpu: 15, ram: 59, requests: 25, lastEvent: 'System idle' },
  
  fetchTelemetry: async () => {
    try {
      const res = await fetch('/api/telemetry');
      const data = await res.json();
      set({
        telemetry: {
          cpu: data.cpu,
          ram: data.ram,
          requests: data.requests,
          lastEvent: data.event
        }
      });
    } catch (err) {
      // offline ticking fallback
      set((state) => {
        const cpu = Math.floor(Math.random() * 20) + 10;
        const ram = Math.floor(Math.random() * 5) + 55;
        const requests = Math.floor(Math.random() * 30) + 20;
        return { telemetry: { cpu, ram, requests, lastEvent: `[${new Date().toLocaleTimeString()}] Live Telemetry Pulse active.` } };
      });
    }
  },

  // Synchronize entire workspace databases
  syncData: () => {
    get().fetchClients();
    get().fetchAuditLogs();
    get().fetchSessions();
    get().fetchPermissions();
    get().fetchFlows();
  }
}));