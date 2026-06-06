import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldAlert, Eye, Maximize2, Smartphone, Mic, UserPlus } from "lucide-react";

export function LiveProctoring() {
  const [dots, setDots] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [faceVerified, setFaceVerified] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDots = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        x: 40 + Math.random() * 20,
        y: 30 + Math.random() * 40,
      }));
      setDots(newDots);
    }, 200);

    const faceTimer = setTimeout(() => setFaceVerified(true), 3000);

    const alertInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const types = [
          { icon: Smartphone, text: "Electronic Device Detected", color: "text-rose-400" },
          { icon: UserPlus, text: "Extra Person Detected", color: "text-rose-400" },
          { icon: Mic, text: "Background Voice Detected", color: "text-amber-400" },
        ];
        const alert = types[Math.floor(Math.random() * types.length)];
        setAlerts(prev => [alert, ...prev].slice(0, 3));
        setTimeout(() => setAlerts(prev => prev.filter(a => a !== alert)), 4000);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(alertInterval);
      clearTimeout(faceTimer);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080808] shadow-2xl">
      <div className="flex items-center justify-between bg-white/5 px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI PROCTOR ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[8px] font-bold text-slate-600">60 FPS</span>
           <Maximize2 className="h-3 w-3 text-slate-500 hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>

      <div className="relative aspect-video bg-black/40 p-4" ref={containerRef}>
        {!faceVerified && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
             <div className="h-12 w-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Verifying Identity...</p>
          </div>
        )}

        <svg className="absolute inset-0 h-full w-full pointer-events-none z-10">
          {dots.map((dot) => (
            <motion.circle
              key={dot.id}
              cx={`${dot.x}%`}
              cy={`${dot.y}%`}
              r="2"
              fill={alerts.length > 0 ? "#f43f5e" : "#6366f1"}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
            />
          ))}
        </svg>

        <div className="flex h-full w-full items-center justify-center opacity-20">
          <User className="h-24 w-24 text-white" />
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-20">
          <AnimatePresence>
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 rounded-lg bg-black/80 border border-rose-500/20 px-2 py-1 shadow-2xl"
              >
                <alert.icon className={`h-3 w-3 ${alert.color}`} />
                <span className={`text-[8px] font-black uppercase tracking-tighter ${alert.color}`}>{alert.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-20">
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[8px] font-bold text-white border border-white/5">
            <ShieldAlert className={`h-2.5 w-2.5 ${faceVerified ? "text-emerald-400" : "text-slate-500"}`} />
            {faceVerified ? "Identity Verified" : "Identity Unknown"}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[8px] font-bold text-white border border-white/5">
            <Eye className="h-2.5 w-2.5 text-indigo-400" />
            Gaze: Centered
          </div>
        </div>

        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent z-10"
        />
      </div>
    </div>
  );
}
