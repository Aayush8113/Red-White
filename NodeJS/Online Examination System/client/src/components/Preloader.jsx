import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Cpu, Globe, Zap, Check, GraduationCap } from "lucide-react";

function SecurityCheck({ label, active, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 py-2"
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10">
         {active ? (
           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
             <Check className="h-3 w-3 text-indigo-400" />
           </motion.div>
         ) : (
           <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/20 animate-pulse" />
         )}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-slate-300" : "text-slate-500"}`}>
        {label}
      </span>
    </motion.div>
  );
}

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 1500);
          return 100;
        }
        return prev + (Math.random() > 0.8 ? 7 : 2);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#010101] overflow-hidden"
        >
          
          <div className="absolute inset-0">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#312e81_0%,transparent_70%)] opacity-20" />
          </div>

          <div className="relative z-20 flex flex-col items-center w-full max-w-sm px-8">
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-16"
            >
              <div className="relative mx-auto mb-10 h-24 w-24">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-indigo-500/20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-indigo-600 shadow-[0_0_60px_rgba(99,102,241,0.4)]">
                     <GraduationCap className="h-8 w-8 text-white" />
                   </div>
                </div>
              </div>
              <h1 className="text-4xl font-black text-white tracking-[0.2em]">
                SCHOOLZ<span className="text-indigo-500">PRO</span>
              </h1>
              <p className="mt-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                Excellence in Assessment
              </p>
            </motion.div>

            
            <div className="w-full mb-16 space-y-1">
               <SecurityCheck label="Securing Data Connection" active={progress > 20} delay={0.2} />
               <SecurityCheck label="Verifying Digital Identity" active={progress > 50} delay={0.3} />
               <SecurityCheck label="Initializing AI Monitor" active={progress > 80} delay={0.4} />
               <SecurityCheck label="Optimizing Assessment Environment" active={progress > 95} delay={0.5} />
            </div>

            
            <div className="w-full">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">
                    {progress < 100 ? "System Readiness Check" : "Verification Complete"}
                  </span>
                  <span className="text-[9px] font-mono text-white/40">{progress}%</span>
               </div>
               <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   className="h-full rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                 />
               </div>
            </div>
          </div>

          
          <div className="absolute bottom-12 text-center">
            <p className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.5em]">
              Trusted by 500+ International Institutions
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
