import { motion } from "framer-motion";
import { Trophy, Medal, Target, Zap, TrendingUp, Search, Crown, Activity } from "lucide-react";

export function LeaderboardPage() {
  const topThree = [
    { name: "SARAH_SMITH", score: "2,940", accuracy: "98%", rank: 2, avatar: "SS" },
    { name: "AAYUSH_SYS", score: "3,120", accuracy: "100%", rank: 1, avatar: "AA" },
    { name: "JOHN_DOE_X", score: "2,810", accuracy: "94%", rank: 3, avatar: "JD" },
  ];

  const others = [
    { rank: 4, name: "EMILY_ROSS", score: "2,740", accuracy: "92%", trend: "up" },
    { rank: 5, name: "MIKE_JOHNSON", score: "2,650", accuracy: "89%", trend: "down" },
    { rank: 6, name: "CHRIS_EVANS", score: "2,590", accuracy: "88%", trend: "up" },
    { rank: 7, name: "TONY_STARK", score: "2,550", accuracy: "87%", trend: "same" },
    { rank: 8, name: "BRUCE_BANNER", score: "2,480", accuracy: "85%", trend: "down" },
  ];

  return (
    <div className="space-y-16">
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-3">
             <div className="h-1 w-8 bg-indigo-500" />
             GLOBAL_RANKING_SYNC
          </div>
          <h1 className="text-4xl font-black text-white lg:text-5xl uppercase tracking-tighter">
            Elite <span className="text-indigo-500">Board</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-slate-500">Top entities across the Schoolzpro network. Updated in real-time based on assessment accuracy.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-4 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="QUERY_ENTITY..." 
                className="rounded-2xl border border-white/5 bg-white/[0.02] py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500/30 transition-all w-64"
              />
           </div>
        </div>
      </section>

      {/* God Mode Podium */}
      <section className="flex flex-col md:flex-row items-end justify-center gap-4 lg:gap-12 pt-20 pb-10">
        {/* Rank 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center group"
        >
          <div className="relative mb-6 h-24 w-24 rounded-[32px] border-2 border-slate-500/20 p-1 bg-white/[0.02] backdrop-blur-xl group-hover:border-slate-400/50 transition-all">
             <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-slate-500/10 text-xl font-black text-slate-400">{topThree[0].avatar}</div>
             <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-500 text-xs font-black text-slate-900 shadow-xl border-4 border-[#010101]">2</div>
          </div>
          <p className="text-xs font-black text-white tracking-widest uppercase mb-1">{topThree[0].name}</p>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{topThree[0].score}_PTS</p>
          <div className="mt-8 h-40 w-32 rounded-t-[40px] bg-gradient-to-b from-white/5 to-transparent border-t border-white/10" />
        </motion.div>

        {/* Rank 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center group relative"
        >
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
             <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
             >
               <Crown className="h-12 w-12 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
             </motion.div>
          </div>
          
          <div className="relative mb-8 h-32 w-32 rounded-[40px] border-2 border-amber-500/30 p-1 bg-amber-500/[0.02] backdrop-blur-xl group-hover:border-amber-400/60 transition-all shadow-[0_0_50px_rgba(251,191,36,0.1)]">
             <div className="flex h-full w-full items-center justify-center rounded-[36px] bg-amber-500/10 text-2xl font-black text-amber-400">{topThree[1].avatar}</div>
             <div className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-sm font-black text-amber-900 shadow-2xl border-4 border-[#010101]">1</div>
          </div>
          <p className="text-sm font-black text-white tracking-widest uppercase mb-1">{topThree[1].name}</p>
          <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">{topThree[1].score}_PTS</p>
          <div className="mt-8 h-64 w-44 rounded-t-[60px] bg-gradient-to-b from-indigo-500/10 to-transparent border-t border-indigo-500/20" />
        </motion.div>

        {/* Rank 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center group"
        >
          <div className="relative mb-6 h-24 w-24 rounded-[32px] border-2 border-amber-700/20 p-1 bg-white/[0.02] backdrop-blur-xl group-hover:border-amber-700/50 transition-all">
             <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-amber-700/10 text-xl font-black text-amber-600">{topThree[2].avatar}</div>
             <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-700 text-xs font-black text-amber-100 shadow-xl border-4 border-[#010101]">3</div>
          </div>
          <p className="text-xs font-black text-white tracking-widest uppercase mb-1">{topThree[2].name}</p>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{topThree[2].score}_PTS</p>
          <div className="mt-8 h-24 w-32 rounded-t-[40px] bg-gradient-to-b from-white/5 to-transparent border-t border-white/10" />
        </motion.div>
      </section>

      {/* God Mode Data Table */}
      <section className="overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.01] backdrop-blur-md">
        <table className="w-full text-left text-[10px] uppercase font-black tracking-widest">
          <thead className="bg-white/[0.03] text-slate-500 border-b border-white/5">
            <tr>
              <th className="px-10 py-6">Identity_Rank</th>
              <th className="px-10 py-6">Entity_Name</th>
              <th className="px-10 py-6 text-center">Score_Data</th>
              <th className="px-10 py-6 text-center">Accuracy_Rating</th>
              <th className="px-10 py-6 text-right">Status_Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {others.map((item, i) => (
              <tr key={i} className="transition-all hover:bg-white/[0.03] group">
                <td className="px-10 py-6 text-slate-600 group-hover:text-indigo-400">#0{item.rank}</td>
                <td className="px-10 py-6 text-white">{item.name}</td>
                <td className="px-10 py-6 text-center font-mono text-indigo-400">{item.score}</td>
                <td className="px-10 py-6 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-1 w-16 rounded-full bg-white/5 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: item.accuracy }}
                         className="h-full bg-indigo-500" 
                       />
                    </div>
                    <span className="text-[8px] font-mono text-slate-500">{item.accuracy}</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Activity className={`h-3 w-3 ${
                      item.trend === "up" ? "text-emerald-400" : item.trend === "down" ? "text-rose-400" : "text-slate-600"
                    }`} />
                    <span className={`text-[8px] ${
                      item.trend === "up" ? "text-emerald-400" : item.trend === "down" ? "text-rose-400" : "text-slate-600"
                    }`}>{item.trend.toUpperCase()}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
