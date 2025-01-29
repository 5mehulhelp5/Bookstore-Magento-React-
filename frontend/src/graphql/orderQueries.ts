import { gql } from '@apollo/client';

export const PLACE_ORDER = gql`
  mutation PlaceOrder(
    $cartId: String!
    $shippingAddress: ShippingAddressInput!
    $billingAddress: BillingAddressInput!
    $paymentMethod: PaymentMethodInput!
  ) {
    placeOrder(
      input: {
        cart_id: $cartId
        shipping_address: $shippingAddress
        billing_address: $billingAddress
        payment_method: $paymentMethod
      }
    ) {
      order {
        order_number
        shipping_address {
          firstname
          lastname
          street
          city
          region
          postcode
          telephone
        }
        total {
          grand_total {
            value
            currency
          }
        }
      }
    }
  }
`;

export const GET_ORDER_HISTORY = gql`
  query GetOrderHistory {
    customerOrders {
      items {
        id
        order_number
        created_at
        status
        total {
          grand_total {
            value
            currency
          }
        }
        items {
          product_name
          quantity_ordered
          product_sale_price {
            value
            currency
          }
        }
      }
    }
  }
`;
export const GET_ORDER_DETAILS = gql`
query GetOrderDetails($orderNumber: String!) {
  order(order_number: $orderNumber) {
    order_number
    created_at
    status
    items {
      id
      product_name
      quantity_ordered
      product_sale_price {
        value
        currency
      }
    }
    shipping_address {
      firstname
      lastname
      street
      city
      state
      postalCode
      country
      phone
    }
    total {
      grand_total {
        value
        currency
      }
    }
  }
}
`;