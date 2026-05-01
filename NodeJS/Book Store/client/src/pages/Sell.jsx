import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Plus, ArrowLeft, BookOpen, DollarSign, Tag, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Sell = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(
        'http://localhost:5000/api/books',
        { title, author, price, category, countInStock, image, description },
        config
      );
      alert('Book listed for sale!');
      navigate('/shop');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to list book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-12 px-6 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">Sell Your Book</h1>
            <p className="text-white/40 mt-2">List your book in our premium collection</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn-glass !px-6 !py-3">
            <ArrowLeft size={18} /> Cancel
          </button>
        </div>

        <form onSubmit={submitHandler} className="glass p-8 md:p-12 rounded-[40px] space-y-8 border border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                <BookOpen size={14} /> Book Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
                placeholder="e.g. The Great Gatsby"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                <User size={14} /> Author Name
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
                placeholder="F. Scott Fitzgerald"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                <DollarSign size={14} /> Selling Price ($)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
                placeholder="29.99"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Tag size={14} /> Category
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
                placeholder="Fiction, Biography, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Upload size={14} /> Cover Image URL
            </label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Info size={14} /> Book Description
            </label>
            <textarea
              required
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
              placeholder="Tell readers about this masterpiece..."
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-5 !text-xl !rounded-3xl"
            >
              {loading ? 'Processing...' : 'List Book for Sale'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Sell;
