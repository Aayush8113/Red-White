import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from '../api/blogService';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    if (!user || user.role !== 'Administrator') {
      navigate('/');
      return;
    }

    const getAllBlogs = async () => {
      try {
        const data = await fetchBlogs(); 
        setAllBlogs(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    getAllBlogs();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('ADMIN ACTION: Are you sure you want to permanently delete this blog?')) {
      try {
        await deleteBlog(id);
        setAllBlogs(allBlogs.filter((blog) => blog._id !== id));
      } catch (err) {
        alert('Failed to delete blog.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Admin Panel...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#dc3545' }}>Admin Dashboard</h2>
      <p>Manage all platform content here.</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
        <thead>
          <tr style={{ backgroundColor: '#333', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Title</th>
            <th style={{ padding: '12px' }}>Author</th>
            <th style={{ padding: '12px' }}>Category</th>
            <th style={{ padding: '12px' }}>Date</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allBlogs.map((blog) => (
            <tr key={blog._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>
                <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                  {blog.title}
                </Link>
              </td>
              <td style={{ padding: '12px' }}>{blog.author?.name || 'Unknown'}</td>
              <td style={{ padding: '12px' }}>{blog.category}</td>
              <td style={{ padding: '12px' }}>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: '12px' }}>
                <button 
                  onClick={() => handleDelete(blog._id)}
                  style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {allBlogs.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>No blogs found in the database.</p>}
    </div>
  );
};

export default AdminDashboard;