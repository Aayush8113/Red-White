import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Package, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name);
      setEmail(user.email);
      
      const fetchOrders = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
          setOrders(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchOrders();
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        { name, email, password },
        config
      );
      login(data);
      setMessage('Profile Updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Profile Info */}
        <div className="w-full lg:w-1/3">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="text-primary-400" /> User Profile
            </h2>
            
            {message && (
              <div className={`px-4 py-2 rounded-xl mb-6 text-sm ${message.includes('success') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-white/40 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40 ml-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="Leave blank to keep same"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40 ml-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* Orders */}
        <div className="flex-1">
          <div className="glass p-8 rounded-3xl h-full">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="text-primary-400" /> My Orders
            </h2>
            
            {orders.length === 0 ? (
              <p className="text-white/40 text-center py-12">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="py-4 px-4 text-white/40 text-sm font-medium">ID</th>
                      <th className="py-4 px-4 text-white/40 text-sm font-medium">DATE</th>
                      <th className="py-4 px-4 text-white/40 text-sm font-medium">TOTAL</th>
                      <th className="py-4 px-4 text-white/40 text-sm font-medium">PAID</th>
                      <th className="py-4 px-4 text-white/40 text-sm font-medium">DELIVERED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 text-xs font-mono">{order._id}</td>
                        <td className="py-4 px-4 text-sm">{order.createdAt.substring(0, 10)}</td>
                        <td className="py-4 px-4 text-sm font-bold">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          {order.isPaid ? (
                            <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">Yes</span>
                          ) : (
                            <span className="text-red-400 text-xs bg-red-400/10 px-2 py-1 rounded-full">No</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {order.isDelivered ? (
                            <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">Yes</span>
                          ) : (
                            <span className="text-red-400 text-xs bg-red-400/10 px-2 py-1 rounded-full">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
