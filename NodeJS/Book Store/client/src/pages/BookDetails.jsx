import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(
        `http://localhost:5000/api/books/${id}/reviews`,
        { rating, comment },
        config
      );
      alert('Review Submitted!');
      setComment('');
      // Refresh book data
      const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
      setBook(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!book) return <div className="pt-32 text-center text-red-500">Book not found</div>;

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
      <Link to="/shop" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
        <ArrowLeft size={20} /> Back to Catalog
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <div className="glass p-8 rounded-3xl sticky top-32">
            <img src={book.image} alt={book.title} className="w-full rounded-2xl shadow-2xl" />
          </div>
        </motion.div>

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

      <section className="mt-24">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/3">
            <div className="glass p-8 rounded-3xl sticky top-32">
              <h3 className="text-xl font-bold mb-6">Write a Review</h3>
              {user ? (
                <form onSubmit={submitReviewHandler} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm text-white/40">Rating</label>
                    <select 
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary-500"
                    >
                      <option value="5" className="bg-[#1e293b]">5 - Excellent</option>
                      <option value="4" className="bg-[#1e293b]">4 - Very Good</option>
                      <option value="3" className="bg-[#1e293b]">3 - Good</option>
                      <option value="2" className="bg-[#1e293b]">2 - Fair</option>
                      <option value="1" className="bg-[#1e293b]">1 - Poor</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-white/40">Comment</label>
                    <textarea 
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary-500"
                      placeholder="Share your thoughts..."
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {submittingReview ? <Loader2 className="animate-spin" size={18} /> : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-white/40">Please <Link to="/login" className="text-primary-400 hover:underline">login</Link> to write a review.</p>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {book.reviews.length === 0 ? (
              <p className="text-white/40 italic">No reviews yet. Be the first to review!</p>
            ) : (
              book.reviews.map((review) => (
                <div key={review._id} className="glass p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold">{review.name}</p>
                      <div className="flex items-center gap-1 mt-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-white/20">{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p className="text-white/70 leading-relaxed">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookDetails;
