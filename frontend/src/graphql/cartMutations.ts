import { gql } from '@apollo/client';

export const CREATE_CART = gql`
  mutation CreateEmptyCart {
    createEmptyCart
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($cartId: String!, $sku: String!, $quantity: Float!) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cartId
        cart_items: [
          {
            data: {
              quantity: $quantity
              sku: $sku
            }
          }
        ]
      }
    ) {
      cart {
        items {
          id
          product {
            name
            sku
          }
          quantity
          prices {
            price {
              value
              currency
            }
          }
        }
        prices {
          grand_total {
            value
            currency
          }
        }
      }
    }
  }
`;

export const GET_CART = gql`
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      items {
        id
        product {
          name
          sku
          image {
            url
            label
          }
        }
        quantity
        prices {
          price {
            value
            currency
          }
          row_total {
            value
            currency
          }
        }
      }
      prices {
        grand_total {
          value
          currency
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($cartId: String!, $cartItemId: Int!, $quantity: Float!) {
    updateCartItems(
      input: {
        cart_id: $cartId
        cart_items: [
          {
            cart_item_id: $cartItemId
            quantity: $quantity
          }
        ]
      }
    ) {
      cart {
        items {
          id
          quantity
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartId: String!, $cartItemId: Int!) {
    removeItemFromCart(
      input: {
        cart_id: $cartId
        cart_item_id: $cartItemId
      }
    ) {
      cart {
        items {
          id
        }
      }
    }
  }
`;

export const MERGE_CARTS = gql`
  mutation MergeCards($sourceCartId: String!, $destinationCartId: String!) {
    mergeCarts(
      source_cart_id: $sourceCartId
      destination_cart_id: $destinationCartId
    ) {
      items {
        id
        quantity
      }
    }
  }
`;
export const GET_CUSTOMER_CART = gql`
  query GetCustomerCart {
    customerCart {
      id
      items {
        id
        product {
          name
          sku
        }
        quantity
      }
    }
  }
`;