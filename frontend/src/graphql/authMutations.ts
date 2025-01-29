import { gql } from '@apollo/client';

// Generate Customer Token (Login)
export const GENERATE_CUSTOMER_TOKEN = gql`
  mutation GenerateCustomerToken(
    $email: String!, 
    $password: String!
  ) {
    generateCustomerToken(
      email: $email, 
      password: $password
    ) {
      token
    }
  }
`;

// Create Customer (Registration)
export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer(
    $firstname: String!, 
    $lastname: String!, 
    $email: String!, 
    $password: String!, 
    $is_subscribed: Boolean
  ) {
    createCustomerV2(
      input: {
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        is_subscribed: $is_subscribed
      }
    ) {
      customer {
        id
        firstname
        lastname
        email
      }
    }
  }
`;

// Reset Password
export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordResetEmail(email: $email)
  }
`;