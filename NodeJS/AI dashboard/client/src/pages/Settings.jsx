import { useState } from 'react';
import { 
  Settings as SettingsIcon, Eye, EyeOff, Sun, Moon, 
  Database, UserCheck, ShieldAlert, Sparkles, Ghost 
} from 'lucide-react';
import { useStore } from '../store/uiStore';
import { toast } from 'sonner';

export const Settings = () => {
  const { 
    isMaskingEnabled, setMaskingEnabled, theme, setTheme, 
    environment, setEnvironment, startImpersonation, stopImpersonation,
    impersonatedUser, user 
  } = useStore();

  const handleGhostMode = (role) => {
    if (role === 'none') {
      stopImpersonation();
      toast.info("Ghost Mode suspended. Returned to primary account.");
    } else {
      startImpersonation(role);
      toast.success(`Ghost Mode activated: Impersonating ${role}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Introduction */}
      <div className="dark:bg-slate-900/40 bg-white p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-805 dark:text-white">System Settings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure global dashboard parameters, visual themes, data masking levels, and testing accounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PANEL 1: PII Masking Engine */}
        <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <EyeOff size={16} className="text-indigo-600 dark:text-indigo-400" />
              PII Masking Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When activated, confidential database fields (client names, emails, transaction values) are dynamically blurred or starred out to protect privacy.
            </p>
          </div>

          <div className="mt-6 p-4 dark:bg-slate-950/40 bg-slate-50 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex gap-3 items-center">
              {isMaskingEnabled ? <EyeOff className="text-indigo-500 dark:text-indigo-400" size={18} /> : <Eye className="text-slate-450 dark:text-slate-550" size={18} />}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white">Data Blurring State</h4>
                <p className="text-[10px] text-slate-500">Mask names, emails, revenues.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMaskingEnabled(!isMaskingEnabled);
                toast.success(`PII Masking Engine ${!isMaskingEnabled ? 'Activated' : 'Suspended'}`);
              }}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                isMaskingEnabled 
                  ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                  : 'dark:bg-slate-950 bg-slate-100 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {isMaskingEnabled ? "ENABLED" : "DISABLED"}
            </button>
          </div>
        </div>

        {/* PANEL 2: Ghost Mode (User Impersonation) */}
        <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Ghost size={16} className="text-indigo-600 dark:text-indigo-400" />
              Ghost Mode Simulation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Impersonate different access roles to inspect views under restricted security settings. Great for debugging permissions issues.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-[10px] text-slate-500 font-bold block mb-1">CHOOSE IMPERSONATED TARGET</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'none', label: 'Primary' },
                { key: 'Editor', label: 'Editor' },
                { key: 'Viewer', label: 'Viewer' },
                { key: 'Guest', label: 'Guest' }
              ].map((role) => {
                const isActive = (role.key === 'none' && !impersonatedUser) || (impersonatedUser?.role === role.key);
                return (
                  <button
                    key={role.key}
                    onClick={() => handleGhostMode(role.key)}
                    className={`py-2 border rounded-xl text-[10px] font-bold transition-colors ${
                      isActive 
                        ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                        : 'dark:bg-slate-950 bg-slate-100 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PANEL 3: Safe Stage Environment */}
        <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Database size={16} className="text-indigo-600 dark:text-indigo-400" />
              Safe Stage Environment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch database contexts between Production and Sandbox modes. Each has separated collections in MongoDB.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {[
              { key: 'production', label: 'Production Database' },
              { key: 'sandbox', label: 'Sandbox Database' }
            ].map((env) => {
              const active = environment === env.key;
              return (
                <button
                  key={env.key}
                  onClick={() => {
                    setEnvironment(env.key);
                    toast.info(`Environment switched to ${env.key}`);
                  }}
                  className={`py-3 border rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1.5 transition-colors ${
                    active 
                      ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                      : 'dark:bg-slate-950 bg-slate-100 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Database size={14} />
                  {env.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PANEL 4: Color Theme Switcher */}
        <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sun size={16} className="text-indigo-600 dark:text-indigo-400" />
              Visual Theme Selection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure system themes. Default recommendation is high-fidelity Dark Mode.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {[
              { key: 'dark', label: 'Dark glassmorphic', icon: Moon },
              { key: 'light', label: 'Light modern', icon: Sun }
            ].map((th) => {
              const active = theme === th.key;
              const Icon = th.icon;
              return (
                <button
                  key={th.key}
                  onClick={() => {
                    setTheme(th.key);
                    toast.success(`Theme set to ${th.label}`);
                  }}
                  className={`py-3 border rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1.5 transition-colors ${
                    active 
                      ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                      : 'dark:bg-slate-955 bg-slate-100 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  {th.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};