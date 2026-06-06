import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, GraduationCap, Trophy, Settings, LogOut, Menu, X, Bell, ShieldCheck, PlusSquare, Megaphone, Zap, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmoothScroll } from "./SmoothScroll.jsx";
import { useAuthStore } from "../state/authStore";
import { InteractiveBackground } from "./InteractiveBackground.jsx";

function NavLink({ to, icon: Icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative flex items-center gap-4 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all ${
        active
          ? "bg-white/[0.05] text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)] border border-white/5"
          : "text-slate-500 hover:text-white hover:bg-white/[0.02]"
      }`}
    >
      <Icon className={`h-4 w-4 transition-all duration-500 ${active ? "text-indigo-400 scale-110" : "group-hover:text-white group-hover:scale-110"}`} />
      {label}
      {active && (
        <motion.div
          layoutId="active-nav"
          className="absolute inset-y-4 left-0 w-1 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
        />
      )}
    </Link>
  );
}

export function AppShell({ children }) {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const [notifications, setNotifications] = useState([
    { id: 1, title: "System Alert", body: "Term 1: Quantum Computing scheduled for 10:00 UTC", time: "2m ago", type: "exam" },
    { id: 2, title: "Update", body: "Ranking updated: Current position #04", time: "1h ago", type: "trophy" },
  ]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";

  const studentNavItems = [
    { to: "/", icon: LayoutDashboard, label: "Home" },
    { to: "/exams", icon: GraduationCap, label: "My Exams" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { to: "/settings", icon: Settings, label: "Preferences" },
    { to: "/contact", icon: MessageSquare, label: "Contact Admin" },
  ];

  const adminNavItems = [
    { to: "/admin", icon: ShieldCheck, label: "Admin Dashboard" },
    { to: "/create-exam", icon: PlusSquare, label: "Schedule Exam" },
    { to: "/admin/students", icon: GraduationCap, label: "Students" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/contact", icon: MessageSquare, label: "Contact Form" },
  ];

  const teacherNavItems = [
    { to: "/teacher", icon: ShieldCheck, label: "Teacher Dashboard" },
    { to: "/create-exam", icon: PlusSquare, label: "Create Exam" },
    { to: "/admin/students", icon: GraduationCap, label: "My Students" },
    { to: "/settings", icon: Settings, label: "Settings" },
    { to: "/contact", icon: MessageSquare, label: "Contact Admin" },
  ];

  const navItems = isAdmin ? adminNavItems : isTeacher ? teacherNavItems : studentNavItems;

  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password", "/contact"].includes(pathname);
  const isExamPage = pathname.startsWith("/exam/");

  if (isExamPage) return <main className="min-h-screen bg-[#010101]">{children}</main>;
  if (isAuthPage) return <main className="min-h-screen bg-[#010101]">{children}</main>;

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <SmoothScroll>
      <div className="flex min-h-screen bg-transparent selection:bg-indigo-500/30">
        <InteractiveBackground type={user?.role === "admin" ? "admin" : "student"} />
        
        
        <aside className="fixed inset-y-0 left-0 hidden w-80 flex-col border-r border-white/5 bg-black/[0.2] backdrop-blur-3xl p-8 lg:flex">
          <div className="mb-16 flex items-center gap-4 px-2">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-[0_0_30px_rgba(99,102,241,0.4)] overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
               <Zap className="h-6 w-6 text-white relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-[0.2em] text-white">SCHOOLZ<span className="text-indigo-500">PRO</span></span>
              <span className="text-[8px] font-black tracking-[0.5em] text-slate-500 uppercase mt-1">Next Gen Education</span>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                {...item}
                active={pathname === item.to}
              />
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-6 border-t border-white/5 pt-10">
            {user && (
              <div className="mb-4 flex items-center gap-4 px-2">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate uppercase tracking-widest">{user.name}</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-500/60 mt-1">{user.role} Access</p>
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:text-white hover:bg-white/[0.02] rounded-2xl"
            >
              <LogOut className="h-4 w-4 group-hover:text-rose-500 transition-colors" />
              Logout
            </button>
          </div>
        </aside>

        
        <div className="flex flex-1 flex-col lg:pl-80">
          
          <header 
            className={`sticky top-0 z-40 flex h-24 items-center justify-between px-8 transition-all lg:px-12 ${
              scrolled ? "bg-black/40 backdrop-blur-3xl border-b border-white/5" : "bg-transparent"
            }`}
          >
            <div className="flex items-center gap-6 lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-2xl bg-white/5 p-3 text-slate-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="text-lg font-black tracking-widest text-white">SCHOOLZPRO</span>
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center gap-3">
                 <div className="h-1 w-4 bg-indigo-500" />
                 <h1 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                   {navItems.find(i => i.to === pathname)?.label || "CORE_STATUS"}
                 </h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`relative rounded-2xl p-3 transition-all border ${
                    isNotificationsOpen ? "bg-indigo-600 border-indigo-400 text-white" : "text-slate-500 border-white/5 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]" />
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      className="absolute right-0 mt-6 w-96 rounded-3xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-2xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                    >
                      <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Notifications</span>
                        <button className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300">Clear All</button>
                      </div>
                      <div className="space-y-4">
                        {notifications.map((n) => (
                          <div key={n.id} className="group relative rounded-2xl bg-white/[0.03] p-4 transition-all hover:bg-white/[0.06] border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                               <h4 className="text-[10px] font-black text-white tracking-widest">{n.title}</h4>
                               <span className="text-[8px] font-mono text-slate-600">{n.time}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-relaxed">{n.body}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-indigo-600/10 p-0.5 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white uppercase">
                  {user?.name?.slice(0, 2) || "U"}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-80 bg-[#010101] p-8 shadow-2xl lg:hidden border-r border-white/10"
              >
                <div className="mb-16 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/20">
                       <Zap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-widest text-white uppercase">Schoolzpro</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl bg-white/5 p-2 text-slate-400 hover:text-white">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      {...item}
                      active={pathname === item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </SmoothScroll>
  );
}
