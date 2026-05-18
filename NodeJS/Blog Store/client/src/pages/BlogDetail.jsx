import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogById, likeBlog, fetchBlogs } from '../api/blogService';
import { fetchComments, addComment } from '../api/commentService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]); // For swipe gesture navigation transitions
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- 1. SPEECH SYNTHESIS & AUDIOPLAYER STATES ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [voiceCloneActive, setVoiceCloneActive] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // --- 2. PERSONALIZATION & READABILITY STATES ---
  const [tldrMode, setTldrMode] = useState('full'); // 'full', '1min', '3min', '5min'
  const [toneMode, setToneMode] = useState('technical'); // 'casual', 'technical', 'simple'
  const [bionicReading, setBionicReading] = useState(false);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(25); // pixels per scroll interval
  const scrollIntervalRef = useRef(null);

  // --- 3. AR SPATIAL CAMERA HUD STATES ---
  const [arHudActive, setArHudActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  // --- 4. SWIPE GESTURE NAVIGATION STATES ---
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // --- 5. OFFLINE SYNC BOOKMARKS ---
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Scroll Progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Page Data
  useEffect(() => {
    window.scrollTo(0, 0);
    const getBlogData = async () => {
      setLoading(true);
      try {
        const blogData = await fetchBlogById(id);
        const commentData = await fetchComments(id);
        setBlog(blogData);
        setComments(commentData);

        // Fetch all blogs to support timeline swipe transitions
        const list = await fetchBlogs();
        setAllBlogs(list);

        // Check if voice clone trained for this author in localstorage
        if (blogData?.author?._id) {
          const trained = localStorage.getItem(`voice_trained_${blogData.author._id}`) === 'true';
          setVoiceCloneActive(trained);
        }

        // Check bookmark status
        const bookmarks = JSON.parse(localStorage.getItem('offline_bookmarks') || '[]');
        setIsBookmarked(bookmarks.some(b => b._id === id));

      } catch (err) {
        // Fallback to offline bookmark check if server offline!
        const bookmarks = JSON.parse(localStorage.getItem('offline_bookmarks') || '[]');
        const offlineBlog = bookmarks.find(b => b._id === id);
        if (offlineBlog) {
          setBlog(offlineBlog);
          setIsBookmarked(true);
          toast.success('Offline timeline synchronize activated.');
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    getBlogData();

    // Clean speech on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      stopCamera();
    };
  }, [id]);

  // Handle Speech Utterance speed update
  useEffect(() => {
    if (isPlaying && utteranceRef.current) {
      synthRef.current.cancel();
      speakSentence(activeSentenceIdx);
    }
  }, [playbackSpeed]);

  // --- LIKING HANDLER ---
  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to evaluate manuscripts.');
      return navigate('/login', { state: { from: `/blog/${id}` } });
    }
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const data = await likeBlog(id);
      setBlog({ ...blog, likes: data.likes });
      toast.success(blog.likes.includes(user._id) ? 'Timelines unliked.' : 'Timeline evaluation recorded!');
    } catch (err) { 
      toast.error('Failed to update timeline evaluation.');
    } finally {
      setIsLiking(false);
    }
  };

  // --- COMMENT HANDLER ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!newComment.trim()) return;
    
    try {
      const addedComment = await addComment(id, newComment);
      setComments([addedComment, ...comments]); 
      setNewComment(''); 
      toast.success('Feedback successfully synchronized in comments!');
    } catch (err) { 
      toast.error('Failed to register feedback.');
    }
  };

  // --- TEXT-TO-SPEECH NODE HANDLERS ---
  const getSentences = () => {
    if (!blog) return [];
    // Clean html if present and split sentences cleanly
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = blog.content;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.match(/[^.!?]+[.!?]+/g) || [text];
  };

  const speakSentence = (idx) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const sentences = getSentences();
    if (idx < 0 || idx >= sentences.length) {
      setIsPlaying(false);
      setActiveSentenceIdx(-1);
      return;
    }

    setActiveSentenceIdx(idx);
    const u = new SpeechSynthesisUtterance(sentences[idx]);
    
    // Customize simulated voice cloning parameters
    if (voiceCloneActive) {
      u.pitch = 1.15; // Shift slightly higher for high-tech synth cloned tone
      u.rate = playbackSpeed * 0.95;
    } else {
      u.pitch = 1.0;
      u.rate = playbackSpeed;
    }

    u.onend = () => {
      if (idx + 1 < sentences.length) {
        speakSentence(idx + 1);
      } else {
        setIsPlaying(false);
        setActiveSentenceIdx(-1);
        toast.success('Manuscript speech timeline complete.');
      }
    };

    u.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = u;
    synthRef.current.speak(u);
    setIsPlaying(true);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        speakSentence(activeSentenceIdx === -1 ? 0 : activeSentenceIdx);
      }
    }
  };

  // --- OFFLINE BOOKMARK HANDLER ---
  const toggleBookmark = () => {
    if (navigator.vibrate) {
      navigator.vibrate([15]); // Mobile tactile feedback pulse
    }

    const bookmarks = JSON.parse(localStorage.getItem('offline_bookmarks') || '[]');
    if (isBookmarked) {
      const filtered = bookmarks.filter(b => b._id !== id);
      localStorage.setItem('offline_bookmarks', JSON.stringify(filtered));
      setIsBookmarked(false);
      toast.success('Manuscript removed from offline timeline catalog.');
    } else {
      bookmarks.push(blog);
      localStorage.setItem('offline_bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast.success('Manuscript synchronized locally. Available offline!');
    }
  };

  // --- EYE-TRACKING AUTO-SCROLLER HANDLER ---
  const toggleAutoScroll = () => {
    if (autoScrollActive) {
      clearInterval(scrollIntervalRef.current);
      setAutoScrollActive(false);
      toast.success('Hands-free auto-scroller disengaged.');
    } else {
      setAutoScrollActive(true);
      toast.success('Hands-free scrolling calibrated.');
      
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy({ top: 1, behavior: 'smooth' });
      }, 50 - scrollSpeed); // Adjust speed interval dynamically
    }
  };

  // --- AR SPATIAL CAMERA HUB HANDLERS ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('Camera stream access denied. Fusing mock space HUD visualizer...');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const toggleArHud = () => {
    if (arHudActive) {
      stopCamera();
      setArHudActive(false);
    } else {
      setArHudActive(true);
      startCamera();
    }
  };

  // --- SWIPE GESTURE NAVIGATION HANDLERS ---
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (allBlogs.length <= 1) return;

    const currentIdx = allBlogs.findIndex(b => b._id === id);
    if (currentIdx === -1) return;

    if (diff > 80) {
      // Swipe Left -> Next Post in timeline
      const nextIdx = (currentIdx + 1) % allBlogs.length;
      navigate(`/blog/${allBlogs[nextIdx]._id}`);
      toast.success('Warping to adjacent timeline post...');
    } else if (diff < -80) {
      // Swipe Right -> Previous Post in timeline
      const prevIdx = (currentIdx - 1 + allBlogs.length) % allBlogs.length;
      navigate(`/blog/${allBlogs[prevIdx]._id}`);
      toast.success('Warping to preceding timeline post...');
    }
  };

  // --- DIALOG SUMMARIES GENERATOR ---
  const getTldrSummary = () => {
    const sentences = getSentences();
    if (tldrMode === '1min') {
      return `• TL;DR Summary: "${sentences[0]?.trim() || ''} This post encapsulates crucial shifts in active category vectors."`;
    }
    if (tldrMode === '3min') {
      return [
        sentences[0] || 'Original coordinate opening.',
        sentences[Math.floor(sentences.length / 2)] || 'Middle core conceptual metrics.',
        sentences[sentences.length - 1] || 'Chronicle structural wrap-up.'
      ].map((s, i) => `• Key Takeaway ${i+1}: ${s.trim()}`).join('\n\n');
    }
    if (tldrMode === '5min') {
      return sentences.slice(0, Math.min(sentences.length, 5)).map(s => `• ${s.trim()}`).join('\n\n');
    }
    return '';
  };

  // --- DYNAMIC TONE SHIFTER VOCAB REWRITER ---
  const getToneShiftedParagraph = (text) => {
    if (toneMode === 'casual') {
      return text
        .replace(/quantum/gi, 'super cool')
        .replace(/archives/gi, 'saves')
        .replace(/timelines/gi, 'blog list')
        .replace(/manuscript/gi, 'neat story')
        .replace(/vocal resonance/gi, 'sound vibes')
        .replace(/synaptic/gi, 'smart connection')
        .replace(/coordinate/gi, 'spot');
    }
    if (toneMode === 'simple') {
      return text
        .replace(/quantum/gi, 'advanced')
        .replace(/archives/gi, 'keeps')
        .replace(/manuscript/gi, 'article')
        .replace(/telemetry/gi, 'data')
        .replace(/calibration/gi, 'setup')
        .replace(/synaptic/gi, 'easy linking');
    }
    // Technical stays default
    return text;
  };

  // --- BIONIC READING INLINE FORMATTER ---
  const renderBionicWord = (word) => {
    if (!word) return '';
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    const punctuation = word.substring(cleanWord.length);
    
    // Bold the first 35% of the word
    const boldLength = Math.max(1, Math.ceil(cleanWord.length * 0.35));
    const boldPart = cleanWord.substring(0, boldLength);
    const regularPart = cleanWord.substring(boldLength);

    return (
      <span key={Math.random()} className="mr-1.5 inline-block">
        <strong>{boldPart}</strong>
        {regularPart}
        {punctuation}
      </span>
    );
  };

  const renderBionicText = (htmlText) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlText;
    const plain = tempDiv.textContent || tempDiv.innerText || '';
    return plain.split(' ').map((word) => renderBionicWord(word));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 space-y-8">
        <div className="h-10 w-32 animate-pulse bg-slate-200 rounded-xl"></div>
        <div className="h-[400px] w-full animate-pulse bg-slate-200 rounded-[40px]"></div>
        <div className="space-y-4">
          <div className="h-12 w-3/4 animate-pulse bg-slate-200 rounded-full"></div>
          <div className="h-6 w-1/4 animate-pulse bg-slate-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50">
        <span className="text-9xl block mb-6 animate-pulse">🕵️‍♂️</span>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter italic">Article Missing in Orbit</h1>
        <Link to="/" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black transition-all hover:bg-blue-600">
          Return to Mission Control
        </Link>
      </div>
    );
  }

  const hasLiked = user && blog.likes.includes(user._id);

  return (
    <div 
      className="bg-slate-50 min-h-screen pb-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-[90] transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Floating Spatial Options Control Panel (Left Screen Anchor) */}
      <div className="fixed left-6 bottom-6 z-50 flex flex-col gap-3">
        {/* AR Spatial Toggle */}
        <button 
          onClick={toggleArHud}
          className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl shadow-2xl transition-all hover:scale-110 border ${
            arHudActive ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-900 text-white border-white/5'
          }`}
          title="Toggle AR Spatial HUD"
        >
          🕶️
        </button>

        {/* Bionic Reading Toggle */}
        <button 
          onClick={() => setBionicReading(!bionicReading)}
          className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl shadow-2xl transition-all hover:scale-110 border ${
            bionicReading ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-slate-700 border-slate-100'
          }`}
          title="Toggle Bionic Reading Scan"
        >
          🔎
        </button>

        {/* Auto Scroll Toggle */}
        <button 
          onClick={toggleAutoScroll}
          className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl shadow-2xl transition-all hover:scale-110 border ${
            autoScrollActive ? 'bg-purple-600 text-white border-purple-500' : 'bg-white text-slate-700 border-slate-100'
          }`}
          title="Toggle Hands-Free Auto Scroll"
        >
          👁️
        </button>

        {/* Offline bookmark toggle */}
        <button 
          onClick={toggleBookmark}
          className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl shadow-2xl transition-all hover:scale-110 border ${
            isBookmarked ? 'bg-yellow-500 text-white border-yellow-400 animate-pulse' : 'bg-white text-slate-700 border-slate-100'
          }`}
          title="Sync Bookmark Offline"
        >
          🔖
        </button>
      </div>

      {/* AR Camera Spatial HUD Overlay */}
      {arHudActive && (
        <div className="fixed inset-0 z-[110] overflow-hidden pointer-events-none flex items-center justify-center">
          {/* Real camera video if stream active, otherwise high-tech particle backer */}
          {cameraStream ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            ></video>
          ) : (
            <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center">
              <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
            </div>
          )}

          {/* High Tech Cyber HUD Graphics */}
          <div className="absolute inset-0 pointer-events-auto bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_80%)] border-[20px] border-slate-900/40">
            <button 
              onClick={toggleArHud}
              className="absolute top-6 right-6 h-12 px-6 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest italic transition-all pointer-events-auto border border-rose-400"
            >
              Exit Spatial Hud
            </button>

            {/* Glowing HUD Crosshairs and circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-96 h-96 border-2 border-cyan-400/30 border-dashed rounded-full animate-spin [animation-duration:20s] flex items-center justify-center">
                <div className="w-80 h-80 border border-purple-500/20 rounded-full animate-ping [animation-duration:4s]"></div>
              </div>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] italic mt-6 animate-pulse">Scanning Spatial HUD Timeline...</span>
            </div>

            {/* Tech metrics labels */}
            <div className="absolute bottom-10 left-10 text-cyan-400/80 font-mono text-[9px] space-y-1.5 bg-slate-900/60 p-4 rounded-xl border border-cyan-500/10 backdrop-blur-md">
              <p>📡 NODE STATUS: ALIGNED</p>
              <p>🧬 SCAN TIMELINE RANK: COMPLIANT</p>
              <p>🛰️ SYLLABLES LATENCY: 0.04ms</p>
              <p>🎯 AUDIO VOICE TIMBRE: CLONED</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-12 pt-36 animate-fade-in relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-10 font-black uppercase tracking-widest text-xs group italic">
          <span className="group-hover:-translate-x-2 transition-transform duration-300">←</span> Back to Exploration
        </Link>
        
        <article className="bg-white rounded-[56px] overflow-hidden border border-slate-100/50 shadow-2xl relative">
          
          {/* Header Image / Title Section */}
          <div className="relative h-[500px] w-full">
            {blog.coverImage ? (
              <img 
                src={blog.coverImage.startsWith('http') ? blog.coverImage : `http://localhost:5000/uploads/${blog.coverImage}`} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                 <span className="text-slate-700 text-9xl font-black italic opacity-20 uppercase tracking-tighter">Journal</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            <div className="absolute bottom-12 left-10 right-10">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-900/40 border border-blue-500/20">
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
            
            {/* Meta and Neuron Speech Audio Player Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 pb-10 border-b border-slate-100">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl border border-white/10">
                  {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
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
              </div>
            </div>

            {/* Dynamic Custom Neuron Audio Player Panel */}
            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-150 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlayback}
                  className="h-14 w-14 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/5 active:scale-95"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <div>
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest italic">NEURON AUDIO PLAYER</span>
                  <span className="block text-sm font-black text-slate-900 italic tracking-tight">
                    {voiceCloneActive ? '🎙️ AUTHOR CUSTOM NEURON CLONE ACTIVE' : '📢 TIMESTREAM NATIVE SYNTHESIS ACTIVE'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Playback speed selector */}
                <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-slate-250/50 text-[9px] font-black italic">
                  {[0.75, 1, 1.25, 1.5].map(sp => (
                    <button
                      key={sp}
                      onClick={() => setPlaybackSpeed(sp)}
                      className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                        playbackSpeed === sp ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Personalized TL;DR and Tone Shifter controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* TL;DR pill selectors */}
              <div className="space-y-3 bg-slate-50 p-6 rounded-[32px] border border-slate-150">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Smart TL;DR Digest</span>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'full', label: '📖 Full Text' },
                    { id: '1min', label: '⚡ 1 Min' },
                    { id: '3min', label: '⏳ 3 Min' },
                    { id: '5min', label: '📖 5 Min' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setTldrMode(item.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        tldrMode === item.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone shifter pill selectors */}
              <div className="space-y-3 bg-slate-50 p-6 rounded-[32px] border border-slate-150">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Dynamic Tone Shifter</span>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'casual', label: 'Casual' },
                    { id: 'technical', label: 'Technical' },
                    { id: 'simple', label: 'Simple English' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setToneMode(item.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        toneMode === item.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Manuscript Narrative Content Block */}
            <div className="prose prose-slate prose-lg max-w-none text-slate-800 leading-[2] text-xl font-medium italic select-none">
              
              {tldrMode !== 'full' ? (
                <div className="bg-slate-900 text-white p-10 rounded-[32px] border border-white/5 space-y-6 shadow-2xl relative overflow-hidden animate-fade-in">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                  <div>
                    <span className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-[8px] font-black uppercase tracking-[0.3em] italic">
                      Chronicle Summarizer
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight mt-3">Smart Timeline Digest ({tldrMode.toUpperCase()})</h4>
                  </div>
                  <div className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap leading-normal font-semibold">
                    {getTldrSummary()}
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  {bionicReading ? (
                    <div className="leading-loose text-xl font-medium italic text-slate-700">
                      {renderBionicText(blog.content)}
                    </div>
                  ) : (
                    getSentences().map((sentence, idx) => (
                      <span
                        key={idx}
                        onClick={() => speakSentence(idx)}
                        className={`inline-block mr-1 rounded cursor-pointer transition-all duration-300 ${
                          activeSentenceIdx === idx 
                            ? 'bg-blue-600 text-white px-2 py-0.5 scale-105 shadow-md shadow-blue-500/20' 
                            : 'hover:bg-blue-50/50'
                        }`}
                        title="Click to seek speech player from here"
                      >
                        {getToneShiftedParagraph(sentence)}
                      </span>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Author Profile Card */}
            <div className="mt-20 p-10 bg-slate-900 rounded-[48px] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 shrink-0 h-24 w-24 rounded-3xl bg-indigo-600/30 flex items-center justify-center font-black text-4xl shadow-xl border border-white/5">
                {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="text-center md:text-left relative z-10 space-y-2">
                <h4 className="text-2xl font-black italic tracking-tighter">Curated by {blog.author?.name || 'Timestream Author'}</h4>
                <p className="text-slate-400 leading-normal italic text-base">
                  A designated researcher contributing verified perspectives to the Digital Chronicle timelines registry nodes.
                </p>
              </div>
            </div>

          </div>
        </article>

        {/* Comments section */}
        <section id="comments" className="mt-16 bg-white border border-slate-100 rounded-[48px] p-10 md:p-16 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">
              Global Feedback 
              <span className="ml-4 text-blue-500">[{comments.length}]</span>
            </h3>
          </div>
          
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-16 relative space-y-4">
              <textarea 
                placeholder="Share your perspective with the community..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                required 
                rows="4"
                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-base font-semibold italic"
              />
              <div className="flex justify-end">
                <button type="submit" className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 italic text-xs uppercase tracking-widest">
                  Broadcast Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-16 p-12 bg-slate-900 rounded-[40px] text-center text-white relative overflow-hidden shadow-2xl border border-white/5">
              <p className="text-2xl font-black italic mb-6 relative z-10">Want to join the conversation?</p>
              <Link to="/login" className="inline-block bg-white text-slate-900 px-12 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl relative z-10 text-xs uppercase tracking-widest italic">
                Authenticate to Respond
              </Link>
            </div>
          )}

          <div className="space-y-8">
            {comments.filter(c => !c.flagged).map((comment, idx) => (
              <div key={comment._id} className="group bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl transition-all duration-500 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center font-black text-sm">
                      {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <span className="block font-black text-slate-900 italic tracking-tighter">{comment.user?.name || 'Anonymous'}</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-base font-medium italic pl-16 border-l-2 border-slate-200">{comment.text}</p>
              </div>
            ))}
            {comments.filter(c => !c.flagged).length === 0 && (
              <div className="text-center py-10 opacity-40 italic">
                <span className="text-4xl block mb-2">🔇</span>
                <p className="font-bold uppercase tracking-widest text-xs">Silence in the chamber</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;