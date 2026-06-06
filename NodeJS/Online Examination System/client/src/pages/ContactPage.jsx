import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, MessageSquare, Tag, ChevronLeft, Zap, CheckCircle, Loader2, Send } from "lucide-react";
import { useAuthStore } from "../state/authStore";
import { Toast } from "../components/Toast";
import { InteractiveBackground } from "../components/InteractiveBackground";

export function ContactPage() {
  const { contactAdmin, isLoading, user } = useAuthStore();
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setToast({ message: "Please fill in all fields", type: "error" });
      return;
    }
    try {
      await contactAdmin(form);
      setSent(true);
    } catch (err) {
      setToast({ message: err.message || "Failed to send message", type: "error" });
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600";

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <InteractiveBackground type="student" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
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
            Contact Administrator
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
                exit={{ opacity: 0, y: -10 }}
              >
                <h2 className="text-xl font-black text-white mb-2 uppercase tracking-widest">
                  Send a Message
                </h2>
                <p className="text-[12px] text-slate-500 mb-8 leading-relaxed">
                  Have a problem or question? Fill in the form below and the administrator will receive your message directly by email.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Your Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Full name"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Your Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="your@email.com"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Subject</label>
                    <div className="relative group">
                      <Tag className="absolute left-5 top-5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="text"
                        value={form.subject}
                        onChange={set("subject")}
                        placeholder="What is this about?"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-4">Message</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-5 top-5 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <textarea
                        value={form.message}
                        onChange={set("message")}
                        placeholder="Describe your issue or question in detail..."
                        rows={5}
                        className="w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all resize-none placeholder:text-slate-600"
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
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-6"
                >
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </motion.div>
                <h2 className="text-xl font-black text-white mb-3 uppercase tracking-widest">
                  Message Sent!
                </h2>
                <p className="text-[12px] text-slate-400 leading-relaxed mb-8">
                  Your message has been delivered to the administrator. You'll receive a reply at{" "}
                  <span className="text-indigo-400 font-bold">{form.email}</span>.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: user?.name || "", email: user?.email || "", subject: "", message: "" }); }}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors border border-white/5 rounded-xl px-6 py-3"
                >
                  Send Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back link */}
        <p className="mt-8 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2">
            <ChevronLeft className="h-3 w-3" />
            Back to Login
          </Link>
        </p>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
