import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LineChart, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="glass sticky top-0 z-50 w-full px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
        <LineChart className="text-primary" />
        <span>Market<span className="text-primary">Analytics</span></span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
            <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-surface rounded-full border border-white/5">
              <UserIcon size={16} className="text-primary" />
              <span className="text-sm">{user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-danger transition rounded-full hover:bg-white/5"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
            <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition font-medium">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
