import React, { useState } from 'react';
import { useCart } from '../components/Cart/CartContext';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '../components/Layout/Layout';
import { ShippingAddress } from '../types/order.types';
import { PLACE_ORDER } from '../graphql/orderQueries';
import { toast } from 'react-toastify';

const CheckoutPage: React.FC = () => {
  const { register, handleSubmit } = useForm<ShippingAddress>();
  const { items, totalAmount, cartId } = useCart();
  const [placeOrder] = useMutation(PLACE_ORDER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (shippingData: ShippingAddress) => {
    setLoading(true);
    setError(null);

    try {
      // Initialize Stripe with the correct key
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);
      if (!stripe) throw new Error('Stripe failed to initialize.');

      // Place order with the server
      const { data } = await placeOrder({
        variables: {
          cartId,
          shippingAddress: shippingData,
          billingAddress: shippingData, // Assuming same for billing
          paymentMethod: {
            code: 'stripe',
            stripe: {
              payment_method_id: 'pm_card_visa' // Placeholder for actual Stripe payment method ID
            }
          }
        }
      });

      // Redirect to confirmation page if the order is successful
      if (data?.placeOrder?.order?.order_number) {
        toast.success('Order placed successfully!');
        window.location.href = `/order-confirmation/${data.placeOrder.order.order_number}`;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit(handleCheckout)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">First Name</label>
                  <input
                    {...register('firstname', { required: true })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Last Name</label>
                  <input
                    {...register('lastname', { required: true })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Street</label>
                  <input
                    {...register('street', { required: true })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">City</label>
                  <input
                    {...register('city', { required: true })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">State</label>
                  <input
                    {...register('state', { required: true })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Postal Code</label>
                  <input
                    {...register('postalCode', { required: true })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Country</label>
                  <input
                    {...register('country', { required: true })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2">Phone</label>
                  <input
                    {...register('phone', { required: true })}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg mt-6"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              
              {error && (
                <div className="text-red-500 mt-4">{error}</div>
              )}
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-4">
                <span>{item.product.name} x {item.quantity}</span>
                <span>${item.prices.row_total.value.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
