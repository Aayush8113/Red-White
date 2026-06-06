import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Users, 
  FilePlus, 
  ChevronRight, 
  CheckCircle2,
  AlertCircle,
  Bell,
  ShieldCheck,
  Search,
  X,
  Plus
} from "lucide-react";
import { useAuthStore } from "../state/authStore";
import { Toast } from "../components/Toast";

export function ExamCreator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("3600");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const batchRes = await fetch("http://localhost:5000/api/users/batches", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const studentRes = await fetch("http://localhost:5000/api/users/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const batches = await batchRes.json();
      const students = await studentRes.json();
      
      setAvailableBatches(batches.items || []);
      setAvailableStudents(students.items || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!title || !startDate || !startTime) {
      setToast({ message: "Please fill in all required fields", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const startAt = new Date(`${startDate}T${startTime}`);
      const res = await fetch("http://localhost:5000/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          startAt,
          durationSeconds: parseInt(duration),
          targetBatches: selectedBatches,
          targetStudents: selectedStudents.map(s => s._id),
          isPublished: true // Auto-publish for now
        })
      });

      if (res.ok) {
        setIsScheduled(true);
      } else {
        throw new Error("Failed to schedule exam");
      }
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBatch = (batch) => {
    setSelectedBatches(prev => 
      prev.includes(batch) ? prev.filter(b => b !== batch) : [...prev, batch]
    );
  };

  const toggleStudent = (student) => {
    setSelectedStudents(prev => 
      prev.find(s => s._id === student._id) 
        ? prev.filter(s => s._id !== student._id) 
        : [...prev, student]
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <section>
        <h1 className="text-3xl font-black text-white uppercase tracking-widest">Command <span className="text-indigo-500">Center</span></h1>
        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Deployment & Intelligence Assessment Setup</p>
      </section>

      {!isScheduled ? (
        <form onSubmit={handleSchedule} className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Assessment Mission Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced Quantum Mechanics Finals"
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-5 h-5 w-5 text-slate-500" />
                    <input 
                      type="date" 
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50" 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Launch Time</label>
                  <div className="relative">
                    <Clock className="absolute left-5 top-5 h-5 w-5 text-slate-500" />
                    <input 
                      type="time" 
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Target Deployment (Batches)</label>
                <div className="flex flex-wrap gap-3">
                  {availableBatches.map(batch => (
                    <button
                      key={batch}
                      type="button"
                      onClick={() => toggleBatch(batch)}
                      className={`rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedBatches.includes(batch)
                          ? "border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                          : "border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/10 hover:text-white"
                      }`}
                    >
                      {batch}
                    </button>
                  ))}
                  {availableBatches.length === 0 && <p className="text-[10px] text-slate-600 uppercase">No active batches detected</p>}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Target Individuals (Optional)</label>
                <div className="relative">
                  <Search className="absolute left-5 top-5 h-5 w-5 text-slate-500" />
                  <div className="flex flex-wrap gap-2 w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 min-h-[64px]">
                    {selectedStudents.map(student => (
                      <span key={student._id} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1 text-[10px] font-black text-white">
                        {student.name}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleStudent(student)} />
                      </span>
                    ))}
                    {selectedStudents.length === 0 && <span className="text-slate-600 text-sm italic">Search students...</span>}
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2 mt-4 custom-scrollbar">
                   {availableStudents.filter(s => !selectedStudents.find(ss => ss._id === s._id)).map(student => (
                     <button
                       key={student._id}
                       type="button"
                       onClick={() => toggleStudent(student)}
                       className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-4 hover:bg-white/[0.03] transition-all"
                     >
                       <span className="text-xs font-bold text-white">{student.name}</span>
                       <span className="text-[10px] text-slate-500 uppercase">{student.batch}</span>
                     </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6">
              <button type="button" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Abort Mission</button>
              <button 
                type="submit"
                disabled={isLoading}
                className="rounded-2xl bg-indigo-600 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                {isLoading ? "INITIATING..." : "CONFIRM DEPLOYMENT"}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-8">
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Security Protocols
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Neural Net Anti-Cheat", active: true },
                  { label: "Biometric Verification", active: true },
                  { label: "Hardware Lock", active: false },
                  { label: "AI Proctored", active: true },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{rule.label}</span>
                    <div className={`h-4 w-8 rounded-full p-1 transition-all ${rule.active ? "bg-indigo-600" : "bg-white/10"}`}>
                      <div className={`h-2 w-2 rounded-full bg-white transition-all ${rule.active ? "translate-x-4" : ""}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 p-8">
              <div className="flex items-center gap-4 text-indigo-400 mb-4">
                <Bell className="h-5 w-5" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Transmission Status</h4>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
                Upon confirmation, encrypted mission dossiers will be transmitted to {selectedStudents.length + (selectedBatches.length * 40)} target entities.
              </p>
            </div>
          </div>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[60px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl text-center py-32"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-white mb-10">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-widest">Deployment <span className="text-emerald-500">Confirmed</span></h2>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 max-w-md mx-auto">
            All target students have been notified via secure channels.
          </p>
          <div className="mt-16 flex items-center justify-center gap-6">
            <button onClick={() => setIsScheduled(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Create Another</button>
            <button className="rounded-2xl bg-white/5 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">Go to Terminal</button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
