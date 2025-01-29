import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useCart } from '../../components/Cart/CartContext';
import { GET_ORDER_HISTORY } from '../../graphql/orderQueries';
import { ADD_TO_CART } from '../../graphql/cartMutations';
import { Order, OrderHistoryItem } from '../../types/order.types';



const OrderHistory: React.FC = () => {
  const { data, loading } = useQuery<{ customerOrders: { items: Order[] } }>(GET_ORDER_HISTORY);
  const [reorderItems] = useMutation(ADD_TO_CART);
  const { refetch: refetchCart } = useCart();

  const handleReorder = async (orderItems: OrderHistoryItem[]) => {
    try {
      for (const item of orderItems) {
        await reorderItems({
          variables: {
            sku: item.product.sku,
            quantity: item.quantity
          }
        });
      }
      await refetchCart();
      toast.success('Items added to cart');
    } catch (error) {
      toast.error('Failed to add items to cart');
    }
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Order History</h2>

      {data?.customerOrders?.items.map((order) => (
        <div key={order.id} className="border-b pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <div>
              <span className="font-semibold">Order #{order.order_number}</span>
              <span className="ml-4 text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>

          <div className="mt-2">
            {order.items.map((item) => (
              <div key={item.id} className="text-sm text-gray-600">
                {item.product.name} x {item.quantity}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="font-semibold">
              Total: ${order.total.grand_total.value.toFixed(2)}
            </span>
            <button
              onClick={() => handleReorder(order.items)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reorder
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function for order status colors
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

export default OrderHistory;
