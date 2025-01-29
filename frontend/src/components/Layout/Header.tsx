import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { CategoryChild, RootCategory } from '../../types/product.types';
import { GET_CATEGORIES } from '../../graphql/queries';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const categories = useMemo(() => {
    return (categoriesData?.categoryList[0] as RootCategory)?.children?.map(
      (category: CategoryChild) => ({ 
        id: category.id, 
        name: category.name 
      })
    ) || [];
  }, [categoriesData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  return (
    <header className="bg-white w-full">
      <nav className="px-3">
        <div className="container mx-auto">
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center justify-end p-4">
            <button 
              onClick={() => setIsOffcanvasOpen(true)}
              className="p-2"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-between items-center py-4">
            {/* Left Nav Items */}
            <ul className="flex items-center space-x-8">
              <li>
                <Link to="/products" className="text-sm font-medium uppercase hover:text-red-600 transition-colors">
                  Shop
                </Link>
              </li>
              <li className="relative">
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center text-sm font-medium uppercase hover:text-red-600 transition-colors"
                >
                  Categories
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoriesOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-sm z-50">
                    <ul className="py-2">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link 
                            to={`/products?category=${category.id}`}
                            className="block px-4 py-2 text-gray-800 hover:text-red-600 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            </ul>

            {/* Logo */}
            <Link to="/home" className="mx-4">
              <img src="/images/logo.png" alt="Logo" className="size-44" />
            </Link>

            {/* Right Nav Items */}
            <ul className="flex items-center space-x-8">
              {/* Search */}
              <li className="relative">
                <div className="relative group border hover:border-[#bb1b1e] border-gray-200 rounded-md px-3 py-1">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="search"
                      placeholder="Search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="w-40 outline-none text-sm"
                    />
                    <button type="submit" className="ml-2">
                      <Search className="h-4 w-4 text-gray-500" />
                    </button>
                  </form>
                </div>
              </li>

              {/* Auth Links */}
              <li>
                {isAuthenticated ? (
                  <button 
                    onClick={logout}
                    className="text-sm font-medium uppercase hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    className="text-sm font-medium uppercase hover:text-red-600 transition-colors"
                  >
                    Sign-in
                  </Link>
                )}
              </li>

              {/* Cart */}
              <li>
                <Link to="/cart" className="hover:text-red-600 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </li>

              {/* Orders (if authenticated) */}
              {isAuthenticated && (
                <li>
                  <Link 
                    to="/orders"
                    className="text-sm font-medium uppercase hover:text-red-600 transition-colors"
                  >
                    My Orders
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Mobile Menu (Offcanvas) */}
          <div className={`lg:hidden fixed inset-y-0 right-0 w-4/5 bg-white shadow-lg transform ${isOffcanvasOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <Link to="/home">
                  <img src="/images/logo.png" alt="Logo" className="h-20 w-20" />
                </Link>
                <button 
                  onClick={() => setIsOffcanvasOpen(false)}
                  className="p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <ul className="space-y-6">
                <li>
                  <Link 
                    to="/products" 
                    className="block text-sm font-medium uppercase hover:text-red-600"
                    onClick={() => setIsOffcanvasOpen(false)}
                  >
                    Shop
                  </Link>
                </li>
                <li className="relative">
                  <button className="flex items-center text-sm font-medium uppercase w-full hover:text-red-600">
                    Categories
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul className="mt-2 ml-4 space-y-2">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link 
                          to={`/products?category=${category.id}`}
                          className="block text-sm text-gray-600 hover:text-red-600"
                          onClick={() => setIsOffcanvasOpen(false)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link 
                        to="/orders" 
                        className="block text-sm font-medium uppercase hover:text-red-600"
                        onClick={() => setIsOffcanvasOpen(false)}
                      >
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          logout();
                          setIsOffcanvasOpen(false);
                        }} 
                        className="block text-sm font-medium uppercase hover:text-red-600"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link 
                      to="/login" 
                      className="block text-sm font-medium uppercase hover:text-red-600"
                      onClick={() => setIsOffcanvasOpen(false)}
                    >
                      Sign-in / Register
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;