import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Zap, CheckCircle, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../state/authStore";
import { Toast } from "../components/Toast";
import { InteractiveBackground } from "../components/InteractiveBackground";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const { resetPassword, isLoading } = useAuthStore();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }
    if (password.length < 6) {
      setToast({ message: "Password must be at least 6 characters", type: "error" });
      return;
    }
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setToast({ message: err.message || "Failed to reset password", type: "error" });
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
            Set New Password
          </p>
        </div>

        
        <div className="rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {!token ? (
              <motion.div
                key="invalid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-3 uppercase tracking-widest">
                  Invalid Link
                </h2>
                <p className="text-[12px] text-slate-400 leading-relaxed mb-6">
                  This reset link is missing a token. Please request a new password reset.
                </p>
                <Link to="/forgot-password" className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-300">
                  Request New Link
                </Link>
              </motion.div>
            ) : !done ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-xl font-black text-white mb-2 uppercase tracking-widest">
                  New Password
                </h2>
                <p className="text-[12px] text-slate-500 mb-8 leading-relaxed">
                  Choose a strong password. It must be at least 6 characters.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">
                      New Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 pr-14 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-5 text-slate-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
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
                        RESETTING...
                      </>
                    ) : (
                      "Reset Password"
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
                  Password Reset!
                </h2>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Your password has been changed successfully. Redirecting you to login...
                </p>
                <div className="mt-4 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
