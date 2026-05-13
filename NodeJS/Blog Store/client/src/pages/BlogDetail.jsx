import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogById, likeBlog } from '../api/blogService';
import { fetchComments, addComment } from '../api/commentService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        setTimeout(() => setLoading(false), 800); // Slight delay for smooth feel
      }
    };
    getBlogData();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like');
      return navigate('/login', { state: { from: `/blog/${id}` } });
    }
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const data = await likeBlog(id);
      setBlog({ ...blog, likes: data.likes });
      toast.success(blog.likes.includes(user._id) ? 'Unliked post' : 'Liked post');
    } catch (err) { 
      toast.error('Failed to update like');
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
      toast.success('Comment posted!');
    } catch (err) { 
      toast.error('Failed to post comment');
    }
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const text = `Check out this amazing blog post: ${blog?.title}`;
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-8">
        <div className="h-10 w-32 animate-shimmer rounded-xl"></div>
        <div className="h-[400px] w-full animate-shimmer rounded-[40px]"></div>
        <div className="space-y-4">
          <div className="h-12 w-3/4 animate-shimmer rounded-full"></div>
          <div className="h-6 w-1/4 animate-shimmer rounded-full"></div>
        </div>
        <div className="space-y-4 pt-10">
          <div className="h-4 w-full animate-shimmer rounded-full"></div>
          <div className="h-4 w-full animate-shimmer rounded-full"></div>
          <div className="h-4 w-5/6 animate-shimmer rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20"></div>
          <span className="text-9xl block mb-6 animate-bounce relative z-10">🕵️‍♂️</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter italic">Article Missing in Orbit</h1>
        <p className="text-slate-500 text-xl max-w-md mx-auto mb-10 italic">
          The story you're looking for has either drifted into another dimension or was never written.
        </p>
        <Link 
          to="/" 
          className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black transition-all hover:bg-blue-600 active:scale-95 shadow-2xl shadow-slate-200"
        >
          Return to Mission Control
        </Link>
      </div>
    );
  }

  const hasLiked = user && blog.likes.includes(user._id);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-[60] transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-12 font-black uppercase tracking-widest text-xs group">
          <span className="group-hover:-translate-x-2 transition-transform duration-300">←</span> Back to Exploration
        </Link>
        
        <article className="futuristic-card rounded-[48px] overflow-hidden border border-white relative">
          {/* Header Image / Title Section */}
          <div className="relative h-[500px] w-full">
            {blog.coverImage ? (
              <img 
                src={`http://localhost:5000/uploads/${blog.coverImage}`} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                 <span className="text-slate-700 text-9xl font-black italic opacity-20 uppercase tracking-tighter">Journal</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-12 left-10 right-10">
              <div className="flex flex-wrap gap-3 mb-6">
                 <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-900/40">
                  {blog.category}
                </span>
                {blog.tags?.map((tag, idx) => (
                  <span key={idx} className="bg-white/10 backdrop-blur-md text-white/80 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter italic drop-shadow-2xl">
                {blog.title}
              </h1>
            </div>
          </div>

          <div className="p-10 md:p-16 relative">
            {/* Meta Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 pb-10 border-b border-slate-100">
              <div className="flex items-center gap-5">
                <div className="relative">
                  {blog.author?.profilePicture ? (
                    <img 
                      src={`http://localhost:5000/uploads/${blog.author.profilePicture}`} 
                      alt={blog.author.name}
                      className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white shadow-xl shadow-slate-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-slate-200">
                      {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-blue-500 border-4 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="font-black text-slate-900 text-xl italic tracking-tighter">{blog.author?.name || 'Ghost Writer'}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • 5 min read
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLike}
                  className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all duration-300 shadow-xl ${
                    hasLiked 
                      ? 'bg-rose-500 text-white shadow-rose-200' 
                      : 'bg-white text-slate-400 hover:text-rose-500 border border-slate-100 shadow-slate-100'
                  }`}
                >
                  <span className={`text-xl transform group-hover:scale-125 transition-transform ${hasLiked ? 'animate-bounce' : ''}`}>
                    {hasLiked ? '❤️' : '🤍'}
                  </span>
                  <span>{blog.likes.length}</span>
                </button>
                
                <a href="#comments" className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-500 hover:shadow-xl transition-all shadow-sm">
                   💬
                </a>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-[2] text-xl font-medium italic selection:bg-blue-100 selection:text-blue-900">
              {blog.content.split('\n').map((para, i) => (
                <p key={i} className="mb-10 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-blue-600 first-letter:italic">
                  {para}
                </p>
              ))}
            </div>

            {/* Author Card Section */}
            <div className="mt-20 p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]"></div>
              
              <div className="relative z-10 shrink-0">
                {blog.author?.profilePicture ? (
                  <img 
                    src={`http://localhost:5000/uploads/${blog.author.profilePicture}`} 
                    alt={blog.author.name}
                    className="h-32 w-32 rounded-[32px] object-cover border-4 border-white/10 shadow-2xl"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-[32px] bg-blue-600 text-white flex items-center justify-center font-black text-5xl shadow-2xl">
                    {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>

              <div className="text-center md:text-left relative z-10">
                <h4 className="text-2xl font-black mb-3 italic tracking-tighter">Curated by {blog.author?.name}</h4>
                <p className="text-slate-400 leading-relaxed italic text-lg mb-6">
                  {blog.author?.bio || "A visionary thinker exploring the intersection of reality and digital possibility. Dedicated to crafting stories that resonate in the modern age."}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                   <Link to={`/profile/${blog.author?._id}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-black transition-all border border-white/5">
                    View Portfolio
                   </Link>
                   <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-black transition-all shadow-lg shadow-blue-900/40">
                    Follow Author
                   </button>
                </div>
              </div>
            </div>

            {/* Sharing Bar */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-y border-slate-100">
               <span className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] italic">Transmit Story</span>
               <div className="flex gap-4">
                  <button onClick={() => shareOnSocial('twitter')} className="px-6 py-3 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-2xl font-black hover:bg-[#1DA1F2] hover:text-white transition-all flex items-center gap-2">
                    X
                  </button>
                  <button onClick={() => shareOnSocial('facebook')} className="px-6 py-3 bg-[#4267B2]/10 text-[#4267B2] rounded-2xl font-black hover:bg-[#4267B2] hover:text-white transition-all">
                    FB
                  </button>
                  <button onClick={() => shareOnSocial('linkedin')} className="px-6 py-3 bg-[#0077b5]/10 text-[#0077b5] rounded-2xl font-black hover:bg-[#0077b5] hover:text-white transition-all">
                    IN
                  </button>
               </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section id="comments" className="mt-16 futuristic-card rounded-[48px] p-10 md:p-16">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">
              Global Feedback 
              <span className="ml-4 text-blue-500">[{comments.length}]</span>
            </h3>
          </div>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-16 relative">
              <div className="gradient-border">
                <textarea 
                  placeholder="Share your perspective with the community..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  required 
                  className="w-full px-8 py-6 bg-white/50 border-none rounded-2xl focus:ring-0 outline-none transition-all min-h-[150px] resize-none text-lg font-medium italic"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-2xl active:scale-95 italic">
                  Broadcast Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-16 p-12 bg-blue-600 rounded-[40px] text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <p className="text-2xl font-black italic mb-6 relative z-10">Want to join the conversation?</p>
              <Link to="/login" className="inline-block bg-white text-blue-600 px-12 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl relative z-10">
                Authenticate to Respond
              </Link>
            </div>
          )}

          <div className="space-y-8">
            {comments.length === 0 ? (
              <div className="text-center py-10 opacity-40 italic">
                <span className="text-4xl block mb-2">🔇</span>
                <p className="font-bold uppercase tracking-widest text-xs">Silence in the chamber</p>
              </div>
            ) : (
              comments.map((comment, idx) => (
                <div key={comment._id} className="group bg-white p-8 rounded-[32px] border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      {comment.user?.profilePicture ? (
                        <img 
                          src={`http://localhost:5000/uploads/${comment.user.profilePicture}`} 
                          alt={comment.user.name}
                          className="h-12 w-12 rounded-xl object-cover border-2 border-slate-50 shadow-md"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-sm">
                          {comment.user?.name ? comment.user.name.charAt(0) : '?'}
                        </div>
                      )}
                      <div>
                        <span className="block font-black text-slate-900 italic tracking-tighter">{comment.user?.name || 'Anonymous'}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-slate-300 hover:text-blue-500">☝️</button>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg font-medium italic pl-16 border-l-2 border-slate-50">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;