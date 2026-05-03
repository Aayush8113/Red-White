import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from '../api/blogService';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const getMyBlogs = async () => {
      try {
        const allBlogs = await fetchBlogs();
   
        const userBlogs = allBlogs.filter((blog) => blog.author?._id === user._id);
        setMyBlogs(userBlogs);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    getMyBlogs();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog? This cannot be undone.')) {
      try {
        await deleteBlog(id);
     
        setMyBlogs(myBlogs.filter((blog) => blog._id !== id));
      } catch (err) {
        alert('Failed to delete blog');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>My Dashboard</h2>
      <p>Manage your posts below.</p>

      {myBlogs.length === 0 ? (
        <p>You haven't written any blogs yet. <Link to="/create">Create one now!</Link></p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {myBlogs.map((blog) => (
            <div key={blog._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>
                  <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none', color: '#333' }}>{blog.title}</Link>
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'gray' }}>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/edit/${blog._id}`} style={{ textDecoration: 'none', padding: '5px 10px', backgroundColor: '#ffc107', color: '#000', borderRadius: '4px' }}>
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(blog._id)}
                  style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;