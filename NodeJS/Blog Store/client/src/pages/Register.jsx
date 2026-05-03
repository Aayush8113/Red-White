import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-center text-white">
            <h2 className="text-3xl font-black italic tracking-tighter">Join the Community</h2>
            <p className="opacity-80 mt-2 text-sm">Start your journey as a content creator today</p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-medium rounded-r-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="input-field"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="input-field"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
                <input 
                  type="password" 
                  placeholder="Create a strong password" 
                  className="input-field"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <p className="mt-1.5 text-[10px] text-slate-500 ml-1">Must be at least 6 characters long.</p>
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`btn-primary w-full flex justify-center items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : 'Register Now'}
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-600 text-sm">
                Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;