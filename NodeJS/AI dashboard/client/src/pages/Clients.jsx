import { useState } from 'react';
import { 
  Search, Trash2, Edit3, Plus, ArrowUpDown, ShieldAlert, 
  Settings, X, Check, Users, Sparkles, AlertCircle
} from "lucide-react";
import { useStore } from "../store/uiStore";
import { toast } from "sonner";

export const Clients = () => {
  const { 
    addClient, updateClient, deleteClient, executeBulkAction, 
    hasPermission, isMaskingEnabled, getActiveRole, theme,
    productionClients, sandboxClients, environment
  } = useStore();

  const clients = environment === 'production' ? productionClients : sandboxClients;

  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null); 
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Active', amount: '' });

  
  const [bulkFilter, setBulkFilter] = useState('all');
  const [bulkAction, setBulkAction] = useState('activate');
  const [isBulkRunning, setIsBulkRunning] = useState(false);

  
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSplitViewOpen, setIsSplitViewOpen] = useState(false);

  
  const canWrite = hasPermission('write');
  const canDelete = hasPermission('delete');

  
  const maskEmail = (email) => {
    if (!isMaskingEnabled) return email;
    const [name, domain] = email.split('@');
    if (!name || !domain) return '••••••';
    return `${name[0]}•••@${domain}`;
  };

  const maskName = (name) => {
    if (!isMaskingEnabled) return name;
    return `${name.substring(0, 3)}•••••`;
  };

  const maskAmount = (amount) => {
    if (!isMaskingEnabled) return `$${amount.toLocaleString()}`;
    return '$••••••';
  };

  
  const handleOpenCreate = () => {
    if (!canWrite) {
      toast.error(`Access Denied: Role '${getActiveRole()}' lacks write permissions.`);
      return;
    }
    setEditingClient(null);
    setFormData({ name: '', email: '', status: 'Active', amount: '' });
    setIsCrudModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    if (!canWrite) {
      toast.error(`Access Denied: Role '${getActiveRole()}' lacks write permissions.`);
      return;
    }
    setEditingClient(client);
    setFormData({ 
      name: client.name, 
      email: client.email, 
      status: client.status, 
      amount: client.amount.toString() 
    });
    setIsCrudModalOpen(true);
  };

  const handleSubmitCrud = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editingClient) {
      updateClient({ 
        ...editingClient, 
        name: formData.name, 
        email: formData.email, 
        status: formData.status, 
        amount: formData.amount 
      });
      toast.success("Client record updated successfully");
    } else {
      addClient(formData);
      toast.success("Client record instantiated");
    }
    setIsCrudModalOpen(false);
  };

  const handleDeleteClient = (id) => {
    if (!canDelete) {
      toast.error(`Access Denied: Role '${getActiveRole()}' lacks delete permissions.`);
      return;
    }
    deleteClient(id);
    toast.error("Client record purged from database");
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  };

  
  const handleExecuteBulk = () => {
    if (!canWrite) {
      toast.error(`Access Denied: Role '${getActiveRole()}' lacks write permissions to execute Bulk Engine.`);
      return;
    }
    setIsBulkRunning(true);
    toast.info("Bulk Engine compiling modifications...");
    
    setTimeout(() => {
      executeBulkAction(bulkFilter, bulkAction);
      setIsBulkRunning(false);
      toast.success("Mass records modified and audit log written");
    }, 1200);
  };

  
  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 2) {
        toast.warning("Split View only supports comparing exactly 2 records.");
        return;
      }
      setSelectedIds(prev => [...prev, id]);
    }
  };

  
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const compareRowColor = theme === 'dark' ? 'text-white' : 'text-slate-800';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 p-6 rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
          <ShieldAlert size={16} className="text-amber-500" />
          Bulk Data Engine
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-[10px] text-slate-500 font-bold block mb-1">SELECT SUBSET</label>
            <select
              value={bulkFilter}
              onChange={(e) => setBulkFilter(e.target.value)}
              className="w-full dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Clients</option>
              <option value="pending">Pending Clients</option>
              <option value="low-revenue">Revenue &lt; $15,000</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-bold block mb-1">OPERATION TYPE</label>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="w-full dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="activate">Activate Status</option>
              <option value="clear-pending">Cancel Status</option>
              <option value="bump-revenue">Bump Revenue (+15% Inflation)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleExecuteBulk}
              disabled={isBulkRunning}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-slate-200 disabled:text-slate-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98]"
            >
              {isBulkRunning ? "Running Mass Update..." : "Execute Mass Bulk Operation"}
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex-1 flex gap-2">
          {}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full dark:bg-slate-900 bg-white border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 shadow-sm" 
            />
          </div>
          {}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dark:bg-slate-900 bg-white border border-slate-200 dark:border-white/5 rounded-xl px-3 text-xs text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Pending">Pending Only</option>
            <option value="Cancelled">Cancelled Only</option>
          </select>
        </div>

        <div className="flex gap-2">
          {}
          {selectedIds.length === 2 && (
            <button
              onClick={() => setIsSplitViewOpen(true)}
              className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-900/10"
            >
              <Users size={14} /> Compare (2 Selected)
            </button>
          )}

          {}
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-900/10"
          >
            <Plus size={14} /> Add Client Record
          </button>
        </div>
      </div>

      {}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-md">
        <table className="w-full text-left text-xs text-slate-500 dark:text-slate-400">
          <thead className="dark:bg-slate-950/40 bg-slate-50 text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[9px] font-bold border-b border-slate-200 dark:border-white/5">
            <tr>
              <th className="px-6 py-4 w-12 text-center">Compare</th>
              <th className="px-6 py-4">Client Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Revenue Rate</th>
              <th className="px-6 py-4">Date Logged</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredClients.map((c) => {
              const isSelected = selectedIds.includes(c._id || c.id);
              return (
                <tr key={c._id || c.id} className={`hover:bg-slate-50 dark:hover:bg-white/2 transition-colors ${isSelected ? 'bg-indigo-600/5 dark:bg-indigo-600/5' : ''}`}>
                  
                  {}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleSelectRow(c._id || c.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors mx-auto ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                          : 'border-slate-300 dark:border-white/20 hover:border-indigo-500'
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </button>
                  </td>

                  {}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white text-sm">{maskName(c.name)}</div>
                    <div className="text-slate-500 text-[10px] mt-0.5">{maskEmail(c.email)}</div>
                  </td>

                  {}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                      c.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}>{c.status}</span>
                  </td>

                  {}
                  <td className="px-6 py-4 text-slate-800 dark:text-white font-semibold">{maskAmount(c.amount)}</td>

                  {}
                  <td className="px-6 py-4">{c.date}</td>

                  {}
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => handleOpenEdit(c)}
                        className="p-2 dark:bg-slate-950/40 bg-slate-100 hover:bg-indigo-650 hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-white/5"
                        title="Edit Record"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(c._id || c.id)}
                        className="p-2 dark:bg-slate-950/40 bg-slate-100 hover:bg-rose-600 hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-white/5"
                        title="Delete Record"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
            <AlertCircle size={28} className="text-slate-400" />
            <span>No administrative client records cataloged.</span>
          </div>
        )}
      </div>

      {}
      {isCrudModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md dark:bg-slate-900 bg-white border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsCrudModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-slate-800 dark:text-white font-bold text-base mb-4 flex items-center gap-1.5">
              <Sparkles size={16} className="text-indigo-500 dark:text-indigo-400" />
              {editingClient ? "Modify Client Record" : "Instantiate Client Entity"}
            </h3>
            
            <form onSubmit={handleSubmitCrud} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">NAME</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full dark:bg-slate-950 bg-slate-50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500" 
                  placeholder="Acme Corp"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full dark:bg-slate-950 bg-slate-50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500" 
                  placeholder="contact@acme.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full dark:bg-slate-950 bg-slate-50 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">REVENUE ($)</label>
                  <input 
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full dark:bg-slate-950 bg-slate-50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500" 
                    placeholder="12000"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex gap-2 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsCrudModalOpen(false)}
                  className="px-4 py-2 dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                >
                  {editingClient ? "Save Changes" : "Create Entity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {isSplitViewOpen && (
        (() => {
          const compClients = clients.filter(c => selectedIds.includes(c._id || c.id));
          if (compClients.length !== 2) return null;
          const [c1, c2] = compClients;

          return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-4xl dark:bg-slate-900 bg-white border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                
                <button 
                  onClick={() => setIsSplitViewOpen(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 dark:bg-white/5 bg-slate-100 rounded-lg"
                >
                  <X size={18} />
                </button>

                <h3 className="dark:text-white text-slate-800 font-bold text-lg mb-6 flex items-center gap-2">
                  <Users className="text-indigo-500 dark:text-indigo-400" size={20} />
                  Split View Record Comparison
                </h3>

                <div className="grid grid-cols-2 gap-6 divide-x divide-slate-100 dark:divide-white/5">
                  {}
                  <div className="pr-3 space-y-4">
                    <div className="bg-indigo-600/5 p-4 rounded-2xl border border-indigo-500/10">
                      <div className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1">Entity Reference A</div>
                      <h4 className="dark:text-white text-slate-800 text-lg font-bold truncate">{maskName(c1.name)}</h4>
                      <p className="text-slate-500 text-xs truncate">{maskEmail(c1.email)}</p>
                    </div>

                    <div className="space-y-3 pl-2">
                      <CompareRow label="Status Value" val={c1.status} highlight={c1.status !== c2.status} color={c1.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-300'} textClass={compareRowColor} />
                      <CompareRow label="Arr Revenue rate" val={maskAmount(c1.amount)} highlight={c1.amount !== c2.amount} textClass={compareRowColor} />
                      <CompareRow label="System Log Date" val={c1.date} highlight={c1.date !== c2.date} textClass={compareRowColor} />
                      
                      {}
                      <CompareRow label="AI Churn Threat Risk" val={c1.amount > 50000 ? "Low Churn Risk (2.4%)" : "Medium Risk (14.2%)"} color={c1.amount > 50000 ? 'text-emerald-650 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} highlight textClass={compareRowColor} />
                      <CompareRow label="Index Health Score" val={c1.status === 'Cancelled' ? '0/100' : c1.amount > 80000 ? '98/100' : '82/100'} highlight textClass={compareRowColor} />
                    </div>
                  </div>

                  {}
                  <div className="pl-6 space-y-4">
                    <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                      <div className="text-[10px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider mb-1">Entity Reference B</div>
                      <h4 className="dark:text-white text-slate-800 text-lg font-bold truncate">{maskName(c2.name)}</h4>
                      <p className="text-slate-500 text-xs truncate">{maskEmail(c2.email)}</p>
                    </div>

                    <div className="space-y-3 pl-2">
                      <CompareRow label="Status Value" val={c2.status} highlight={c1.status !== c2.status} color={c2.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-300'} textClass={compareRowColor} />
                      <CompareRow label="Arr Revenue rate" val={maskAmount(c2.amount)} highlight={c1.amount !== c2.amount} textClass={compareRowColor} />
                      <CompareRow label="System Log Date" val={c2.date} highlight={c1.date !== c2.date} textClass={compareRowColor} />
                      
                      {}
                      <CompareRow label="AI Churn Threat Risk" val={c2.amount > 50000 ? "Low Churn Risk (2.4%)" : "Medium Risk (14.2%)"} color={c2.amount > 50000 ? 'text-emerald-650 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} highlight textClass={compareRowColor} />
                      <CompareRow label="Index Health Score" val={c2.status === 'Cancelled' ? '0/100' : c2.amount > 80000 ? '98/100' : '82/100'} highlight textClass={compareRowColor} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
                  <button 
                    onClick={() => setIsSplitViewOpen(false)}
                    className="px-6 py-2.5 dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-bold hover:text-slate-800 dark:hover:text-white rounded-xl"
                  >
                    Close Comparison
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};

const CompareRow = ({ label, val, highlight, color = '', textClass = 'text-white' }) => (
  <div className={`py-2 px-3 rounded-lg flex justify-between items-center text-xs ${highlight ? 'dark:bg-white/2 bg-slate-50 border border-slate-200 dark:border-white/5' : ''}`}>
    <span className="text-slate-500 font-medium">{label}</span>
    <span className={`font-semibold ${color || textClass}`}>{val}</span>
  </div>
);