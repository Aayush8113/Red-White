import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Settings, Users, ArrowRight, ShieldAlert, Sliders, ToggleLeft } from 'lucide-react';
import { useStore } from '../store/uiStore';

export const GlobalSearch = () => {
  const { isSearchOpen, toggleSearch, getClients, toggleMasking, isMaskingEnabled, setMaskingEnabled } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        toggleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, toggleSearch]);

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const clients = getClients();

  // Create list of search targets
  const items = [
    // Pages / Routes
    { id: 'route-dashboard', title: 'Go to Dashboard Overview', category: 'Navigation', icon: Sliders, action: () => navigate('/') },
    { id: 'route-clients', title: 'Go to Client Management', category: 'Navigation', icon: Users, action: () => navigate('/clients') },
    { id: 'route-ai', title: 'Go to AI Playground & Scaffold', category: 'Navigation', icon: Sparkles, action: () => navigate('/ai-studio') },
    { id: 'route-automation', title: 'Go to Action Flows Builder', category: 'Navigation', icon: ShieldAlert, action: () => navigate('/automation') },
    { id: 'route-security', title: 'Go to Matrix Security & RBAC', category: 'Navigation', icon: Settings, action: () => navigate('/security') },
    
    // Toggles / Quick actions
    { 
      id: 'action-masking', 
      title: `${isMaskingEnabled ? 'Disable' : 'Enable'} PII Data Masking`, 
      category: 'Quick Command', 
      icon: ToggleLeft, 
      action: () => setMaskingEnabled(!isMaskingEnabled) 
    },
    
    // Clients Data
    ...clients.map(c => ({
      id: `client-${c.id}`,
      title: `${c.name} (${c.email}) - Revenue: $${c.amount.toLocaleString()}`,
      category: 'Clients',
      icon: Users,
      action: () => { navigate('/clients'); }
    }))
  ];

  // Filter items
  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        toggleSearch();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-white/5">
          <Search className="text-slate-400 mr-3" size={20} />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent border-none focus:outline-none text-white text-base placeholder:text-slate-500"
            placeholder="Type a command, page name, or client..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
          />
          <button 
            onClick={toggleSearch}
            className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results found for <span className="text-white font-medium">"{query}"</span>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => { item.action(); toggleSearch(); }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30' 
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isSelected ? 'text-white' : 'text-slate-400'} />
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className={`text-[10px] uppercase tracking-wider font-semibold ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                  {isSelected && <ArrowRight size={14} className="animate-pulse" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-950/40 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-medium">
          <div className="flex gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <div>Press Cmd+K to toggle anytime</div>
        </div>
      </div>
    </div>
  );
};
