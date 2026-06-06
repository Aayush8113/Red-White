import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { useEffect } from "react";

export function Toast({ message, type = "info", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400" />,
    info: <Info className="h-5 w-5 text-indigo-400" />,
  };

  const backgrounds = {
    success: "bg-emerald-500/10 border-emerald-500/20",
    error: "bg-rose-500/10 border-rose-500/20",
    info: "bg-indigo-500/10 border-indigo-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${backgrounds[type]}`}
    >
      <div className="flex items-center gap-4 min-w-[300px]">
        {icons[type]}
        <p className="text-sm font-bold text-white uppercase tracking-widest">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-auto p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
      >
        <X className="h-4 w-4" />
      </button>
      
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-0.5 rounded-full ${
          type === "success" ? "bg-emerald-500" : type === "error" ? "bg-rose-500" : "bg-indigo-500"
        }`}
      />
    </motion.div>
  );
}
