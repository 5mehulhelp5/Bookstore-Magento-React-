import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import FeaturedProducts from '../components/FeaturedProducts';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto mt-20 mb-12 px-4">
        <h2 className="text-4xl mb-4">Welcome to Abdu's Bookstore!</h2>
        {isAuthenticated && user ? (
          <div>
            <p className="text-2xl mb-6">
              Hello, <strong>{user.firstname}</strong>! Discover our curated collection of books.
            </p>
            <div className="flex gap-3">
              <Link 
                to="/cart" 
                className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-[#bb1b1e] transition-colors"
              >
                View Cart
              </Link>
              <Link 
                to="/admin" 
                className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-[#bb1b1e] transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-4xl">
            Please {' '}
            <Link 
              to="/login" 
              className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-[#bb1b1e] transition-colors inline-block mx-2"
            >
              Sign-in
            </Link>
            {' '} or {' '}
            <Link 
              to="/register" 
              className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-[#bb1b1e] transition-colors inline-block mx-2"
            >
              Register
            </Link>
            {' '} to start shopping.
          </p>
        )}
      </div>
      <FeaturedProducts />
    </Layout>
  );
};

export default LandingPage;