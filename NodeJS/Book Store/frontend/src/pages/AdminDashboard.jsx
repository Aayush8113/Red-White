import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LayoutDashboard, Book as BookIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchBooks = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/books');
        setBooks(data.books);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [user, navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/books/${id}`, config);
        setBooks(books.filter((b) => b._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const createBookHandler = async () => {
     try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post('http://localhost:5000/api/books', {}, config);
        navigate(`/admin/book/${data._id}/edit`);
      } catch (err) {
        alert(err.response?.data?.message || 'Create failed');
      }
  };

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <LayoutDashboard className="text-primary-400" /> Admin Panel
          </h1>
          <p className="text-white/40">Manage your bookstore inventory</p>
        </div>
        <button 
          onClick={createBookHandler}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold"
        >
          <Plus size={20} /> Add New Book
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="py-5 px-6 text-white/40 text-sm font-medium uppercase tracking-wider">Book</th>
              <th className="py-5 px-6 text-white/40 text-sm font-medium uppercase tracking-wider">Author</th>
              <th className="py-5 px-6 text-white/40 text-sm font-medium uppercase tracking-wider">Category</th>
              <th className="py-5 px-6 text-white/40 text-sm font-medium uppercase tracking-wider">Price</th>
              <th className="py-5 px-6 text-white/40 text-sm font-medium uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {books.map((book) => (
              <tr key={book._id} className="hover:bg-white/5 transition-colors group">
                <td className="py-5 px-6">
                  <div className="flex items-center gap-4">
                    <img src={book.image} alt="" className="w-10 h-14 object-cover rounded-lg" />
                    <span className="font-bold">{book.title}</span>
                  </div>
                </td>
                <td className="py-5 px-6 text-white/60">{book.author}</td>
                <td className="py-5 px-6">
                  <span className="bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {book.category}
                  </span>
                </td>
                <td className="py-5 px-6 font-bold text-primary-400">${book.price}</td>
                <td className="py-5 px-6">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => navigate(`/admin/book/${book._id}/edit`)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => deleteHandler(book._id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400/60 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
