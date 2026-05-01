import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 glass rounded-3xl">
          <ShoppingBag className="mx-auto text-white/10 mb-4" size={64} />
          <p className="text-xl text-white/40 mb-8">Your cart is empty</p>
          <Link to="/shop" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl transition-all">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item.book} className="glass p-4 rounded-2xl flex items-center gap-6">
                <img src={item.image} alt={item.title} className="w-20 h-28 object-cover rounded-lg" />
                <div className="flex-1">
                  <Link to={`/book/${item.book}`} className="text-lg font-bold hover:text-primary-400 transition-colors">
                    {item.title}
                  </Link>
                  <p className="text-primary-400 font-bold mt-1">${item.price}</p>
                </div>
                
                <div className="flex items-center gap-3 glass px-3 py-1.5 rounded-xl">
                  <select
                    value={item.qty}
                    onChange={(e) => addToCart(item, Number(e.target.value))}
                    className="bg-transparent focus:outline-none cursor-pointer"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1} className="bg-[#1e293b]">
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => removeFromCart(item.book)}
                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <Link to="/shop" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mt-4">
              <ArrowLeft size={18} /> Continue Shopping
            </Link>
          </div>

          <div className="w-full lg:w-96">
            <div className="glass p-6 rounded-3xl sticky top-32">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/60">
                  <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="h-px bg-white/5 my-4" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-400">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={checkoutHandler}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
