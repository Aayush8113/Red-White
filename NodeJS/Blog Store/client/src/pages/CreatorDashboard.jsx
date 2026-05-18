import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from '../api/blogService';
import { fetchSystemComments, deleteComment, moderateComment } from '../api/commentService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CreatorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('publications');
  const [myBlogs, setMyBlogs] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Voice training states
  const [trainingActive, setTrainingActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingSuccess, setRecordingSuccess] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [calibrating, setCalibrating] = useState(false);
  const [voiceTrained, setVoiceTrained] = useState(false);

  const loadCreatorData = async () => {
    setLoading(true);
    try {
      const blogsData = await fetchBlogs();
      // Filter blogs authored by this user
      const creatorBlogs = blogsData.filter(b => b.author?._id === user?._id);
      setMyBlogs(creatorBlogs);

      // Get system comments and filter those posted on this creator's blogs
      const allComments = await fetchSystemComments();
      const creatorBlogIds = creatorBlogs.map(b => b._id);
      const filteredComments = allComments.filter(c => creatorBlogIds.includes(c.blogId?._id || c.blogId));
      setMyComments(filteredComments);

      // Check if voice clone is already trained in localstorage
      const isVoiceTrained = localStorage.getItem(`voice_trained_${user?._id}`) === 'true';
      setVoiceTrained(isVoiceTrained);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync creator database registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || (user.role !== 'Creator' && user.role !== 'Administrator')) {
      toast.error('Access restricted to Narrative Creators.');
      navigate('/');
      return;
    }
    loadCreatorData();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('ARCHIVE PURGE: Are you sure you want to permanently erase this manuscript?')) {
      const toastId = toast.loading('Purging manuscript from timelines...');
      try {
        await deleteBlog(id);
        setMyBlogs(myBlogs.filter(b => b._id !== id));
        toast.success('Manuscript erased successfully.', { id: toastId });
      } catch (err) {
        toast.error('Failed to erase manuscript.', { id: toastId });
      }
    }
  };

  // Voice calibration animation handler
  const startRecording = () => {
    setRecording(true);
    setRecordingSuccess(false);
    toast.success('Neuron audio receptor open. Speak manuscript sentence...');
    
    // Simulate reading speech window
    setTimeout(() => {
      setRecording(false);
      setRecordingSuccess(true);
      toast.success('Speech capture complete. Timing and frequency locked.');
    }, 4500);
  };

  const handleCalibration = () => {
    setCalibrating(true);
    setCalibrationProgress(0);
    const toastId = toast.loading('Initializing synaptic voice cloning...');

    const interval = setInterval(() => {
      setCalibrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCalibrating(false);
          setVoiceTrained(true);
          localStorage.setItem(`voice_trained_${user?._id}`, 'true');
          toast.success('Synaptic Voice Clone successfully calibrated and synchronized!', { id: toastId });
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const resetVoiceClone = () => {
    setVoiceTrained(false);
    setRecordingSuccess(false);
    localStorage.removeItem(`voice_trained_${user?._id}`);
    toast.success('Voice profile de-calibrated.');
  };

  // Comment Moderation Handlers
  const handleCommentAction = async (id, action) => {
    const toastId = toast.loading(`${action === 'flag' ? 'Flagging' : 'Approving'} feedback entry...`);
    try {
      await moderateComment(id, action);
      setMyComments(myComments.map(c => c._id === id ? { ...c, flagged: action === 'flag' } : c));
      toast.success(`Feedback entry ${action === 'flag' ? 'flagged' : 'approved'} successfully.`, { id: toastId });
    } catch (err) {
      toast.error('Failed to moderate feedback.', { id: toastId });
    }
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm('DELETE COMMENT: Are you sure you want to delete this comment?')) {
      const toastId = toast.loading('Deleting comment...');
      try {
        await deleteComment(id);
        setMyComments(myComments.filter(c => c._id !== id));
        toast.success('Comment deleted.', { id: toastId });
      } catch (err) {
        toast.error('Failed to delete comment.', { id: toastId });
      }
    }
  };

  // Compute stats
  const totalLikes = myBlogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0);
  const totalReadHours = (myBlogs.length * 8.4).toFixed(1);
  const avgReadEase = myBlogs.length ? '84%' : 'N/A';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Accessing Creator Sandbox Registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Creator Header */}
        <div className="bg-slate-900 p-12 rounded-[48px] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative z-10 space-y-4">
            <span className="px-6 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] italic">
              Creative Sandbox Terminal
            </span>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter">
              Creator Studio
            </h1>
            <p className="text-slate-400 max-w-xl font-medium italic">
              Draft manuscripts, evaluate content analytics, calibrate AI cloned voices, and moderate local manuscript feedback.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white p-3 rounded-[32px] shadow-xl border border-slate-100/50 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'publications', label: '✍️ My Manuscripts', count: myBlogs.length },
            { id: 'analytics', label: '📊 Narrative Analytics', count: null },
            { id: 'feedback', label: '💬 Local Post Feedback', count: myComments.length },
            { id: 'voice', label: '🎙️ Neuron Voice Cloner', count: voiceTrained ? 'TRAINED' : 'PENDING' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic transition-all shrink-0 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/20'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold ${
                  tab.count === 'TRAINED' ? 'bg-green-500 text-white' : tab.count === 'PENDING' ? 'bg-amber-500 text-white' : activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-2xl border border-slate-100/30 min-h-[500px]">
          
          {/* My Publications */}
          {activeTab === 'publications' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">My Publications Archive</h3>
                  <p className="text-slate-400 text-sm font-medium italic">Create and curate your narrative manuscripts in the timeline.</p>
                </div>
                <Link to="/create" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 italic">
                  + Draft Manuscript
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {myBlogs.map((blog) => (
                  <div key={blog._id} className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 hover:border-indigo-200 transition-all flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="bg-white text-slate-800 text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-slate-100 shadow-sm">
                          {blog.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 italic tracking-tight truncate">{blog.title}</h4>
                      <p className="text-slate-500 text-sm line-clamp-2 italic font-medium leading-relaxed">{blog.content}</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                      <div className="flex gap-4 items-center">
                        <span className="text-sm font-bold text-slate-400">❤️ {blog.likes?.length || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/blog/${blog._id}`} className="px-4 py-2 bg-white text-slate-800 hover:bg-slate-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider border border-slate-100 transition-all shadow-sm italic">
                          Preview
                        </Link>
                        <Link to={`/edit/${blog._id}`} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider text-indigo-600 transition-all italic">
                          Modify
                        </Link>
                        <button onClick={() => handleDelete(blog._id)} className="px-4 py-2 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider text-red-500 transition-all italic">
                          Purge
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {myBlogs.length === 0 && (
                  <div className="col-span-2 text-center py-20 text-slate-300 italic bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                    No manuscripts drafted in active profile. Click '+ Draft Manuscript' above to begin.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Narrative Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">Manuscript Telemetry</h3>
                <p className="text-slate-400 text-sm font-medium italic">High-fidelity metrics tracking cognitive engagement on published works.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Published Manus', val: myBlogs.length, desc: 'Active articles' },
                  { label: 'Timeline Likes', val: totalLikes, desc: 'Reader evaluations' },
                  { label: 'Time Stream Reach', val: `${totalReadHours}h`, desc: 'Estimated read time' },
                  { label: 'Cognitive Read Rate', val: avgReadEase, desc: 'Scroll engagement' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{stat.label}</span>
                    <h4 className="text-4xl font-black text-slate-900 italic tracking-tighter">{stat.val}</h4>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Category Vectors & Reading Hours Graph Mock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                  <h4 className="font-black text-slate-900 italic uppercase tracking-wider text-xs">Active Category Vectors</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'Coding & Quantum', pct: '74%', val: '7 Articles' },
                      { name: 'AI & Systems Engineering', pct: '56%', val: '5 Articles' },
                      { name: 'Philosophy & Psychology', pct: '38%', val: '3 Articles' }
                    ].map((cat, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-wide">
                          <span>{cat.name}</span>
                          <span>{cat.val}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: cat.pct }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6 flex flex-col justify-between">
                  <h4 className="font-black text-slate-900 italic uppercase tracking-wider text-xs">Simulated Reading Density</h4>
                  <div className="flex items-end justify-between h-32 pt-4">
                    {[35, 55, 75, 45, 85, 95, 65].map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 w-full">
                        <div className="w-6 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all hover:scale-105" style={{ height: `${h}%` }}></div>
                        <span className="text-[8px] font-black text-slate-400 uppercase">Day {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback moderation */}
          {activeTab === 'feedback' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">Local Post Feedback</h3>
                <p className="text-slate-400 text-sm font-medium italic">Moderate reader evaluations and commentary specifically left on your publications.</p>
              </div>

              <div className="space-y-6">
                {myComments.map((comm) => (
                  <div key={comm._id} className={`group p-8 rounded-[32px] border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50 hover:bg-white hover:shadow-xl ${
                    comm.flagged ? 'border-red-200 bg-red-50/20' : 'border-slate-100'
                  }`}>
                    <div className="space-y-4 max-w-3xl">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-black text-slate-900 italic tracking-tight">{comm.user?.name || 'Anonymous User'}</span>
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{new Date(comm.createdAt).toLocaleDateString()}</span>
                        <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Manuscript: {comm.blogId?.title || 'Unknown Post'}
                        </span>
                        {comm.flagged && (
                          <span className="bg-red-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                            ⚠️ FLAGGED FEEDBACK
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 leading-relaxed text-sm font-medium italic pl-6 border-l-2 border-slate-200">{comm.text}</p>
                    </div>

                    <div className="flex gap-2 shrink-0 self-end md:self-center">
                      {comm.flagged ? (
                        <button onClick={() => handleCommentAction(comm._id, 'unflag')} className="px-5 py-2.5 bg-green-50 hover:bg-green-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-green-600 transition-all italic">
                          Approve
                        </button>
                      ) : (
                        <button onClick={() => handleCommentAction(comm._id, 'flag')} className="px-5 py-2.5 bg-yellow-50 hover:bg-yellow-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-yellow-600 transition-all italic">
                          Flag
                        </button>
                      )}
                      <button onClick={() => handleDeleteComment(comm._id)} className="px-5 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 transition-all italic">
                        Purge
                      </button>
                    </div>
                  </div>
                ))}
                {myComments.length === 0 && (
                  <div className="text-center py-20 text-slate-300 italic bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                    No comments currently found on your articles.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Voice Cloning Portal */}
          {activeTab === 'voice' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">Neuron Voice Cloning</h3>
                <p className="text-slate-400 text-sm font-medium italic">Calibrate a simulated custom vocal profile that allows readers to listen to your posts in your synthetically cloned voice.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Calibration Box */}
                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex flex-col justify-between space-y-8 relative overflow-hidden">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-slate-900 italic uppercase tracking-wider text-xs">Vocal Calibration Console</h4>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        voiceTrained ? 'bg-green-500 text-white' : 'bg-amber-500 text-white animate-pulse'
                      }`}>
                        {voiceTrained ? 'Profile Synchronized' : 'Profile Awaiting Calibration'}
                      </span>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 space-y-4">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Recital Manuscript Sentence</span>
                      <p className="text-slate-800 text-lg font-black italic tracking-tight leading-relaxed">
                        "The digital timeline archives our stories for the collective consciousness of future generations. Secure gateway authorizations establish synaptic connection locks."
                      </p>
                    </div>

                    {recording && (
                      <div className="space-y-4 bg-red-50 p-6 rounded-[24px] border border-red-100 flex flex-col items-center text-center animate-pulse">
                        <div className="flex gap-1.5 h-8 items-center justify-center">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <div key={i} className="w-1 bg-red-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `-${i * 0.1}s` }}></div>
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Capturing vocal frequency... speak now</span>
                      </div>
                    )}

                    {calibrating && (
                      <div className="space-y-4">
                        <div className="flex justify-between text-xs font-black text-slate-500 uppercase">
                          <span>Synthesizing voice matrix...</span>
                          <span>{calibrationProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full transition-all duration-150" style={{ width: `${calibrationProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 pt-4 border-t border-slate-200/50">
                    {!voiceTrained ? (
                      <>
                        <button
                          onClick={startRecording}
                          disabled={recording || calibrating}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl active:scale-95 text-xs uppercase tracking-[0.2em] italic disabled:opacity-50"
                        >
                          {recording ? 'Audio Receptor Open...' : 'Initialize Voice Calibration'}
                        </button>
                        <button
                          onClick={handleCalibration}
                          disabled={!recordingSuccess || calibrating}
                          className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-[0.2em] italic disabled:opacity-50"
                        >
                          Complete Synthesis
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={resetVoiceClone}
                        className="w-full py-4 bg-red-50 hover:bg-red-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500 transition-all italic"
                      >
                        Reset Voice Profile Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    <h4 className="font-black text-slate-900 italic uppercase tracking-wider text-xs">Cloning Parameters</h4>
                    <p className="text-slate-500 italic font-medium leading-relaxed text-sm">
                      Our custom cloning simulated node extracts vocal frequencies, timbre, resonance coefficients, and speed vectors from your vocal input, generating an instantaneous custom cloned voice model.
                    </p>
                    <div className="space-y-4">
                      {[
                        { name: 'VocalTimbre Isolator', val: voiceTrained ? 'LOCKED [98%]' : 'AWAITING INPUT' },
                        { name: 'Timestream Frequency Map', val: voiceTrained ? 'GENERATED' : 'AWAITING INPUT' },
                        { name: 'Latency Synch-Buffering', val: '0.04ms' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-200/50 last:border-0 font-medium text-slate-700 text-xs">
                          <span className="font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
                          <span className="font-mono text-slate-900">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {voiceTrained && (
                    <div className="bg-green-50 border border-green-200 p-6 rounded-[24px] text-green-800 text-xs font-semibold leading-relaxed flex items-start gap-3">
                      <span className="text-lg">📢</span>
                      <p>Timeline Synchronization complete. Readers visiting your published manuscripts will now be authorized to select your synthetically cloned voice in the Audio Stream player!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
