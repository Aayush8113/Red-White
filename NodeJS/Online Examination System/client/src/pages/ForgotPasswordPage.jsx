import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronLeft, Zap, CheckCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "../state/authStore";
import { Toast } from "../components/Toast";
import { InteractiveBackground } from "../components/InteractiveBackground";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { forgotPassword, isLoading } = useAuthStore();
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setToast({ message: err.message || "Failed to send reset email", type: "error" });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <InteractiveBackground type="student" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 shadow-[0_0_40px_rgba(99,102,241,0.3)] mb-6"
          >
            <Zap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-[0.2em] uppercase">
            SCHOOLZ<span className="text-indigo-500">PRO</span>
          </h1>
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Password Recovery
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-black text-white mb-2 uppercase tracking-widest">
                  Forgot Password?
                </h2>
                <p className="text-[12px] text-slate-500 mb-8 leading-relaxed">
                  Enter your registered email and we'll send you a secure link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@school.edu"
                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-2xl bg-indigo-600 py-5 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-500 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-3 uppercase tracking-widest">
                  Check Your Inbox
                </h2>
                <p className="text-[12px] text-slate-400 leading-relaxed mb-6">
                  If <span className="text-indigo-400 font-bold">{email}</span> is registered, 
                  you'll receive a password reset link shortly. Check your spam folder if it doesn't arrive.
                </p>
                <button
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Try a different email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2">
            <ChevronLeft className="h-3 w-3" />
            Back to Login
          </Link>
        </p>
      </motion.div>

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
