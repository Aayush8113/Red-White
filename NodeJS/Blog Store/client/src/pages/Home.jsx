import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../api/blogService';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogs(categoryFilter, searchTerm);
      setBlogs(data);
    } catch (err) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [categoryFilter]); 

  const handleSearch = (e) => {
    e.preventDefault();
    loadBlogs();
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight animate-fade-in">
            Explore the World of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Brilliant Ideas</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Discover expert-written articles on technology, artificial intelligence, culture, and more.
          </p>

          <div className="max-w-3xl mx-auto glass-card p-2 rounded-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="flex-grow relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search articles by title or keyword..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-xl focus:ring-0 outline-none text-slate-900"
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Discover Articles</h2>
            <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-2"></div>
          </div>
          
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Filter by:</span>
             <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-full font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-slate-300 transition-all shadow-sm"
              >
                <option value="">All Topics</option>
                <option value="Coding">Coding</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Psychology">Psychology</option>
                <option value="Gaming">Gaming</option>
                <option value="Food">Food & Culture</option>
                <option value="History">History</option>
                <option value="Historical Places">Places</option>
                <option value="Ghost">Paranormal</option>
              </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm animate-pulse">
                <div className="h-48 bg-slate-100 rounded-2xl mb-4"></div>
                <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded-full w-full mb-2"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-600 p-8 rounded-2xl text-center border border-rose-100 font-bold">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] shadow-sm border border-slate-100">
            <span className="text-6xl mb-4 block">🏜️</span>
            <p className="text-2xl font-black text-slate-900">No matching articles found.</p>
            <p className="text-slate-400 mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, index) => (
              <article 
                key={blog._id} 
                className="group bg-white rounded-[32px] shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative overflow-hidden h-60">
                  {blog.coverImage ? (
                    <img 
                      src={`http://localhost:5000/uploads/${blog.coverImage}`} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-6xl group-hover:scale-125 transition-transform duration-500">📄</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                  </h2>
                  
                  <p className="text-slate-500 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                    {blog.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-lg">
                        {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">{blog.author?.name || 'Anonymous'}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-black">
                      <span>❤️</span> {blog.likes?.length || 0}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;