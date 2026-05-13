import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBlog, uploadImage } from '../api/blogService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[48px] shadow-2xl text-center border border-slate-100 max-w-md">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-3xl font-black italic tracking-tighter mb-4">Authentication Required</h2>
          <p className="text-slate-500 mb-8 font-medium">You need to be part of the collective to transmit your stories into the archive.</p>
          <Link to="/login" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all">Authenticate Now</Link>
        </div>
      </div>
    );
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const toastId = toast.loading('Uploading visual data...');
    try {
      const imagePath = await uploadImage(file);
      setCoverImage(imagePath);
      toast.success('Visual data synchronized', { id: toastId });
    } catch (err) {
      toast.error('Data transmission failed', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Registering entry in archive...');
    try {
      await createBlog({ title, category, content, coverImage });
      toast.success('Story archived successfully', { id: toastId });
      navigate('/'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to archive story', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-40 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-10 font-black uppercase tracking-[0.3em] text-[10px] italic group">
          <span className="group-hover:-translate-x-2 transition-transform">←</span> Back to Archive
        </Link>

        <div className="futuristic-card rounded-[56px] overflow-hidden border border-white">
          <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <h1 className="text-5xl font-black italic tracking-tighter relative z-10">New Manuscript</h1>
            <p className="text-slate-400 mt-2 font-medium italic relative z-10">Archive your unique perspective in the digital timeline.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            {/* Visual Header Upload */}
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                onChange={uploadFileHandler} 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
              />
              <div className={`w-full h-64 rounded-[40px] border-2 border-dashed transition-all flex flex-col items-center justify-center ${
                coverImage ? 'border-transparent' : 'border-slate-200 bg-slate-50 group-hover:border-blue-300 group-hover:bg-blue-50'
              }`}>
                {coverImage ? (
                  <img 
                    src={`http://localhost:5000/uploads/${coverImage}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-[38px] shadow-2xl" 
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl mb-4 block group-hover:scale-125 transition-transform">🖼️</span>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Transmit Cover Visual</p>
                    <p className="text-[10px] text-slate-300 mt-1 uppercase font-bold tracking-[0.2em] italic">Click to Select File</p>
                  </div>
                )}
                
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[40px] flex items-center justify-center z-10">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                       <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                       <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Title of Record</label>
                <div className="gradient-border">
                   <input 
                    type="text" placeholder="Quantum Mechanics..." value={title} onChange={(e) => setTitle(e.target.value)} required 
                    className="w-full px-8 py-4 bg-white/50 border-none rounded-2xl focus:ring-0 outline-none text-lg font-black italic tracking-tighter"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Category Vector</label>
                <div className="gradient-border">
                  <input 
                    type="text" placeholder="Science..." value={category} onChange={(e) => setCategory(e.target.value)} required 
                    className="w-full px-8 py-4 bg-white/50 border-none rounded-2xl focus:ring-0 outline-none text-lg font-black italic tracking-tighter"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Narrative Content</label>
              <div className="gradient-border">
                <textarea 
                  placeholder="The story begins in the year 2045..." value={content} onChange={(e) => setContent(e.target.value)} required rows="12"
                  className="w-full px-8 py-6 bg-white/50 border-none rounded-[32px] focus:ring-0 outline-none text-lg font-medium italic leading-relaxed resize-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={uploading} 
              className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl transition-all shadow-2xl shadow-slate-200 hover:bg-blue-600 active:scale-95 text-xs uppercase tracking-[0.4em] italic disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Archiving Protocol Initiate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;