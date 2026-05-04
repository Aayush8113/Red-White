import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const Payment = () => {
  const { shippingAddress, savePaymentMethod } = useCart();
  const navigate = useNavigate();

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="pt-32 pb-12 px-6 max-w-4xl mx-auto min-h-screen">
      <CheckoutSteps step1 step2 step3 />
      
      <div className="glass p-8 md:p-12 rounded-3xl">
        <h1 className="text-3xl font-black mb-8">Payment Method</h1>
        
        <form onSubmit={submitHandler} className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-white/60 ml-1">Select Method</label>
            
            <div 
              onClick={() => setMethod('PayPal')}
              className={`flex items-center justify-between p-6 rounded-2xl cursor-pointer transition-all border-2 ${paymentMethod === 'PayPal' ? 'bg-primary-500/10 border-primary-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${paymentMethod === 'PayPal' ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/40'}`}>
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="font-bold">PayPal or Credit Card</p>
                  <p className="text-xs text-white/40">Fast and secure payment</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'PayPal' ? 'border-primary-500' : 'border-white/20'}`}>
                {paymentMethod === 'PayPal' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
              </div>
            </div>

            <div 
              onClick={() => setMethod('Stripe')}
              className={`flex items-center justify-between p-6 rounded-2xl cursor-pointer transition-all border-2 ${paymentMethod === 'Stripe' ? 'bg-primary-500/10 border-primary-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${paymentMethod === 'Stripe' ? 'bg-primary-500 text-white' : 'bg-white/10 text-white/40'}`}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="font-bold">Stripe</p>
                  <p className="text-xs text-white/40">Direct credit card processing</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Stripe' ? 'border-primary-500' : 'border-white/20'}`}>
                {paymentMethod === 'Stripe' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary mt-8"
          >
            Continue to Order Summary <Send size={18} className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
