import { useState, useEffect } from 'react';
import { fetchBlogs } from '../api/blogService';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blogs');
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading blogs...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Latest Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found. Be the first to create one!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {blogs.map((blog) => (
            <div key={blog._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{blog.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'gray' }}>
                By {blog.author?.name || 'Unknown'} | Category: {blog.category}
              </p>
              <p style={{ marginTop: '10px' }}>{blog.content.substring(0, 150)}...</p>
              <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#555' }}>
                👍 {blog.likes?.length || 0} Likes
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;