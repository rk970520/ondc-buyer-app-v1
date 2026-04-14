import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buyerDataApi } from '../api/buyerData';
import { motion } from 'motion/react';
import { Package, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await buyerDataApi.getOrders({ size: 10 });
        setOrders(res.data?.data || res.data || []);
      } catch (error) {
        console.error('Failed to fetch orders', error);
        // Mock data
        setOrders([
          { id: 'ord_123', status: 'Delivered', date: '2026-03-15', total: 1499, items: [{ name: 'Premium Item', image: 'https://picsum.photos/seed/1/100/100' }] },
          { id: 'ord_124', status: 'Processing', date: '2026-03-16', total: 899, items: [{ name: 'Organic Apples', image: 'https://picsum.photos/seed/2/100/100' }] },
          { id: 'ord_125', status: 'Cancelled', date: '2026-03-10', total: 2499, items: [{ name: 'Wireless Headphones', image: 'https://picsum.photos/seed/3/100/100' }] }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-neutral-900">Your Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <Link 
              key={order.id || i} 
              to={`/orders/${order.id}`}
              className="block bg-white p-6 rounded-3xl border border-neutral-200 hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="flex -space-x-4">
                  {order.items?.slice(0, 3).map((item: any, idx: number) => (
                    <img 
                      key={idx} 
                      src={item.image || `https://picsum.photos/seed/${order.id}${idx}/100/100`} 
                      alt="" 
                      className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-16 h-16 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600 shadow-sm z-10">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-neutral-900">Order #{order.id}</h3>
                      <p className="text-sm text-neutral-500">Placed on {new Date(order.date || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(order.status || 'Processing')}`}>
                      {getStatusIcon(order.status || 'Processing')}
                      {order.status || 'Processing'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-sm text-neutral-600 line-clamp-1 max-w-md">
                      {order.items?.map((i: any) => i.name).join(', ') || 'Items from ONDC Network'}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg text-neutral-900">₹{order.total || '1,499'}</span>
                      <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">No orders yet</h2>
          <p className="text-neutral-500 mb-6">When you place an order, it will appear here.</p>
          <Link to="/search" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
            Start Shopping
          </Link>
        </div>
      )}
    </motion.div>
  );
}
