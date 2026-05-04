import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, MapPin, CreditCard, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Order = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrder();
  }, [id, user]);

  if (loading) return <div className="pt-32 text-center h-screen">Loading Order...</div>;
  if (!order) return <div className="pt-32 text-center h-screen text-red-500">Order not found</div>;

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-black">Order #{order._id.substring(0, 10).toUpperCase()}</h1>
            {order.isPaid ? (
              <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">PAID</span>
            ) : (
              <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">PENDING PAYMENT</span>
            )}
          </div>
          <p className="text-white/40 flex items-center gap-2 text-sm">
            <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <Link to="/profile" className="btn-glass !px-6 !py-3">View All Orders</Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="text-primary-400" /> Shipping Information
            </h2>
            <div className="space-y-2 text-white/70">
              <p><strong className="text-white">Name:</strong> {order.user.name}</p>
              <p><strong className="text-white">Email:</strong> {order.user.email}</p>
              <p>
                <strong className="text-white">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
            <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 ${order.isDelivered ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white/40'}`}>
              {order.isDelivered ? <CheckCircle2 size={20} /> : <Clock size={20} />}
              <span className="font-medium">{order.isDelivered ? `Delivered on ${order.deliveredAt}` : 'Not Yet Delivered'}</span>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <CreditCard className="text-primary-400" /> Payment Status
            </h2>
            <p className="text-white/70 mb-4"><strong className="text-white">Method:</strong> {order.paymentMethod}</p>
            <div className={`p-4 rounded-2xl flex items-center gap-3 ${order.isPaid ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white/40'}`}>
              {order.isPaid ? <CheckCircle2 size={20} /> : <Clock size={20} />}
              <span className="font-medium">{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleString()}` : 'Payment Pending'}</span>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <ShoppingBag className="text-primary-400" /> Order Items
            </h2>
            <div className="space-y-6">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-6 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg shadow-lg" />
                  <div className="flex-1">
                    <Link to={`/book/${item.book}`} className="font-bold hover:text-primary-400 transition-colors">
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.qty} x ${item.price} = <span className="text-primary-400">${(item.qty * item.price).toFixed(2)}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="glass p-8 rounded-3xl sticky top-32">
            <h2 className="text-2xl font-black mb-8">Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-white/60">
                <span>Items</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/5 my-6" />
              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-primary-400">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
