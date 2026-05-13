import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ categories, onSearch, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <aside className="space-y-10">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-4 italic">Search Articles</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text" 
            placeholder="Search keywords..." 
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors">
            🔍
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-4 italic">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className="text-left px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-slate-600 text-sm flex justify-between items-center group"
            >
              {cat}
              <span className="text-slate-300 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        <h3 className="text-xl font-black mb-2 italic">Stay Inspired</h3>
        <p className="text-slate-400 text-sm mb-6">Get the latest stories and creative ideas delivered to your inbox weekly.</p>
        <form className="space-y-3">
          <input 
            type="email" 
            placeholder="your@email.com" 
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm placeholder:text-slate-500"
          />
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all active:scale-95 text-sm shadow-lg">
            Subscribe Now
          </button>
        </form>
      </div>

      {/* Social Links */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-4 italic">Follow Us</h3>
        <div className="flex gap-3">
          {['fb', 'tw', 'ig', 'li'].map((social) => (
            <button key={social} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <span className="text-xs font-black uppercase">{social}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
