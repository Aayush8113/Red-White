import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState('');
  const [socialStep, setSocialStep] = useState(1); // 1 = select role, 2 = animate connection
  const [simulatedRole, setSimulatedRole] = useState('Reader');
  
  const { login, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialClick = (platform) => {
    setSelectedSocial(platform);
    setShowSocialModal(true);
    setSocialStep(1);
  };

  const handleSimulatedLogin = () => {
    setSocialStep(2);
    const toastId = toast.loading(`Initiating ${selectedSocial} handshake protocol...`);
    
    setTimeout(() => {
      // Create mock user data based on chosen role
      let mockUser = {
        _id: 'mock-id-' + Math.floor(Math.random() * 100000),
        name: simulatedRole === 'Administrator' ? 'Sarah Connor' : simulatedRole === 'Creator' ? 'Marcus Vane' : 'Elena Rostova',
        email: simulatedRole === 'Administrator' ? 'admin@chronicle.net' : simulatedRole === 'Creator' ? 'creator@chronicle.net' : 'reader@chronicle.net',
        role: simulatedRole,
        token: 'mock-jwt-token-xyz-12345'
      };

      // Save to localStorage
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      
      // Update state in context
      setUser(mockUser);
      
      toast.success(`Synaptic authorization granted. Welcome back, ${mockUser.name}!`, { id: toastId });
      setShowSocialModal(false);
      
      // Redirect based on role
      if (simulatedRole === 'Administrator') {
        navigate('/admin');
      } else if (simulatedRole === 'Creator') {
        navigate('/creator');
      } else {
        navigate('/');
      }
    }, 2000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 relative bg-slate-50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100/50">
          <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter">Welcome Back</h2>
            <p className="text-slate-400 mt-2 text-sm font-medium">Access your personalized blog experience</p>
          </div>
          
          <div className="p-10">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-medium rounded-r-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-2 italic">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1.5 ml-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">Forgot password?</Link>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-[0.2em] italic disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verifying Gateway...' : 'Initiate Session'}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] italic">Or Sync Network</span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => handleSocialClick('Google')}
                className="flex items-center justify-center p-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl border border-rose-100 hover:border-rose-200 transition-all text-xl hover:scale-105 active:scale-95"
                title="Sign in with Google"
              >
                G+
              </button>
              <button 
                onClick={() => handleSocialClick('GitHub')}
                className="flex items-center justify-center p-4 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all text-xl hover:scale-105 active:scale-95"
                title="Sign in with GitHub"
              >
                GH
              </button>
              <button 
                onClick={() => handleSocialClick('Discord')}
                className="flex items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-2xl border border-indigo-100 hover:border-indigo-200 transition-all text-xl hover:scale-105 active:scale-95"
                title="Sign in with Discord"
              >
                💬
              </button>
            </div>
            
            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-sm font-medium">
                New to BlogStore? <Link to="/register" className="text-blue-600 font-black hover:underline italic ml-1">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Login simulation Overlay Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[48px] shadow-2xl p-10 max-w-md w-full border border-slate-100 text-center relative overflow-hidden">
            <button 
              onClick={() => setShowSocialModal(false)}
              className="absolute top-6 right-6 h-10 w-10 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center text-sm font-bold border border-slate-100 transition-all"
            >
              ✕
            </button>

            {socialStep === 1 ? (
              <div className="space-y-8">
                <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-xl">
                  🔑
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{selectedSocial} Access Portal</h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium">Choose your chronicle permissions vector:</p>
                </div>

                <div className="space-y-4">
                  {[
                    { role: 'Reader', desc: 'Read stories, listen to cloned audio streams, and bookmark feeds.' },
                    { role: 'Creator', desc: 'Draft articles, upload media, generate AI cover art, and analyze metrics.' },
                    { role: 'Administrator', desc: 'Moderation deck, bulk RSS imports, and warp link managers.' }
                  ].map((item) => (
                    <button
                      key={item.role}
                      onClick={() => setSimulatedRole(item.role)}
                      className={`w-full p-5 rounded-3xl text-left border transition-all flex items-center gap-4 ${
                        simulatedRole === item.role
                          ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/5'
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        simulatedRole === item.role ? 'border-blue-500' : 'border-slate-300'
                      }`}>
                        {simulatedRole === item.role && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                      </div>
                      <div>
                        <span className="block font-black text-slate-900 italic tracking-tight">{item.role} Profile</span>
                        <span className="block text-[11px] text-slate-400 mt-0.5 leading-normal">{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSimulatedLogin}
                  className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-blue-600 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-[0.3em] italic"
                >
                  Establish Link Connection
                </button>
              </div>
            ) : (
              <div className="space-y-8 py-10">
                <div className="w-24 h-24 relative mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 animate-spin blur-lg opacity-40"></div>
                  <div className="absolute inset-0 border-4 border-dashed border-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl">
                    ⚡
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">Syncing Space Nodes</h3>
                  <p className="text-slate-400 text-sm font-medium">Validating JWT credentials and parsing authorizations...</p>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div className="bg-blue-500 h-full w-2/3 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;