import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/users/wishlist', config);
        setWishlist(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const removeHandler = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/users/wishlist/${id}`, config);
      setWishlist(wishlist.filter((item) => item._id !== id));
    } catch (err) {
      alert('Failed to remove from wishlist');
    }
  };

  if (!user) return (
    <div className="pt-32 text-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Your Wishlist</h2>
      <p className="text-white/40">Please <Link to="/login" className="text-primary-400">login</Link> to view your wishlist.</p>
    </div>
  );

  if (loading) return <div className="pt-32 text-center h-screen">Loading...</div>;

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black flex items-center gap-4">
            <Heart className="text-red-500 fill-red-500" /> My Wishlist
          </h1>
          <p className="text-white/40 mt-2">{wishlist.length} items saved for later</p>
        </div>
        <Link to="/shop" className="btn-glass !px-6 !py-3">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Heart size={40} className="text-white/10" />
          </div>
          <p className="text-white/40 text-xl">Your wishlist is currently empty.</p>
          <Link to="/shop" className="btn-primary inline-flex">Explore Books</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((book) => (
            <motion.div 
              layout
              key={book._id}
              className="glass-card p-4 flex gap-6 group"
            >
              <div className="w-1/3 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <h3 className="font-bold text-xl group-hover:text-primary-400 transition-colors line-clamp-2">
                    <Link to={`/book/${book._id}`}>{book.title}</Link>
                  </h3>
                  <p className="text-white/40 text-sm mt-1">by {book.author}</p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-2xl font-black text-white/90">${book.price}</p>
                  <div className="flex gap-2">
                    <Link to={`/book/${book._id}`} className="bg-primary-600 hover:bg-primary-700 p-3 rounded-xl transition-all">
                      <ShoppingCart size={18} />
                    </Link>
                    <button 
                      onClick={() => removeHandler(book._id)}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
