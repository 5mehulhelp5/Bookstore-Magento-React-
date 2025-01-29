import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  CREATE_CART,
  ADD_TO_CART,
  GET_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  MERGE_CARTS,
  GET_CUSTOMER_CART,
} from '../../graphql/cartMutations';
import { CartContextType, CartItem } from '../../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartId, setCartId] = useState<string | null>(localStorage.getItem('cartId'));
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const [createCart] = useMutation(CREATE_CART);
  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART);
  const [mergeCarts] = useMutation(MERGE_CARTS);

  const { data: cartData, loading, refetch } = useQuery(GET_CART, {
    variables: { cartId },
    skip: !cartId,
    fetchPolicy: 'network-only',
  });

  const { data: customerCartData, refetch: refetchCustomerCart } = useQuery(GET_CUSTOMER_CART, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    const initializeCart = async () => {
      if (!cartId) {
        setIsOperationLoading(true);
        try {
          const { data } = await createCart();
          if (!data?.createEmptyCart) {
            throw new Error('Failed to create cart');
          }
          const newCartId = data.createEmptyCart;
          setCartId(newCartId);
          localStorage.setItem('cartId', newCartId);
          toast.success('Shopping cart initialized');
        } catch (error) {
          console.error('Error creating cart:', error);
          toast.error('Failed to initialize shopping cart');
        } finally {
          setIsOperationLoading(false);
        }
      }
    };

    initializeCart();
  }, [cartId, createCart]);

  const addToCart = async (sku: string, quantity: number) => {
    if (!cartId) {
      toast.error('No cart available');
      return;
    }

    setIsOperationLoading(true);
    try {
      const { data } = await addToCartMutation({
        variables: {
          cartId,
          sku,
          quantity,
        },
      });

      await refetch();
      toast.success('Item added to cart');
    } catch (error: any) {
      console.error('Add to Cart Error:', error.networkError || error.graphQLErrors || error.message);
      toast.error(`Failed to add item to cart: ${error.message}`);
      throw error;
    } finally {
      setIsOperationLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!cartId) return;

    setIsOperationLoading(true);
    try {
      await updateCartItemMutation({
        variables: {
          cartId,
          cartItemId: itemId,
          quantity,
        },
      });
      await refetch();
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update cart');
    } finally {
      setIsOperationLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!cartId) return;

    setIsOperationLoading(true);
    try {
      await removeFromCartMutation({
        variables: {
          cartId,
          cartItemId: itemId,
        },
      });
      await refetch();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsOperationLoading(false);
    }
  };

  const value: CartContextType = {
    cartId,
    items: cartData?.cart?.items || [],
    totalAmount: cartData?.cart?.prices?.grand_total?.value || 0,
    loading,
    isOperationLoading,
    addToCart,
    updateQuantity,
    removeItem,
    isCartEmpty: !cartData?.cart?.items?.length,
    refetch,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
