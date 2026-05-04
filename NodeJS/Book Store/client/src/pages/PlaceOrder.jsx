import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, MapPin, CreditCard, Send, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Price calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cartItems.map((item) => ({
            name: item.title,
            qty: item.qty,
            image: item.image,
            price: item.price,
            book: item.book,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto min-h-screen">
      <CheckoutSteps step1 step2 step3 step4 />
      
      <div className="flex flex-col lg:flex-row gap-12 mt-8">
        <div className="flex-1 space-y-8">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <MapPin className="text-primary-400" /> Shipping
            </h2>
            <p className="text-white/70">
              <strong className="text-white">Address:</strong> {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <CreditCard className="text-primary-400" /> Payment Method
            </h2>
            <p className="text-white/70">
              <strong className="text-white">Method:</strong> {paymentMethod}
            </p>
          </div>

          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <ShoppingBag className="text-primary-400" /> Order Items
            </h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-lg shadow-lg" />
                    <div className="flex-1">
                      <Link to={`/book/${item.book}`} className="font-bold hover:text-primary-400 transition-colors">
                        {item.title}
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.qty} x ${item.price} = <span className="text-primary-400">${(item.qty * item.price).toFixed(2)}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="glass p-8 rounded-3xl sticky top-32 border border-primary-500/20">
            <h2 className="text-2xl font-black mb-8 text-gradient">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-white/60">
                <span>Items</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Tax</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/5 my-6" />
              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>
                <span className="text-primary-400">${totalPrice.toFixed(2)}</span>
              </div>
              
              <button
                disabled={cartItems.length === 0 || loading}
                onClick={placeOrderHandler}
                className="w-full btn-primary mt-8 py-5 text-lg"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>Place Order <Send size={20} className="ml-2" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
