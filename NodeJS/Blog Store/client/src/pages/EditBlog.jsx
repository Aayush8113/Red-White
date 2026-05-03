import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBlogById, updateBlog } from '../api/blogService';
import { AuthContext } from '../context/AuthContext';

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getBlog = async () => {
      try {
        const data = await fetchBlogById(id);
      
        if (data.author._id !== user?._id) {
          navigate('/');
        }
        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content);
      } catch (err) {
        setError('Failed to load blog data');
      }
    };
    if (user) getBlog();
  }, [id, user, navigate]);

  if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please login.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBlog(id, { title, category, content });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Edit Blog</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '1rem' }}
        />
        <input 
          type="text" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '1rem' }}
        />
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
          rows="10"
          style={{ padding: '10px', fontSize: '1rem', resize: 'vertical' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', border: 'none', borderRadius: '5px' }}>
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;