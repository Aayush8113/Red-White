import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, BookOpen, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gradient">
        <BookOpen className="text-primary-400" />
        <span>BookStore</span>
      </Link>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-primary-400 transition-colors"
          />
          <Search className="absolute left-3 top-2.5 text-white/40 w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/shop" className="hover:text-primary-400 transition-colors">Shop</Link>
        <Link to="/cart" className="relative hover:text-primary-400 transition-colors">
          <ShoppingCart />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              {cartItems.reduce((acc, item) => acc + item.qty, 0)}
            </span>
          )}
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
              <User size={20} />
              <span className="hidden sm:inline">{user.name}</span>
            </Link>
            {user.isAdmin && (
              <Link to="/admin/dashboard" className="text-xs bg-primary-500/10 text-primary-400 px-2 py-1 rounded-full font-bold uppercase tracking-widest hover:bg-primary-500/20 transition-all">
                Admin
              </Link>
            )}
            <button onClick={logout} className="p-2 hover:text-red-400 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full transition-all">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
