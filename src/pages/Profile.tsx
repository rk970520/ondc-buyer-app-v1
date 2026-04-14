import { useAuthStore } from '../store/authStore';
import { motion } from 'motion/react';
import { User, MapPin, Settings, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-neutral-500 mb-4">{user.email || user.identifier}</p>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase">
              <Shield className="w-3 h-3" /> {user.role || 'BUYER'}
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 text-neutral-700 font-medium">
              <MapPin className="w-5 h-5 text-neutral-400" /> Saved Addresses
            </button>
            <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 text-neutral-700 font-medium">
              <Settings className="w-5 h-5 text-neutral-400" /> Account Settings
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-50 transition-colors text-red-600 font-medium">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">First Name</label>
                <div className="text-neutral-900 font-medium p-3 bg-neutral-50 rounded-xl border border-neutral-100">{user.firstName || 'Not provided'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Last Name</label>
                <div className="text-neutral-900 font-medium p-3 bg-neutral-50 rounded-xl border border-neutral-100">{user.lastName || 'Not provided'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Email Address</label>
                <div className="text-neutral-900 font-medium p-3 bg-neutral-50 rounded-xl border border-neutral-100">{user.email || user.identifier || 'Not provided'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Phone Number</label>
                <div className="text-neutral-900 font-medium p-3 bg-neutral-50 rounded-xl border border-neutral-100">{user.phone ? `+${user.countryCode || '91'} ${user.phone}` : 'Not provided'}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-neutral-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-neutral-800 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Saved Addresses</h3>
              <button className="text-emerald-600 font-medium hover:underline text-sm">Add New</button>
            </div>
            <div className="border-2 border-emerald-500 bg-emerald-50 p-6 rounded-2xl relative">
              <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">DEFAULT</div>
              <h4 className="font-bold text-lg text-neutral-900 mb-1">Home</h4>
              <p className="text-neutral-600 leading-relaxed max-w-sm">
                Building Name, Street Name<br />
                Locality, Mumbai<br />
                Maharashtra, India - 400001
              </p>
              <div className="mt-4 flex gap-4">
                <button className="text-sm font-medium text-emerald-600 hover:underline">Edit</button>
                <button className="text-sm font-medium text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
