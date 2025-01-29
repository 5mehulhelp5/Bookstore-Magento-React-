import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/queries';

interface Category {
  id: string;
  name: string;
}

interface FilterBarProps {
  setFilters: (filters: any) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ setFilters }) => {
  // Fetch categories
  const { 
    loading: categoriesLoading, 
    error: categoriesError, 
    data: categoriesData 
  } = useQuery(GET_CATEGORIES);

  // State for categories and form inputs
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State for local filter inputs
  const [localMinPrice, setLocalMinPrice] = useState(
    searchParams.get('min_price') || ''
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    searchParams.get('max_price') || ''
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );

  // Update categories when data is loaded
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.categories.items);
    }
  }, [categoriesData]);

  // Apply filters method
  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
  
    // Update category
    if (selectedCategory) {
      newParams.set('category', selectedCategory);
    } else {
      newParams.delete('category');
    }
  
    // Update price range
    if (localMinPrice) {
      newParams.set('min_price', localMinPrice);
    } else {
      newParams.delete('min_price');
    }
  
    if (localMaxPrice) {
      newParams.set('max_price', localMaxPrice);
    } else {
      newParams.delete('max_price');
    }
  
    // Reset to first page
    newParams.set('page', '1');
  
    // Update URL
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    // Reset local states
    setSelectedCategory('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    
    // Clear URL params, but keep search term if exists
    const newParams = new URLSearchParams();
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      newParams.set('search', searchTerm);
    }
    setSearchParams(newParams);
  };

  // Update filters when URL params change
  useEffect(() => {
    const filters: Record<string, any> = {};

    // Category filter
    if (searchParams.get('category')) {
      filters.category_id = { eq: searchParams.get('category') };
    }

    // Price range filter
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) {
        filters.price.from = parseFloat(minPrice); // Correct field name
      }
      if (maxPrice) {
        filters.price.to = parseFloat(maxPrice); // Correct field name
      }
    }

    // Update parent component's filters
    setFilters(filters);
  }, [searchParams, setFilters]);

  // Loading and error states
  if (categoriesLoading) return <div>Loading categories...</div>;
  if (categoriesError) return <div>Error loading categories: {categoriesError.message}</div>;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="p-2 rounded border"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Price Range Inputs */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min Price"
          value={localMinPrice}
          onChange={(e) => setLocalMinPrice(e.target.value)}
          className="p-2 rounded border w-24"
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max Price"
          value={localMaxPrice}
          onChange={(e) => setLocalMaxPrice(e.target.value)}
          className="p-2 rounded border w-24"
        />
      </div>

      {/* Filter and Clear Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
