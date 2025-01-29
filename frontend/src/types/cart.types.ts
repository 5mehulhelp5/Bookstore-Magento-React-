import { ApolloQueryResult } from '@apollo/client';

export interface CartItem {
    id: number;
    product: {
      name: string;
      sku: string;
      image: {
        url: string;
        label: string;
      };
    };
    quantity: number;
    prices: {
      price: {
        value: number;
        currency: string;
      };
      row_total: {
        value: number;
        currency: string;
      };
    };
  }
  
export interface Cart {
    id: string;
    items: CartItem[];
    prices: {
      grand_total: {
        value: number;
        currency: string;
      };
    };
  }
  export interface CartContextType {
    cartId: string | null;
    items: CartItem[];
    totalAmount: number;
    loading: boolean;
    isOperationLoading: boolean;
    addToCart: (sku: string, quantity: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    isCartEmpty: boolean;
    refetch: () => Promise<ApolloQueryResult<any>>; // Adjusted type here
  
  }