import { motion } from "framer-motion";
import { Eye, ShieldCheck, AlertCircle, Clock, MapPin } from "lucide-react";

function MonitorCard({ student, exam, duration, violations, location }) {
  return (
    <div className="card relative overflow-hidden">
      
      <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold text-emerald-400 border border-emerald-500/20">
        <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
        LIVE
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400 font-bold">
          {student.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{student}</h4>
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5" />
            {location}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Active Exam</span>
          <span className="text-white font-medium">{exam}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Duration</span>
          <span className="text-white font-medium">{duration}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Integrity Status</span>
          <span className={`font-bold ${violations > 0 ? "text-amber-400" : "text-emerald-400"}`}>
            {violations > 0 ? `${violations} Alerts` : "Clear"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="flex-1 btn-secondary !py-1.5 !text-[10px]">
          View Feed
        </button>
        <button className="btn-primary !py-1.5 !px-3">
          <AlertCircle className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function AdminLiveMonitor() {
  const activeSessions = [
    { student: "Aayush", exam: "Advanced JS", duration: "18:42", violations: 0, location: "Delhi, IN" },
    { student: "John Doe", exam: "System Design", duration: "05:12", violations: 2, location: "New York, US" },
    { student: "Sarah Smith", exam: "React Core", duration: "42:10", violations: 0, location: "London, UK" },
    { student: "Mike Ross", exam: "Data Structures", duration: "12:55", violations: 0, location: "Toronto, CA" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Session <span className="text-indigo-500">Monitor</span></h2>
          <p className="text-sm text-slate-400 mt-1">Real-time proctoring overview of all active examinations.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-3 border border-white/5">
          <div className="text-center border-r border-white/10 pr-4">
            <p className="text-lg font-black text-white">124</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Active</p>
          </div>
          <div className="text-center pl-4">
            <p className="text-lg font-black text-rose-500">3</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Flagged</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activeSessions.map((session, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <MonitorCard {...session} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
