import { gql } from '@apollo/client';

// Query for featured books - modified to work with the categories structure
export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($categoryIds: [String], $pageSize: Int = 4) {
    products(
      pageSize: $pageSize
      filter: {
        category_id: { in: $categoryIds }
      }
    ) {
      items {
        id
        name
        sku
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        small_image {
          url
          label
        }
        short_description {
          html
        }
        categories {
          id
          name
          url_key
        }
      }
      total_count
    }
  }
`;

// Main query for products with filtering and search
export const GET_PRODUCTS = gql`
  query GetProducts(
    $filters: ProductAttributeFilterInput,
    $search: String,
    $pageSize: Int = 20,
    $currentPage: Int = 1,
    $sort: ProductAttributeSortInput
  ) {
    products(
      filter: $filters,
      search: $search,
      pageSize: $pageSize,
      currentPage: $currentPage,
      sort: $sort
    ) {
      items {
        id
        name
        sku
        small_image {
          url
          label
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        description {
          html
        }
        categories {
          id
          name
          url_key
        }
      }
      page_info {
        total_pages
        current_page
        page_size
      }
      total_count
    }
  }
`;

// Query for book categories - modified to match the data patch structure
export const GET_CATEGORIES = gql`
  query GetCategories {
    categoryList(filters: { ids: { eq: "2" } }) {
      id
      name
      children {
        id
        name
        url_key
        url_path
        position
        level
        children {
          id
          name
          url_key
          url_path
          position
          level
        }
      }
    }
  }
`;

// Query for single book details - updated to match the data patch structure
export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        id
        sku
        name
        description {
          html
        }
        short_description {
          html
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        small_image {
          url
          label
        }
        media_gallery {
          url
          label
          position
        }
        categories {
          id
          name
          url_key
        }
        stock_status
  
        related_products {
          id
          name
          sku
          small_image {
            url
            label
          }
          price_range {
            minimum_price {
              regular_price {
                value
                currency
              }
            }
          }
        }
      }
    }
  }
`;

// Example usage for filtering by category
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: String!, $pageSize: Int = 20, $currentPage: Int = 1) {
    products(
      filter: { 
        category_id: { eq: $categoryId }
      }
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      items {
        id
        name
        sku
        small_image {
          url
          label
        }
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        categories {
          id
          name
          url_key
        }
      }
      page_info {
        total_pages
        current_page
        page_size
      }
      total_count
    }
  }
`;