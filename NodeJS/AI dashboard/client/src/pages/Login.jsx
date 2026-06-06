import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/uiStore';
import { ShieldCheck, LogIn, Chrome, HelpCircle, KeyRound, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '../components/Logo';

export const Login = () => {
  const { login, isMfaEnabled, isSsoEnabled } = useStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('Aayush');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState('Admin');
  const [step, setStep] = useState('credentials'); 
  const [mfaCode, setMfaCode] = useState('');

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (isMfaEnabled) {
      setStep('mfa');
      toast.info("Multi-Factor Authentication Shield triggered. Check your auth app!");
    } else {
      performLogin();
    }
  };

  const handleMfaSubmit = (e) => {
    e.preventDefault();
    if (mfaCode === '123456') {
      performLogin();
    } else {
      toast.error("Invalid verification code. Enter '123456' for mock verification.");
    }
  };

  const performLogin = async () => {
    await login(username, role);
    toast.success(`Welcome back, ${username}! Authenticated as ${role}.`);
    navigate('/');
  };

  const handleQuickLogin = async (quickUser, quickRole) => {
    setUsername(quickUser);
    setRole(quickRole);
    if (isMfaEnabled) {
      setStep('mfa');
      toast.info("MFA Shield triggered.");
    } else {
      await login(quickUser, quickRole);
      toast.success(`Authenticated as ${quickRole}`);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl relative z-10">
        
        {}
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-14 h-14 mb-3" />
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            Aether<span className="text-indigo-500">Forge</span> Portal
          </h1>
          <p className="text-slate-500 text-xs mt-1">Autonomous Operations & Security Control Center</p>
        </div>

        {step === 'credentials' ? (
          <>
            {}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">USERNAME / EMAIL</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="admin@aetherforge.ai"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {}
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1.5">RBAC ROLE SELECTOR</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Admin', 'Editor', 'Viewer'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        role === r 
                          ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' 
                          : 'bg-slate-950/50 text-slate-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {isSsoEnabled ? (
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Redirecting to Single Sign-On Identity provider...");
                    setTimeout(performLogin, 1000);
                  }}
                  className="w-full py-3 bg-slate-850 hover:bg-slate-800 border border-white/10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-indigo-400 transition-all active:scale-95"
                >
                  <Chrome size={16} /> Sign In with Enterprise SSO
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-650/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <LogIn size={16} /> Authenticate
                </button>
              )}
            </form>

            {}
            <div className="mt-8 pt-6 border-t border-white/5">
              <span className="text-[10px] text-slate-500 font-bold block mb-3 uppercase tracking-wider">Quick Select Profiles (RBAC Demo)</span>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleQuickLogin('Aayush', 'Admin')} 
                  className="p-2.5 bg-slate-950/30 hover:bg-slate-900 border border-white/5 rounded-xl text-center group transition-colors"
                >
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400">Aayush</div>
                  <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">Admin</div>
                </button>
                <button 
                  onClick={() => handleQuickLogin('Jane', 'Editor')} 
                  className="p-2.5 bg-slate-950/30 hover:bg-slate-900 border border-white/5 rounded-xl text-center group transition-colors"
                >
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400">Jane</div>
                  <div className="text-[9px] text-sky-400 font-semibold mt-0.5">Editor</div>
                </button>
                <button 
                  onClick={() => handleQuickLogin('Bob', 'Viewer')} 
                  className="p-2.5 bg-slate-950/30 hover:bg-slate-900 border border-white/5 rounded-xl text-center group transition-colors"
                >
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400">Bob</div>
                  <div className="text-[9px] text-purple-400 font-semibold mt-0.5">Viewer</div>
                </button>
              </div>
            </div>
          </>
        ) : (
          
          <form onSubmit={handleMfaSubmit} className="space-y-6">
            <div className="text-center">
              <KeyRound size={32} className="mx-auto text-indigo-400 mb-2 animate-bounce" />
              <h3 className="text-white font-semibold text-sm">Enter 2FA Code</h3>
              <p className="text-slate-400 text-xs mt-1">Please type the code from your Authenticator app.</p>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-widest text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••"
              />
              <span className="text-[10px] text-slate-500 text-center block mt-2">Hint: Type <strong className="text-indigo-400">123456</strong> to verify</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="py-2.5 bg-slate-950 hover:bg-slate-900 border border-white/5 rounded-xl text-xs font-bold text-slate-400 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
              >
                Verify Code
              </button>
            </div>
          </form>
        )}
      </div>

      {}
      <div className="mt-8 flex items-center gap-1.5 text-slate-600 text-xs">
        <Sparkles size={14} />
        <span>Secured by AetherShield v5.0 (Sandbox Stage Active)</span>
      </div>
    </div>
  );
};
