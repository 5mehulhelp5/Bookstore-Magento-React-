import React from 'react';
import { useCart } from '../components/Cart/CartContext';
import Layout from '../components/Layout/Layout';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { items, totalAmount, updateQuantity, removeItem, loading } = useCart();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
          <div>Loading cart...</div>
        </div>
      </Layout>
    );
  }

  if (!items.length) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
          <div className="text-center text-gray-500">
            Your cart is empty
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
      <div className="text-center mb-8">
          <h1 className="font-['Montserrat'] font-light tracking-wider uppercase text-[#141414] text-5xl">Shopping Cart</h1>
          <div className="text-sm mt-2">
            <a href="/" className="text-gray-600 hover:text-[#bb1b1e]">Home</a>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-600">Shopping Cart</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center p-6 border-b border-gray-200"
            >
              <img
                src={item.product.image.url}
                alt={item.product.image.label}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">
                  ${item.prices.price.value.toFixed(2)} each
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="px-3 py-1 border-r hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border-l hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                
                <span className="font-semibold">
                  ${item.prices.row_total.value.toFixed(2)}
                </span>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <Link to='/checkout'>
              <button className="mt-4 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
