'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { Product } from '@/lib/types/product';

// Demo products data
const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-006',
    name: 'Cyberpunk Oversized Tee',
    price: 29.99,
    originalPrice: 49.99,
    stock: 75,
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    category: 'T-Shirts',
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
        values: ['Black', 'White', 'Navy', 'Gray'],
      },
    ],
  },
  {
    id: 'prod-007',
    name: 'Neon Logo Hoodie',
    price: 59.99,
    originalPrice: 89.99,
    stock: 120,
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    category: 'Hoodies',
    badge: 'NEW',
    rating: 4.9,
    reviews: 89,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL'],
      },
    ],
  },
  {
    id: 'prod-008',
    name: 'Cyber Cargo Pants',
    price: 79.99,
    originalPrice: 129.99,
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
        values: ['28', '30', '32', '34', '36', '38'],
      },
    ],
  },
  {
    id: 'prod-009',
    name: 'Tech-wear Jacket',
    price: 119.99,
    originalPrice: 199.99,
    stock: 200,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    category: 'Jackets',
    rating: 4.9,
    reviews: 201,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
  },
  {
    id: 'prod-010',
    name: 'Street Sneakers',
    price: 89.99,
    originalPrice: 149.99,
    stock: 100,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    category: 'Shoes',
    badge: 'NEW',
    rating: 4.6,
    reviews: 178,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['6', '7', '8', '9', '10', '11', '12', '13'],
      },
    ],
  },
  {
    id: 'prod-011',
    name: 'Cyber Beanie',
    price: 19.99,
    stock: 200,
    image:
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    rating: 4.5,
    reviews: 92,
  },
  {
    id: 'prod-012',
    name: 'Holographic Backpack',
    price: 69.99,
    originalPrice: 99.99,
    stock: 50,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    category: 'Bags',
    badge: 'SALE',
    rating: 4.8,
    reviews: 145,
  },
  {
    id: 'prod-013',
    name: 'Glitch Print Shorts',
    price: 39.99,
    originalPrice: 69.99,
    stock: 80,
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    category: 'Shorts',
    rating: 4.7,
    reviews: 103,
    variants: [
      {
        id: 'size',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL'],
      },
    ],
  },
];

export default function ProductsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 py-12 dark:bg-linear-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-foreground mb-4 text-4xl font-black tracking-widest uppercase sm:text-5xl">
            Products Demo
          </h1>
          <p className="text-foreground/70 mx-auto max-w-2xl text-lg">
            Browse our collection and test the cart functionality. Click Add to Cart to add items to
            your shopping cart.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {DEMO_PRODUCTS.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="group relative">
              {/* Product Card Container */}
              <div className="relative overflow-hidden rounded-lg bg-linear-to-r from-slate-800 to-slate-900 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-cyan-500/20">
                {/* Product Image */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-700 sm:h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-2 left-2 z-10 bg-linear-to-r from-cyan-500 to-blue-500 px-2 py-1 text-xs font-bold text-white sm:top-3 sm:left-3">
                      {product.badge}
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:top-3 sm:right-3 sm:h-12 sm:w-12">
                      {Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100,
                      )}
                      %
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-5">
                  {/* Category */}
                  <p className="text-foreground/50 mb-1 text-xs font-semibold tracking-wider uppercase">
                    {product.category}
                  </p>

                  {/* Name */}
                  <h3 className="text-foreground mb-2 line-clamp-2 text-sm font-bold sm:text-base">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="text-foreground/60 mb-3 flex items-center gap-1 text-xs">
                      <span>{'⭐'.repeat(Math.floor(product.rating))}</span>
                      <span>({product.reviews})</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-lg font-bold text-cyan-400 sm:text-xl">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-foreground/50 text-sm line-through sm:text-base">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <p
                    className={`mb-4 text-xs font-semibold ${
                      product.stock > 5 ? 'text-green-400' : 'text-orange-400'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>

                  {/* Add to Cart Button */}
                  {product.stock > 0 ? (
                    <AddToCartButton
                      productId={product.id}
                      name={product.name}
                      priceSnapshot={product.price}
                      image={product.image}
                      stock={product.stock}
                      quantity={1}
                      className="w-full"
                    />
                  ) : (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-slate-400 opacity-50"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-6 text-center backdrop-blur-sm"
        >
          <h2 className="text-foreground mb-2 text-xl font-bold">💡 How to Test the Cart</h2>
          <p className="text-foreground/70">
            1. Click Add to Cart on any product above
            <br />
            2. The cart badge in the header will update showing item count
            <br />
            3. Click the cart icon in the header to open the cart drawer
            <br />
            4. View your items, update quantities, and see totals calculated
          </p>
        </motion.div>
      </div>
    </div>
  );
}
