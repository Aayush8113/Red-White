import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogById, likeBlog } from '../api/blogService';
import { fetchComments, addComment } from '../api/commentService';
import { AuthContext } from '../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext);
  
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogData = async () => {
      try {
        const blogData = await fetchBlogById(id);
        const commentData = await fetchComments(id);
        setBlog(blogData);
        setComments(commentData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getBlogData();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Please login to like this post');
    try {
      const data = await likeBlog(id);
      setBlog({ ...blog, likes: data.likes });
    } catch (err) { console.error(err); }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const addedComment = await addComment(id, newComment);
      setComments([addedComment, ...comments]); 
      setNewComment(''); 
    } catch (err) { console.error(err); }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (!blog) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Blog not found.</div>;

  const hasLiked = user && blog.likes.includes(user._id);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>&larr; Back to Home</Link>
      
      <div style={{ marginTop: '20px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
        <h1 style={{ marginBottom: '10px', fontSize: '2.5rem' }}>{blog.title}</h1>
        <p style={{ color: 'gray', paddingBottom: '15px' }}>
          By {blog.author?.name || 'Unknown'} | {new Date(blog.createdAt).toLocaleDateString()} | Category: {blog.category}
        </p>

        {blog.coverImage && (
          <img 
            src={`http://localhost:5000${blog.coverImage}`} 
            alt={blog.title} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} 
          />
        )}
        
        <div style={{ marginTop: '20px', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
          {blog.content}
        </div>

        <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button 
            onClick={handleLike} 
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: hasLiked ? '#007bff' : '#f4f4f4', color: hasLiked ? 'white' : 'black', border: '1px solid #ddd', borderRadius: '5px', fontWeight: 'bold' }}
          >
            {hasLiked ? 'Liked' : 'Like'} ({blog.likes.length})
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Comments ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input type="text" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Post</button>
          </form>
        ) : (
          <p style={{ marginBottom: '30px', color: '#555' }}><Link to="/login" style={{ color: '#007bff' }}>Login</Link> to add a comment.</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {comments.map((comment) => (
            <div key={comment._id} style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#333' }}>{comment.user?.name || 'Unknown'}</strong>
                <span style={{ color: 'gray', fontSize: '0.85rem' }}>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p style={{ margin: '0', color: '#444', lineHeight: '1.5' }}>{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;