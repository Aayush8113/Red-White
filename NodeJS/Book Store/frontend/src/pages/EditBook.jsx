import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
        setTitle(data.title);
        setPrice(data.price);
        setImage(data.image);
        setAuthor(data.author);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchBook();
  }, [id]);

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
      await axios.put(
        `http://localhost:5000/api/books/${id}`,
        { title, price, image, author, category, countInStock, description },
        config
      );
      navigate('/admin/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="pt-32 text-center">Loading...</div>;

  return (
    <div className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
      <Link to="/admin/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="glass p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-8">Edit Book</h1>
        
        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm text-white/40 ml-1">Book Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/40 ml-1">Author</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/40 ml-1">Price ($)</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-white/40 ml-1">Stock Quantity</label>
            <input
              type="number"
              required
              value={countInStock}
              onChange={(e) => setCountInStock(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-white/40 ml-1">Image URL</label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-white/40 ml-1">Category</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-white/40 ml-1">Description</label>
            <textarea
              required
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-500 transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Update Book Details</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
