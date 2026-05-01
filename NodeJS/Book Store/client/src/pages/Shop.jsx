import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Star, ShoppingCart, Heart, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/books?keyword=${keyword}`);
        setBooks(data.books);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [keyword]);

  const addToWishlist = async (id) => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post('http://localhost:5000/api/users/wishlist', { bookId: id }, config);
      alert('Added to wishlist!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black mb-4">The <span className="text-gradient">Grand Collection</span></h1>
          <p className="text-white/40 text-lg leading-relaxed">
            Browse through thousands of titles from various genres. From literature classics 
            to modern sci-fi, find your next world to get lost in.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96 group">
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pl-14 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all duration-300"
            />
            <Search className="absolute left-5 top-4.5 text-white/20 group-focus-within:text-primary-400 transition-colors" size={20} />
          </div>
          <button className="btn-glass !p-4 !rounded-2xl">
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="glass p-5 rounded-[32px] animate-pulse">
              <div className="aspect-[3/4] bg-white/5 rounded-2xl mb-6" />
              <div className="h-6 bg-white/5 rounded-full w-2/3 mb-3" />
              <div className="h-4 bg-white/5 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <AnimatePresence>
            {books.map((book, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                key={book._id}
                className="glass-card p-5 group relative"
              >
                <div className="absolute top-8 right-8 z-10">
                  <button 
                    onClick={() => addToWishlist(book._id)}
                    className="w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-white/10 transition-all active:scale-75"
                  >
                    <Heart size={18} />
                  </button>
                </div>

                <Link to={`/book/${book._id}`}>
                  <div className="aspect-[3/4] rounded-2xl mb-6 overflow-hidden relative shadow-2xl">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 w-full py-3 rounded-xl text-center text-sm font-bold">
                        View Details
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className="space-y-1 mb-6">
                  <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">{book.author}</p>
                  <Link to={`/book/${book._id}`}>
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold">{book.rating}</span>
                    </div>
                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">• {book.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-2xl font-black text-white/90">${book.price}</span>
                  <Link to={`/book/${book._id}`} className="bg-white/5 hover:bg-primary-500 p-3 rounded-2xl transition-all shadow-xl hover:shadow-primary-500/20 active:scale-90">
                    <ShoppingCart size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && books.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 glass rounded-[40px] border border-dashed border-white/10"
        >
          <Search size={48} className="mx-auto text-white/10 mb-6" />
          <p className="text-2xl font-bold text-white/40">No treasures found matching "{keyword}"</p>
          <button onClick={() => setKeyword('')} className="mt-6 text-primary-400 hover:underline font-bold">Clear search filters</button>
        </motion.div>
      )}
    </div>
  );
};

export default Shop;
