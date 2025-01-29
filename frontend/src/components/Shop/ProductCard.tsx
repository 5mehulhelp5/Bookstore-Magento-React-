import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Product } from '../../types/product.types';
import { useCart } from '../../components/Cart/CartContext';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isOperationLoading } = useCart();

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/product/${product.sku}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!product?.sku) {
      toast.error('Book SKU is missing. Unable to add this book to the cart.');
      return;
    }

    try {
      await addToCart(product.sku, 1);
      toast.success(`${product.name || 'Book'} has been added to your cart!`);
    } catch (error: any) {
      console.error('Failed to add book to cart:', error);
      toast.error('An error occurred while adding the book to your cart. Please try again.');
    }
  };

  return (
    <Link to={`/product/${product.sku}`} className="block">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-shadow hover:shadow-xl">
        {/* Image Section */}
        <div className="relative">
          {product.image?.url ? (
            <img
              src={product.image.url}
              alt={product.image.label || product.name}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Book Cover Not Available</span>
            </div>
          )}
          
          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md"
          >
            <svg
              className="w-5 h-5 text-[#141414] hover:text-[#bb1b1e] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>

          {/* Category Badge */}
          {product.categories?.[0] && (
            <div className="absolute top-4 left-4 bg-[#141414]/80 text-white px-3 py-1 rounded-full text-sm">
              {product.categories[0].name}
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="p-4">
          {/* Book Title */}
          <h3 className="font-bold text-lg text-[#141414] font-['Montserrat'] line-clamp-1">
            {product.name || 'Untitled Book'}
          </h3>
          
          {/* Book Description */}
          {product.short_description?.html ? (
            <div 
              className="mt-2 text-sm text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: product.short_description.html }} 
            />
          ) : (
            <p className="mt-2 text-sm text-gray-500">No description available.</p>
          )}

          {/* Price and Add to Cart Button */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-[#bb1b1e] font-bold">
              {product?.price?.regularPrice?.amount?.value
                ? `$${product.price.regularPrice.amount.value.toFixed(2)}`
                : 'Price not available'}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={isOperationLoading || !product?.sku}
              className={`${
                isOperationLoading || !product?.sku
                  ? 'bg-[#bb1b1e]/50 cursor-not-allowed'
                  : 'bg-[#bb1b1e] hover:bg-[#141414]'
              } text-white px-4 py-2 rounded transition-colors relative`}
            >
              {isOperationLoading ? (
                <>
                  <span className="opacity-0">Add to Cart</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  </div>
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;