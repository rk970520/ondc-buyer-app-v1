import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { motion } from 'motion/react';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();

  const total = items.reduce((acc, item) => acc + (typeof item.price === 'number' ? item.price : (item.price?.value || 499)) * (item.quantity || 1), 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-neutral-400" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Start exploring the ONDC network.</p>
        <Link to="/search" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((item, index) => (
            <div key={item.id || index} className="flex gap-6 p-6 bg-white border border-neutral-200 rounded-3xl items-center hover:shadow-sm transition-shadow">
              <div className="w-24 h-24 bg-neutral-100 rounded-2xl overflow-hidden shrink-0">
                <img 
                  src={(item.images && item.images[0]) || item.image || `https://picsum.photos/seed/${item.id || index}/200/200`} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900">{item.name || 'Premium Product'}</h3>
                    <p className="text-sm text-neutral-500">{item.providerName || item.provider?.name || 'Baniya Store'}</p>
                  </div>
                  <button 
                    onClick={() => {
                      removeItem(item.itemId || item.id);
                      toast.success('Removed from cart');
                    }}
                    className="text-neutral-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                      Qty: {item.quantity || 1}
                    </span>
                  </div>
                  <span className="font-bold text-xl text-neutral-900">₹{(typeof item.price === 'number' ? item.price : (item.price?.value || 499)) * (item.quantity || 1)}</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end">
            <button 
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
              className="text-sm font-medium text-neutral-500 hover:text-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 sticky top-24">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-neutral-900">₹{total}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span className="font-medium text-neutral-900">₹{Math.round(total * 0.18)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-neutral-900">Total</span>
              <span className="text-2xl font-bold text-neutral-900">₹{total + Math.round(total * 0.18)}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
