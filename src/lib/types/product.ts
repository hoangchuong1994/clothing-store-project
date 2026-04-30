/**
 * Unified Product Type Definitions
 * Single source of truth for all product-related types
 */

/**
 * Product variant information
 * Supports multiple variant types (size, color, etc.)
 */
export interface ProductVariant {
  id: string;
  name: string;
  values: string[];
}

/**
 * Unified Product interface
 * Used across UI, cart, and database layers
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // For sale prices
  stock: number; // Available inventory
  image: string;
  category: string; // Product category (e.g., 'T-Shirts', 'Hoodies')
  badge?: string; // UI badge like 'NEW', 'SALE', 'HOT'
  rating?: number; // Average rating (1-5)
  reviews?: number; // Number of reviews
  variants?: ProductVariant[]; // Product variants (size, color, etc.)
}

/**
 * Category information for UI display
 */
export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

/**
 * Testimonial for UI display
 */
export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}
