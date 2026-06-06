import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  AlertCircle,
  Flag,
  CheckCircle2,
  Menu,
  X
} from "lucide-react";
import gsap from "gsap";

import { useExamIntegrity } from "../hooks/useExamIntegrity";
import { useExamStore } from "../state/examStore";
import { CodeEditorQuestion } from "../components/CodeEditorQuestion.jsx";
import { LiveProctoring } from "../components/LiveProctoring.jsx";
import { useLockdown } from "../hooks/useLockdown";

function formatMs(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function TestTakingPage() {
  const { examId } = useParams();
  const nav = useNavigate();
  const ref = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { bootstrapDemo, questions, activeIndex, setActiveIndex, setAnswer, answers, grade } = useExamStore();
  const [now, setNow] = useState(() => Date.now());

  useLockdown({
    onViolation: (msg) => {
      console.warn("LOCKDOWN VIOLATION:", msg);
      
    }
  });

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useLayoutEffect(() => {
    if (examId === "demo" && questions.length === 0) bootstrapDemo();
  }, [examId, questions.length, bootstrapDemo]);

  const q = questions[activeIndex];
  const timerMsLeft = useMemo(() => {
    const { endsAtMs } = useExamStore.getState();
    if (!endsAtMs) return null;
    return endsAtMs - now;
  }, [now]);

  const isTimeCritical = timerMsLeft != null && timerMsLeft < 5 * 60 * 1000;

  useExamIntegrity({
    attemptId: null,
    onAutoSubmit: () => {
      const r = grade();
      nav(`/results/demo-attempt?score=${r.total}&max=${r.max}`, { replace: true });
    },
  });

  if (!q) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-slate-300">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
          <p className="text-sm font-medium">Initializing exam environment...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const r = grade();
    nav(`/results/demo-attempt?score=${r.total}&max=${r.max}`);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#030303] text-slate-100">
      
      <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#080808] px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsNavOpen(true)}
            className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-sm font-bold tracking-tight text-white lg:text-base">
            Exam: <span className="text-indigo-400 font-medium">Data Structures Demo</span>
          </h1>
        </div>

        <div className={`flex items-center gap-3 rounded-full px-4 py-1.5 border ${
          isTimeCritical ? "border-rose-500/50 bg-rose-500/10 text-rose-400" : "border-white/10 bg-white/5 text-slate-300"
        }`}>
          <Clock className={`h-4 w-4 ${isTimeCritical ? "animate-pulse" : ""}`} />
          <span className="text-sm font-black font-mono">
            {timerMsLeft != null ? formatMs(timerMsLeft) : "--:--"}
          </span>
        </div>

        <button 
          onClick={handleSubmit}
          className="btn-primary !py-1.5 !px-4 !text-xs !rounded-lg"
        >
          Finish Exam
          <Send className="h-3 w-3" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        <aside className="hidden w-80 flex-col border-r border-white/5 bg-[#080808] lg:flex">
          <div className="p-4 border-b border-white/5">
            <LiveProctoring />
          </div>
          <div className="p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, idx) => {
                const active = idx === activeIndex;
                const answered = answers[questions[idx].id] != null;
                return (
                  <button
                    key={questions[idx].id}
                    onClick={() => setActiveIndex(idx)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      active 
                        ? "bg-indigo-600 text-white ring-2 ring-indigo-500/50" 
                        : answered 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" 
                          : "bg-white/5 text-slate-500 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto border-t border-white/5 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="h-3 w-3 rounded bg-emerald-500/20 border border-emerald-500/20" />
              Answered
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="h-3 w-3 rounded bg-white/5 border border-white/5" />
              Not Visited
            </div>
          </div>
        </aside>

        
        <main className="relative flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-black text-indigo-400">
                      {activeIndex + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      {q.type} • {q.weightage} Point{q.weightage > 1 ? "s" : ""}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-amber-400 transition-colors">
                    <Flag className="h-4 w-4" />
                    Flag
                  </button>
                </div>

                <h2 className="text-xl font-bold leading-relaxed text-white lg:text-2xl">
                  {q.prompt}
                </h2>

                <div className="space-y-4">
                  {q.type === "mcq" && q.options.map((opt, idx) => (
                    <label 
                      key={opt}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all ${
                        Number(answers[q.id]) === idx
                          ? "border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/10"
                          : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name={`q-${q.id}`}
                        className="h-5 w-5 border-white/10 bg-transparent text-indigo-600 focus:ring-indigo-500"
                        checked={Number(answers[q.id]) === idx}
                        onChange={() => setAnswer(q.id, idx)}
                      />
                      <span className="text-base font-medium">{opt}</span>
                      {Number(answers[q.id]) === idx && (
                        <CheckCircle2 className="ml-auto h-5 w-5 text-indigo-400" />
                      )}
                    </label>
                  ))}

                  {q.type === "boolean" && (
                    <div className="flex gap-4">
                      {[true, false].map((v) => (
                        <button
                          key={String(v)}
                          onClick={() => setAnswer(q.id, v)}
                          className={`flex-1 rounded-2xl border p-6 text-lg font-bold transition-all ${
                            answers[q.id] === v
                              ? "border-indigo-500 bg-indigo-500/10 text-white"
                              : "border-white/5 bg-white/5 text-slate-500 hover:bg-white/10"
                          }`}
                        >
                          {v ? "True" : "False"}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === "short" && (
                    <div className="relative">
                      <textarea
                        value={answers[q.id] ?? ""}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                        placeholder="Type your answer here..."
                        rows={4}
                        className="w-full rounded-2xl border border-white/5 bg-white/5 p-6 text-lg text-white outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                  )}

                  {q.type === "code" && (
                    <CodeEditorQuestion 
                      question={q} 
                      value={answers[q.id]} 
                      onChange={(val) => setAnswer(q.id, val)} 
                    />
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      
      <footer className="flex h-20 items-center justify-between border-t border-white/5 bg-[#080808] px-6 lg:px-12">
        <button
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex(activeIndex - 1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>

        <div className="hidden lg:flex items-center gap-4">
          <div className="h-2 w-64 rounded-full bg-white/5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((activeIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-indigo-500"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            {activeIndex + 1} of {questions.length} Questions
          </span>
        </div>

        <button
          onClick={() => {
            if (activeIndex < questions.length - 1) {
              setActiveIndex(activeIndex + 1);
            } else {
              handleSubmit();
            }
          }}
          className="flex items-center gap-2 text-sm font-bold text-indigo-400 transition-colors hover:text-indigo-300"
        >
          {activeIndex < questions.length - 1 ? "Next Question" : "Submit Exam"}
          <ChevronRight className="h-5 w-5" />
        </button>
      </footer>

      
      <AnimatePresence>
        {isNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNavOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#080808] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Question Palette</h3>
                <button onClick={() => setIsNavOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveIndex(idx);
                      setIsNavOpen(false);
                    }}
                    className={`h-12 rounded-xl text-sm font-bold ${
                      activeIndex === idx ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
