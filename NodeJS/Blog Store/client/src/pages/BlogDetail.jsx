import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogById, likeBlog } from '../api/blogService';
import { fetchComments, addComment } from '../api/commentService';
import { AuthContext } from '../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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
    if (!user) {
      return navigate('/login', { state: { from: `/blog/${id}` } });
    }
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const data = await likeBlog(id);
      setBlog({ ...blog, likes: data.likes });
    } catch (err) { 
      console.error(err); 
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!newComment.trim()) return;
    
    try {
      const addedComment = await addComment(id, newComment);
      setComments([addedComment, ...comments]); 
      setNewComment(''); 
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Fetching article details...</p>
      </div>
    );
  }

  if (!blog) return <div className="text-center py-20 text-slate-500">Blog not found.</div>;

  const hasLiked = user && blog.likes.includes(user._id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Discover
      </Link>
      
      <article className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {blog.coverImage && (
          <div className="w-full h-[400px] relative">
            <img 
              src={`http://localhost:5000/uploads/${blog.coverImage}`} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                {blog.title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-8 md:p-12">
          {!blog.coverImage && (
             <div className="mb-8">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-wider">
                  {blog.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  {blog.title}
                </h1>
             </div>
          )}

          <div className="flex items-center justify-between mb-10 pb-8 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="font-bold text-slate-900">{blog.author?.name || 'Anonymous Writer'}</p>
                <p className="text-sm text-slate-400">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
                hasLiked 
                  ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-100' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              } ${isLiking ? 'opacity-50' : ''}`}
            >
              <span className={`text-xl transition-transform ${hasLiked ? 'scale-125' : ''}`}>
                {hasLiked ? '❤️' : '🤍'}
              </span>
              {blog.likes.length}
            </button>
          </div>
          
          <div className="prose prose-slate lg:prose-xl max-w-none text-slate-700 leading-relaxed space-y-6 text-lg">
            {blog.content.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-12 bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          Community Thoughts 
          <span className="text-slate-300 text-lg font-medium">({comments.length})</span>
        </h3>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-12 group">
            <div className="relative">
              <textarea 
                placeholder="Share your thoughts on this article..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                required 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-none placeholder:text-slate-400"
              />
              <div className="absolute bottom-4 right-4">
                <button type="submit" className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-12 p-8 bg-blue-50 rounded-2xl border border-blue-100 text-center">
            <p className="text-blue-900 font-semibold mb-4">Want to join the conversation?</p>
            <Link to="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
              Sign in to Comment
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-center text-slate-400 py-4 italic">No comments yet. Be the first to speak!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                      {comment.user?.name ? comment.user.name.charAt(0) : '?'}
                    </div>
                    <span className="font-bold text-slate-900">{comment.user?.name || 'Anonymous'}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 leading-relaxed pl-11">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;