import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(book, qty);
    navigate('/cart');
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!book) return <div className="pt-32 text-center text-red-500">Book not found</div>;

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
      <Link to="/shop" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
        <ArrowLeft size={20} /> Back to Catalog
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <div className="glass p-8 rounded-3xl sticky top-32">
            <img src={book.image} alt={book.title} className="w-full rounded-2xl shadow-2xl" />
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-8"
        >
          <div>
            <p className="text-primary-400 font-medium mb-2">{book.category}</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{book.title}</h1>
            <p className="text-xl text-white/60 italic">by {book.author}</p>
            
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{book.rating}</span>
              </div>
              <span className="text-white/40">{book.numReviews} Reviews</span>
            </div>
          </div>

          <p className="text-white/70 leading-relaxed text-lg">
            {book.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-y border-white/5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary-400" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="text-primary-400" />
              <span className="text-sm">Free Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="text-primary-400" />
              <span className="text-sm">7 Day Returns</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-white/40 text-sm">Total Price</p>
              <p className="text-4xl font-bold text-primary-400">${book.price}</p>
            </div>
            
            <div className="flex items-center gap-4 glass p-2 rounded-2xl">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"
              >-</button>
              <span className="text-lg font-bold w-4 text-center">{qty}</span>
              <button 
                onClick={() => setQty(Math.min(book.countInStock, qty + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"
              >+</button>
            </div>
          </div>

          <button 
            disabled={book.countInStock === 0}
            onClick={addToCartHandler}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg"
          >
            <ShoppingCart />
            {book.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetails;
