/**
 * Unified Product Database
 * Single source of truth for all product data
 * In production, this would be Prisma queries
 */

import { Product } from '@/lib/types/product';

/**
 * Main product database
 * Contains all products with complete information
 */
export const PRODUCTS_DB: Record<string, Product> = {
  'prod-001': {
    id: 'prod-001',
    name: 'Classic Cotton T-Shirt',
    price: 29.99,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'T-Shirts',
    rating: 4.5,
    reviews: 89,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'White', 'Navy', 'Gray'],
      },
    ],
  },
  'prod-002': {
    id: 'prod-002',
    name: 'Slim Fit Denim Jeans',
    price: 79.99,
    stock: 85,
    image:
      'https://images.unsplash.com/photo-1551028181-5e52652f7f71?auto=format&fit=crop&w=600&q=80',
    category: 'Pants',
    rating: 4.7,
    reviews: 156,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['28', '30', '32', '34', '36', '38'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Dark Blue', 'Light Blue', 'Black'],
      },
    ],
  },
  'prod-003': {
    id: 'prod-003',
    name: 'Premium Leather Jacket',
    price: 249.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
    category: 'Outerwear',
    rating: 4.9,
    reviews: 45,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'Brown', 'Tan'],
      },
    ],
  },
  'prod-004': {
    id: 'prod-004',
    name: 'Summer Shorts',
    price: 39.99,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
    category: 'Pants',
    rating: 4.6,
    reviews: 73,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Navy', 'Khaki', 'Black', 'White'],
      },
    ],
  },
  'prod-005': {
    id: 'prod-005',
    name: 'Winter Knit Sweater',
    price: 89.99,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'Sweaters',
    rating: 4.8,
    reviews: 67,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Cream', 'Charcoal', 'Burgundy', 'Forest Green'],
      },
    ],
  },
  // UI Featured Products
  'prod-006': {
    id: 'prod-006',
    name: 'Cyber Oversized Hoodie',
    price: 89.99,
    originalPrice: 129.99,
    stock: 75,
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    category: 'Hoodies',
    badge: 'SALE',
    rating: 4.8,
    reviews: 124,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'Gray', 'White'],
      },
    ],
  },
  'prod-007': {
    id: 'prod-007',
    name: 'Neon Grid T-Shirt',
    price: 49.99,
    stock: 120,
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    category: 'T-Shirts',
    badge: 'NEW',
    rating: 4.9,
    reviews: 89,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'White', 'Neon Green'],
      },
    ],
  },
  'prod-008': {
    id: 'prod-008',
    name: 'Streetwear Cargo Pants',
    price: 99.99,
    originalPrice: 149.99,
    stock: 90,
    image:
      'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=600&q=80',
    category: 'Pants',
    badge: 'HOT',
    rating: 4.7,
    reviews: 156,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'Khaki', 'Olive'],
      },
    ],
  },
  'prod-009': {
    id: 'prod-009',
    name: 'Premium Snapback Cap',
    price: 39.99,
    stock: 200,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    rating: 4.6,
    reviews: 73,
    variants: [
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'Navy', 'Red', 'White'],
      },
    ],
  },
  // New Arrivals
  'prod-010': {
    id: 'prod-010',
    name: 'Limited Edition Jersey',
    price: 129.99,
    stock: 50,
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    category: 'T-Shirts',
    badge: 'LIMITED',
    rating: 5.0,
    reviews: 32,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'White'],
      },
    ],
  },
  'prod-011': {
    id: 'prod-011',
    name: 'Techwear Jacket',
    price: 199.99,
    stock: 30,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    category: 'Outerwear',
    badge: 'NEW',
    rating: 4.9,
    reviews: 45,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'Gray'],
      },
    ],
  },
  'prod-012': {
    id: 'prod-012',
    name: 'Vintage Denim',
    price: 119.99,
    stock: 80,
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    category: 'Pants',
    badge: 'TRENDING',
    rating: 4.8,
    reviews: 67,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['28', '30', '32', '34', '36'],
      },
      {
        id: 'color',
        name: 'Color',
        values: ['Dark Blue', 'Light Wash'],
      },
    ],
  },
  'prod-013': {
    id: 'prod-013',
    name: 'Cyber Backpack',
    price: 159.99,
    stock: 60,
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    rating: 4.7,
    reviews: 54,
    variants: [
      {
        id: 'color',
        name: 'Color',
        values: ['Black', 'Gray', 'Neon'],
      },
    ],
  },
};

/**
 * Get product by ID
 */
export async function getProduct(productId: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return PRODUCTS_DB[productId] || null;
}

/**
 * Get multiple products by IDs
 */
export async function getProducts(productIds: string[]): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return productIds.map((id) => PRODUCTS_DB[id]).filter((product): product is Product => !!product);
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Object.values(PRODUCTS_DB);
}

/**
 * Check stock availability
 */
export async function checkStock(
  productId: string,
  requiredQuantity: number,
): Promise<{ available: number; isAvailable: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 30));

  const product = PRODUCTS_DB[productId];
  if (!product) {
    return { available: 0, isAvailable: false };
  }

  const available = product.stock;
  return {
    available,
    isAvailable: available >= requiredQuantity,
  };
}
