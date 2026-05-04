import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Flag, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <div className="pt-32 pb-12 px-6 max-w-4xl mx-auto min-h-screen">
      <CheckoutSteps step1 step2 />
      
      <div className="glass p-8 md:p-12 rounded-3xl">
        <h1 className="text-3xl font-black mb-8">Shipping Details</h1>
        
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Address</label>
            <div className="relative">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-500 transition-all"
                placeholder="Enter address"
              />
              <MapPin className="absolute left-4 top-3.5 text-white/30" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60 ml-1">City</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="Enter city"
                />
                <div className="absolute left-4 top-3.5 text-white/30">
                  <span className="font-bold text-xs">CITY</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60 ml-1">Postal Code</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-500 transition-all"
                  placeholder="Enter postal code"
                />
                <div className="absolute left-4 top-3.5 text-white/30">
                  <span className="font-bold text-xs">ZIP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-1">Country</label>
            <div className="relative">
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary-500 transition-all"
                placeholder="Enter country"
              />
              <Flag className="absolute left-4 top-3.5 text-white/30" size={18} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary mt-8"
          >
            Continue to Payment <Send size={18} className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
