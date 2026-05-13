import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../api/blogService';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    "Coding", "AI", "Psychology", "Gaming", "Food & Culture", "History", "Places", "Paranormal"
  ];

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await fetchBlogs(categoryFilter, searchTerm);
      setBlogs(data);
    } catch (err) {
      setError('System failure while fetching archive.');
    } finally {
      // Simulate slightly longer load for futuristic feel
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [categoryFilter, searchTerm]); 

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategorySelect = (cat) => {
    setCategoryFilter(cat);
  };

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Hero Section */}
      <section className="bg-slate-900 pt-48 pb-32 px-4 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8 animate-fade-in">
             <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] italic">The Future of Content</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] animate-fade-in">
            Digital Archive of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 italic">Universal Ideas</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto mb-12 animate-fade-in font-medium italic leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Where cutting-edge technology meets timeless storytelling. Explore the intersection of reality and imagination.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
             <button className="px-10 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-2xl shadow-white/5 active:scale-95 uppercase tracking-widest text-xs">Explore Trends</button>
             <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest text-xs">Join Archive</button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-32">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Feed Area */}
          <div className="lg:w-2/3 space-y-12">
            {/* Header / Filter Status */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white/50 backdrop-blur-xl p-10 rounded-[48px] border border-white shadow-2xl shadow-slate-200/50">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 block">System Stream</span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                  {categoryFilter ? `Catalog: ${categoryFilter}` : searchTerm ? `Search: ${searchTerm}` : 'Master Feed'}
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort: Latest First</span>
                 {categoryFilter && (
                   <button 
                     onClick={() => setCategoryFilter('')}
                     className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-90"
                   >
                     Reset Catalog
                   </button>
                 )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-[48px] p-6 shadow-xl border border-slate-100 animate-pulse">
                    <div className="h-64 bg-slate-100 rounded-[32px] mb-6"></div>
                    <div className="h-8 bg-slate-100 rounded-full w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-full mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 text-rose-600 p-12 rounded-[48px] text-center border border-rose-100 font-black italic text-xl shadow-2xl">{error}</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[64px] shadow-2xl border border-slate-100">
                <div className="text-8xl mb-8 animate-bounce">📡</div>
                <p className="text-3xl font-black text-slate-900 italic tracking-tighter mb-4">Frequency Silent</p>
                <p className="text-slate-400 font-medium max-w-xs mx-auto">We couldn't locate any records matching your specific coordinates.</p>
                <button onClick={() => {setCategoryFilter(''); setSearchTerm('');}} className="mt-8 text-blue-600 font-black uppercase tracking-widest text-xs hover:underline">Reset Search</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {blogs.map((blog, index) => (
                  <article 
                    key={blog._id} 
                    className="group bg-white rounded-[48px] shadow-xl hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-700 border border-slate-100 overflow-hidden flex flex-col animate-fade-in relative"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden h-72">
                      {blog.coverImage ? (
                        <img 
                          src={`http://localhost:5000/uploads/${blog.coverImage}`} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <span className="text-slate-200 text-9xl font-black italic opacity-50 uppercase tracking-tighter -rotate-12">BLOG</span>
                        </div>
                      )}
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                          {blog.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-10 flex flex-col flex-grow relative">
                      <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors tracking-tighter italic">
                        <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                      </h2>
                      
                      <p className="text-slate-500 mb-8 line-clamp-2 text-base leading-relaxed flex-grow italic font-medium">
                        {blog.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                          {blog.author?.profilePicture ? (
                            <img 
                              src={`http://localhost:5000/uploads/${blog.author.profilePicture}`} 
                              alt={blog.author.name}
                              className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-xl">
                              {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div>
                             <p className="text-sm font-black text-slate-900 italic tracking-tighter">{blog.author?.name || 'Anonymous'}</p>
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{new Date(blog.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                           <span className="text-lg">→</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Futuristic Sidebar */}
          <div className="lg:w-1/3">
            <Sidebar 
              categories={categories} 
              onSearch={handleSearch} 
              onCategorySelect={handleCategorySelect} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;