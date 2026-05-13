import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 4) {
      toast.error('Please enter 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp: otpString });
      toast.success('OTP Verified Successfully');
      navigate('/reset-password', { state: { email, otp: otpString } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      toast.success('OTP Resent Successfully');
      setTimer(120);
      setOtp(['', '', '', '']);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[32px] shadow-2xl shadow-blue-900/5 border border-slate-100 text-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Verify OTP
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            We've sent a 4-digit code to <span className="font-bold text-slate-900">{email}</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 my-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-16 h-16 text-2xl font-black text-center bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        <div className="text-sm text-slate-500 mb-6">
          {timer > 0 ? (
            <span>Expires in: <span className="font-bold text-blue-600">{formatTime(timer)}</span></span>
          ) : (
            <span className="text-rose-500 font-bold">OTP Expired</span>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || timer === 0}
          className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 mb-4"
        >
          {loading ? 'Verifying...' : 'Verify & Proceed'}
        </button>

        <div className="text-sm">
          <p className="text-slate-500">
            Didn't receive code?{' '}
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={`font-black ${timer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-500'}`}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
