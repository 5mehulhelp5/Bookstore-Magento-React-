export interface Money {
  value: number;
  currency: string;
}

export interface Price {
  regularPrice: {
    amount: Money;
  };
  specialPrice?: {
    amount: Money;
  };
}

export interface MediaGalleryEntry {
  url: string;
  label?: string;
  position?: number;
}

export interface Review {
  summary: string;
  text: string;
  nickname: string;
  average_rating: number;
  created_at: string;
}

export interface Reviews {
  items: Review[];
  page_info: {
    total_pages: number;
  };
}

export interface Category {
  id: string;
  name: string;
  url_key: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  image?: {
    url: string;
    label: string;
  };
  short_description?: {
    html: string;
  };
  categories?: Category[];
  price_range?: {
    minimum_price: {
      regular_price: {
        value: number;
        currency: string;
      };
    };
  };
  price?: {
    regularPrice: {
      amount: {
        value: number;
        currency: string;
      };
    };
  };
}

export interface CategoryChild {
  id: string;
  name: string;
  url_key: string;
  url_path: string;
  position: number;
  level: number;
  children?: CategoryChild[];
}

export interface RootCategory {
  id: string;
  name: string;
  children: CategoryChild[];
}


