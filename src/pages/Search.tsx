import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { buyerDataApi } from '../api/buyerData';
import { motion } from 'motion/react';
import { Store, Filter, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const domain = searchParams.get('domain') || '';
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let res;
        if (query) {
          res = await buyerDataApi.search({ type: 'item', searchTerm: query, page: 0, size: 20, domain });
        } else {
          res = await buyerDataApi.getItems({ page: 0, size: 20, domain });
        }
        setItems(res.data?.data?.list || res.data?.items || []);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, domain]);

  const handleAddToCart = (item: any) => {
    addItem({ ...item, quantity: 1 });
    toast.success('Added to cart');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 sticky top-24">
          <div className="flex items-center gap-2 font-semibold text-neutral-900 mb-6">
            <Filter className="w-5 h-5" /> Filters
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {['Grocery', 'Electronics', 'Fashion', 'Home'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-neutral-600">
                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm" />
                <span>-</span>
                <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">
            {query ? `Search results for "${query}"` : domain ? `${domain} Products` : 'All Products'}
          </h1>
          <p className="text-neutral-500 mt-1">{items.length} items found</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }}
                key={item.id || i} 
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
              >
                <Link to={`/product/${item.id || 'mock-id'}`} className="aspect-square bg-neutral-100 relative block overflow-hidden">
                  <img 
                    src={(item.images && item.images[0]) || item.image || `https://picsum.photos/seed/${item.id || i}/400/400`} 
                    alt={item.name || 'Product'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs font-medium text-emerald-600 mb-2">{item.domain || 'ONDC:RET10'}</div>
                  <Link to={`/product/${item.id || 'mock-id'}`} className="font-semibold text-neutral-900 mb-1 line-clamp-2 hover:text-emerald-600 transition-colors">
                    {item.name || 'Premium Product Name'}
                  </Link>
                  <p className="text-sm text-neutral-500 mb-4 flex items-center gap-1 mt-auto">
                    <Store className="w-3 h-3" /> {item.providerName || item.provider?.name || 'Baniya Store'}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <span className="text-lg font-bold text-neutral-900">₹{typeof item.price === 'number' ? item.price : (item.price?.value || '499')}</span>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="bg-neutral-100 hover:bg-emerald-600 hover:text-white text-neutral-900 p-2.5 rounded-xl transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">No results found</h2>
            <p className="text-neutral-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}
