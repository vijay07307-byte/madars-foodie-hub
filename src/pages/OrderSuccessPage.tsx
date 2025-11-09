import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Home } from 'lucide-react';
import { supabase, Order } from '../lib/supabase';

type OrderSuccessPageProps = {
  orderId: string;
  onGoHome: () => void;
};

export function OrderSuccessPage({ orderId, onGoHome }: OrderSuccessPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();

    const subscription = supabase
      .channel('order_status')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload) => {
        setOrder(payload.new as Order);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const getStatusMessage = () => {
    switch (order.status) {
      case 'pending':
        return 'Your order has been placed and is awaiting confirmation';
      case 'confirmed':
        return 'Your order has been confirmed';
      case 'preparing':
        return 'Your order is being prepared';
      case 'ready':
        return 'Your order is ready for pickup!';
      case 'completed':
        return 'Your order has been completed';
      default:
        return 'Order status updated';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
          <CheckCircle className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
          <p className="text-green-100">Thank you for your order</p>
        </div>

        <div className="p-8">
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-800">{order.order_number}</p>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold text-orange-600 capitalize">
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Payment</span>
                <span className="font-semibold text-green-600 capitalize">
                  {order.payment_status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-gray-800 text-xl">
                  ₹{order.final_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-800 mb-1">
                  {getStatusMessage()}
                </p>
                {order.status === 'preparing' && (
                  <p className="text-sm text-orange-700">
                    Estimated time: {order.estimated_time} minutes
                  </p>
                )}
                {order.status === 'ready' && (
                  <p className="text-sm text-orange-700">
                    Please collect your order from the canteen counter
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onGoHome}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all shadow-lg flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>

            <p className="text-center text-sm text-gray-500">
              You will receive a notification when your order is ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
