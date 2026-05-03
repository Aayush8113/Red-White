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
      setIsScrolled(window.scrollY > 10);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-lg shadow-xl py-2' : 'bg-slate-900 py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                <span className="text-white font-black text-xl italic">B</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-white">Blog<span className="text-blue-400">Store</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className={`nav-link ${isActive('/') ? 'text-white after:w-full' : ''}`}>Home</Link>
              {user && (
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'text-white after:w-full' : ''}`}>My Posts</Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            {user ? (
              <>
                <Link to="/create" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                  <span>+</span> New Post
                </Link>

                <div className="flex items-center gap-4 bg-slate-800/50 p-1.5 pl-4 rounded-full border border-slate-700">
                  <Link to="/notifications" className="relative text-slate-300 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link to="/profile" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm group-hover:ring-2 ring-indigo-400 transition-all">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  
                  <button onClick={handleLogout} className="text-slate-400 hover:text-rose-400 transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-300 hover:text-white font-semibold transition-colors px-4">Login</Link>
                <Link to="/register" className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-white/5 active:scale-95">
                  Register
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