import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-24 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/20">
                <span className="text-white font-black text-2xl italic">B</span>
              </div>
              <span className="font-black text-3xl tracking-tighter text-white italic">Blog<span className="text-blue-500">Store</span></span>
            </Link>
            <p className="text-lg leading-relaxed italic font-medium">
              Revolutionizing digital storytelling through cutting-edge design and seamless user experiences.
            </p>
            <div className="flex gap-4">
               {['X', 'FB', 'IG', 'LI'].map(s => (
                 <button key={s} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
                   <span className="text-xs font-black uppercase tracking-widest">{s}</span>
                 </button>
               ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[10px] italic">Navigation</h4>
            <ul className="space-y-5 text-sm font-black uppercase tracking-widest">
              <li><Link to="/" className="hover:text-blue-400 transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Discover</Link></li>
              <li><Link to="/create" className="hover:text-blue-400 transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Write Story</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-blue-400 transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> My Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[10px] italic">Company</h4>
            <ul className="space-y-5 text-sm font-black uppercase tracking-widest">
              <li><Link to="/" className="hover:text-blue-400 transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> About Us</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Careers</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Terms</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-all flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span> Privacy</Link></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
            <h4 className="text-white font-black mb-4 uppercase tracking-[0.3em] text-[10px] italic">Join the Elite</h4>
            <p className="text-sm mb-6 italic font-medium leading-relaxed">Subscribe to receive curated masterpieces directly in your inbox.</p>
            <form className="space-y-3">
               <input type="email" placeholder="Email Address" className="w-full px-5 py-4 bg-slate-800 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none" />
               <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/40 text-xs uppercase tracking-widest">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            &copy; {new Date().getFullYear()} BLOGSTORE ARCHIVE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">VERSION 2.0.4</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">EST. 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
