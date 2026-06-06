import { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Key, Users, Terminal, Globe, 
  Trash2, Search, ToggleLeft, ToggleRight, Radio, Laptop, Smartphone, Eye
} from 'lucide-react';
import { useStore } from '../store/uiStore';
import { toast } from 'sonner';

export const Security = () => {
  const { 
    matrixAuth, updateMatrixPermission, auditLogs, sessions, 
    terminateSession, isMfaEnabled, toggleMfa, isSsoEnabled, toggleSso,
    user, getActiveRole
  } = useStore();

  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState('All');

  
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
                          log.actor.toLowerCase().includes(logSearch.toLowerCase());
    const matchesFilter = logFilter === 'All' || log.actionType === logFilter;
    return matchesSearch && matchesFilter;
  });

  const uniqueActionTypes = Array.from(new Set(auditLogs.map(l => l.actionType)));

  
  const applyPreset = async (presetName) => {
    toast.loading(`Applying ${presetName} permission profile...`);
    
    const permissionKeys = ['read', 'write', 'delete', 'system', 'export'];
    let targetConfig = {};

    if (presetName === 'Strict Lock') {
      targetConfig = {
        Admin: { read: true, write: true, delete: false, system: false, export: false },
        Editor: { read: true, write: false, delete: false, system: false, export: false },
        Viewer: { read: true, write: false, delete: false, system: false, export: false },
        Guest: { read: true, write: false, delete: false, system: false, export: false },
      };
    } else if (presetName === 'Permissive Open') {
      targetConfig = {
        Admin: { read: true, write: true, delete: true, system: true, export: true },
        Editor: { read: true, write: true, delete: true, system: true, export: true },
        Viewer: { read: true, write: true, delete: false, system: false, export: false },
        Guest: { read: true, write: true, delete: false, system: false, export: false },
      };
    } else { 
      targetConfig = {
        Admin: { read: true, write: true, delete: true, system: true, export: true },
        Editor: { read: true, write: true, delete: false, system: false, export: true },
        Viewer: { read: true, write: false, delete: false, system: false, export: false },
        Guest: { read: true, write: false, delete: false, system: false, export: false },
      };
    }

    
    for (const role of Object.keys(targetConfig)) {
      for (const key of permissionKeys) {
        const val = targetConfig[role][key];
        await updateMatrixPermission(role, key, val);
      }
    }
    
    toast.dismiss();
    toast.success(`Applied ${presetName} RBAC preset successfully!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {}
      <div className="dark:bg-slate-900/40 bg-white p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Security & Governance Matrix</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Manage Role-Based Access Controls (RBAC), view immutable audit trails, and oversee device sessions.</p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-xl border border-emerald-500/20 font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <ShieldCheck size={14} className="text-emerald-500" /> Shield Status: Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {}
        <div className="lg:col-span-2 space-y-8">
          
          {}
          <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 dark:border-white/5 pb-4 mb-4 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Key size={16} className="text-indigo-500 dark:text-indigo-400" />
                  Matrix Auth (RBAC) Grid
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Modify permission keys on the fly. Actions are immediately synced.</p>
              </div>
            </div>

            {}
            <div className="mb-6">
              <span className="text-[10px] text-slate-500 font-bold block mb-2 uppercase">LOAD PERMISSION PRESETS (CLICK TO APPLY):</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Strict Lock", name: "Strict Lock", style: "border-rose-500/25 text-rose-600 bg-rose-500/5 hover:bg-rose-500/10" },
                  { label: "Permissive Open", name: "Permissive Open", style: "border-emerald-500/25 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10" },
                  { label: "Compliance Standard", name: "Compliance Standard", style: "border-indigo-500/25 text-indigo-600 bg-indigo-500/5 hover:bg-indigo-500/10" }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset.name)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-xl border transition-all ${preset.style}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-500 dark:text-slate-400">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 text-[9px] uppercase tracking-widest font-bold text-slate-405 dark:text-slate-500">
                    <th className="pb-3 pr-4">System Role</th>
                    <th className="pb-3 text-center">Read</th>
                    <th className="pb-3 text-center">Write</th>
                    <th className="pb-3 text-center">Delete</th>
                    <th className="pb-3 text-center">System Config</th>
                    <th className="pb-3 text-center">Export</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {Object.keys(matrixAuth).map((role) => {
                    const isActive = getActiveRole() === role;
                    return (
                      <tr key={role} className={isActive ? 'bg-indigo-500/5 dark:bg-indigo-500/5' : ''}>
                        <td className="py-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          {role}
                          {isActive && (
                            <span className="text-[8px] bg-indigo-500/15 text-indigo-650 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </td>
                        {['read', 'write', 'delete', 'system', 'export'].map((permKey) => (
                          <td key={permKey} className="py-4 text-center">
                            <input
                              type="checkbox"
                              checked={matrixAuth[role][permKey]}
                              onChange={(e) => {
                                updateMatrixPermission(role, permKey, e.target.checked);
                                toast.success(`Updated ${permKey} capability for ${role}`);
                              }}
                              className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-indigo-600 focus:ring-0 focus:ring-offset-0 dark:bg-slate-900 bg-slate-100 accent-indigo-600"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {}
          <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-md flex flex-col justify-between h-[450px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={16} className="text-indigo-500 dark:text-indigo-400" />
                    Black Box: Immutable Audit Logger
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Cryptographically signed logs track administrator transactions.</p>
                </div>
                <span className="text-[10px] dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-xl font-mono">
                  {auditLogs.length} Records
                </span>
              </div>

              {}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-500 w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder="Search logs details..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/5 rounded-xl px-2.5 text-xs text-slate-700 dark:text-slate-400 focus:outline-none"
                >
                  <option value="All">All Actions</option>
                  {uniqueActionTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            {}
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="dark:bg-slate-950/50 bg-slate-50 border border-slate-200 dark:border-white/2 p-3 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-950 transition-colors">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        log.actionType.includes('ERROR') || log.actionType.includes('FAIL') 
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20' 
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                      }`}>
                        {log.actionType}
                      </span>
                      <span className="text-[10px] font-bold text-slate-805 dark:text-white">{log.actor}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{log.details}</div>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <div className="text-[9px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    <div className="text-[9px] text-slate-600 dark:text-slate-500 flex items-center gap-1 mt-0.5 justify-end">
                      <Globe size={8} /> {log.location} ({log.ip})
                    </div>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="py-12 text-center text-slate-500 italic text-xs">No matching transaction log found.</div>
              )}
            </div>
          </div>

        </div>

        {}
        <div className="space-y-8">
          
          {}
          <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-md">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <ShieldAlert size={16} className="text-amber-500" />
              Sign-In Shield Policies
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Configure network security authentication guards.</p>

            <div className="space-y-4">
              {}
              <div className="flex items-center justify-between p-3.5 dark:bg-slate-950/40 bg-slate-50 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Multi-Factor MFA Enforce</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Enforce additional TOTP authentication.</p>
                </div>
                <button 
                  onClick={toggleMfa}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {isMfaEnabled ? (
                    <ToggleRight size={28} className="text-indigo-500 dark:text-indigo-400" />
                  ) : (
                    <ToggleLeft size={28} className="text-slate-400 dark:text-slate-600" />
                  )}
                </button>
              </div>

              {}
              <div className="flex items-center justify-between p-3.5 dark:bg-slate-950/40 bg-slate-50 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Single Sign-On SSO Gateway</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Restrict auth pathways to Okta/Google SSO.</p>
                </div>
                <button 
                  onClick={toggleSso}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {isSsoEnabled ? (
                    <ToggleRight size={28} className="text-indigo-500 dark:text-indigo-400" />
                  ) : (
                    <ToggleLeft size={28} className="text-slate-400 dark:text-slate-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {}
          <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-md">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
              <Laptop size={16} className="text-indigo-500 dark:text-indigo-400" />
              Session Guard
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Terminate remote devices and secure credentials.</p>

            <div className="space-y-3">
              {sessions.map((s) => {
                const Icon = s.device.includes('iPhone') || s.device.includes('Android') ? Smartphone : Laptop;
                return (
                  <div key={s.id} className="p-3.5 dark:bg-slate-955/40 bg-slate-50 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 dark:bg-white/5 bg-slate-100 rounded-xl border border-slate-200 dark:border-white/5">
                        <Icon size={14} className="text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          {s.device}
                          {s.isCurrent && (
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 rounded-full font-bold uppercase">
                              Self
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{s.location} • {s.ip}</div>
                        <div className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{s.activeAt}</div>
                      </div>
                    </div>

                    {!s.isCurrent && (
                      <button
                        onClick={() => {
                          terminateSession(s.id);
                          toast.success(`Terminated remote session on ${s.device}`);
                        }}
                        className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                        title="Remote Logout"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
