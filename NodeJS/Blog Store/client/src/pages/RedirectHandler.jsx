import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resolveRedirect } from '../api/blogService';
import { toast } from 'react-hot-toast';

const RedirectHandler = () => {
  const [checking, setChecking] = useState(true);
  const [warping, setWarping] = useState(false);
  const [newPath, setNewPath] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkRedirect = async () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '') {
        setChecking(false);
        return;
      }

      try {
        const redirect = await resolveRedirect(currentPath);
        if (redirect && redirect.newPath) {
          setWarping(true);
          setNewPath(redirect.newPath);
          toast.success('Rerouting legacy connection through warp node...');
          
          // Delay for a beautiful warp transition experience
          setTimeout(() => {
            navigate(redirect.newPath);
          }, 2500);
        } else {
          setChecking(false);
        }
      } catch (err) {
        // Any error means no redirect was resolved
        setChecking(false);
      }
    };

    checkRedirect();
  }, [navigate]);

  if (warping) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_80%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Glowing vortex */}
        <div className="relative w-80 h-80 mb-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 animate-spin opacity-40 blur-[40px]"></div>
          <div className="absolute w-64 h-64 border-4 border-dashed border-blue-500/30 rounded-full animate-spin [animation-duration:15s]"></div>
          <div className="absolute w-48 h-48 border-2 border-indigo-400/50 rounded-full animate-ping [animation-duration:3s]"></div>
          <div className="relative text-7xl animate-bounce">🌀</div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <span className="px-6 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] italic animate-pulse">
            Spatial Distortion Detected
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
            Warp Link Activated
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
            Connecting legacy path <code className="text-blue-400 bg-white/5 px-2 py-1 rounded border border-white/5 font-mono text-sm not-italic">{window.location.pathname}</code> with new digital chronicle coordinates...
          </p>
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Scanning Space Coordinates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
      
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20"></div>
        <span className="text-9xl block mb-6 animate-pulse relative z-10">🕵️‍♂️</span>
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
};

export default RedirectHandler;
