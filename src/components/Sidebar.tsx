import { X, User, FileText, Home, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
};

export function Sidebar({ isOpen, onClose, onNavigate, currentPage }: SidebarProps) {
  const { profile, signOut } = useAuth();

  const handleNavigation = (page: string) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 mb-6 text-white">
            <div className="flex items-center mb-2">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">User Details</span>
            </div>
            <p className="text-sm text-orange-100">{profile?.full_name || 'Guest User'}</p>
            <p className="text-xs text-orange-100 mt-1">{profile?.email}</p>
            <p className="text-xs text-orange-100 mt-1 capitalize">
              Role: {profile?.role || 'customer'}
            </p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => handleNavigation('home')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => handleNavigation('orders')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'orders'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              <span className="font-medium">My Orders</span>
            </button>

            {profile?.role === 'canteen' && (
              <button
                onClick={() => handleNavigation('canteen')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  currentPage === 'canteen'
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Canteen Management</span>
              </button>
            )}

            <button
              onClick={() => handleNavigation('terms')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'terms'
                  ? 'bg-orange-100 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              <span className="font-medium">Terms & Conditions</span>
            </button>
          </nav>

          <button
            onClick={() => signOut()}
            className="w-full mt-8 bg-red-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
