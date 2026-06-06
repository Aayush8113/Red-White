import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { 
  Trophy, 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart3,
  TrendingUp
} from "lucide-react";

import { RadarChartCanvas } from "../components/RadarChartCanvas.jsx";
import { useExamStore } from "../state/examStore";
import { CertificatePreview } from "../components/CertificatePreview.jsx";

export function ResultsPage() {
  const ref = useRef(null);
  const [sp] = useSearchParams();
  const scoreQ = Number(sp.get("score"));
  const maxQ = Number(sp.get("max"));

  const { grade } = useExamStore();
  const computed = useMemo(() => grade(), [grade]);
  const total = Number.isFinite(scoreQ) ? scoreQ : computed.total;
  const max = Number.isFinite(maxQ) ? maxQ : computed.max;

  const [shown, setShown] = useState(0);
  const percentage = max ? Math.round((total / max) * 100) : 0;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(
        { v: 0 },
        {
          v: total,
          duration: 1.5,
          ease: "power3.out",
          onUpdate() {
            setShown(Math.round(this.targets()[0].v));
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [total]);

  const getPerformanceMessage = (p) => {
    if (p >= 90) return { title: "Outstanding!", color: "text-emerald-400" };
    if (p >= 75) return { title: "Great Job!", color: "text-indigo-400" };
    if (p >= 50) return { title: "Passed", color: "text-amber-400" };
    return { title: "Keep Improving", color: "text-rose-400" };
  };

  const performance = getPerformanceMessage(percentage);

  return (
    <div ref={ref} className="mx-auto max-w-5xl space-y-10 pb-10">
      
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Exam Results</h1>
            <p className="mt-1 text-slate-400">Detailed breakdown of your performance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary px-4">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="btn-primary px-4">
            <Download className="h-4 w-4" />
            Certificate
          </button>
        </div>
      </section>

      
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 rounded-3xl border border-white/5 bg-[#0A0A0A] p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400">
            <Trophy className="h-10 w-10" />
          </div>
          <h2 className={`text-2xl font-bold ${performance.color}`}>{performance.title}</h2>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-6xl font-black text-white">{shown}</span>
            <span className="text-xl font-bold text-slate-500">/{max}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-400">Total Points Earned</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
            <div>
              <p className="text-2xl font-bold text-white">{percentage}%</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12:45</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Time Taken</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#0A0A0A] p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              Competency Radar
            </h3>
            <span className="text-xs text-slate-500 italic">Across all categories</span>
          </div>
          <div className="h-[240px] flex items-center justify-center">
            <RadarChartCanvas values={computed.categories} max={max || 10} />
          </div>
        </motion.div>
      </div>

      
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-white">Subject Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(computed.categories).map(([cat, score], i) => (
            <motion.div 
              key={cat}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="card !p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-white">{cat}</span>
                <span className="text-xs font-medium text-slate-500">{score} pts</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / (max / Object.keys(computed.categories).length)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full rounded-full bg-indigo-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="rounded-3xl border border-white/5 bg-white/5 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Integrity Verification</h3>
            <p className="text-sm text-slate-400">Our AI proctoring system analyzed your session behavior.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-lg font-bold">Excellent</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Focus Level</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-lg font-bold text-white">0</span>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Violations</p>
            </div>
          </div>
        </div>
      </section>

      
      {percentage >= 50 && (
        <section className="space-y-6 pt-10 border-t border-white/5">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">Your Official Certification</h3>
            <p className="mt-1 text-slate-400">Share your achievement with the world</p>
          </div>
          <CertificatePreview 
            score={total} 
            total={max} 
            examTitle="Data Structures & Algorithms Demo"
          />
        </section>
      )}
    </div>
  );
}
