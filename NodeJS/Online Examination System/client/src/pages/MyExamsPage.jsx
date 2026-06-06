import { motion } from "framer-motion";
import { GraduationCap, Clock, BarChart3, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function ExamRecord({ title, date, score, total, status, type }) {
  const isCompleted = status === "Completed";
  
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 transition-all hover:border-indigo-500/50">
      <div className="flex items-center justify-between mb-6">
        <div className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
          isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
        }`}>
          {status}
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase">{type}</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-500 mb-6 flex items-center gap-2">
        <Clock className="h-3 w-3" />
        {date}
      </p>

      {isCompleted ? (
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Score</p>
            <p className="text-lg font-black text-white">{score}<span className="text-slate-600 text-sm">/{total}</span></p>
          </div>
          <Link to="/results" className="btn-secondary !py-2 !text-[10px]">View Analysis</Link>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div className="flex items-center gap-4">
             <div className="text-center">
                <p className="text-[8px] font-bold text-slate-600 uppercase">Ques</p>
                <p className="text-xs font-bold text-white">26</p>
             </div>
             <div className="text-center">
                <p className="text-[8px] font-bold text-slate-600 uppercase">Mins</p>
                <p className="text-xs font-bold text-white">45</p>
             </div>
          </div>
          <Link to="/exam/demo" className="btn-primary !py-2 !text-[10px]">
            <Play className="h-3 w-3 fill-current" />
            Start Now
          </Link>
        </div>
      )}
    </div>
  );
}

export function MyExamsPage() {
  const activeExams = [
    { title: "Term 1: Data Structures", date: "Available until May 10", status: "Upcoming", type: "Main Exam" },
    { title: "React Essentials Quiz", date: "Daily Practice", status: "Available", type: "Practice" },
  ];

  const pastExams = [
    { title: "Intro to Algorithms", date: "Apr 28, 2026", score: "22", total: "25", status: "Completed", type: "Quiz" },
    { title: "Modern JavaScript", date: "Apr 20, 2026", score: "18", total: "20", status: "Completed", type: "Final" },
    { title: "Database Systems", date: "Apr 15, 2026", score: "14", total: "15", status: "Completed", type: "Mid-Term" },
  ];

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold text-white lg:text-4xl">My <span className="text-indigo-500">Assessments</span></h1>
        <p className="mt-2 text-slate-400">Track your upcoming, active, and completed examinations.</p>
      </section>

      <div className="space-y-12">
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Active & Upcoming
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeExams.map((exam, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <ExamRecord {...exam} />
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Completed History
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastExams.map((exam, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <ExamRecord {...exam} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
