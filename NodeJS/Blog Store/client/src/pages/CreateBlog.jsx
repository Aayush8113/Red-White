import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../api/blogService';
import { AuthContext } from '../context/AuthContext';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please login to create a blog.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog({ title, category, content });
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Create a New Blog</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Blog Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '1rem' }}
        />
        
        <input 
          type="text" 
          placeholder="Category (e.g., Technology, Lifestyle)" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '1rem' }}
        />
        
        <textarea 
          placeholder="Write your blog content here..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
          rows="10"
          style={{ padding: '10px', fontSize: '1rem', resize: 'vertical' }}
        />
        
        <button 
          type="submit" 
          style={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#333', color: '#fff', cursor: 'pointer', border: 'none', borderRadius: '5px' }}
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;