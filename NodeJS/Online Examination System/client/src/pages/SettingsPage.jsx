import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Eye,
  Palette,
  Lock,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  Loader2,
  EyeOff,
} from "lucide-react";
import { useAuthStore } from "../state/authStore";
import { Toast } from "../components/Toast";

function SettingSection({ icon: Icon, title, description, children }) {
  return (
    <div className="card flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
      <div className="flex-shrink-0">
        <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-400">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">{label}</label>
      <div className="relative group">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "••••••••"}
          className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 pr-12 text-sm text-white outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/30"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { user, updateUser, changePassword, isLoading } = useAuthStore();

  const [theme, setTheme] = useState(localStorage.getItem("schoolzpro-theme") || "dark");
  const [highContrast, setHighContrast] = useState(localStorage.getItem("schoolzpro-contrast") === "true");
  const [screenReader, setScreenReader] = useState(localStorage.getItem("schoolzpro-screenreader") === "true");
  const [showSaved, setShowSaved] = useState(false);
  const [toast, setToast] = useState(null);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [notifications, setNotifications] = useState({
    exams: true,
    leaderboard: true,
    performance: true,
    updates: true,
  });

  // Password change state
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (theme === "light") {
      body.classList.add("light-theme");
    } else if (theme === "dark") {
      body.classList.remove("light-theme");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      body.classList.toggle("light-theme", !prefersDark);
    }
    body.classList.toggle("high-contrast", highContrast);
    localStorage.setItem("schoolzpro-theme", theme);
    localStorage.setItem("schoolzpro-contrast", highContrast);
    localStorage.setItem("schoolzpro-screenreader", screenReader);
  }, [theme, highContrast, screenReader]);

  const handleSave = () => {
    if (updateUser) {
      updateUser({ name: profile.name, email: profile.email });
    }
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleReset = () => {
    setTheme("dark");
    setHighContrast(false);
    setScreenReader(false);
    setProfile({ name: user?.name || "", email: user?.email || "" });
    setNotifications({ exams: true, leaderboard: true, performance: true, updates: true });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      setToast({ message: "Please fill in all password fields", type: "error" });
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setToast({ message: "New passwords do not match", type: "error" });
      return;
    }
    if (pwForm.newPw.length < 6) {
      setToast({ message: "New password must be at least 6 characters", type: "error" });
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(pwForm.current, pwForm.newPw);
      setPwForm({ current: "", newPw: "", confirm: "" });
      setToast({ message: "Password changed successfully!", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Failed to change password", type: "error" });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="h-5 w-5" />
            Preferences Saved Successfully
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <section>
        <h1 className="text-3xl font-black text-white lg:text-4xl uppercase tracking-tight">
          User <span className="text-indigo-500">Preferences</span>
        </h1>
        <p className="mt-2 text-slate-400 font-medium text-sm lg:text-base">
          Manage your personal profile, visual preferences, and security settings.
        </p>
      </section>

      <div className="space-y-6">
        {/* Profile */}
        <SettingSection
          icon={User}
          title="Profile Information"
          description="Update your personal identification and contact details."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>
          </div>
        </SettingSection>

        {/* Change Password */}
        <SettingSection
          icon={Lock}
          title="Change Password"
          description="Update your account password. Must be at least 6 characters."
        >
          <form onSubmit={handleChangePassword} className="grid gap-4 sm:grid-cols-3">
            <PasswordInput
              label="Current Password"
              value={pwForm.current}
              onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
            />
            <PasswordInput
              label="New Password"
              value={pwForm.newPw}
              onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
            />
            <PasswordInput
              label="Confirm New Password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
            />
            <div className="sm:col-span-3 pt-2">
              <button
                type="submit"
                disabled={pwLoading}
                className="rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-3"
              >
                {pwLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </SettingSection>

        {/* Appearance */}
        <SettingSection
          icon={Palette}
          title="Appearance & Theme"
          description="Customize the visual environment of the platform."
        >
          <div className="flex flex-wrap gap-4">
            {["light", "dark", "system"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex flex-1 min-w-[120px] flex-col items-center gap-4 rounded-3xl border p-6 transition-all duration-500 ${
                  theme === t ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.1)]" : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className={`rounded-2xl p-4 transition-all duration-500 ${theme === t ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/20" : "bg-white/5 text-slate-400"}`}>
                  {t === "light" && <Sun className="h-6 w-6" />}
                  {t === "dark" && <Moon className="h-6 w-6" />}
                  {t === "system" && <Monitor className="h-6 w-6" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{t} Mode</span>
              </button>
            ))}
          </div>
        </SettingSection>

        {/* Accessibility */}
        <SettingSection
          icon={Eye}
          title="Accessibility Tools"
          description="Enhance the interface for your specific requirements."
        >
          <div className="space-y-4">
            {[
              { key: "highContrast", label: "High Contrast Mode", sub: "Enhance visibility for clearer reading.", val: highContrast, toggle: () => setHighContrast(!highContrast) },
              { key: "screenReader", label: "Screen Reader Support", sub: "Optimize platform for assistive voice technologies.", val: screenReader, toggle: () => setScreenReader(!screenReader) },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all">
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1 opacity-60">{item.sub}</p>
                </div>
                <button
                  onClick={item.toggle}
                  className={`h-8 w-14 rounded-full transition-all duration-500 relative ${item.val ? "bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]" : "bg-white/10"}`}
                >
                  <motion.div
                    animate={{ x: item.val ? 28 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1.5 h-5 w-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection
          icon={Bell}
          title="Notification Control"
          description="Select the updates you wish to receive via push alerts."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { id: "exams", label: "New Exams Scheduled" },
              { id: "leaderboard", label: "Leaderboard Changes" },
              { id: "performance", label: "Academic Performance" },
              { id: "updates", label: "System Service Updates" },
            ].map((pref) => (
              <label key={pref.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.01] p-5 transition-all hover:bg-white/5 cursor-pointer group">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-white transition-colors">{pref.label}</span>
                <input
                  type="checkbox"
                  checked={notifications[pref.id]}
                  onChange={() => setNotifications({ ...notifications, [pref.id]: !notifications[pref.id] })}
                  className="h-6 w-6 rounded-xl border-white/10 bg-white/5 text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </SettingSection>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t border-white/5">
        <button onClick={handleReset} className="btn-secondary min-w-[160px]">Reset to Default</button>
        <button onClick={handleSave} className="btn-primary min-w-[200px]">Save Preferences</button>
      </div>
    </div>
  );
}
