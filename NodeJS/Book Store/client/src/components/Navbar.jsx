import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, BookOpen, Search, Heart, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const searchHandler = (e) => {
    if (e.key === 'Enter') {
      navigate(`/shop?keyword=${keyword}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-card !rounded-none !border-t-0 !border-x-0 px-6 py-4 flex justify-between items-center backdrop-blur-2xl">
      <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter">
        <div className="bg-primary-500 p-2 rounded-xl">
          <BookOpen className="text-white" size={24} />
        </div>
        <span className="text-gradient">BookStore</span>
      </Link>

      <div className="hidden lg:flex flex-1 max-w-lg mx-12">
        <div className="relative w-full group">
          <input
            type="text"
            placeholder="Search our collection..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={searchHandler}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 pl-12 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all duration-300"
          />
          <Search className="absolute left-4 top-3.5 text-white/20 group-focus-within:text-primary-400 transition-colors" size={20} />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-white/60">
          <Link to="/shop" className="hover:text-primary-400 transition-colors">Shop</Link>
          {user && (
            <Link to="/sell" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
              <PlusCircle size={18} /> Sell
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <Link to="/wishlist" className="p-3 hover:bg-white/5 rounded-2xl transition-all relative text-white/60 hover:text-red-400">
            <Heart size={22} />
          </Link>
          
          <Link to="/cart" className="p-3 hover:bg-white/5 rounded-2xl transition-all relative text-white/60 hover:text-primary-400">
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute top-2 right-2 bg-primary-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-primary-500/40">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>

          <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-3 p-1 pr-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-bold text-sm">{user.name}</span>
              </Link>
              <button onClick={logout} className="p-3 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !px-6 !py-2.5 !text-sm !rounded-xl">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
