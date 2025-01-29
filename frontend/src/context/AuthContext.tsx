import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { GENERATE_CUSTOMER_TOKEN } from '../graphql/authMutations';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('customer_token')
  );
  const [user, setUser] = useState<AuthContextType['user']>(null);

  const [generateTokenMutation] = useMutation(GENERATE_CUSTOMER_TOKEN);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await generateTokenMutation({
        variables: { email, password }
      });

      // Store token in localStorage
      localStorage.setItem('customer_token', data.generateCustomerToken.token);
      
      // Update authentication state
      setIsAuthenticated(true);
      
      // You might want to fetch user details here and set user state
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('customer_token');
    
    // Reset authentication state
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
