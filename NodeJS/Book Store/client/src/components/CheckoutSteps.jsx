import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { name: 'Login', active: step1, link: '/login' },
    { name: 'Shipping', active: step2, link: '/shipping' },
    { name: 'Payment', active: step3, link: '/payment' },
    { name: 'Place Order', active: step4, link: '/placeorder' },
  ];

  return (
    <div className="flex justify-center items-center gap-4 mb-12">
      {steps.map((step, index) => (
        <div key={step.name} className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            {step.active ? (
              <Link
                to={step.link}
                className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 transition-all hover:scale-110"
              >
                {index < steps.findIndex(s => s.active === false) || step4 ? <Check size={20} strokeWidth={3} /> : index + 1}
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                {index + 1}
              </div>
            )}
            <span className={`text-[10px] font-bold uppercase tracking-widest ${step.active ? 'text-primary-400' : 'text-white/20'}`}>
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-[2px] mb-6 rounded-full ${steps[index + 1].active ? 'bg-primary-500' : 'bg-white/5'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
