import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Play, 
  Clock, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Calendar,
  AlertCircle,
  Zap,
  Shield,
  Activity
} from "lucide-react";
import { useAuthStore } from "../state/authStore";

function HUDStat({ icon: Icon, label, value, color }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm group hover:bg-white/[0.04] transition-all">
      <div className={`absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full ${color} opacity-[0.03] blur-3xl`} />
      <div className="flex items-center gap-4">
        <div className={`rounded-xl bg-white/5 p-3 ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
          <p className="text-2xl font-black text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PremiumExamCard({ title, duration, questions, difficulty, category, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01] p-8 transition-all hover:border-indigo-500/30 hover:bg-white/[0.03]"
    >
      <div className="absolute top-0 left-0 h-1 w-0 bg-indigo-500 transition-all group-hover:w-full" />
      
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
          {category}
        </span>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Activity className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold">Live Exam</span>
        </div>
      </div>

      <h3 className="mt-6 text-xl font-black text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>

      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
        <div className="text-center">
          <p className="text-[8px] font-black text-slate-600 uppercase">Duration</p>
          <p className="text-xs font-bold text-white">{duration}m</p>
        </div>
        <div className="text-center border-x border-white/5">
          <p className="text-[8px] font-black text-slate-600 uppercase">Items</p>
          <p className="text-xs font-bold text-white">{questions}</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] font-black text-slate-600 uppercase">Level</p>
          <p className={`text-xs font-bold ${difficulty === 'Hard' ? 'text-rose-400' : 'text-emerald-400'}`}>{difficulty}</p>
        </div>
      </div>

      <Link 
        to="/exam/demo" 
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 py-4 text-sm font-black text-white transition-all hover:bg-indigo-600 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
      >
        Start Assessment
        <Zap className="h-4 w-4 fill-current" />
      </Link>
    </motion.div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  
  const stats = [
    { icon: Zap, label: "Overall Rating", value: "924", color: "text-indigo-400" },
    { icon: Activity, label: "Attendance", value: "98.2%", color: "text-emerald-400" },
    { icon: Shield, label: "Trust Score", value: "100", color: "text-blue-400" },
  ];

  const exams = [
    { title: "Advanced Neural Networks & AI Architecture", duration: 60, questions: 40, difficulty: "Hard", category: "AI_ML" },
    { title: "Quantum Computing Principles (Core)", duration: 45, questions: 30, difficulty: "Hard", category: "PHYSICS" },
  ];

  return (
    <div className="space-y-12">
      {/* Dynamic Header HUD */}
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-3">
             <div className="h-1 w-8 bg-indigo-500" />
             Upcoming Assessment
          </div>
          <h1 className="text-4xl font-black text-white lg:text-5xl">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-400">{user?.name || "STUDENT"}!</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">
            System status optimal. Your upcoming assessment in <strong>Quantum Computing</strong> is ready for initiation.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Rank</p>
              <p className="text-2xl font-black text-white">#04<span className="text-xs text-indigo-500">/1284</span></p>
           </div>
        </div>
      </section>

      {/* High-End Stats Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <HUDStat key={i} {...stat} />
        ))}
      </section>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main Feed */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight">Available Exams</h2>
            <Link to="/exams" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300">View All Exams</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {exams.map((exam, i) => (
              <PremiumExamCard key={i} {...exam} delay={0.2 + i * 0.1} />
            ))}
          </div>
        </section>

        {/* Technical Sidebar */}
        <section className="space-y-8">
           <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">Recent Activity</h3>
              <div className="space-y-6">
                {[
                  { time: "09:40", msg: "Term 1 results verified", type: "success" },
                  { time: "Yesterday", msg: "Integrity check passed", type: "info" },
                  { time: "2 days ago", msg: "Batch B exam scheduled", type: "info" },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 border-l border-white/5 pl-4">
                    <span className="text-[10px] font-mono text-slate-600">{log.time}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{log.msg}</p>
                  </div>
                ))}
              </div>
           </div>

           <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-2xl" />
              <div className="flex items-center gap-3 text-indigo-400 mb-4">
                <Shield className="h-5 w-5" />
                <h4 className="text-xs font-black uppercase tracking-widest">Exam Proctoring</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tighter">
                Please ensure your internet connection is stable. ID verification is required for all assessments.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
}
