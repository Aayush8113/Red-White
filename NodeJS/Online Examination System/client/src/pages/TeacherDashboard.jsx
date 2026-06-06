import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BookOpen, Clock, TrendingUp, Search, Filter, MoreVertical, Plus } from "lucide-react";
import { useState } from "react";

export function TeacherDashboard() {
  const [activeBatch, setActiveBatch] = useState("Batch-A");

  const batches = [
    { id: "Batch-A", name: "Grade 12 - Quantum Computing", students: 42, progress: 85 },
    { id: "Batch-B", name: "Grade 11 - Cyber Security", students: 38, progress: 62 },
    { id: "Batch-C", name: "Grade 12 - AI & Ethics", students: 45, progress: 92 },
  ];

  const students = [
    { id: 1, name: "Aayush Kumar", score: 98, status: "Excellent", avatar: "AK" },
    { id: 2, name: "Sarah Jenkins", score: 85, status: "Good", avatar: "SJ" },
    { id: 3, name: "Michael Chen", score: 72, status: "Improving", avatar: "MC" },
    { id: 4, name: "Emma Wilson", score: 92, status: "Excellent", avatar: "EW" },
  ];

  return (
    <div className="space-y-10 pb-20">
      
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">Teacher <span className="text-indigo-500">Terminal</span></h1>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Managing Student Batches & Intelligence</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all">
             <Plus className="h-4 w-4" />
             New Batch
           </button>
           <Link to="/create-exam" className="rounded-2xl bg-indigo-600 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:bg-indigo-500 transition-all">
             Schedule Exam
           </Link>

        </div>
      </div>

      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: "125", icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { label: "Active Batches", value: "03", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Avg. Score", value: "88%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Scheduled", value: "05", icon: Clock, color: "text-rose-500", bg: "bg-rose-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[32px] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-3xl"
          >
            <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
            <h3 className="mt-2 text-3xl font-black text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        
        <div className="lg:col-span-1 space-y-6">
           <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 pl-2">Active Batches</h2>
           <div className="space-y-4">
             {batches.map((batch) => (
               <button
                 key={batch.id}
                 onClick={() => setActiveBatch(batch.id)}
                 className={`group relative w-full overflow-hidden rounded-[32px] border p-6 text-left transition-all ${
                   activeBatch === batch.id 
                     ? "border-indigo-500/50 bg-indigo-500/5 shadow-[0_20px_40px_rgba(99,102,241,0.1)]" 
                     : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                 }`}
               >
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">{batch.name}</span>
                    <span className="text-[10px] font-bold text-slate-500">{batch.students} Students</span>
                 </div>
                 <div className="h-1.5 w-full rounded-full bg-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${batch.progress}%` }}
                     className="h-full rounded-full bg-indigo-500"
                   />
                 </div>
                 {activeBatch === batch.id && (
                   <div className="absolute right-0 top-0 h-full w-1 bg-indigo-500" />
                 )}
               </button>
             ))}
           </div>
        </div>

        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Student Roster - {activeBatch}</h2>
             <div className="flex items-center gap-4">
                <Search className="h-4 w-4 text-slate-500 cursor-pointer hover:text-white" />
                <Filter className="h-4 w-4 text-slate-500 cursor-pointer hover:text-white" />
             </div>
          </div>

          <div className="rounded-[40px] border border-white/5 bg-white/[0.01] backdrop-blur-3xl p-8">
             <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="group flex items-center justify-between rounded-3xl border border-transparent p-4 transition-all hover:border-white/5 hover:bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                       <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 text-sm font-black uppercase tracking-tighter">
                         {student.avatar}
                       </div>
                       <div>
                         <h4 className="text-xs font-black text-white uppercase tracking-widest">{student.name}</h4>
                         <p className="text-[8px] font-bold text-slate-600 uppercase mt-1 tracking-[0.2em]">ID: STU-2026-{student.id}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-10">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-indigo-500">{student.score}%</p>
                          <p className="text-[8px] font-bold text-slate-600 uppercase mt-1 tracking-widest">{student.status}</p>
                       </div>
                       <button className="rounded-xl p-2 text-slate-600 hover:bg-white/5 hover:text-white transition-all">
                         <MoreVertical className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
             <button className="mt-8 w-full rounded-2xl border border-white/5 bg-white/[0.02] py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all">
               View All Intelligence Reports
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
