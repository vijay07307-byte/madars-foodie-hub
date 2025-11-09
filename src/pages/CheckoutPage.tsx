import { useEffect, useState } from 'react';
import { supabase, CartItem, FoodItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Smartphone, ChevronLeft } from 'lucide-react';

type CheckoutPageProps = {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
};

type CartItemWithDetails = CartItem & { food_items: FoodItem };

export function CheckoutPage({ onBack, onOrderComplete }: CheckoutPageProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('cart_items')
        .select('*, food_items(*)')
        .eq('user_id', user.id);

      if (data) {
        setCartItems(data as CartItemWithDetails[]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const calculateItemPrice = (item: CartItemWithDetails) => {
    const basePrice = item.food_items.price;
    const discount = item.food_items.discount_percentage;
    const discountedPrice = basePrice - (basePrice * discount) / 100;
    return discountedPrice * item.quantity;
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const originalPrice = item.food_items.price * item.quantity;
      return sum + originalPrice;
    }, 0);

    const discount = cartItems.reduce((sum, item) => {
      const originalPrice = item.food_items.price * item.quantity;
      const discountedPrice = calculateItemPrice(item);
      return sum + (originalPrice - discountedPrice);
    }, 0);

    const total = subtotal - discount;
    return { subtotal, discount, total };
  };

  const generateOrderNumber = () => {
    return `MF${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  const placeOrder = async () => {
    if (!user || cartItems.length === 0) return;

    setLoading(true);

    try {
      const { subtotal, discount, total } = calculateTotals();
      const orderNumber = generateOrderNumber();

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: subtotal,
          discount_amount: discount,
          final_amount: total,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: 'completed',
          order_number: orderNumber,
          estimated_time: 15,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        food_item_id: item.food_item_id,
        quantity: item.quantity,
        price: calculateItemPrice(item) / item.quantity,
        customization: item.customization,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await supabase.from('cart_items').delete().eq('user_id', user.id);

      onOrderComplete(order.id);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, discount, total } = calculateTotals();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={onBack}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Go back to menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.food_items.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{calculateItemPrice(item).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
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
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Smartphone className="w-6 h-6 mr-3 text-orange-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">UPI</p>
                    <p className="text-sm text-gray-500">Google Pay, PhonePe, etc.</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    paymentMethod === 'upi'
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'upi' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 mr-3 text-orange-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Card</p>
                    <p className="text-sm text-gray-500">Credit or Debit Card</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'card' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3 text-orange-600 font-bold">₹</div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Cash</p>
                    <p className="text-sm text-gray-500">Pay at counter</p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    paymentMethod === 'cash'
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'cash' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
