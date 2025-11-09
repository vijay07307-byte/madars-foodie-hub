import { Menu, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type HeaderProps = {
  onMenuClick: () => void;
  onCartClick: () => void;
};

export function Header({ onMenuClick, onCartClick }: HeaderProps) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchCartCount = async () => {
      const { data } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);

      if (data) {
        const total = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      }
    };

    fetchCartCount();

    const subscription = supabase
      .channel('cart_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${user.id}` }, () => {
        fetchCartCount();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            MADRAS FOODIE
          </h1>

          <button
            onClick={onCartClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-orange-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
