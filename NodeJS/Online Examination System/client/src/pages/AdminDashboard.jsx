import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";

import { AdminLiveMonitor } from "./AdminLiveMonitor.jsx";

function AdminStatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="text-2xl font-black text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const stats = [
    { icon: Users, label: "Total Students", value: "1,284", color: "bg-indigo-600" },
    { icon: FileText, label: "Exams Conducted", value: "842", color: "bg-blue-600" },
    { icon: CheckCircle2, label: "Passed Rate", value: "76%", color: "bg-emerald-600" },
    { icon: AlertTriangle, label: "Integrity Alerts", value: "24", color: "bg-rose-600" },
  ];

  const recentAttempts = [
    { student: "Aayush", exam: "Data Structures", score: "22/25", status: "Passed", time: "2 mins ago" },
    { student: "John Doe", exam: "React Essentials", score: "12/15", status: "Passed", time: "15 mins ago" },
    { student: "Sarah Smith", exam: "Advanced JS", score: "8/25", status: "Failed", time: "1 hour ago" },
    { student: "Mike Ross", exam: "System Design", score: "18/20", status: "Passed", time: "3 hours ago" },
  ];

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">System <span className="text-indigo-500">Overview</span></h1>
          <p className="mt-2 text-slate-400">Monitor overall system performance and student integrity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Search className="h-4 w-4" />
            Search
          </button>
          <button className="btn-primary">
            Export Report
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <AdminStatCard {...stat} />
          </motion.div>
        ))}
      </section>

      {/* Live Monitor Section */}
      <section>
        <AdminLiveMonitor />
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Recent Attempts Table */}
        <section className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Recent Exam Activity
            </h2>
            <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">View all</button>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A]">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Exam</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentAttempts.map((attempt, i) => (
                  <tr key={i} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 font-bold text-white">{attempt.student}</td>
                    <td className="px-6 py-4 text-slate-400">{attempt.exam}</td>
                    <td className="px-6 py-4 font-mono text-indigo-400">{attempt.score}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                        attempt.status === "Passed" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{attempt.time}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-white">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Integrity Feed */}
        <section>
          <h2 className="mb-6 text-xl font-bold text-white">Integrity Alerts</h2>
          <div className="space-y-4">
            {[
              { student: "James W.", violation: "Multiple Tab Switches", severity: "High" },
              { student: "Emily R.", violation: "Camera Disconnected", severity: "Medium" },
              { student: "Chris B.", violation: "Focus Loss", severity: "Low" },
            ].map((alert, i) => (
              <div key={i} className={`rounded-2xl border p-4 bg-white/5 transition-all hover:translate-x-1 ${
                alert.severity === "High" ? "border-rose-500/20" : 
                alert.severity === "Medium" ? "border-amber-500/20" : "border-white/5"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{alert.student}</span>
                  <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                    alert.severity === "High" ? "bg-rose-500 text-white" : 
                    alert.severity === "Medium" ? "bg-amber-500 text-black" : "bg-white/10 text-slate-400"
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{alert.violation}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
