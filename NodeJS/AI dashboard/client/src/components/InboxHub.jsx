import { X, Check, Trash2, AlertCircle, ShieldAlert, Cpu, Database } from 'lucide-react';
import { useStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';

export const InboxHub = () => {
  const { isInboxOpen, toggleInbox, inboxAlerts, markAllAlertsAsRead, dismissAlert } = useStore();
  const navigate = useNavigate();

  if (!isInboxOpen) return null;

  const getIcon = (category) => {
    switch (category) {
      case 'Security': return <ShieldAlert className="text-rose-400" size={16} />;
      case 'Telemetry': return <Cpu className="text-amber-400" size={16} />;
      case 'Import': return <Database className="text-emerald-400" size={16} />;
      default: return <AlertCircle className="text-indigo-400" size={16} />;
    }
  };

  const handleAction = (category) => {
    toggleInbox();
    if (category === 'Security') navigate('/security');
    else if (category === 'Telemetry') navigate('/');
    else if (category === 'Import') navigate('/data-forge');
    else if (category === 'Automation') navigate('/automation');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={toggleInbox} />
      <div className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-slate-900 border-l border-white/10 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-800/40">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span>Inbox Hub</span>
              {inboxAlerts.filter(a => !a.read).length > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {inboxAlerts.filter(a => !a.read).length} New
                </span>
              )}
            </h3>
            <p className="text-slate-400 text-xs">System alerts, updates, and pending actions.</p>
          </div>
          <button onClick={toggleInbox} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="p-3 border-b border-white/5 flex justify-between items-center bg-slate-950/20 text-xs text-slate-400">
          <button 
            onClick={markAllAlertsAsRead} 
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Check size={14} /> Mark all read
          </button>
          <span>{inboxAlerts.length} Messages</span>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {inboxAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
              <AlertCircle size={32} className="mb-2 text-slate-600" />
              <p className="text-sm font-medium">Inbox is empty</p>
              <p className="text-xs">No pending tasks or system issues.</p>
            </div>
          ) : (
            inboxAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3.5 rounded-xl border transition-all duration-150 flex gap-3 relative group ${
                  alert.read 
                    ? 'bg-slate-800/20 border-white/5' 
                    : 'bg-slate-800/60 border-indigo-500/20 shadow-md shadow-indigo-950/20'
                }`}
              >
                {/* Icon Column */}
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                  {getIcon(alert.category)}
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{alert.category}</span>
                    <span className="text-[10px] text-slate-500">{alert.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-0.5 truncate">{alert.title}</h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">{alert.description}</p>
                  
                  {/* Action Link */}
                  <button 
                    onClick={() => handleAction(alert.category)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold mt-2 underline"
                  >
                    Resolve Issue
                  </button>
                </div>

                {/* Dismiss Button */}
                <button 
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  title="Dismiss Alert"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
