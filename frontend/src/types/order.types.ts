export interface OrderItem {
  id: number;
  product_name: string;
  quantity_ordered: number;
  product_sale_price: {
    value: number;
    currency: string;
  };
}

export interface OrderHistoryItem {
  id: number;
  product: {
    name: string;
    sku: string;
  };
  quantity: number;
}

export interface ShippingAddress {
  firstname: string;  // Changed from firstName to match API
  lastname: string;   // Changed from lastName to match API
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  items: OrderHistoryItem[];
  total: {
    grand_total: {
      value: number;
      currency: string;
    };
  };
}

export interface OrderData {
  order: {
    order_number: string;
    created_at: string;
    items: OrderItem[];
    total: {
      grand_total: {
        value: number;
        currency: string;
      };
    };
  };
}
