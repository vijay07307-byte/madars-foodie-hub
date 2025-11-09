import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { supabase, CartItem, FoodItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
};

type CartItemWithDetails = CartItem & { food_items: FoodItem };

export function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchCartItems();
    }
  }, [isOpen, user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, food_items(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data as CartItemWithDetails[]);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await supabase.from('cart_items').delete().eq('id', itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateItemPrice = (item: CartItemWithDetails) => {
    const basePrice = item.food_items.price;
    const discount = item.food_items.discount_percentage;
    const discountedPrice = basePrice - (basePrice * discount) / 100;
    return discountedPrice * item.quantity;
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
    const discount = cartItems.reduce((sum, item) => {
      const originalPrice = item.food_items.price * item.quantity;
      const discountedPrice = calculateItemPrice(item);
      return sum + (originalPrice - discountedPrice);
    }, 0);
    return { subtotal, discount, total: subtotal };
  };

  const { subtotal, discount, total } = calculateTotals();

  const handleCheckout = () => {
    onCheckout();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="w-6 h-6 text-orange-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add some delicious items!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-4 flex gap-4"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.food_items.image_url ? (
                        <img
                          src={item.food_items.image_url}
                          alt={item.food_items.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {item.food_items.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.food_items.discount_percentage > 0 ? (
                          <>
                            <span className="text-orange-600 font-bold">
                              ₹{(item.food_items.price - (item.food_items.price * item.food_items.discount_percentage) / 100).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{item.food_items.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-800 font-bold">
                            ₹{item.food_items.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-6 bg-gray-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{(subtotal + discount).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
