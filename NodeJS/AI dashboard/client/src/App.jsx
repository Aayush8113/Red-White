// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { AISidebar } from './components/AISidebar';
import { GhostBanner } from './components/GhostBanner';
import { GlobalSearch } from './components/GlobalSearch';
import { InboxHub } from './components/InboxHub';
import { useGsapScroll } from './hooks/useGsapScroll';
import { useStore } from './store/uiStore';
import { Logo } from './components/Logo';

// Page Imports
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { Clients } from './pages/Clients';
import { AIPlayground } from './pages/AIPlayground';
import { ActionFlows } from './pages/ActionFlows';
import { QueryStudio } from './pages/QueryStudio';
import { DataForge } from './pages/DataForge';
import { Security } from './pages/Security';
import { Settings } from './pages/Settings';

import { Menu, Sparkles, Bell, Search, AlertCircle, Sun, Moon, Eye } from 'lucide-react';
import { cn } from './lib/utils';

/* -------------------------------------------------------------------------- */
/* HEADER COMPONENT                                                           */
/* -------------------------------------------------------------------------- */
const Header = () => {
  const { 
    toggleAi, toggleSidebar, toggleSearch, toggleInbox, inboxAlerts, 
    theme, setTheme, user, impersonatedUser
  } = useStore();
  const location = useLocation();

  const routeTitles = {
    '/': 'AetherForge Overview',
    '/clients': 'Client Engine & CRUD',
    '/ai-studio': 'AI Copilot & Scaffold',
    '/automation': 'Action Flows Builder',
    '/query-studio': 'Query Studio Charts',
    '/data-forge': 'Data Forge Import/Export',
    '/security': 'Security Governance (RBAC)',
    '/settings': 'Platform Settings',
  };

  const title = routeTitles[location.pathname] || 'Dashboard';
  const unreadAlerts = inboxAlerts.filter(a => !a.read).length;
  const activeUser = impersonatedUser || user;

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <header className="h-20 border-b border-slate-200 dark:border-white/5 flex justify-between items-center px-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md sticky top-0 z-10 transition-all">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" 
          onClick={toggleSidebar}
        >
          <Menu />
        </button>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
      </div>

      {/* Right: Actions & Search */}
      <div className="flex items-center gap-4">
        {/* Command Palette Trigger (Cmd+K) */}
        <button 
          onClick={toggleSearch}
          className="hidden md:flex items-center gap-3 bg-slate-100 dark:bg-slate-950/40 rounded-full px-4 py-2 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <Search size={15} />
          <span className="text-xs">Search (Ctrl+K)</span>
          <kbd className="text-[9px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-350 dark:border-slate-700">Ctrl K</kbd>
        </button>

        {/* Theme Toggler */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
          title="Toggle Dark/Light theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>

        {/* System Inbox Alert Hub */}
        <button 
          onClick={toggleInbox}
          className="relative p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <Bell size={20} />
          {unreadAlerts > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center animate-pulse ring-2 ring-white dark:ring-slate-900">
              {unreadAlerts}
            </span>
          )}
        </button>

        {/* AI Trigger Button */}
        <button 
          onClick={toggleAi} 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg shadow-indigo-500/10 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles size={14} className="animate-pulse" /> 
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* User Role Indicator */}
        {activeUser && (
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 pl-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20 dark:border-indigo-500/30">
              {activeUser.avatar}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-white">{activeUser.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{activeUser.role}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN LAYOUT WRAPPER                                                        */
/* -------------------------------------------------------------------------- */
const Layout = ({ children }) => {
  const { isAuthenticated, environment, syncData } = useStore();
  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      syncData();
    }
  }, [isAuthenticated, syncData]);

  // Apply smooth scrolling via GSAP hook to our main scroll container
  useGsapScroll(scrollRef);

  // If on login, do not render header or sidebar
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  // Route Guard redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isProd = environment === 'production';

  return (
    <div className="flex dark:bg-slate-950 bg-slate-50 min-h-screen font-sans text-slate-800 dark:text-slate-200 selection:bg-indigo-500/30 relative overflow-hidden transition-colors duration-300">
      {/* Live Animated Background Ambient Orbs */}
      <div className="absolute top-[-15%] left-[-15%] w-[45%] h-[45%] bg-indigo-650/10 dark:bg-indigo-650/15 rounded-full blur-[130px] pointer-events-none z-0 animate-orb-1" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[45%] h-[45%] bg-purple-650/8 dark:bg-purple-650/12 rounded-full blur-[130px] pointer-events-none z-0 animate-orb-2" />
      
      {/* Technology Overlay Shard Grid Mesh */}
      <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none z-0 animate-mesh" />

      <Sidebar />
      <AISidebar />
      <GlobalSearch />
      <InboxHub />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-w-0 overflow-hidden relative z-10">
        <GhostBanner />
        
        {/* Sandbox environment top warning watermark */}
        {!isProd && (
          <div className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold text-center py-1 tracking-widest uppercase border-b border-amber-500/20">
            Sandbox Environment Sandbox Environment Sandbox Environment
          </div>
        )}

        <Header />
        
        {/* Main scrollable frame */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-transparent text-slate-800 dark:text-slate-200"
        >
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PROTECTED ROUTE CONTAINER                                                  */
/* -------------------------------------------------------------------------- */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/* -------------------------------------------------------------------------- */
/* APP ROUTER WITH HYDRATION LOADER                                           */
/* -------------------------------------------------------------------------- */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("Initializing AetherForge node grid...");
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setLoadingStatus("Synchronizing MongoDB collections..."), 450),
      setTimeout(() => setLoadingStatus("Hydrating matrix permissions..."), 900),
      setTimeout(() => setLoadingStatus("Bootstrapping AetherOS interface..."), 1350),
      setTimeout(() => setLoading(false), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden">
        {/* Ambient background glows during load */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[140px]" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
          {/* Animated concentric loader wheels */}
          <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute -inset-3 border border-purple-500/5 border-b-purple-500 rounded-full animate-spin-reverse" />
            <Logo className="w-14 h-14" glow={false} />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white mb-1">AetherForge</h2>
          <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-6">MERN System Hydration</p>
          
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium h-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            {loadingStatus}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster 
        position="top-right" 
        theme="dark" 
        richColors
      />
      
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
          <Route path="/ai-studio" element={<ProtectedRoute><AIPlayground /></ProtectedRoute>} />
          <Route path="/automation" element={<ProtectedRoute><ActionFlows /></ProtectedRoute>} />
          <Route path="/query-studio" element={<ProtectedRoute><QueryStudio /></ProtectedRoute>} />
          <Route path="/data-forge" element={<ProtectedRoute><DataForge /></ProtectedRoute>} />
          <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* 404 Fallback Route */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <AlertCircle size={48} className="text-slate-600 mb-4 animate-bounce" />
              <h1 className="text-2xl font-bold text-white">404: Section Not Found</h1>
              <p className="text-slate-400 mt-2">The feature or screen you requested is offline or currently missing.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}