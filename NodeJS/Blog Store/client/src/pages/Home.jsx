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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Discover Articles</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex flex-1 sm:w-80">
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-r-md transition-colors font-medium">
              Search
            </button>
          </form>
          
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[150px]"
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
            <p className="text-gray-500 font-medium">Loading amazing content...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-center border border-red-100">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-500">No blogs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article key={blog._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
              {blog.coverImage ? (
                <img 
                  src={`http://localhost:5000${blog.coverImage}`} 
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 text-4xl">📝</span>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                  {blog.content}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{blog.author?.name || 'Unknown'}</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="text-rose-500">♥</span> {blog.likes?.length || 0}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;