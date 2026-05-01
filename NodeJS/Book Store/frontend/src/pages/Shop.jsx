import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

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

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Explore Library</h1>
          <p className="text-white/40">Find the perfect book for your next adventure</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Search by title..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-500 transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-white/30" size={18} />
          </div>
          <button className="glass p-3 rounded-xl hover:bg-white/10 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="glass p-4 rounded-3xl animate-pulse">
              <div className="aspect-[3/4] bg-white/5 rounded-2xl mb-4" />
              <div className="h-4 bg-white/5 rounded w-2/3 mb-2" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={book._id}
              className="glass p-4 rounded-3xl group hover:border-primary-500/30 transition-all duration-300"
            >
              <Link to={`/book/${book._id}`}>
                <div className="aspect-[3/4] rounded-2xl mb-4 overflow-hidden relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                    <Star className="text-yellow-500 fill-yellow-500" size={12} />
                    <span>{book.rating}</span>
                  </div>
                </div>
              </Link>
              
              <div className="px-2">
                <p className="text-white/40 text-xs mb-1">{book.author}</p>
                <Link to={`/book/${book._id}`}>
                  <h3 className="font-bold text-lg mb-4 line-clamp-1 group-hover:text-primary-400 transition-colors">
                    {book.title}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-400">${book.price}</span>
                  <button className="bg-white/5 hover:bg-primary-600 p-2.5 rounded-xl transition-all">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-24 glass rounded-3xl">
          <p className="text-xl text-white/40">No books found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;
