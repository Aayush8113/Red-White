import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { fetchNotifications } from '../api/notificationService';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

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

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0 font-bold text-2xl tracking-tight">
            <Link to="/" className="hover:text-blue-400 transition-colors">BlogApp</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'Administrator' && (
                  <Link to="/admin" className="text-amber-400 font-semibold hover:text-amber-300">Admin Panel</Link>
                )}
                
                <Link to="/dashboard" className="hover:text-blue-300 transition-colors">Dashboard</Link>
                <Link to="/create" className="border border-white/30 hover:border-white px-3 py-1.5 rounded-md transition-all bg-white/5 hover:bg-white/10">
                  + Create Post
                </Link>

                <Link to="/notifications" className="relative hover:text-blue-300 transition-colors ml-2">
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold ring-2 ring-slate-900">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                
                <div className="h-6 w-px bg-slate-700 mx-2"></div>
                
                <Link to="/profile" className="text-slate-300 hover:text-white transition-colors">
                  {user.name}
                </Link>
                
                <button onClick={handleLogout} className="text-sm bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-md transition-colors shadow-sm ml-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-300 transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;