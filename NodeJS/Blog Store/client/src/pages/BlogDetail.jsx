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

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const text = `Check out this amazing blog post: ${blog.title}`;
    let shareUrl = '';
    
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    }
    
    window.open(shareUrl, '_blank');
  };

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
              {blog.author?.profilePicture ? (
                <img 
                  src={`http://localhost:5000/uploads/${blog.author.profilePicture}`} 
                  alt={blog.author.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-slate-100"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                  {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
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
          
          <div className="prose prose-slate lg:prose-xl max-w-none text-slate-700 leading-relaxed space-y-6 text-lg mb-10">
            {blog.content.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Sharing */}
          <div className="flex items-center gap-4 py-8 border-t border-slate-50">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Share this:</span>
            <div className="flex gap-3">
              <button onClick={() => shareOnSocial('twitter')} className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
              <button onClick={() => shareOnSocial('facebook')} className="w-10 h-10 rounded-full bg-[#4267B2]/10 text-[#4267B2] flex items-center justify-center hover:bg-[#4267B2] hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button onClick={() => shareOnSocial('linkedin')} className="w-10 h-10 rounded-full bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </button>
            </div>
          </div>

          {/* Author Bio Section */}
          <div className="mt-10 p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-8">
            {blog.author?.profilePicture ? (
              <img 
                src={`http://localhost:5000/uploads/${blog.author.profilePicture}`} 
                alt={blog.author.name}
                className="h-24 w-24 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-lg">
                {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="text-center md:text-left">
              <h4 className="text-xl font-black text-slate-900 mb-2 italic">About the Author, {blog.author?.name}</h4>
              <p className="text-slate-500 leading-relaxed italic">
                {blog.author?.bio || "A passionate storyteller and dedicated explorer of ideas, sharing unique perspectives on life, technology, and everything in between."}
              </p>
              <div className="mt-4 flex justify-center md:justify-start gap-4">
                 <Link to={`/profile/${blog.author?._id}`} className="text-sm font-bold text-blue-600 hover:underline">View Profile</Link>
                 <span className="text-slate-300">|</span>
                 <button className="text-sm font-bold text-slate-400 cursor-not-allowed">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <section id="comments" className="mt-12 bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
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
                    {comment.user?.profilePicture ? (
                      <img 
                        src={`http://localhost:5000/uploads/${comment.user.profilePicture}`} 
                        alt={comment.user.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                        {comment.user?.name ? comment.user.name.charAt(0) : '?'}
                      </div>
                    )}
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