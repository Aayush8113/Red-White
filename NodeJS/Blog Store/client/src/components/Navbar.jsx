import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchNotifications } from '../api/notificationService';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      const getUnreadCount = async () => {
        try {
          const data = await fetchNotifications();
          setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (err) {}
      };
      getUnreadCount();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
        ? 'py-4' 
        : 'py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        <div className={`flex items-center gap-10 px-8 py-3 rounded-[32px] transition-all duration-500 border ${
          isScrolled 
            ? 'bg-slate-900/80 backdrop-blur-2xl border-white/10 shadow-2xl scale-95' 
            : 'bg-slate-900/40 backdrop-blur-md border-white/5 shadow-none'
        }`}>
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-[15deg] transition-all duration-500">
              <span className="text-white font-black text-xl italic tracking-tighter">B</span>
            </div>
            <span className="font-black text-2xl tracking-tighter text-white italic hidden sm:block">
              Blog<span className="text-blue-400">Store</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
              isActive('/') ? 'text-blue-400' : 'text-slate-400 hover:text-white'
            }`}>
              Feed
            </Link>
            {user && (
              <Link to="/dashboard" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                isActive('/dashboard') ? 'text-blue-400' : 'text-slate-400 hover:text-white'
              }`}>
                Archive
              </Link>
            )}
            {user && (
              <Link to="/create" className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all px-4 py-2 bg-blue-600/10 rounded-full border border-blue-500/20 ${
                isActive('/create') ? 'text-blue-400' : 'text-slate-400 hover:text-white'
              }`}>
                + New
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-6 pl-6 border-l border-white/10">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/notifications" className="relative text-slate-400 hover:text-white transition-colors">
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-[8px] font-black animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <Link to="/profile" className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-indigo-900/40 hover:scale-110 transition-all overflow-hidden border border-white/10">
                   {user.name.charAt(0).toUpperCase()}
                </Link>
                
                <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors">
                   <span className="text-lg">⏻</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white">Access</Link>
                <Link to="/register" className="bg-white text-slate-900 px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-50 transition-all active:scale-95">
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;