import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Sparkles, AlertTriangle, 
  BarChart3, Database, ShieldCheck, Settings, LogOut, Code2, Lock
} from "lucide-react";
import { cn } from "../lib/utils";
import { useStore } from "../store/uiStore";
import { toast } from 'sonner';
import { Logo } from './Logo';

export const Sidebar = () => {
  const { 
    environment, setEnvironment, logout, hasPermission, getActiveRole 
  } = useStore();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/", perm: "read" },
    { icon: Users, label: "Clients & CRUD", path: "/clients", perm: "read" },
    { icon: Sparkles, label: "AI Playground", path: "/ai-studio", perm: "read" },
    { icon: AlertTriangle, label: "Action Flows", path: "/automation", perm: "read" },
    { icon: BarChart3, label: "Query Studio", path: "/query-studio", perm: "read" },
    { icon: Database, label: "Data Forge", path: "/data-forge", perm: "export" },
    { icon: ShieldCheck, label: "Security & RBAC", path: "/security", perm: "system" },
    { icon: Settings, label: "Settings", path: "/settings", perm: "read" },
  ];

  const handleEnvChange = (env) => {
    setEnvironment(env);
    toast.info(`Environment switched to ${env.toUpperCase()}`);
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    navigate('/login');
  };

  const isProd = environment === 'production';

  return (
    <aside className={cn(
      "w-64 border-r h-screen fixed left-0 top-0 flex flex-col z-20 hidden md:flex transition-all duration-300",
      isProd 
        ? "dark:bg-slate-900 bg-white dark:border-white/5 border-slate-200" 
        : "dark:bg-slate-900/95 bg-amber-50/95 dark:border-amber-500/20 border-amber-200 shadow-lg shadow-amber-950/10"
    )}>
      {/* Brand */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            Aether<span className={isProd ? "text-indigo-500" : "text-amber-500"}>Forge</span>
          </span>
        </div>
      </div>

      {/* Safe Stage Environment Switcher */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 dark:bg-slate-950/20 bg-slate-50/50">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Safe Stage Env</div>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/5">
          <button
            onClick={() => handleEnvChange('production')}
            className={cn(
              "py-1.5 rounded-lg text-xs font-semibold transition-all",
              isProd 
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/20 dark:shadow-indigo-950/50" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            )}
          >
            PROD
          </button>
          <button
            onClick={() => handleEnvChange('sandbox')}
            className={cn(
              "py-1.5 rounded-lg text-xs font-semibold transition-all",
              !isProd 
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-950/20 dark:shadow-amber-950/50" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            )}
          >
            SANDBOX
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const allowed = hasPermission(item.perm);
          
          if (!allowed) {
            return (
              <div
                key={item.path}
                onClick={() => toast.error(`Access Denied: Role '${getActiveRole()}' lacks '${item.perm}' permission.`)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-450 dark:text-slate-600 cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/2"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
                <Lock size={12} className="text-slate-400 dark:text-slate-500" />
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                isActive 
                  ? isProd
                    ? "bg-indigo-600/10 text-indigo-500 dark:text-indigo-400 border-indigo-600/20 shadow-lg shadow-indigo-950/10"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 shadow-lg shadow-amber-950/10"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border-transparent"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User / Sign Out */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};