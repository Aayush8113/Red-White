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
      setTimeout(() => setLoading(false), 800);
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
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-48 pb-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-10 animate-fade-in">
             <span className="text-blue-400 text-[11px] font-black uppercase tracking-[0.6em] italic">Neural Network Active</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.85] animate-fade-in italic">
            Digital <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Chronicle</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-3xl max-w-4xl mx-auto mb-16 animate-fade-in font-medium italic leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Decoding the complexity of the modern world through automated intelligence and human creativity.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
             <button className="px-12 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 active:scale-95 uppercase tracking-[0.2em] text-[11px] italic">Initialize Access</button>
             <button className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-3xl hover:bg-white/10 transition-all active:scale-95 uppercase tracking-[0.2em] text-[11px] italic">Read Manifest</button>
          </div>
        </div>
      </section>

      {/* Top Category Navigation */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-[30]">
        <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white/20 flex items-center gap-4 overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setCategoryFilter('')}
             className={`shrink-0 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] italic transition-all ${
               categoryFilter === '' 
                ? 'bg-slate-900 text-white shadow-xl' 
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'
             }`}
           >
             All Streams
           </button>
           <div className="h-8 w-px bg-slate-100 shrink-0"></div>
           {categories.map((cat) => (
             <button 
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`shrink-0 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] italic transition-all ${
                  categoryFilter === cat 
                   ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' 
                   : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600'
                }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20 pb-40">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Feed Area */}
          <div className="lg:w-2/3 space-y-16">
            {/* Status Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white p-12 rounded-[56px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Live Stream</span>
                </div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">
                  {categoryFilter ? categoryFilter : searchTerm ? `Search: ${searchTerm}` : 'Deep Archive'}
                </h2>
              </div>
              
              <div className="flex items-center gap-6">
                 {categoryFilter && (
                   <button 
                     onClick={() => setCategoryFilter('')}
                     className="px-8 py-4 bg-slate-900 text-white text-[11px] font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-90 italic"
                   >
                     Reset Protocol
                   </button>
                 )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-[56px] p-8 shadow-xl border border-slate-50 animate-pulse">
                    <div className="h-72 bg-slate-100 rounded-[40px] mb-8"></div>
                    <div className="h-10 bg-slate-100 rounded-full w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-full mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 text-rose-600 p-16 rounded-[56px] text-center border border-rose-100 font-black italic text-2xl shadow-2xl">
                ⚠️ {error}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-40 bg-white rounded-[64px] shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02),transparent)]"></div>
                <div className="text-9xl mb-10 animate-pulse opacity-20">🤖</div>
                <p className="text-4xl font-black text-slate-900 italic tracking-tighter mb-6">No Records Found</p>
                <p className="text-slate-400 font-medium max-w-sm mx-auto text-lg leading-relaxed">The archive is currently empty for these parameters. AI suggests refining your search vector.</p>
                <button onClick={() => {setCategoryFilter(''); setSearchTerm('');}} className="mt-12 px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-blue-600 transition-all">Clear Search Vectors</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {blogs.map((blog, index) => (
                  <article 
                    key={blog._id} 
                    className="group bg-white rounded-[56px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] hover:shadow-[0_48px_96px_-24px_rgba(59,130,246,0.12)] transition-all duration-700 border border-slate-100 overflow-hidden flex flex-col animate-fade-in relative"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="relative overflow-hidden h-80">
                      {blog.coverImage ? (
                        <img 
                          src={blog.coverImage.startsWith('http') ? blog.coverImage : `http://localhost:5000/uploads/${blog.coverImage}`} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                        />

                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                          <span className="text-white/5 text-[12rem] font-black italic -rotate-12 select-none tracking-tighter">DATA</span>
                        </div>
                      )}
                      <div className="absolute top-8 left-8 flex gap-3">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.25em] px-5 py-2 rounded-2xl border border-white/10 shadow-xl">
                          {blog.category}
                        </span>
                        <div className="bg-blue-600 h-2 w-2 rounded-full absolute -top-1 -right-1 animate-ping"></div>
                      </div>
                    </div>
                    
                    <div className="p-12 flex flex-col flex-grow relative">
                      <div className="flex items-center gap-3 mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
                         <span className="h-px w-8 bg-slate-300"></span>
                         <span className="text-[10px] font-black uppercase tracking-widest italic">Entry 00{index + 1}</span>
                      </div>
                      
                      <h2 className="text-3xl font-black text-slate-900 mb-6 leading-[1.1] group-hover:text-blue-600 transition-colors tracking-tighter italic">
                        <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                      </h2>
                      
                      <p className="text-slate-500 mb-10 line-clamp-2 text-lg leading-relaxed flex-grow italic font-medium">
                        {blog.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-10 border-t border-slate-50">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            {blog.author?.profilePicture ? (
                              <img 
                                src={`http://localhost:5000/uploads/${blog.author.profilePicture}`} 
                                alt={blog.author.name}
                                className="h-14 w-14 rounded-[20px] object-cover border-4 border-white shadow-xl"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-[20px] bg-slate-900 text-white flex items-center justify-center text-xl font-black shadow-xl">
                                {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                             <p className="text-lg font-black text-slate-900 italic tracking-tighter">{blog.author?.name || 'Anonymous'}</p>
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-0.5">{new Date(blog.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-45 transition-all duration-500 shadow-sm">
                           <span className="text-2xl">→</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* AI-Powered Sidebar */}
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