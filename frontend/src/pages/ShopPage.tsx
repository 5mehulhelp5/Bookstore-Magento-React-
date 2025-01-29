import React, { useState, useMemo, FormEvent } from 'react';
import { useQuery } from '@apollo/client';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { Product, CategoryChild, RootCategory } from '../types/product.types';
import { GET_CATEGORIES, GET_PRODUCTS } from '../graphql/queries';
import ProductCard from '../components/Shop/ProductCard';
import '../index.css';

const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Form state values
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [categoryValue, setCategoryValue] = useState(searchParams.get('category') || '');
  const [minPriceValue, setMinPriceValue] = useState(searchParams.get('min_price') || '');
  const [maxPriceValue, setMaxPriceValue] = useState(searchParams.get('max_price') || '');

  // URL parameters
  const urlSearchTerm = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlMinPrice = searchParams.get('min_price') || '';
  const urlMaxPrice = searchParams.get('max_price') || '';

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );
  const [filters, setFilters] = useState<Record<string, any>>({});
  const pageSize = 12;

  // GraphQL queries
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES);

  // Categories for dropdown
  const categories = useMemo(() => {
    return (categoriesData?.categoryList[0] as RootCategory)?.children?.map(
      (category: CategoryChild) => ({ 
        id: category.id, 
        name: category.name 
      })
    ) || [];
  }, [categoriesData]);

  // Combine URL parameters with existing filters
  const combinedFilters = useMemo(() => {
    const baseFilters: Record<string, any> = { ...filters };

    // Category filter
    if (urlCategory) {
      baseFilters.category_id = { eq: urlCategory };
    }

    // Price range filter
    if (urlMinPrice || urlMaxPrice) {
      baseFilters.price = {};
      if (urlMinPrice) {
        baseFilters.price.from = parseFloat(urlMinPrice);
      }
      if (urlMaxPrice) {
        baseFilters.price.to = parseFloat(urlMaxPrice);
      }
    }

    return baseFilters;
  }, [urlCategory, urlMinPrice, urlMaxPrice, filters]);

  // GraphQL query for products
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: {
      filters: combinedFilters,
      search: urlSearchTerm || undefined,
      pageSize,
      currentPage,
    },
    onError: (error) => {
      console.error('Full GraphQL Error:', error);
    },
  });

  // Handle form submission
  const handleSubmitFilter = (e: FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    // Update search parameter
    if (searchValue) {
      newParams.set('search', searchValue);
    } else {
      newParams.delete('search');
    }
    
    // Update category parameter
    if (categoryValue) {
      newParams.set('category', categoryValue);
    } else {
      newParams.delete('category');
    }
    
    // Update price parameters
    if (minPriceValue) {
      newParams.set('min_price', minPriceValue);
    } else {
      newParams.delete('min_price');
    }
    
    if (maxPriceValue) {
      newParams.set('max_price', maxPriceValue);
    } else {
      newParams.delete('max_price');
    }
    
    // Reset to first page when filtering
    newParams.set('page', '1');
    
    navigate(`/products?${newParams.toString()}`);
  };

  // Handle reset
  const handleReset = () => {
    setSearchValue('');
    setCategoryValue('');
    setMinPriceValue('');
    setMaxPriceValue('');
    navigate('/products');
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    navigate(`/products?${newParams.toString()}`);
    setCurrentPage(page);
  };

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data?.products?.total_count / pageSize) || 0;
  }, [data, pageSize]);

  // Filter products
  const filteredProducts = useMemo(() => {
    const minPrice = parseFloat(urlMinPrice || '0');
    const maxPrice = parseFloat(urlMaxPrice || '9999');
  
    return (
      data?.products?.items?.filter((product: Product) => {
        const price = product.price_range?.minimum_price?.regular_price?.value ?? 0;
        return price >= minPrice && price <= maxPrice;
      }) || []
    );
  }, [data, urlMinPrice, urlMaxPrice]);

  // Early return for loading and error states
  if (loading) return <div>Loading...</div>;
  if (categoriesLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;
  if (categoriesError) return <div>Error loading categories: {categoriesError.message}</div>;

  return (
    <Layout>
      <div className="container mx-auto mt-20">
        <div className="row mb-8">
          <div className="col-12 text-center py-16 pb-0">
            <h1 className="font-['Montserrat'] font-light tracking-wider uppercase text-[#141414] text-5xl">
              {urlSearchTerm ? 'Search Results' : 'Shop'}
            </h1>
            <div className="breadcrumbs mt-2">
              <span className="item">
                <Link to="/" className="text-[#141414] hover:text-[#bb1b1e]">Home &gt;</Link>
              </span>
              <span className="item ml-2 text-[#777777]">
                {urlSearchTerm ? 'Search Results' : 'Shop'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap p-6">
          <aside className="w-full lg:w-1/4 pr-8 mb-6 lg:mb-0">
            <div className="sidebar">
              <form onSubmit={handleSubmitFilter}>
                {/* Search Bar */}
                <div className="widget-menu">
                  <div className="widget-search-bar">
                    <div className="relative flex justify-between items-center py-1">
                      <input
                        className="search-field w-full border-b border-[#141414] focus:outline-none focus:border-[#bb1b1e] transition-colors"
                        placeholder="Search"
                        type="search"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                      <button type="submit" className="absolute right-0">
                        <i className="fas fa-search text-[#141414]"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="widget-product-categories pt-5">
                  <h5 className="widget-title text-lg uppercase font-['Montserrat'] tracking-wider mb-4">
                    Categories
                  </h5>
                  <select 
                    className="w-full p-2 border border-[#141414] focus:outline-none focus:border-[#bb1b1e] transition-colors"
                    value={categoryValue}
                    onChange={(e) => setCategoryValue(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="widget-price-filter pt-5">
                  <h5 className="widget-title text-lg uppercase font-['Montserrat'] tracking-wider mb-4">
                    Price Range
                  </h5>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Min Price</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-[#141414] focus:outline-none focus:border-[#bb1b1e] transition-colors"
                        value={minPriceValue}
                        onChange={(e) => setMinPriceValue(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Max Price</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-[#141414] focus:outline-none focus:border-[#bb1b1e] transition-colors"
                        value={maxPriceValue}
                        onChange={(e) => setMaxPriceValue(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-4 mt-6">
                  <button 
                    type="submit"
                    className="bg-[#141414] text-white px-4 py-2 hover:bg-[#bb1b1e] transition-colors"
                  >
                    Filter
                  </button>
                  <button 
                    type="button"
                    onClick={handleReset}
                    className="bg-[#141414] text-white px-4 py-2 hover:bg-[#bb1b1e] transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="w-full lg:w-3/4">
            <div className="flex flex-wrap -mx-4">
              {filteredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-4 mb-6">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center text-[#777777] hover:text-[#bb1b1e] disabled:text-gray-400"
                >
                  <svg width="24" height="24" className="transform rotate-180">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" fill="none" strokeWidth="2"/>
                  </svg>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 ${
                      currentPage === page
                        ? 'text-[#bb1b1e] bg-[#f5f5f5] rounded-md' 
                        : 'text-[#777777] hover:text-[#bb1b1e] hover:bg-[#f5f5f5] rounded-md transition-colors'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center text-[#777777] hover:text-[#bb1b1e] disabled:text-gray-400"
                >
                  <svg width="24" height="24">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" fill="none" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;