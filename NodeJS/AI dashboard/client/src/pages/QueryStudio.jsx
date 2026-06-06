import { useState } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, LineChart, Line, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';
import { BarChart3, Settings, Play, Download, Sparkles } from 'lucide-react';
import { useStore } from '../store/uiStore';
import { toast } from 'sonner';

export const QueryStudio = () => {
  const { theme, productionClients, sandboxClients, environment } = useStore();
  const clients = environment === 'production' ? productionClients : sandboxClients;
  const isDark = theme !== 'light';

  
  const [chartType, setChartType] = useState('bar'); 
  const [xAxisKey, setXAxisKey] = useState('status'); 
  const [yAxisKey, setYAxisKey] = useState('amount'); 
  
  const [compiledData, setCompiledData] = useState([]);
  const [hasCompiled, setHasCompiled] = useState(false);

  
  const triggerDirectCompile = (xKey, yKey, cType) => {
    if (clients.length === 0) {
      toast.error("No database records available to compile.");
      return;
    }

    let result = [];

    
    if (xKey === 'status') {
      const groups = { Active: 0, Pending: 0, Cancelled: 0 };
      const counts = { Active: 0, Pending: 0, Cancelled: 0 };
      
      clients.forEach(c => {
        groups[c.status] = (groups[c.status] || 0) + c.amount;
        counts[c.status] = (counts[c.status] || 0) + 1;
      });

      result = Object.keys(groups).map(status => ({
        name: status,
        amount: groups[status],
        count: counts[status]
      }));
    } else if (xKey === 'date') {
      const dateGroups = {};
      const dateCounts = {};
      
      clients.forEach(c => {
        dateGroups[c.date] = (dateGroups[c.date] || 0) + c.amount;
        dateCounts[c.date] = (dateCounts[c.date] || 0) + 1;
      });

      result = Object.keys(dateGroups).sort().map(date => ({
        name: date,
        amount: dateGroups[date],
        count: dateCounts[date]
      }));
    } else {
      result = clients.map(c => ({
        name: c.name,
        amount: c.amount,
        count: 1
      }));
    }

    setCompiledData(result);
    setHasCompiled(true);
    toast.success("Query studio visual reports compiled!");
  };

  const handleCompileReport = () => {
    triggerDirectCompile(xAxisKey, yAxisKey, chartType);
  };

  const handleExport = () => {
    toast.info("Report compiled. Exporting custom JSON payload metadata...");
    
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(compiledData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aetherforge_query_report_${xAxisKey}_${yAxisKey}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {}
      <div className="dark:bg-slate-900/40 bg-white p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Query Studio</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate custom reports, charts, and data aggregations from MERN schemas.</p>
        </div>
        <span className="text-xs bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-xl border border-indigo-600/25 font-bold uppercase tracking-wider">
          Query Engine Active
        </span>
      </div>

      {}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-md">
        <span className="text-[10px] text-slate-500 font-bold block mb-3 uppercase tracking-wider">LIVE REPORT TEMPLATES (CLICK TO GENERATE):</span>
        <div className="flex flex-wrap gap-2.5">
          {[
            { label: "Revenue status distribution", x: 'status', y: 'amount', type: 'bar' },
            { label: "Revenue timeline trend", x: 'date', y: 'amount', type: 'area' },
            { label: "Accounts volume line", x: 'status', y: 'count', type: 'line' }
          ].map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setXAxisKey(tmpl.x);
                setYAxisKey(tmpl.y);
                setChartType(tmpl.type);
                triggerDirectCompile(tmpl.x, tmpl.y, tmpl.type);
              }}
              className="px-3 py-1.5 text-[10px] dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-250 dark:border-white/5 hover:border-indigo-500/30 text-slate-700 dark:text-slate-350 font-medium rounded-xl transition-all"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between h-fit gap-6 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-3">
              <Settings size={16} className="text-indigo-500" />
              Configure Visualization
            </h3>

            {}
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">X-AXIS (DIMENSION GROUP)</label>
              <select
                value={xAxisKey}
                onChange={(e) => setXAxisKey(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-100 border border-slate-250 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="status">Client Status</option>
                <option value="date">Logging Date</option>
                <option value="name">Individual Client Name</option>
              </select>
            </div>

            {}
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">Y-AXIS (DATA METRIC)</label>
              <select
                value={yAxisKey}
                onChange={(e) => setYAxisKey(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-100 border border-slate-250 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="amount">Revenue ($ ARR)</option>
                <option value="count">Count (Clients Quantity)</option>
              </select>
            </div>

            {}
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">CHART RENDERER</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-100 border border-slate-250 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="bar">Bar Chart</option>
                <option value="area">Area Gradient Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCompileReport}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-lg active:scale-98"
          >
            <Play size={12} fill="white" /> Compile Visualization
          </button>
        </div>

        {}
        <div className="lg:col-span-2 dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between min-h-[400px] shadow-xl">
          {hasCompiled ? (
            <div className="flex-1 flex flex-col justify-between">
              
              {}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-550" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Showing <span className="text-slate-800 dark:text-white font-bold">{yAxisKey.toUpperCase()}</span> grouped by <span className="text-slate-800 dark:text-white font-bold">{xAxisKey.toUpperCase()}</span>
                  </span>
                </div>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 dark:bg-slate-950 bg-slate-100 border border-slate-250 dark:border-white/10 hover:border-indigo-500/30 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  <Download size={12} /> Export JSON
                </button>
              </div>

              {}
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={compiledData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                      <XAxis dataKey="name" stroke={isDark ? "#475569" : "#64748b"} fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke={isDark ? "#475569" : "#64748b"} fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => yAxisKey === 'amount' ? `$${v.toLocaleString()}` : v} />
                      <Tooltip contentStyle={{backgroundColor: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#e2e8f0', color: isDark ? '#fff' : '#000'}} />
                      <Legend />
                      <Bar dataKey={yAxisKey} fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : chartType === 'area' ? (
                    <AreaChart data={compiledData}>
                      <defs>
                        <linearGradient id="queryColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                      <XAxis dataKey="name" stroke={isDark ? "#475569" : "#64748b"} fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke={isDark ? "#475569" : "#64748b"} fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => yAxisKey === 'amount' ? `$${v.toLocaleString()}` : v} />
                      <Tooltip contentStyle={{backgroundColor: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#e2e8f0', color: isDark ? '#fff' : '#000'}} />
                      <Legend />
                      <Area type="monotone" dataKey={yAxisKey} stroke="#8b5cf6" fillOpacity={1} fill="url(#queryColor)" strokeWidth={2} />
                    </AreaChart>
                  ) : (
                    <LineChart data={compiledData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                      <XAxis dataKey="name" stroke={isDark ? "#475569" : "#64748b"} fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke={isDark ? "#475569" : "#64748b"} fontSize={10} axisLine={false} tickLine={false} tickFormatter={v => yAxisKey === 'amount' ? `$${v.toLocaleString()}` : v} />
                      <Tooltip contentStyle={{backgroundColor: isDark ? '#0f172a' : '#fff', borderColor: isDark ? '#1e293b' : '#e2e8f0', color: isDark ? '#fff' : '#000'}} />
                      <Legend />
                      <Line type="monotone" dataKey={yAxisKey} stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 8 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center py-20">
              <BarChart3 size={36} className="text-slate-350 dark:text-slate-700 mb-2 animate-pulse" />
              <p className="text-sm font-semibold">Workspace is idle.</p>
              <p className="text-xs">Adjust configurations on the left panel and compile to run queries.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
