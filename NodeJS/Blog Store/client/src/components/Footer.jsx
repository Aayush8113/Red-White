import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl italic">B</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-white">Blog<span className="text-blue-400">Store</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 italic">
              Empowering creators and storytellers through a premium digital journal experience. Discover, create, and share your unique perspectives with the world.
            </p>
            <div className="flex gap-4">
               {['tw', 'fb', 'ig', 'li'].map(s => (
                 <button key={s} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                   <span className="text-[10px] font-black uppercase">{s}</span>
                 </button>
               ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs italic">Explore</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Latest Stories</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Popular Articles</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Categories</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Authors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs italic">Resources</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Newsletter</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Community Guidelines</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs italic">Call to Action</h4>
            <p className="text-sm mb-6 italic font-medium">Ready to share your story with a global audience?</p>
            <Link to="/create" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-blue-900/20 active:scale-95">
              Start Writing
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} BlogStore. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="text-slate-600">Designed with Passion</span>
            <span className="text-slate-600">Built for Creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
