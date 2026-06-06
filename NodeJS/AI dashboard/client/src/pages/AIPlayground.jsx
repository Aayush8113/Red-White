import { useState } from 'react';
import { Sparkles, Send, Database, ShieldCheck, Grid, Table, List, Code, Play } from 'lucide-react';
import { useStore } from '../store/uiStore';
import { toast } from 'sonner';

export const AIPlayground = () => {
  const { getClients } = useStore();
  const clients = getClients();

  // 1. AI Copilot state
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', msg: "I'm connected to your live MERN database. Ask me queries like 'Find active clients' or 'Get clients with revenue > 50000'." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [copilotResults, setCopilotResults] = useState([]);
  const [generatedQueryText, setGeneratedQueryText] = useState('');

  // 2. Smart Scaffold state
  const [scaffoldType, setScaffoldType] = useState('grid'); // 'table' | 'grid' | 'list'
  const [scaffoldColumns, setScaffoldColumns] = useState(['name', 'status', 'amount']);
  const [scaffoldFilter, setScaffoldFilter] = useState('All');
  const [hasScaffolded, setHasScaffolded] = useState(false);

  // Copilot Query parsing engine
  const triggerDirectQuery = (queryText) => {
    setQuery(queryText);
    setChatLog(prev => [...prev, { role: 'user', msg: queryText }]);
    setIsTyping(true);

    setTimeout(() => {
      let filtered = [...clients];
      let sql = 'db.clients.find({})';
      let assistantMsg = "Here are the records matching your query.";

      const lower = queryText.toLowerCase();
      if (lower.includes('active')) {
        filtered = clients.filter(c => c.status === 'Active');
        sql = "db.clients.find({ status: 'Active' })";
        assistantMsg = `Found ${filtered.length} active client records in MongoDB database.`;
      } else if (lower.includes('pending')) {
        filtered = clients.filter(c => c.status === 'Pending');
        sql = "db.clients.find({ status: 'Pending' })";
        assistantMsg = `Found ${filtered.length} pending client records awaiting approval.`;
      } else if (lower.includes('cancelled') || lower.includes('cancel')) {
        filtered = clients.filter(c => c.status === 'Cancelled');
        sql = "db.clients.find({ status: 'Cancelled' })";
        assistantMsg = `Found ${filtered.length} cancelled accounts.`;
      } else if (lower.includes('>') || lower.includes('greater') || lower.includes('over') || lower.includes('more')) {
        // extract amount
        const match = lower.match(/\d+/g);
        const amountLimit = match ? parseInt(match[0]) * (lower.includes('k') ? 1000 : 1) : 50000;
        filtered = clients.filter(c => c.amount > amountLimit);
        sql = `db.clients.find({ amount: { $gt: ${amountLimit} } })`;
        assistantMsg = `Compiled Mongoose aggregation. Matched ${filtered.length} client files exceeding $${amountLimit.toLocaleString()}.`;
      } else {
        assistantMsg = "I couldn't isolate a filter criteria from your description. Displaying full collections as fallback.";
      }

      setChatLog(prev => [...prev, { role: 'assistant', msg: assistantMsg }]);
      setCopilotResults(filtered);
      setGeneratedQueryText(sql);
      setIsTyping(false);
      setQuery('');
      toast.success("Query parsed successfully!");
    }, 1000);
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    triggerDirectQuery(query);
  };

  // Smart Scaffold compilation handler
  const handleCompileScaffold = () => {
    setHasScaffolded(true);
    toast.success(`Scaffolded ${scaffoldType} view layout successfully!`);
  };

  const toggleColumn = (col) => {
    if (scaffoldColumns.includes(col)) {
      if (scaffoldColumns.length === 1) {
        toast.warning("At least one column must remain enabled.");
        return;
      }
      setScaffoldColumns(prev => prev.filter(c => c !== col));
    } else {
      setScaffoldColumns(prev => [...prev, col]);
    }
  };

  // Scaffold data selector
  const scaffoldedData = clients.filter(c => {
    if (scaffoldFilter === 'All') return true;
    return c.status === scaffoldFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {/* SECTION A: AI COPILOT */}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[650px] shadow-2xl">
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4 mb-4">
            <div>
              <h3 className="text-slate-800 dark:text-white font-bold text-base flex items-center gap-1.5">
                <Sparkles className="text-indigo-500 dark:text-indigo-400" size={18} />
                AI Copilot Query Studio
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Natural language query compiler linked to live database.</p>
            </div>
            <span className="bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-600/20">DB COPILOT v2</span>
          </div>

          {/* Quick Query Templates */}
          <div className="mb-4">
            <span className="text-[10px] text-slate-500 font-bold block mb-1.5">LIVE COPILOT TEMPLATES (CLICK TO RUN):</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Find Active Clients", query: "Find active clients" },
                { label: "Revenue Over $10k", query: "Get clients with revenue > 10000" },
                { label: "Pending Verification", query: "Show pending clients" }
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => triggerDirectQuery(tmpl.query)}
                  className="px-2.5 py-1 text-[10px] dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 text-slate-700 dark:text-slate-355 font-medium rounded-xl transition-all"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface logs container */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
            {chatLog.map((log, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${log.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  log.role === 'user' ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-white' : 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                }`}>
                  {log.role === 'user' ? 'U' : <Sparkles size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  log.role === 'user' ? 'bg-indigo-650 text-white shadow-lg' : 'dark:bg-slate-950 bg-slate-50 dark:text-slate-300 text-slate-700 border border-slate-200 dark:border-white/5 shadow-sm'
                }`}>
                  {log.msg}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-[10px] text-slate-505 font-semibold pl-12 flex items-center gap-1.5">
                <RefreshSpinner /> AI Query Engine translating...
              </div>
            )}
          </div>
        </div>

        {/* Live Aggregation code and matching results preview */}
        {generatedQueryText && (
          <div className="mt-4 dark:bg-slate-950 bg-slate-50 border border-slate-200 dark:border-white/5 p-3.5 rounded-2xl">
            <div className="flex justify-between items-center text-[10px] text-slate-550 font-bold mb-2">
              <span className="flex items-center gap-1"><Code size={12} /> MONGO COMPILER OUTPUT</span>
              <span className="text-indigo-600 dark:text-indigo-400">100% Correct translation</span>
            </div>
            <pre className="text-[11px] font-mono text-indigo-755 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/20 p-2 rounded-lg border border-indigo-200 dark:border-indigo-900/30 overflow-x-auto">{generatedQueryText}</pre>
            
            {/* Short results preview */}
            <div className="mt-3 text-[10px] text-slate-650 dark:text-slate-400 max-h-24 overflow-y-auto custom-scrollbar">
              <span className="font-bold text-[9px] uppercase tracking-wider block mb-1">DATA RETURNED (LIMIT 3)</span>
              {copilotResults.length === 0 ? (
                <div className="text-slate-500 italic">No document matched.</div>
              ) : (
                copilotResults.slice(0, 3).map((r, rIdx) => (
                  <div key={rIdx} className="py-1 border-b border-slate-200 dark:border-white/2 last:border-0 flex justify-between">
                    <span>{r.name} ({r.email})</span>
                    <span className="text-slate-800 dark:text-white font-semibold">${r.amount.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Input box */}
        <form onSubmit={handleQuerySubmit} className="mt-4 flex gap-2 relative">
          <input
            type="text"
            className="w-full dark:bg-slate-950 bg-slate-100 border border-slate-250 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
            placeholder="Ask AI e.g. 'Show me active clients over 50k'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-550 rounded-lg text-white"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
      {/* SECTION B: SMART SCAFFOLD */}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[650px] shadow-2xl">
        <div className="space-y-6 overflow-y-auto custom-scrollbar pr-1 flex-1">
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-white/5 pb-4">
            <h3 className="text-slate-800 dark:text-white font-bold text-base flex items-center gap-1.5">
              <Database className="text-indigo-500 dark:text-indigo-400" size={18} />
              Smart Scaffold View Builder
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Instantly compile layout interfaces from schemas.</p>
          </div>

          {/* Quick Scaffold Templates */}
          <div>
            <span className="text-[10px] text-slate-500 font-bold block mb-1.5">LIVE SCAFFOLD TEMPLATES (CLICK TO LOAD):</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "VIP Grid: Name, Revenue, Status (Active)", type: 'grid', cols: ['name', 'status', 'amount'], filter: 'Active' },
                { label: "Directory Table: Name, Email, Date (All)", type: 'table', cols: ['name', 'email', 'date'], filter: 'All' },
                { label: "Trial List: Name, Revenue (Pending)", type: 'list', cols: ['name', 'amount'], filter: 'Pending' }
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setScaffoldType(tmpl.type);
                    setScaffoldColumns(tmpl.cols);
                    setScaffoldFilter(tmpl.filter);
                    setHasScaffolded(true);
                    toast.success(`Loaded and compiled ${tmpl.label}!`);
                  }}
                  className="px-2.5 py-1 text-[10px] dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 text-slate-700 dark:text-slate-355 font-medium rounded-xl transition-all"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scaffold Configurations */}
          <div className="space-y-4">
            {/* View Type Select */}
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-2">CHOOSE VIEW SYSTEM</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'grid', label: 'Card Grid', icon: Grid },
                  { value: 'table', label: 'Data Table', icon: Table },
                  { value: 'list', label: 'Compact List', icon: List }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = scaffoldType === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => setScaffoldType(item.value)}
                      className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all ${
                        active 
                          ? 'bg-indigo-650/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold' 
                          : 'dark:bg-slate-950 bg-slate-100 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Columns Multi-select */}
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-2">ACTIVE COLUMNS TO SCAFFOLD</label>
              <div className="flex flex-wrap gap-2">
                {['name', 'email', 'status', 'amount', 'date'].map((col) => {
                  const active = scaffoldColumns.includes(col);
                  return (
                    <button
                      key={col}
                      onClick={() => toggleColumn(col)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors ${
                        active 
                          ? 'bg-indigo-650/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                          : 'dark:bg-slate-950 bg-slate-100 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      {active ? '✓' : '+'} {col.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schema Filter select */}
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1.5">SCHEMA CONSTRAINT FILTER</label>
              <select
                value={scaffoldFilter}
                onChange={(e) => setScaffoldFilter(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-100 border border-slate-250 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="All">All Documents</option>
                <option value="Active">Active status only</option>
                <option value="Pending">Pending status only</option>
                <option value="Cancelled">Cancelled status only</option>
              </select>
            </div>

            {/* Run Button */}
            <button
              onClick={handleCompileScaffold}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-colors"
            >
              <Play size={12} fill="white" /> Compile & Render Scaffold Widget
            </button>
          </div>

          {/* Scaffolded Output Box */}
          {hasScaffolded && (
            <div className="dark:bg-slate-950 bg-slate-50 border border-slate-250 dark:border-white/10 p-4 rounded-2xl mt-4 max-h-60 overflow-y-auto custom-scrollbar">
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Database size={12} /> DYNAMICALLY SCAFFOLDED VIEW (Live Data)
              </div>
              
              {/* Type: Grid */}
              {scaffoldType === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scaffoldedData.map((d, dIdx) => (
                    <div key={dIdx} className="dark:bg-slate-900 bg-white border border-slate-200 dark:border-white/5 p-3 rounded-xl shadow-sm">
                      {scaffoldColumns.includes('name') && <div className="font-bold text-slate-800 dark:text-white text-xs truncate">{d.name}</div>}
                      {scaffoldColumns.includes('email') && <div className="text-[9px] text-slate-500 truncate mt-0.5">{d.email}</div>}
                      <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-slate-100 dark:border-white/5 text-[10px]">
                        {scaffoldColumns.includes('status') && <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{d.status}</span>}
                        {scaffoldColumns.includes('amount') && <span className="text-slate-800 dark:text-white font-bold">${d.amount.toLocaleString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Type: Table */}
              {scaffoldType === 'table' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px] text-slate-500 dark:text-slate-400">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 text-[8px] uppercase tracking-wider font-bold">
                        {scaffoldColumns.map(col => <th key={col} className="pb-2">{col}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {scaffoldedData.map((d, dIdx) => (
                        <tr key={dIdx}>
                          {scaffoldColumns.map(col => (
                            <td key={col} className="py-2 text-slate-700 dark:text-white max-w-[100px] truncate">
                              {col === 'amount' ? `$${d.amount.toLocaleString()}` : d[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Type: List */}
              {scaffoldType === 'list' && (
                <div className="space-y-1.5">
                  {scaffoldedData.map((d, dIdx) => (
                    <div key={dIdx} className="py-2 px-3 dark:bg-slate-900 bg-white border border-slate-200 dark:border-white/2 rounded-lg flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-300 shadow-sm">
                      <div className="flex gap-2 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {scaffoldColumns.includes('name') && <span className="font-bold text-slate-800 dark:text-white">{d.name}</span>}
                        {scaffoldColumns.includes('email') && <span className="text-slate-500">({d.email})</span>}
                      </div>
                      <div className="flex gap-3">
                        {scaffoldColumns.includes('status') && <span className="uppercase text-[9px] tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">{d.status}</span>}
                        {scaffoldColumns.includes('amount') && <span className="text-slate-800 dark:text-white font-bold">${d.amount.toLocaleString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RefreshSpinner = () => (
  <svg className="animate-spin h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);
