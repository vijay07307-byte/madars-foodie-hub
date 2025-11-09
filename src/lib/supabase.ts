import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'canteen';
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  created_at: string;
};

export type FoodItem = {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
  discount_percentage: number;
  is_combo: boolean;
  is_customizable: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity: number;
  customization: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  food_items?: FoodItem;
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_method: string | null;
  payment_status: 'pending' | 'completed' | 'failed';
  order_number: string;
  estimated_time: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  food_item_id: string;
  quantity: number;
  price: number;
  customization: Record<string, unknown>;
  created_at: string;
  food_items?: FoodItem;
};
