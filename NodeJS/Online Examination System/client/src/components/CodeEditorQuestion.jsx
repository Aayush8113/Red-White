import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Copy, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function CodeEditorQuestion({ question, value, onChange }) {
  const [language, setLanguage] = useState("javascript");
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setIsOutputVisible(true);
    setOutput("Running tests...\n\nTest Case 1: Passed\nTest Case 2: Passed\nTest Case 3: Failed (Expected 42, got undefined)");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-xl bg-[#1e1e1e] px-4 py-2 border border-white/5">
        <div className="flex items-center gap-4">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-400 outline-none hover:text-white transition-colors"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Auto-save active</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onChange("")}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-rose-400 transition-all"
            title="Reset code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button 
            onClick={handleRun}
            className="flex items-center gap-2 rounded-lg bg-indigo-600/10 px-3 py-1.5 text-xs font-bold text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Run Tests
          </button>
        </div>
      </div>

      <div className="h-[400px] overflow-hidden rounded-2xl border border-white/5 bg-[#1e1e1e] shadow-2xl">
        <Editor
          height="100%"
          defaultLanguage={language}
          theme="vs-dark"
          value={value || question.initialCode || "
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 20 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {isOutputVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-6"
        >
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            Output Console
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </h4>
          <pre className="font-mono text-xs leading-relaxed text-slate-300">
            {output}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
