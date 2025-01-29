import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_PRODUCTS } from '../graphql/queries';
import ProductCard from '../components/Shop/ProductCard';
import { Product } from '../types/product.types';

const FeaturedProducts: React.FC = () => {
  const { loading, error, data } = useQuery(GET_FEATURED_PRODUCTS, {
    variables: {
      categoryIds: ['2'],
      pageSize: 4,
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#bb1b1e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        Error loading featured books: {error.message}
      </div>
    );
  }

  if (!data?.products?.items?.length) {
    return <div className="text-center py-8">No featured books available</div>;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.products.items.map((product: Product) => {
          // Transform the product structure to match ProductCard's expectations
          const transformedProduct = {
            ...product,
            price: {
              regularPrice: {
                amount: {
                  value: product.price_range?.minimum_price?.regular_price?.value || 0,
                  currency: product.price_range?.minimum_price?.regular_price?.currency || 'USD'
                },
              },
            },
          };

          return (
            <div key={product.id} className="relative">
              <div className="absolute top-2 right-2 bg-[#bb1b1e] text-white px-2 py-1 rounded text-sm">
                {product.categories?.[0]?.name || 'Uncategorized'}
              </div>
              <ProductCard product={transformedProduct} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProducts;