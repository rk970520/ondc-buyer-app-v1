import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buyerDataApi } from '../api/buyerData';
import { motion } from 'motion/react';
import { Store, Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await buyerDataApi.getItem(id!);
        setProduct(res.data?.data || res.data || {
          id,
          name: 'Premium Organic Product',
          description: 'High quality product sourced directly from the best providers in the ONDC network. This item ensures maximum satisfaction and value for money.',
          price: { value: 499, currency: 'INR' },
          provider: { name: 'Baniya Store', rating: 4.5 },
          domain: 'ONDC:RET10',
          rating: 4.8,
          reviews: 124
        });
      } catch (error) {
        console.error('Failed to fetch product', error);
        // Fallback for demo
        setProduct({
          id,
          name: 'Premium Organic Product',
          description: 'High quality product sourced directly from the best providers in the ONDC network. This item ensures maximum satisfaction and value for money.',
          price: { value: 499, currency: 'INR' },
          provider: { name: 'Baniya Store', rating: 4.5 },
          domain: 'ONDC:RET10',
          rating: 4.8,
          reviews: 124
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({ ...product, quantity });
      toast.success('Added to cart');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-neutral-200 rounded-3xl" />;
  }

  if (!product) return <div>Product not found</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to results
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-neutral-100 rounded-3xl overflow-hidden border border-neutral-200">
            <img 
              src={(product.images && product.images[0]) || product.image || `https://picsum.photos/seed/${product.id}/800/800`} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200 cursor-pointer hover:border-emerald-500 transition-colors">
                <img 
                  src={(product.images && product.images[i]) || `https://picsum.photos/seed/${product.id}${i}/200/200`} 
                  alt="" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {product.domain || 'ONDC:RET10'}
            </span>
            <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">
              <Star className="w-4 h-4 fill-current" /> {product.rating || 4.5} ({product.reviews || 124} reviews)
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-neutral-200">
            <div className="text-4xl font-bold text-neutral-900">₹{typeof product.price === 'number' ? product.price : (product.price?.value || 499)}</div>
            <div className="text-lg text-neutral-400 line-through">₹{Math.round((typeof product.price === 'number' ? product.price : (product.price?.value || 499)) * 1.2)}</div>
            <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">20% OFF</div>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-8">
            {product.description || product.shortDescription || 'High quality product sourced directly from the best providers in the ONDC network. This item ensures maximum satisfaction and value for money.'}
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-neutral-700">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>Sold by <span className="font-semibold">{product.providerName || product.provider?.name || 'Baniya Store'}</span></span>
            </div>
            <div className="flex items-center gap-3 text-neutral-700">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>ONDC Verified Seller</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-700">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Standard delivery in 2-4 days</span>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-neutral-200 flex items-center gap-6">
            <div className="flex items-center bg-neutral-100 rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-neutral-600"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold text-neutral-900">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-neutral-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-full font-semibold text-lg transition-colors shadow-lg shadow-emerald-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
