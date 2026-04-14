import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buyerDataApi } from '../api/buyerData';
import { motion } from 'motion/react';
import { Search, ShoppingBag, Store, ArrowRight } from 'lucide-react';

export default function Home() {
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await buyerDataApi.getDomains();
        setDomains(res.data?.data?.list || []);
      } catch (error) {
        console.error('Failed to fetch domains', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDomains();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/shopping/1920/1080?blur=4')] bg-cover bg-center mix-blend-overlay opacity-40" />
        <div className="relative px-8 py-24 sm:px-16 sm:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6">
            Shop the ONDC Network
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mb-10">
            Discover millions of products from local sellers and top brands, all in one place.
          </p>
          <div className="w-full max-w-2xl flex bg-white rounded-full p-2 shadow-xl">
            <input 
              type="text" 
              placeholder="What are you looking for today?" 
              className="flex-1 px-6 py-3 bg-transparent outline-none text-neutral-900"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Explore Categories</h2>
          <Link to="/search" className="text-emerald-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {domains.length > 0 ? domains.map((domain) => (
              <Link 
                key={domain.id || domain.name} 
                to={`/search?domain=${domain.name}`}
                className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-neutral-700 text-center">{domain.name || domain.description || 'Category'}</span>
              </Link>
            )) : (
              // Mock data if API fails or returns empty
              ['Grocery', 'F&B', 'Fashion', 'Electronics', 'Home & Decor', 'Health'].map((name) => (
                <Link 
                  key={name} 
                  to={`/search?domain=${name}`}
                  className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
                >
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 text-center">{name}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </section>

      {/* Featured Items */}
      <section>
        <h2 className="text-2xl font-bold text-neutral-900 mb-8">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-neutral-100 relative">
                <img 
                  src={`https://picsum.photos/seed/product${i}/400/400`} 
                  alt="Product" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-medium text-emerald-600 mb-2">ONDC:RET10</div>
                <h3 className="font-semibold text-neutral-900 mb-1 truncate">Premium Quality Product</h3>
                <p className="text-sm text-neutral-500 mb-4 flex items-center gap-1">
                  <Store className="w-3 h-3" /> Baniya Store
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-neutral-900">₹499</span>
                  <button className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
