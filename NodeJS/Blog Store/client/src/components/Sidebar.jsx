import { useState } from 'react';

const Sidebar = ({ categories, onSearch, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <aside className="space-y-12 sticky top-32">
      {/* Search Bar - Futuristic Style */}
      <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 group transition-all hover:shadow-blue-500/5">
        <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.4em] italic">Intelligence</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text" 
            placeholder="Search the archive..." 
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold italic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg active:scale-90">
            🔍
          </button>
        </form>
      </div>

      {/* Categories - Pill Style */}
      <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.4em] italic">Taxonomy</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-widest text-slate-600 shadow-sm active:scale-95"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Posts Placeholder / Featured */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[48px] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
        <h3 className="text-[10px] font-black mb-4 uppercase tracking-[0.4em] opacity-60 italic">Featured Mission</h3>
        <p className="text-xl font-black mb-6 italic leading-tight tracking-tighter">Start your own legacy in the archive today.</p>
        <button className="px-8 py-3 bg-white text-blue-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95">
          Begin Writing
        </button>
      </div>

      {/* Connection Links */}
      <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-[0.4em] italic">Connections</h3>
        <div className="grid grid-cols-2 gap-4">
          {['Twitter', 'Discord', 'Github', 'LinkedIn'].map((social) => (
            <button key={social} className="px-4 py-3 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-slate-100">
              {social}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
