import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ChevronRight, Github, Zap, Shield, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../state/authStore";
import { Toast } from "../components/Toast";
import { InteractiveBackground } from "../components/InteractiveBackground";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const [toast, setToast] = useState(null);
  const nav = useNavigate();
  const [isLight, setIsLight] = useState(document.body.classList.contains("light-theme"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.body.classList.contains("light-theme"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setToast({ message: "Welcome back!", type: "success" });
      const role = data.user.role.toLowerCase();
      setTimeout(() => {
        if (role === "admin") nav("/admin");
        else if (role === "teacher") nav("/teacher");
        else nav("/");
      }, 1500);

    } catch (err) {
      setToast({ message: err.message || "Invalid credentials", type: "error" });
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
        {/* Branding HUD */}
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
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Secure Access Portal</p>
        </div>

        {/* Login Form */}
        <div className="rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Email Address</label>
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

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
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

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-2xl bg-indigo-600 py-5 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    LOGGING IN...
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-3"
                  >
                    Login Now
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>


        </div>

        {/* Support Footer */}
        <p className="mt-10 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Forgot password?{" "}
          <Link to="/forgot-password" className="text-indigo-500 hover:text-indigo-400 transition-colors hover:underline">
            Reset it here
          </Link>
        </p>

        <p className="mt-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Need help?{" "}
          <a
            href="mailto:admin@schoolzpro.com"
            className="text-indigo-500 hover:text-indigo-400 transition-colors hover:underline"
          >
            Contact Administrator
          </a>
        </p>

        <p className="mt-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>

      {/* Decorative HUD Details */}
      <div className="fixed top-10 right-10 text-indigo-500/20 text-[8px] font-mono pointer-events-none text-right uppercase">
        <p>Protocol: SSL_ENCRYPTED</p>
        <p>Location: 127.0.0.1</p>
        <p>Session: {Date.now()}</p>
      </div>
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
