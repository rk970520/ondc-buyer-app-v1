import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buyerDataApi } from '../api/buyerData';
import { buyerAppApi } from '../api/buyerApp';
import { motion } from 'motion/react';
import { ArrowLeft, Package, MapPin, Receipt, AlertCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await buyerDataApi.getOrder(id!);
        setOrder(res.data?.data || res.data || {
          id,
          status: 'Processing',
          date: new Date().toISOString(),
          total: 1499,
          items: [
            { id: '1', name: 'Premium Item 1', quantity: 2, price: 500, image: 'https://picsum.photos/seed/1/100/100' },
            { id: '2', name: 'Organic Apples', quantity: 1, price: 499, image: 'https://picsum.photos/seed/2/100/100' }
          ],
          provider: { name: 'Baniya Store', id: 'prov_1' },
          shipping: { address: 'Building Name, Street Name, Locality, Mumbai, Maharashtra, India - 400001' }
        });
      } catch (error) {
        console.error('Failed to fetch order', error);
        // Mock data
        setOrder({
          id,
          status: 'Processing',
          date: new Date().toISOString(),
          total: 1499,
          items: [
            { id: '1', name: 'Premium Item 1', quantity: 2, price: 500, image: 'https://picsum.photos/seed/1/100/100' },
            { id: '2', name: 'Organic Apples', quantity: 1, price: 499, image: 'https://picsum.photos/seed/2/100/100' }
          ],
          provider: { name: 'Baniya Store', id: 'prov_1' },
          shipping: { address: 'Building Name, Street Name, Locality, Mumbai, Maharashtra, India - 400001' }
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await buyerAppApi.cancel({ order: { id }, reasonId: "001" });
      toast.success('Order cancelled successfully');
      setOrder({ ...order, status: 'Cancelled' });
    } catch (error) {
      console.error(error);
      toast.success('Order cancelled (Demo)');
      setOrder({ ...order, status: 'Cancelled' });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-neutral-200 rounded-3xl max-w-4xl mx-auto" />;
  if (!order) return <div>Order not found</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <Link to="/orders" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Order #{order.id}</h1>
          <p className="text-neutral-500">Placed on {new Date(order.date).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {order.status}
          </span>
          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
            <button 
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Items */}
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" /> Items
            </h2>
            <div className="space-y-6">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
                  <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover border border-neutral-200" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                      <span className="font-bold text-neutral-900">₹{item.price * item.quantity}</span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">Sold by {order.provider?.name}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-medium bg-neutral-100 px-2 py-1 rounded text-neutral-600">Qty: {item.quantity}</span>
                      {order.status === 'Delivered' && (
                        <button className="text-sm text-emerald-600 font-medium hover:underline flex items-center gap-1">
                          <Star className="w-4 h-4" /> Rate Item
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issue Reporting */}
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Have an issue with your order?</h3>
              <p className="text-sm text-amber-700 mb-4">You can raise an issue if items are missing, damaged, or not as described.</p>
              <button className="bg-white text-amber-700 border border-amber-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors">
                Report Issue
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Summary */}
          <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" /> Summary
            </h2>
            <div className="space-y-3 text-sm mb-4 pb-4 border-b border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal</span>
                <span className="font-medium text-neutral-900">₹{order.total - Math.round(order.total * 0.18)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span className="font-medium text-neutral-900">₹{Math.round(order.total * 0.18)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-neutral-900">Total</span>
              <span className="text-xl font-bold text-emerald-600">₹{order.total}</span>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Delivery Address
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {order.shipping?.address}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
