import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/users', { name, email, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md glass p-8 rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-white/40 mb-8">Join our community of book lovers</p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-500 transition-all"
                placeholder="John Doe"
              />
              <UserIcon className="absolute left-4 top-3.5 text-white/30" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-500 transition-all"
                placeholder="name@example.com"
              />
              <Mail className="absolute left-4 top-3.5 text-white/30" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-500 transition-all"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-3.5 text-white/30" size={18} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-white/40">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
