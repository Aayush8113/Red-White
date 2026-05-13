import { useState, useEffect } from 'react';

const Sidebar = ({ categories, onSearch, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiLoad, setAiLoad] = useState(85);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAiLoad(prev => Math.min(100, Math.max(70, prev + (Math.random() * 10 - 5))));
      setPulse(p => !p);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <aside className="space-y-12 sticky top-32">
      {/* AI Engine Status - NEW Futuristic Feature */}
      <div className="bg-slate-900 p-8 rounded-[48px] text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 italic">Core Intelligence</h3>
             <div className={`h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] ${pulse ? 'animate-ping' : ''}`}></div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                <span>Neural Processing</span>
                <span>{Math.round(aiLoad)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out"
                   style={{ width: `${aiLoad}%` }}
                 ></div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-[11px] italic font-medium text-slate-300 leading-relaxed">
                "AI is currently analyzing 2,400+ data points to curate your personalized reading stream."
              </p>
            </div>

            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/40 active:scale-95">
              Sync Neural Profile
            </button>
          </div>
        </div>
      </div>

      {/* Futuristic Search */}
      <div className="bg-white p-8 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 group transition-all hover:shadow-blue-500/10">
        <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.4em] italic">Search Engine</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="gradient-border">
            <input 
              type="text" 
              placeholder="Query the database..." 
              className="w-full pl-6 pr-14 py-4 bg-slate-50/50 border-none rounded-3xl focus:ring-0 outline-none transition-all text-sm font-bold italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-2xl active:scale-90">
            📡
          </button>
        </form>
      </div>

      {/* Taxonomy (Categories) - High-end UI */}
      <div className="bg-white p-8 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-[0.4em] italic">Knowledge Clusters</h3>
        <div className="grid grid-cols-1 gap-3">
          {categories.map((cat, idx) => (
            <button 
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className="group flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-50 hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-300 font-black italic">0{idx + 1}</span>
                <span className="font-black text-[11px] uppercase tracking-widest text-slate-600 group-hover:text-blue-600 transition-colors">{cat}</span>
              </div>
              <span className="text-slate-200 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Automation Insights - NEW Feature */}
      <div className="bg-white p-8 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.4em] italic">Automated Insights</h3>
        <div className="space-y-6">
           <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">💡</div>
              <div>
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1 italic">Trending Prediction</h4>
                 <p className="text-[10px] text-slate-500 italic font-medium leading-relaxed">AI predicts "Quantum Computing" will be the most discussed topic next week.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 bg-purple-50 rounded-2xl flex items-center justify-center text-xl">⚡</div>
              <div>
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 mb-1 italic">Efficiency Score</h4>
                 <p className="text-[10px] text-slate-500 italic font-medium leading-relaxed">System content delivery has improved by 14% through automated caching.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Connection Protocol */}
      <div className="bg-slate-50 p-8 rounded-[48px] border border-slate-100 text-center">
        <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.4em] italic">Connect Protocol</h3>
        <div className="flex justify-center gap-4">
          {['X', 'Discord', 'Github'].map((social) => (
            <button key={social} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
              <span className="text-[10px] font-black uppercase">{social.charAt(0)}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
