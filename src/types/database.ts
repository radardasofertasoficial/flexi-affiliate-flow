// Manual types until auto-generated types update
export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string | null;
  rating: number;
  reviews: number;
  category: string;
  badge: string | null;
  affiliate_url: string;
  store: string;
  priority: number;
  featured: boolean;
  active: boolean;
  sales_count: number;
  show_sales: boolean;
  views_count: number;
  show_views: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductClick {
  id: string;
  product_id: string;
  clicked_at: string;
  referrer: string | null;
  user_agent: string | null;
}

export interface ProductInsert {
  title: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  image?: string | null;
  rating?: number;
  reviews?: number;
  category?: string;
  badge?: string | null;
  affiliate_url: string;
  store?: string;
  priority?: number;
  featured?: boolean;
  active?: boolean;
  sales_count?: number;
  show_sales?: boolean;
  views_count?: number;
  show_views?: boolean;
}
