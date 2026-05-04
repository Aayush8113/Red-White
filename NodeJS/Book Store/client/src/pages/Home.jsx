import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingCart, Sparkles, BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/books');
        setFeaturedBooks(data.books.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

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
    <div className="relative">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-24 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px] -z-10" />
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] -z-10" />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-16 lg:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 animate-pulse">
              <Sparkles className="text-yellow-400" size={16} />
              <span className="text-sm font-medium text-white/80">Premium Literary Experience</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
              Elevate Your <br />
              <span className="text-gradient">Reading Journey</span>
            </h1>
            
            <p className="mt-8 text-white/60 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Step into a sanctuary of stories. From rare manuscripts to modern masterpieces, 
              curate your personal library with our handpicked collection of world-class literature.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link to="/shop" className="btn-primary">
                Explore Collection <ArrowRight size={20} />
              </Link>
              <Link to="/signup" className="btn-glass">
                Join our Society
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-40 grayscale">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} />
                <span className="text-sm font-semibold uppercase tracking-widest">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={20} />
                <span className="text-sm font-semibold uppercase tracking-widest">20k+ Titles</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative w-full max-w-lg lg:max-w-none"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-purple-500/30 blur-3xl group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative glass-card aspect-[4/5] overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center p-12">
                    <img 
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" 
                      alt="Featured Book" 
                      className="w-full h-full object-contain book-cover-shadow animate-float"
                    />
                 </div>
              </div>
              
              {/* Floating Stat Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-8 -right-8 glass p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20"
              >
                <div className="bg-yellow-500/20 p-3 rounded-2xl">
                  <Star className="text-yellow-500 fill-yellow-500" size={32} />
                </div>
                <div>
                  <p className="text-2xl font-black">4.9/5</p>
                  <p className="text-sm text-white/40 font-medium">Reader Rating</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Featured Section */}
        <section className="mt-40">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black">Curated for You</h2>
              <p className="text-white/40 mt-4 text-lg">Handpicked bestsellers that define generations.</p>
            </div>
            <Link to="/shop" className="text-primary-400 font-bold hover:text-primary-300 transition-colors flex items-center gap-2 group">
              View All Books <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredBooks.map((book, index) => (
              <motion.div 
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group p-5 relative"
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
                  <div className="aspect-[3/4] rounded-2xl mb-6 overflow-hidden relative">
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Quick View
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="space-y-1 mb-6">
                  <p className="text-xs font-bold tracking-widest text-white/30 uppercase">{book.author}</p>
                  <Link to={`/book/${book._id}`}>
                    <h3 className="font-bold text-xl line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-2xl font-black text-white/90">${book.price}</span>
                  <Link to={`/book/${book._id}`} className="bg-white/5 hover:bg-primary-500 p-3 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary-500/20 active:scale-90">
                    <ShoppingCart size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
