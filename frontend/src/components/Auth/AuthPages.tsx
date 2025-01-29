import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMutation } from '@apollo/client';
import { CREATE_CUSTOMER } from '../../graphql/authMutations';

const AuthPages = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loginError, setLoginError] = useState('');

  // Register state
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    isSubscribed: false
  });
  const [registerError, setRegisterError] = useState('');

  const [createCustomerMutation] = useMutation(CREATE_CUSTOMER);

  const handleLoginSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoginError('');

    try {
      await login(loginData.email, loginData.password);
      navigate('/');
    } catch (err) {
      setLoginError('Invalid email or password');
    }
  };

  const handleRegisterSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setRegisterError('');

    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    try {
      await createCustomerMutation({
        variables: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          is_subscribed: formData.isSubscribed
        }
      });

      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setRegisterError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Account</h1>
          <div className="text-sm mt-2">
            <a href="/" className="text-gray-600 hover:text-[#bb1b1e]">Home</a>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-600">Account</span>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <button
              className={`px-6 py-2 font-light uppercase ${
                activeTab === 'login'
                  ? 'text-[#bb1b1e] border-b-2 border-[#bb1b1e]'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`px-6 py-2 font-light uppercase ${
                activeTab === 'register'
                  ? 'text-[#bb1b1e] border-b-2 border-[#bb1b1e]'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          <div className="bg-white p-8 shadow-md">
            {activeTab === 'login' ? (
              // Login Form
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {loginError}
                  </div>
                )}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold uppercase mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    className="w-full p-2 border-b border-gray-300 focus:border-[#bb1b1e] focus:outline-none transition-colors"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-semibold uppercase mb-2">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full p-2 border-b border-gray-300 focus:border-[#bb1b1e] focus:outline-none transition-colors"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({...loginData, rememberMe: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Remember Me</span>
                  </label>
                  <a href="/forgot-password" className="text-sm font-bold text-[#bb1b1e] hover:text-[#bb1b1e]">
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-[#bb1b1e] text-white font-bold py-2 px-4 transition-colors"
                >
                  Login
                </button>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {registerError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {registerError}
                  </div>
                )}
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="firstname" className="block text-sm font-semibold uppercase mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      value={formData.firstname}
                      onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                      className="w-full p-2 border-b border-gray-300 focus:border-[#bb1b1e] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="lastname" className="block text-sm font-semibold uppercase mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      value={formData.lastname}
                      onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                      className="w-full p-2 border-b border-gray-300 focus:border-[#bb1b1e] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="register-email" className="block text-sm font-semibold uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border-b border-gray-300 focus:border-[#bb1b1e] focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-sm font-semibold uppercase mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 border-b border-gray-300 focus:border-[#bb1b1e] focus:outline-none transition-colors"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-semibold uppercase mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full p-2 border-b border-gray-300 focus:border-[#bb1b1e] focus:outline-none transition-colors"
                    required
                    minLength={8}
                  />
                </div>
                <div className="py-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isSubscribed}
                      onChange={(e) => setFormData({...formData, isSubscribed: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Subscribe to newsletter</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-[#bb1b1e] text-white font-bold py-2 px-4 transition-colors"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;