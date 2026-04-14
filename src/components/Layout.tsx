import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Home, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-neutral-900">ONDC Buyer</span>
            </Link>

            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, categories, providers..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-transparent rounded-full focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/search?q=${(e.target as HTMLInputElement).value}`);
                    }
                  }}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/cart" className="relative text-neutral-600 hover:text-emerald-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 text-neutral-600 hover:text-emerald-600 transition-colors">
                    <User className="h-6 w-6" />
                    <span className="hidden sm:block font-medium">{user.firstName || 'Profile'}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-neutral-400 hover:text-red-600 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-neutral-500 text-sm">
            © {new Date().getFullYear()} ONDC Buyer App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
