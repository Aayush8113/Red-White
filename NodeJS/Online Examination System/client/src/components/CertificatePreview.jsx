import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, Download, Share2 } from "lucide-react";

export function CertificatePreview({ studentName, score, total, examTitle, date }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto w-full max-w-4xl p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500 rounded-3xl"
    >
      <div className="relative bg-[#030303] rounded-[22px] overflow-hidden p-12 lg:p-20 text-center border border-white/10">
        
        <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/5 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/5 blur-[80px] rounded-full" />
        
        <div className="relative z-10 border-4 border-double border-white/10 p-10 h-full flex flex-col items-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 shadow-2xl">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-sm font-bold uppercase tracking-[0.5em] text-indigo-400 mb-4">
            Certificate of Completion
          </h1>
          
          <p className="text-slate-400 text-sm italic mb-10">This is to certify that</p>
          
          <h2 className="text-4xl font-black text-white mb-6 font-serif">
            {studentName || "Aayush"}
          </h2>
          
          <p className="max-w-md text-slate-300 leading-relaxed mb-10">
            has successfully completed the <span className="text-white font-bold">{examTitle || "Advanced System Architecture"}</span> examination with an outstanding accuracy of <span className="text-indigo-400 font-black">{Math.round((score/total)*100)}%</span>.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between w-full mt-10 gap-8">
            <div className="text-center">
              <p className="text-lg font-bold text-white mb-1">{date || "May 07, 2026"}</p>
              <div className="h-px w-32 bg-white/10 mx-auto mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date Issued</p>
            </div>

            <div className="flex flex-col items-center">
              <ShieldCheck className="h-12 w-12 text-emerald-400 mb-2 opacity-50" />
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                Verification ID: {Math.random().toString(36).substring(7).toUpperCase()}
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=verified-omniexam" 
                  alt="QR Code"
                  className="mx-auto rounded border border-white/20 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer"
                />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Scan to Verify</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button className="btn-secondary px-6">
          <Download className="h-4 w-4" />
          Download PDF
        </button>
        <button className="btn-primary px-6">
          <Share2 className="h-4 w-4" />
          Share to LinkedIn
        </button>
      </div>
    </motion.div>
  );
}
