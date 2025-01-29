import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useCart } from '../components/Cart/CartContext';
import { GET_PRODUCT_DETAILS } from '../graphql/queries';
import Layout from '../components/Layout/Layout';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import { Product, MediaGalleryEntry, Review, Category } from '../types/product.types';

type QuantityChangeType = 'plus' | 'minus';

interface ProductDetailsData {
  products: {
    items: (Product & {
      description?: {
        html: string;
      };
      media_gallery?: MediaGalleryEntry[];
      reviews?: {
        items: Review[];
        page_info: {
          total_pages: number;
        };
      };
      stock_status?: string;
      related_products?: Product[];
    })[];
  };
}

const SingleProductPage: React.FC = () => {
  const { sku } = useParams<{ sku: string }>();
  const { addToCart, isOperationLoading } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('description');

  const { loading, error, data } = useQuery<ProductDetailsData>(GET_PRODUCT_DETAILS, {
    variables: { sku },
    skip: !sku,
  });

  const { product, averageRating, totalReviews } = useMemo(() => {
    const currentProduct = data?.products?.items[0];
    const reviews = currentProduct?.reviews?.items || [];
    
    if (!currentProduct) {
      return { product: undefined, averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + (review.average_rating || 0), 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return {
      product: currentProduct,
      averageRating: Number(avgRating.toFixed(1)),
      totalReviews: reviews.length
    };
  }, [data]);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">Error: {error.message}</div>;
  if (!product) return <div className="p-8">Product not found</div>;

  const handleQuantityChange = (type: QuantityChangeType): void => {
    setQuantity(prev => {
      if (type === 'minus' && prev > 1) return prev - 1;
      if (type === 'plus' && prev < 100) return prev + 1;
      return prev;
    });
  };

  const handleAddToCart = async (): Promise<void> => {
    try {
      if (product.sku) {
        await addToCart(product.sku, quantity);
        toast.success('Added to cart successfully!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      toast.error(errorMessage);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => {
      const starClass = i < Math.floor(rating)
        ? 'text-yellow-400 fill-current'
        : i < rating
          ? 'text-yellow-400 fill-[0.5]'
          : 'text-gray-300';
      return <Star key={i} size={16} className={starClass} />;
    });
  };

  return (
    <Layout>
      {/* Breadcrumbs Section */}
      <section className="mt-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-4xl font-light uppercase tracking-wider mb-4">{product.name}</h1>
            <div className="breadcrumbs">
              <span className="item">
                <a href="/" className="hover:text-red-600">Home &gt;</a>
              </span>
              <span className="item ml-2">Product Details</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image Gallery */}
            <div className="flex">
              <div className="w-1/4 pr-4">
                {product.media_gallery?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`mb-4 cursor-pointer border ${
                      activeImage === index ? 'border-gray-800' : 'border-gray-200'
                    }`}
                  >
                    <img src={image.url} alt={image.label || ''} className="w-full h-auto"/>
                  </div>
                ))}
              </div>
              <div className="w-3/4">
                <img
                  src={product.media_gallery?.[activeImage]?.url ?? product.image?.url}
                  alt={product.name}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info mt-3">
              <h3 className="text-3xl font-light uppercase tracking-wider mb-4">{product.name}</h3>
              <div className="product-price my-3">
  <span className="text-2xl text-red-600 font-bold mr-2">
    ${product.price_range?.minimum_price?.regular_price?.value ?? 'Price not available'}
  </span>
</div>

              {/* Rating Display */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(averageRating)}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating > 0 ? (
                    <>
                      <span className="font-medium">{averageRating}</span>/5
                      <span className="ml-1">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
                    </>
                  ) : (
                    'No reviews yet'
                  )}
                </span>
              </div>

              {product.description && (
                <div dangerouslySetInnerHTML={{ __html: product.description.html }} />
              )}
              
              <hr className="my-4" />

              {/* Quantity Selector */}
              <div className="product-quantity my-3">
                <div className="item-title mb-2">
                  <label className="text-sm font-semibold uppercase tracking-wider">Quantity</label>
                </div>
                <div className="flex items-center">
                  <div className="input-group bg-gray-100 inline-flex items-center max-w-[150px]">
                    <button
                      onClick={() => handleQuantityChange('minus')}
                      className="px-3 py-2 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-16 text-center bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max="100"
                    />
                    <button
                      onClick={() => handleQuantityChange('plus')}
                      className="px-3 py-2 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="action-buttons my-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOperationLoading}
                  className="bg-gray-900 text-white px-8 py-3 hover:bg-red-600 transition-colors disabled:bg-gray-400"
                >
                  {isOperationLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>

              <hr className="my-4" />

              {/* Product Meta */}
              <div className="meta-product">
                <div className="meta-item flex mb-1">
                  <span className="text-uppercase mr-2 font-semibold">SKU:</span>
                  <span>{product.sku}</span>
                </div>
                <div className="meta-item flex mb-1">
                  <span className="text-uppercase mr-2 font-semibold">Categories:</span>
                  <span>
                    {product.categories?.map((category: Category) => category.name).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="product-tabs bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="tabs-listing">
            <nav>
              <div className="nav flex justify-center border-b border-gray-200">
                {['Description', 'Reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-6 py-3 font-light uppercase tracking-wider relative
                      ${activeTab === tab.toLowerCase()
                        ? 'text-red-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600'
                        : 'text-gray-600 hover:text-red-600'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </nav>

            <div className="bg-gray-50 p-8 mt-4">
              {activeTab === 'description' && product.description && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.description.html }} />
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {product.reviews?.items.map((review, index) => (
                    <div key={index} className="flex items-start space-x-4 border-b border-gray-200 pb-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          {review.nickname.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h5 className="font-semibold mr-2">{review.nickname}</h5>
                          <div className="flex">
                            {renderStars(review.average_rating)}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.text}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SingleProductPage;