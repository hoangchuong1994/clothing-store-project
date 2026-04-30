/**
 * UI Data Layer
 * Derives display data from the main product database
 * No duplication - single source of truth in lib/db/products.ts
 */

import { PRODUCTS_DB } from '@/lib/db/products';
import { Category, Testimonial } from '@/lib/types/product';

/**
 * Categories for UI display
 */
export const categories: Category[] = [
  {
    id: '1',
    name: 'Hoodies',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    slug: 'hoodies',
  },
  {
    id: '2',
    name: 'T-Shirts',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    slug: 'tshirts',
  },
  {
    id: '3',
    name: 'Pants',
    image:
      'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=600&q=80',
    slug: 'pants',
  },
  {
    id: '4',
    name: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    slug: 'accessories',
  },
];

/**
 * Featured products - derived from main database
 * These are highlighted products for the homepage
 */
export const featuredProducts = [
  PRODUCTS_DB['prod-006'], // Cyber Oversized Hoodie
  PRODUCTS_DB['prod-007'], // Neon Grid T-Shirt
  PRODUCTS_DB['prod-008'], // Streetwear Cargo Pants
  PRODUCTS_DB['prod-009'], // Premium Snapback Cap
].filter(Boolean); // Filter out any undefined products

/**
 * New arrivals - derived from main database
 * Latest products added to the catalog
 */
export const newArrivals = [
  PRODUCTS_DB['prod-010'], // Limited Edition Jersey
  PRODUCTS_DB['prod-011'], // Techwear Jacket
  PRODUCTS_DB['prod-012'], // Vintage Denim
  PRODUCTS_DB['prod-013'], // Cyber Backpack
].filter(Boolean);

/**
 * Testimonials for UI display
 */
export const testimonials: Testimonial[] = [
  {
    id: '1',
    author: 'Alex Chen',
    role: 'Fashion Influencer',
    content:
      'The quality and design are insane. Every piece hits different. This is THE brand for Gen Z.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '2',
    author: 'Jordan Smith',
    role: 'Streetwear Enthusiast',
    content:
      'Finally a brand that gets the streetwear culture. The attention to detail is unmatched.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    author: 'Taylor Williams',
    role: 'Student',
    content: 'Affordable pricing with premium quality. Been waiting for a brand like this forever!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

/**
 * Helper function to get products by category
 */
export function getProductsByCategory(category: string) {
  return Object.values(PRODUCTS_DB).filter((product) => product.category === category);
}

/**
 * Helper function to get products with specific badge
 */
export function getProductsByBadge(badge: string) {
  return Object.values(PRODUCTS_DB).filter((product) => product.badge === badge);
}

/**
 * Helper function to get products on sale
 */
export function getSaleProducts() {
  return Object.values(PRODUCTS_DB).filter(
    (product) => product.originalPrice && product.originalPrice > product.price,
  );
}
