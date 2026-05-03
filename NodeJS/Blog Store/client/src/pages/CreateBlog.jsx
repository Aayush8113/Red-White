import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog, uploadImage } from '../api/blogService';
import { AuthContext } from '../context/AuthContext';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Please login to create a blog.</div>;
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const imagePath = await uploadImage(file);
      setCoverImage(imagePath);
      setUploading(false);
    } catch (err) {
      setError('Image upload failed');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog({ title, category, content, coverImage });
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
      <h2>Create a New Blog</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cover Image</label>
          <input 
            type="file" 
            onChange={uploadFileHandler} 
            accept="image/*"
            style={{ padding: '10px', width: '100%' }}
          />
          {uploading && <p style={{ fontSize: '0.8rem', color: 'gray' }}>Uploading image...</p>}
          {coverImage && (
            <img src={`http://localhost:5000${coverImage}`} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '10px', borderRadius: '4px' }} />
          )}
        </div>

        <input 
          type="text" placeholder="Blog Title" value={title} onChange={(e) => setTitle(e.target.value)} required 
          style={{ padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        
        <input 
          type="text" placeholder="Category (e.g., Technology)" value={category} onChange={(e) => setCategory(e.target.value)} required 
          style={{ padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        
        <textarea 
          placeholder="Write your blog content here..." value={content} onChange={(e) => setContent(e.target.value)} required rows="10"
          style={{ padding: '10px', fontSize: '1rem', resize: 'vertical', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        
        <button type="submit" disabled={uploading} style={{ padding: '12px 20px', fontSize: '1rem', backgroundColor: '#333', color: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', border: 'none', borderRadius: '5px' }}>
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;