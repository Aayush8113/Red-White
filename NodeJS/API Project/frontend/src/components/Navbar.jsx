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
            <Link to="/dashboard" className="text-gray-300 hover:text-primary transition font-medium">Dashboard</Link>
            <Link to="/portfolio" className="text-gray-300 hover:text-primary transition font-medium">Portfolio</Link>
            
            <div className="flex items-center gap-4 ml-4 px-4 py-1.5 bg-surface rounded-full border border-white/10 shadow-inner">
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Available Cash</span>
                <span className="text-sm font-bold text-success">
                  ${user.balance?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="flex items-center gap-2" title={user.email}>
                <UserIcon size={16} className="text-primary" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
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
