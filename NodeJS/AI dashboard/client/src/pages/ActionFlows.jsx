import { useState } from 'react';
import { 
  Play, ShieldCheck, Settings, AlertCircle, ToggleLeft, 
  MessageSquare, Mail, Terminal, Plus, Trash2, ArrowRight 
} from 'lucide-react';
import { useStore } from '../store/uiStore';
import { toast } from 'sonner';

export const ActionFlows = () => {
  const { actionFlows, toggleFlowActive, runFlowManual, createFlow } = useStore();
  const [activeSimulationId, setActiveSimulationId] = useState(null);
  const [simulationStep, setSimulationStep] = useState(0); // 0: idle, 1: trigger, 2: condition, 3: action

  // Form State
  const [flowName, setFlowName] = useState('');
  const [flowTrigger, setFlowTrigger] = useState('ON_CLIENT_CREATED');
  const [flowCondition, setFlowCondition] = useState('amount > 50000');
  const [flowAction, setFlowAction] = useState('Slack Webhook Notification');

  const handleSimulate = (flowId) => {
    setActiveSimulationId(flowId);
    setSimulationStep(1); // Trigger

    // Visual sequence animation steps
    setTimeout(() => {
      setSimulationStep(2); // Condition check
      setTimeout(() => {
        setSimulationStep(3); // Dispatch action
        setTimeout(() => {
          runFlowManual(flowId);
          setActiveSimulationId(null);
          setSimulationStep(0);
          toast.success("Simulation finished! Check console logs below.");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const getActionIcon = (action) => {
    if (action.includes('Slack') || action.includes('Webhook')) return <MessageSquare className="text-sky-500 dark:text-sky-400" size={14} />;
    if (action.includes('Email') || action.includes('Alert')) return <Mail className="text-amber-500 dark:text-amber-400" size={14} />;
    return <Settings className="text-indigo-550 dark:text-indigo-400" size={14} />;
  };

  const handleCreateFlow = async (e) => {
    e.preventDefault();
    if (!flowName.trim()) {
      toast.error("Please enter a pipeline name.");
      return;
    }
    await createFlow({
      name: flowName,
      trigger: flowTrigger,
      condition: flowCondition,
      action: flowAction
    });
    setFlowName('');
    toast.success(`Pipeline '${flowName}' created and deployed!`);
  };

  const loadPreset = async (preset) => {
    await createFlow(preset);
    toast.success(`Preset '${preset.name}' loaded & deployed!`);
  };

  const presets = [
    { name: "High-Revenue Slack Alert", trigger: "ON_CLIENT_CREATED", condition: "amount > 100000", action: "Slack Alert Dispatcher" },
    { name: "Security Data Blur", trigger: "ON_CLIENT_MODIFIED", condition: "status === 'Cancelled'", action: "PII Masking Engine" },
    { name: "Low Deal Email Archive", trigger: "ON_CLIENT_CREATED", condition: "amount < 5000", action: "System Email Archive Dispatcher" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Introduction Banner */}
      <div className="dark:bg-slate-900/40 bg-white p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Action Flows Builder</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Construct visual workflows. Active filters trigger actions on database operations.</p>
        </div>
        <span className="text-xs bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-xl border border-indigo-600/20 font-bold uppercase tracking-wider">
          Node Engine Running
        </span>
      </div>

      {/* Preset workflow templates */}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-md">
        <span className="text-[10px] text-slate-500 font-bold block mb-3 uppercase tracking-wider">PRE-CONFIGURED WORKFLOW TEMPLATES (1-CLICK LOAD):</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="p-4 text-left border rounded-2xl dark:bg-slate-950 bg-slate-50 border-slate-200 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors">{preset.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">
                Trigger: <span className="font-semibold text-slate-655 dark:text-slate-400">{preset.trigger}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Constraint: <span className="font-mono text-indigo-500 dark:text-indigo-400">{preset.condition}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* New Flow Form Creator */}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-md">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-1.5 border-b border-slate-100 dark:border-white/5 pb-3">
          <Plus size={16} className="text-indigo-500" /> Create Custom Flow Pipeline
        </h3>
        <form onSubmit={handleCreateFlow} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Pipeline Name</label>
            <input
              type="text"
              placeholder="e.g. VIP Slack Alert..."
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="dark:bg-slate-950 bg-slate-50 border border-slate-250 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Database Trigger</label>
            <select
              value={flowTrigger}
              onChange={(e) => setFlowTrigger(e.target.value)}
              className="dark:bg-slate-950 bg-slate-50 border border-slate-250 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="ON_CLIENT_CREATED">ON_CLIENT_CREATED</option>
              <option value="ON_CLIENT_MODIFIED">ON_CLIENT_MODIFIED</option>
              <option value="ON_CLIENT_DELETED">ON_CLIENT_DELETED</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Condition constraint</label>
            <input
              type="text"
              placeholder="e.g. amount > 50000..."
              value={flowCondition}
              onChange={(e) => setFlowCondition(e.target.value)}
              className="dark:bg-slate-950 bg-slate-50 border border-slate-250 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-855 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Action Dispatcher</label>
            <select
              value={flowAction}
              onChange={(e) => setFlowAction(e.target.value)}
              className="dark:bg-slate-950 bg-slate-50 border border-slate-250 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-855 dark:text-white focus:outline-none"
            >
              <option value="Slack Webhook Notification">Slack Webhook Notification</option>
              <option value="System Email Alert Dispatcher">System Email Alert Dispatcher</option>
              <option value="PII Masking Engine">PII Masking Engine</option>
              <option value="Black Box Audit Logger">Black Box Audit Logger</option>
            </select>
          </div>

          <div className="md:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-600 rounded-xl text-white text-xs font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus size={14} /> Deploy Flow Pipeline
            </button>
          </div>
        </form>
      </div>

      {/* Visual Canvas Nodes list */}
      <div className="space-y-6">
        {actionFlows.map((flow) => {
          const isSimulating = activeSimulationId === flow.id;
          return (
            <div 
              key={flow.id} 
              className={`dark:bg-slate-900/50 bg-white border rounded-3xl p-6 transition-all duration-300 relative overflow-hidden shadow-sm ${
                isSimulating 
                  ? 'border-indigo-500 shadow-lg shadow-indigo-950/20' 
                  : 'border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/10'
              }`}
            >
              {/* Background simulator glow */}
              {isSimulating && (
                <div className="absolute inset-0 bg-indigo-500/2 pointer-events-none animate-pulse" />
              )}

              {/* Title row controls */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-white/5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${flow.active ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">{flow.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Toggle active state */}
                  <button
                    onClick={() => {
                      toggleFlowActive(flow.id);
                      toast.info(`Flow '${flow.name}' ${!flow.active ? 'Activated' : 'Suspended'}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                      flow.active 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'dark:bg-slate-950 bg-slate-100 text-slate-500 border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {flow.active ? "ACTIVE / WATCHING" : "SUSPENDED"}
                  </button>

                  {/* Manual Run */}
                  <button
                    onClick={() => handleSimulate(flow.id)}
                    disabled={isSimulating}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 text-white text-[10px] font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                  >
                    <Play size={10} fill="white" /> Simulate Pipeline
                  </button>
                </div>
              </div>

              {/* VISUAL FLOW CANVAS NODES CHIPS */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center relative z-10">
                
                {/* Node 1: Trigger */}
                <div className={`p-4 dark:bg-slate-950 bg-slate-50 rounded-2xl border text-center relative transition-all duration-300 ${
                  isSimulating && simulationStep === 1 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-950/20' 
                    : 'border-slate-200 dark:border-white/5'
                }`}>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block uppercase tracking-widest mb-1.5">1. Trigger</span>
                  <div className="text-xs font-bold text-slate-700 dark:text-white">{flow.trigger}</div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center text-slate-400 dark:text-slate-600">
                  <ArrowRight size={18} className={isSimulating && simulationStep === 1 ? 'animate-pulse text-indigo-500' : ''} />
                </div>

                {/* Node 2: Filter */}
                <div className={`p-4 dark:bg-slate-950 bg-slate-50 rounded-2xl border text-center relative transition-all duration-300 ${
                  isSimulating && simulationStep === 2 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-950/20' 
                    : 'border-slate-200 dark:border-white/5'
                }`}>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block uppercase tracking-widest mb-1.5">2. Constraint</span>
                  <div className="text-xs font-bold text-slate-700 dark:text-white">{flow.condition}</div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center text-slate-400 dark:text-slate-600">
                  <ArrowRight size={18} className={isSimulating && simulationStep === 2 ? 'animate-pulse text-indigo-500' : ''} />
                </div>

                {/* Node 3: Action */}
                <div className={`p-4 dark:bg-slate-950 bg-slate-50 rounded-2xl border text-center relative transition-all duration-300 ${
                  isSimulating && simulationStep === 3 
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-950/20' 
                    : 'border-slate-200 dark:border-white/5'
                }`}>
                  <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block uppercase tracking-widest mb-1.5">3. Dispatcher</span>
                  <div className="text-xs font-bold text-slate-700 dark:text-white flex items-center justify-center gap-1.5">
                    {getActionIcon(flow.action)}
                    {flow.action}
                  </div>
                </div>
              </div>

              {/* Local console log records */}
              <div className="mt-6">
                <div className="text-[10px] text-slate-500 font-bold mb-2 flex items-center gap-1.5">
                  <Terminal size={12} /> execution_history.log
                </div>
                <div className="dark:bg-slate-950 bg-slate-50 p-3.5 rounded-2xl max-h-36 overflow-y-auto custom-scrollbar font-mono text-[10px] text-indigo-700 dark:text-indigo-300 space-y-1.5 border border-slate-250 dark:border-white/2">
                  {flow.logs && flow.logs.length > 0 ? (
                    flow.logs.map((log, lIdx) => (
                      <div key={lIdx} className="leading-relaxed border-l-2 border-indigo-500/50 pl-2">{log}</div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic">No execution logs cataloged. Simulate or trigger a database write.</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
