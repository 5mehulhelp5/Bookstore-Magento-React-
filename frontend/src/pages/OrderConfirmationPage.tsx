import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ORDER_DETAILS } from '../graphql/orderQueries';
import Layout from '../components/Layout/Layout';
import { CheckCircle } from 'lucide-react';
import { OrderData, OrderItem } from '../types/order.types';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data, loading, error } = useQuery<OrderData>(GET_ORDER_DETAILS, {
    variables: { orderNumber: orderId },
    skip: !orderId,
    onCompleted: () => {
      toast.success('Order details loaded successfully!');
    },
    onError: () => {
      toast.error('Failed to load order details.');
    },
  });

  if (loading) return <div>Loading...</div>;

  const order = data?.order;
  if (!order) {
    toast.warn('Order not found.');
    return <div>Order not found.</div>;
  }

  const estimatedDeliveryDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
          <div className="text-green-500 mb-6 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
            <p>Thank you for your order!</p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Order Details</h2>
            <p>Order Number: {order.order_number}</p>
            <p>Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <p>Estimated Delivery: {estimatedDeliveryDate}</p>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-4">Items</h2>
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>
                  {item.product_name} x {item.quantity_ordered}
                </span>
                <span>
                  {item.product_sale_price.currency}{' '}
                  {item.product_sale_price.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
