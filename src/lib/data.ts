/**
 * Legacy data.ts - DEPRECATED
 * This file is kept for backward compatibility.
 * New code should import from:
 * - @/lib/types/product (for types)
 * - @/lib/data/ui (for UI data)
 * - @/lib/db/products (for database operations)
 */

// Re-export types for backward compatibility
export type { Product, Category, Testimonial } from '@/lib/types/product';

// Re-export UI data for backward compatibility
export { categories, featuredProducts, newArrivals, testimonials } from '@/lib/data/ui';
