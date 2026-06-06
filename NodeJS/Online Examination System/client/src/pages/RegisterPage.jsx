import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, Zap } from "lucide-react";
import { useAuthStore } from "../state/authStore";
import { Toast } from "../components/Toast";
import { InteractiveBackground } from "../components/InteractiveBackground";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, isLoading } = useAuthStore();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(document.body.classList.contains("light-theme"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.body.classList.contains("light-theme"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }

    try {
      await signup(name, email, password);
      setToast({ message: "Account created successfully!", type: "success" });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setToast({ message: err.message || "Registration failed", type: "error" });
    }
  };


  return (
    <div className={`relative min-h-screen flex items-center justify-center p-6 overflow-hidden`}>
      <InteractiveBackground type="student" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">Create <span className="text-indigo-500">Account</span></h1>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Join SchoolzPro Institution</p>
        </div>

        <div className="rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-5 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Aayush"
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-5 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@school.edu"
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-5 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-5 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>




            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-2xl bg-indigo-600 py-5 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  PROCESSING...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
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
