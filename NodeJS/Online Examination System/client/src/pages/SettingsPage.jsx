import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Palette, 
  Globe, 
  Keyboard,
  Moon,
  Sun,
  Monitor,
  CheckCircle2
} from "lucide-react";
import { useAuthStore } from "../state/authStore";

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

export function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  
  const [theme, setTheme] = useState(localStorage.getItem("schoolzpro-theme") || "dark");
  const [highContrast, setHighContrast] = useState(localStorage.getItem("schoolzpro-contrast") === "true");
  const [screenReader, setScreenReader] = useState(localStorage.getItem("schoolzpro-screenreader") === "true");
  const [showSaved, setShowSaved] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || "Student",
    email: user?.email || "student@schoolzpro.com"
  });

  const [notifications, setNotifications] = useState({
    exams: true,
    leaderboard: true,
    performance: true,
    updates: true
  });

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
    setProfile({ name: user?.name || "Student", email: user?.email || "student@schoolzpro.com" });
    setNotifications({ exams: true, leaderboard: true, performance: true, updates: true });
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

      <section>
        <h1 className="text-3xl font-black text-white lg:text-4xl uppercase tracking-tight">User <span className="text-indigo-500">Preferences</span></h1>
        <p className="mt-2 text-slate-400 font-medium text-sm lg:text-base">Manage your personal profile, visual preferences, and security tools.</p>
      </section>

      <div className="space-y-6">
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
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/30" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/30" 
              />
            </div>
          </div>
        </SettingSection>

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

        <SettingSection 
          icon={Eye} 
          title="Accessibility Tools" 
          description="Enhance the interface for your specific requirements."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all group">
              <div>
                <p className="text-sm font-bold text-white">High Contrast Mode</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1 opacity-60">Enhance visibility for clearer reading.</p>
              </div>
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`h-8 w-14 rounded-full transition-all duration-500 relative ${highContrast ? "bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]" : "bg-white/10"}`}
              >
                <motion.div 
                  animate={{ x: highContrast ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1.5 h-5 w-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
            <div className="flex items-center justify-between rounded-3xl bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all group">
              <div>
                <p className="text-sm font-bold text-white">Screen Reader Support</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1 opacity-60">Optimize platform for assistive voice technologies.</p>
              </div>
              <button 
                onClick={() => setScreenReader(!screenReader)}
                className={`h-8 w-14 rounded-full transition-all duration-500 relative ${screenReader ? "bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.5)]" : "bg-white/10"}`}
              >
                <motion.div 
                  animate={{ x: screenReader ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1.5 h-5 w-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          </div>
        </SettingSection>

        <SettingSection 
          icon={Bell} 
          title="Notification Control" 
          description="Select the updates you wish to receive via push alerts."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { id: 'exams', label: "New Exams Scheduled" },
              { id: 'leaderboard', label: "Leaderboard Changes" },
              { id: 'performance', label: "Academic Performance" },
              { id: 'updates', label: "System Service Updates" }
            ].map((pref) => (
              <label key={pref.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.01] p-5 transition-all hover:bg-white/5 cursor-pointer group">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-white transition-colors">{pref.label}</span>
                <input 
                  type="checkbox" 
                  checked={notifications[pref.id]} 
                  onChange={() => setNotifications({...notifications, [pref.id]: !notifications[pref.id]})}
                  className="h-6 w-6 rounded-xl border-white/10 bg-white/5 text-indigo-600 accent-indigo-600 cursor-pointer transition-all focus:ring-offset-0 focus:ring-0" 
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
