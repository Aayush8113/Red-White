import { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Database, AlertCircle, Sparkles } from 'lucide-react';
import { useStore } from '../store/uiStore';
import { toast } from 'sonner';

export const DataForge = () => {
  const { importClients, environment, productionClients, sandboxClients } = useStore();
  const clients = environment === 'production' ? productionClients : sandboxClients;

  const [inputData, setInputData] = useState('');
  const [detectedHeaders, setDetectedHeaders] = useState([]);
  const [mapping, setMapping] = useState({ name: '', email: '', status: '', amount: '' });
  const [parsedData, setParsedData] = useState([]);

  const templates = {
    enterprise: [
      { "client_name": "Initech Systems Ltd", "e_mail": "peter@initech.com", "revenue_val": 95000, "state_code": "Active" },
      { "client_name": "Massive Dynamic Corp", "e_mail": "nina@massivedynamic.com", "revenue_val": 125000, "state_code": "Pending" },
      { "client_name": "Hooli Operations", "e_mail": "gavin@hooli.com", "revenue_val": 80000, "state_code": "Cancelled" }
    ],
    saas: [
      { "name": "Vandelay Industries", "email": "art@vandelay.com", "amount": 45000, "status": "Active" },
      { "name": "Soyuz Media", "email": "contact@soyuz.ru", "amount": 12000, "status": "Pending" }
    ],
    trials: [
      { "FullName": "Wayne Enterprises", "MailBox": "bruce@wayne.tech", "AnnualRate": 250000, "Status": "Active" },
      { "FullName": "LexCorp Labs", "MailBox": "lex@lexcorp.com", "AnnualRate": 190000, "Status": "Cancelled" }
    ]
  };

  const loadTemplate = (key) => {
    setInputData(JSON.stringify(templates[key], null, 2));
    toast.success(`Raw ${key} JSON template loaded! Click 'Analyze Structure' next.`);
  };

  
  const handleAnalyze = () => {
    try {
      const data = JSON.parse(inputData);
      if (!Array.isArray(data)) {
        toast.error("Format error: Input must be a JSON array of objects.");
        return;
      }
      if (data.length === 0) {
        toast.error("Format error: The JSON array is empty.");
        return;
      }

      
      const keys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
      setDetectedHeaders(keys);
      setParsedData(data);

      
      const initialMap = { name: '', email: '', status: '', amount: '' };
      keys.forEach((h) => {
        const lower = h.toLowerCase();
        if (lower.includes('name')) initialMap.name = h;
        if (lower.includes('mail') || lower.includes('email')) initialMap.email = h;
        if (lower.includes('status') || lower.includes('state') || lower.includes('code')) initialMap.status = h;
        if (lower.includes('revenue') || lower.includes('amount') || lower.includes('val')) initialMap.amount = h;
      });
      setMapping(initialMap);
      toast.success(`Structure analyzed: ${keys.length} data fields detected.`);
    } catch (e) {
      toast.error("Parse Error: Invalid JSON structure.");
    }
  };

  
  const handleImport = () => {
    if (!mapping.name || !mapping.email) {
      toast.error("Mapping Required: Name and Email keys must be mapped.");
      return;
    }

    const importedRecords = parsedData.map((obj) => {
      const amountVal = obj[mapping.amount];
      const parsedAmount = typeof amountVal === 'number' 
        ? amountVal 
        : parseFloat(amountVal) || 0;

      return {
        name: obj[mapping.name] || 'Anonymous Client',
        email: obj[mapping.email] || 'no-email@aetherforge.ai',
        status: obj[mapping.status] || 'Pending',
        amount: parsedAmount,
        date: new Date().toISOString().split('T')[0]
      };
    });

    importClients(importedRecords);
    toast.success(`Successfully imported ${importedRecords.length} records to MongoDB.`);
    setDetectedHeaders([]);
    setParsedData([]);
    setInputData('');
  };

  
  const handleExportData = (format) => {
    let outputContent = "";
    let fileExtension = format;
    const dateStamp = new Date().toISOString().split('T')[0];
    const fileName = `aetherforge_export_${environment}_${dateStamp}.${fileExtension}`;

    if (format === 'json') {
      outputContent = JSON.stringify(clients, null, 2);
    } else {
      
      const headers = ["ID", "Name", "Email", "Status", "Revenue Rate", "Date Logged"];
      const rows = clients.map(c => [
        c._id || c.id,
        c.name,
        c.email,
        c.status,
        c.amount,
        c.date
      ]);
      outputContent = [
        headers.join(','),
        ...rows.map(r => r.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))
      ].join('\n');
    }

    const blob = new Blob([outputContent], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(`Database exported as ${format.toUpperCase()}!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
      
      {}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[650px] shadow-2xl overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          <div className="flex flex-col border-b border-slate-200 dark:border-white/5 pb-4 gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-805 dark:text-white font-bold text-base flex items-center gap-1.5">
                  <Upload className="text-indigo-500 dark:text-indigo-400" size={18} />
                  Data Forge: Paste Portal
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Paste raw JSON data arrays to import.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] text-slate-500 font-bold block w-full uppercase">LOAD TEMPLATE JSON:</span>
              <button 
                onClick={() => loadTemplate('enterprise')}
                className="text-[10px] dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 px-3 py-1.5 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
              >
                Enterprise SaaS
              </button>
              <button 
                onClick={() => loadTemplate('saas')}
                className="text-[10px] dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 px-3 py-1.5 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
              >
                SaaS Accounts
              </button>
              <button 
                onClick={() => loadTemplate('trials')}
                className="text-[10px] dark:bg-slate-950 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 px-3 py-1.5 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
              >
                Trial Leads
              </button>
            </div>
          </div>

          <div>
            <textarea
              className="w-full h-44 dark:bg-slate-950 bg-slate-100 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-xs font-mono text-indigo-600 dark:text-indigo-400 focus:outline-none focus:border-indigo-500 resize-none custom-scrollbar"
              placeholder="Paste JSON array here..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
            <button 
              onClick={handleAnalyze}
              className="mt-3 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md active:scale-98 transition-all"
            >
              Analyze Structure & Parse Columns
            </button>
          </div>

          {}
          {detectedHeaders.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Field Mapping Matrix</h4>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">TARGET CLIENT NAME</span>
                  <select
                    value={mapping.name}
                    onChange={(e) => setMapping({...mapping, name: e.target.value})}
                    className="w-full dark:bg-slate-955 bg-slate-100 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="">-- Choose Header --</option>
                    {detectedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">TARGET EMAIL ADDRESS</span>
                  <select
                    value={mapping.email}
                    onChange={(e) => setMapping({...mapping, email: e.target.value})}
                    className="w-full dark:bg-slate-955 bg-slate-100 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="">-- Choose Header --</option>
                    {detectedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">TARGET REVENUE</span>
                  <select
                    value={mapping.amount}
                    onChange={(e) => setMapping({...mapping, amount: e.target.value})}
                    className="w-full dark:bg-slate-955 bg-slate-100 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="">-- Choose Header --</option>
                    {detectedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">TARGET STATUS</span>
                  <select
                    value={mapping.status}
                    onChange={(e) => setMapping({...mapping, status: e.target.value})}
                    className="w-full dark:bg-slate-955 bg-slate-100 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="">-- Choose Header --</option>
                    {detectedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-2 justify-end">
                <button
                  onClick={handleImport}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-98"
                >
                  Confirm Mapping & Import Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {}
      <div className="dark:bg-slate-900/50 bg-white border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[650px] shadow-2xl">
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-white/5 pb-4">
            <h3 className="text-slate-800 dark:text-white font-bold text-base flex items-center gap-1.5">
              <Download className="text-indigo-500 dark:text-indigo-400" size={18} />
              Data Forge: Export Matrix
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Extract active MERN database collections instantly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {}
            <div className="dark:bg-slate-950/40 bg-slate-50 border border-slate-200 dark:border-white/5 p-5 rounded-2xl text-center flex flex-col justify-between h-48 hover:border-indigo-500/20 transition-colors shadow-sm">
              <div className="flex flex-col items-center">
                <FileSpreadsheet className="text-indigo-500 dark:text-indigo-400 mb-2" size={24} />
                <h4 className="text-slate-800 dark:text-white font-bold text-xs">CSV Spreadsheet File</h4>
                <p className="text-slate-500 text-[10px] mt-1.5">Best for imports into Excel or Google Sheets.</p>
              </div>
              <button
                onClick={() => handleExportData('csv')}
                className="py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-bold shadow-lg"
              >
                Download CSV Sheet
              </button>
            </div>

            {}
            <div className="dark:bg-slate-950/40 bg-slate-50 border border-slate-200 dark:border-white/5 p-5 rounded-2xl text-center flex flex-col justify-between h-48 hover:border-indigo-500/20 transition-colors shadow-sm">
              <div className="flex flex-col items-center">
                <Database className="text-indigo-500 dark:text-indigo-400 mb-2" size={24} />
                <h4 className="text-slate-800 dark:text-white font-bold text-xs">JSON Schema file</h4>
                <p className="text-slate-500 text-[10px] mt-1.5">Best for developers and database migrations.</p>
              </div>
              <button
                onClick={() => handleExportData('json')}
                className="py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-[10px] font-bold shadow-lg"
              >
                Download JSON Data
              </button>
            </div>
          </div>

          <div className="dark:bg-slate-950/30 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:border-white/5 flex gap-3.5 items-start text-xs text-slate-500 dark:text-slate-400 shadow-sm">
            <AlertCircle className="text-indigo-500 dark:text-indigo-400 shrink-0" size={16} />
            <p className="leading-relaxed">
              Export matrix aggregates both Production and Sandbox collections depending on your currently selected Safe Stage setting in the sidebar. Currently exporting <strong className="text-slate-800 dark:text-white uppercase">{useStore().environment}</strong> files.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider font-bold mx-auto pb-2">
          <Sparkles size={12} className="text-indigo-500" />
          AetherForge Data Sync Certified
        </div>
      </div>

    </div>
  );
};
