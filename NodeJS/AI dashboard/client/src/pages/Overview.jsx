import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  DollarSign, Users, Activity, TrendingUp, Trash2,
  ArrowLeft, ArrowRight, RefreshCw, Cpu, ActivitySquare
} from "lucide-react";
import { useStore } from "../store/uiStore";
import { toast } from 'sonner';

export const Overview = () => {
  const { 
    widgets, reorderWidgets, removeWidget, addWidget, 
    telemetry, fetchTelemetry, environment, isMaskingEnabled, theme,
    productionClients, sandboxClients
  } = useStore();
  const [pulseLogs, setPulseLogs] = useState([]);

  const clients = environment === 'production' ? productionClients : sandboxClients;

  
  const totalRevenue = clients.reduce((acc, c) => acc + (c.status === 'Active' ? c.amount : 0), 0);
  const activeClientsCount = clients.filter(c => c.status === 'Active').length;

  
  const maskValue = (val, isCurrency = true) => {
    if (!isMaskingEnabled) return isCurrency ? `$${val.toLocaleString()}` : val;
    return isCurrency ? '$••••••' : '••••••';
  };

  
  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  
  useEffect(() => {
    if (telemetry.lastEvent) {
      setPulseLogs(prev => [telemetry.lastEvent, ...prev.slice(0, 9)]);
    }
  }, [telemetry.lastEvent]);

  
  const moveWidget = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= widgets.length) return;
    const reordered = [...widgets];
    const temp = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = temp;
    reorderWidgets(reordered);
    toast.success("Dashboard layout updated");
  };

  
  const chartData = [
    { name: 'Mon', val: totalRevenue * 0.7 },
    { name: 'Tue', val: totalRevenue * 0.8 },
    { name: 'Wed', val: totalRevenue * 0.6 },
    { name: 'Thu', val: totalRevenue * 0.85 },
    { name: 'Fri', val: totalRevenue * 0.75 },
    { name: 'Sat', val: totalRevenue * 0.9 },
    { name: 'Sun', val: totalRevenue }
  ];

  const chartStroke = theme === 'dark' ? '#475569' : '#cbd5e1';
  const tooltipStyle = theme === 'dark' 
    ? { backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }
    : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {}
      <div className="flex justify-between items-center dark:bg-slate-900/40 bg-white p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Interactive Flex Board</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Environment: <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase">{environment}</span>. Customize with drag or shift.</p>
        </div>
        <div className="flex gap-2">
          <select 
            onChange={(e) => {
              if (e.target.value) {
                addWidget(e.target.value);
                e.target.value = "";
              }
            }}
            className="dark:bg-slate-800 bg-slate-100 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">+ Add Widget...</option>
            <option value="stats">Key Telemetry</option>
            <option value="revenue">Revenue Analytics</option>
            <option value="live-pulse">Live Telemetry Pulse</option>
            <option value="traffic">Traffic Sources</option>
          </select>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.map((widget, idx) => {
          return (
            <div 
              key={widget.id} 
              className={`dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-2xl p-6 relative group flex flex-col justify-between hover:border-indigo-500/20 transition-all shadow-md ${
                widget.size === 'lg' ? 'lg:col-span-2' : 'lg:col-span-1'
              }`}
            >
              
              {}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ActivitySquare size={14} className="text-indigo-500 dark:text-indigo-400" />
                  {widget.name}
                </h3>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => moveWidget(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30"
                    title="Move Left/Up"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button 
                    onClick={() => moveWidget(idx, 1)}
                    disabled={idx === widgets.length - 1}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded text-slate-550 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white disabled:opacity-30"
                    title="Move Right/Down"
                  >
                    <ArrowRight size={14} />
                  </button>
                  <button 
                    onClick={() => removeWidget(widget.id)}
                    className="p-1 hover:bg-rose-500/10 rounded text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                    title="Remove Widget"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {}
              <div className="flex-1">
                {widget.type === 'stats' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Active Revenue" value={maskValue(totalRevenue, true)} icon={DollarSign} trend="+15.4%" color="text-emerald-600 dark:text-emerald-400" theme={theme} />
                    <StatCard title="Active Clients" value={maskValue(activeClientsCount, false)} icon={Users} trend={`Total ${clients.length}`} color="text-indigo-600 dark:text-indigo-400" theme={theme} />
                    <StatCard title="System Load" value={`${telemetry.cpu}%`} icon={Cpu} trend="Optimized" color="text-sky-600 dark:text-sky-400" theme={theme} />
                    <StatCard title="Traffic Rate" value={`${telemetry.requests} req/s`} icon={TrendingUp} trend="Healthy" color="text-purple-600 dark:text-purple-400" theme={theme} />
                  </div>
                )}

                {widget.type === 'revenue' && (
                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke={chartStroke} axisLine={false} tickLine={false} />
                        <YAxis stroke={chartStroke} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toLocaleString()}`} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {widget.type === 'live-pulse' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {}
                    <div className="dark:bg-slate-950/40 bg-slate-50 p-4 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center shadow-sm">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="4" fill="transparent" />
                          <circle cx="32" cy="32" r="28" className="stroke-indigo-500 transition-all duration-300" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * telemetry.cpu) / 100} />
                        </svg>
                        <span className="absolute text-xs font-bold text-slate-800 dark:text-white">{telemetry.cpu}%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">CPU USAGE</span>
                    </div>

                    <div className="dark:bg-slate-950/40 bg-slate-50 p-4 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center shadow-sm">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="4" fill="transparent" />
                          <circle cx="32" cy="32" r="28" className="stroke-amber-500 transition-all duration-300" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * telemetry.ram) / 100} />
                        </svg>
                        <span className="absolute text-xs font-bold text-slate-800 dark:text-white">{telemetry.ram}%</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2">RAM LOAD</span>
                    </div>

                    {}
                    <div className="md:col-span-3 dark:bg-slate-950 bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-white/5 h-44 overflow-y-auto custom-scrollbar font-mono text-[10px] text-emerald-400 space-y-1">
                      <div className="text-slate-500 border-b border-white/5 pb-1 flex justify-between">
                        <span>LIVE TELEMETRY pulse.log</span>
                        <span className="flex items-center gap-1"><RefreshCw size={10} className="animate-spin text-emerald-500" /> Ticking</span>
                      </div>
                      {pulseLogs.map((log, lIdx) => (
                        <div key={lIdx} className="leading-relaxed truncate">{log}</div>
                      ))}
                    </div>
                  </div>
                )}

                {widget.type === 'traffic' && (
                  <div className="space-y-4">
                    {['Direct Traffic', 'Social Feeds', 'Referrals', 'Organic Search'].map((source, i) => (
                      <div key={source}>
                        <div className="flex justify-between text-xs text-slate-550 dark:text-slate-400 mb-1">
                          <span>{source}</span>
                          <span className="text-slate-800 dark:text-white font-medium">{95 - (i * 22)}%</span>
                        </div>
                        <div className="h-1.5 dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{width: `${95 - (i * 22)}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color, theme }) => (
  <div className="dark:bg-slate-950/40 bg-slate-50 border border-slate-200 dark:border-white/5 p-4 rounded-xl flex items-center justify-between shadow-sm">
    <div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
      <p className={`text-[10px] font-semibold mt-1.5 ${color}`}>{trend}</p>
    </div>
    <div className="p-3 dark:bg-white/5 bg-slate-100 rounded-xl border border-slate-200 dark:border-white/5">
      <Icon className="text-slate-500 dark:text-slate-400 w-5 h-5" />
    </div>
  </div>
);