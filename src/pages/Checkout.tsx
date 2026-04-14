import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { buyerAppApi } from '../api/buyerApp';
import { buyerDataApi } from '../api/buyerData';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { CheckCircle2, MapPin, CreditCard, Loader2 } from 'lucide-react';

export default function Checkout() {
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(`txn_${Date.now()}`);
  
  const total = items.reduce((acc, item) => acc + (typeof item.price === 'number' ? item.price : (item.price?.value || 499)) * (item.quantity || 1), 0);
  const finalTotal = total + Math.round(total * 0.18);

  const handleInit = async () => {
    setLoading(true);
    try {
      // Mocking the init call
      await buyerAppApi.init({
        transactionId,
        buyer: {
          userId: user?.id || 2,
          name: user?.firstName || 'John Doe',
          contact: { email: user?.email || 'john@example.com', phone: user?.phone || '9876543210' },
          location: {
            gps: "20.325691,85.8065218",
            address: { areaCode: "751021", building: "Building", city: "Mumbai", state: "Maharashtra", country: "IND", locality: "Street", name: "House" }
          },
          billing: {
            address: { areaCode: "751021", building: "Building", city: "Mumbai", state: "Maharashtra", country: "IND", locality: "Street", name: "House" },
            phone: user?.phone || '9876543210', name: user?.firstName || 'John Doe', email: user?.email || 'john@example.com'
          },
          fulfillmentId: "f123455"
        }
      });
      setStep(2);
      toast.success('Order initialized');
    } catch (error) {
      console.error(error);
      // Proceed anyway for demo
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Mocking payment
      await buyerDataApi.createPayment({
        currency: "INR",
        amount: finalTotal,
        customerId: user?.id || "2",
        customerName: user?.firstName || "John Doe",
        customerPhone: user?.phone || "9876543210",
        customerEmail: user?.email || "john@example.com"
      });
      
      // Confirm order
      await buyerAppApi.confirm({
        transactionId,
        order: { state: "Created" },
        buyer: { id: user?.id || 2 },
        payment: {
          params: { amount: finalTotal.toString(), currency: "INR", transactionId: `pay_${Date.now()}` },
          status: "PAID", type: "ON-ORDER", collectedBy: "BAP"
        }
      });
      
      clearCart();
      toast.success('Payment successful! Order confirmed.');
      navigate('/orders');
    } catch (error) {
      console.error(error);
      // Proceed anyway for demo
      clearCart();
      toast.success('Order confirmed (Demo mode)');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 -z-10 rounded-full transition-all duration-500" style={{ width: step === 1 ? '0%' : '100%' }}></div>
        
        <div className={`flex flex-col items-center gap-2 bg-neutral-50 px-4 ${step >= 1 ? 'text-emerald-600' : 'text-neutral-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step >= 1 ? 'bg-emerald-600' : 'bg-neutral-300'}`}>1</div>
          <span className="text-sm font-medium">Address</span>
        </div>
        <div className={`flex flex-col items-center gap-2 bg-neutral-50 px-4 ${step >= 2 ? 'text-emerald-600' : 'text-neutral-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${step >= 2 ? 'bg-emerald-600' : 'bg-neutral-300'}`}>2</div>
          <span className="text-sm font-medium">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-neutral-900">Delivery Address</h2>
              </div>
              
              <div className="border-2 border-emerald-500 bg-emerald-50 p-6 rounded-2xl relative">
                <div className="absolute top-6 right-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-neutral-900 mb-1">{user?.firstName || 'John Doe'}</h3>
                <p className="text-neutral-600 mb-4">{user?.phone || '+91 9876543210'}</p>
                <p className="text-neutral-600 leading-relaxed">
                  Building Name, Street Name<br />
                  Locality, Mumbai<br />
                  Maharashtra, India - 400001
                </p>
              </div>

              <button 
                onClick={handleInit}
                disabled={loading}
                className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Payment'}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-neutral-900">Payment Method</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-6 border-2 border-emerald-500 bg-emerald-50 rounded-2xl cursor-pointer">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                    <span className="font-semibold text-neutral-900">UPI / Netbanking</span>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6" referrerPolicy="no-referrer" />
                </label>
                
                <label className="flex items-center justify-between p-6 border border-neutral-200 rounded-2xl cursor-pointer hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                    <span className="font-semibold text-neutral-900">Credit / Debit Card</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-neutral-200 rounded"></div>
                    <div className="w-10 h-6 bg-neutral-200 rounded"></div>
                  </div>
                </label>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ₹${finalTotal}`}
              </button>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 sticky top-24">
            <h3 className="font-bold text-neutral-900 mb-4">Order Details</h3>
            <div className="space-y-4 mb-6">
              {items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <img src={(item.images && item.images[0]) || item.image || `https://picsum.photos/seed/${item.id || i}/100/100`} alt="" className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-neutral-900 line-clamp-1">{item.name || 'Product'}</h4>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity || 1}</p>
                    <p className="text-sm font-bold text-neutral-900 mt-1">₹{(typeof item.price === 'number' ? item.price : (item.price?.value || 499)) * (item.quantity || 1)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-neutral-200 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">₹{total}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax (18%)</span>
                <span className="font-medium text-neutral-900">₹{Math.round(total * 0.18)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-neutral-200 mt-3">
                <span className="font-bold text-neutral-900">Total</span>
                <span className="text-xl font-bold text-emerald-600">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
