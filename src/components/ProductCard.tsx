'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from '@/components/ui/icon';
import { Product } from '@/lib/data';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const hasDiscount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} className="group relative">
      <div className="relative overflow-hidden rounded-lg bg-linear-to-r from-slate-900 to-slate-800">
        {/* Product Image */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100 sm:h-64 md:h-72 lg:h-80 dark:bg-slate-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2 left-2 z-10 bg-linear-to-r from-cyan-500 to-blue-500 px-2 py-1 text-xs font-bold text-white sm:top-3 sm:left-3 sm:px-3">
              {product.badge}
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount > 0 && (
            <div className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 font-bold text-white shadow-lg sm:top-3 sm:right-3 sm:h-12 sm:w-12">
              -{hasDiscount}%
            </div>
          )}

          {/* Overlay with Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 backdrop-blur-sm sm:gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-slate-900 transition-all duration-300 hover:bg-cyan-400 sm:h-auto sm:w-auto"
              aria-label="View product details"
            >
              <Eye size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-slate-900 transition-all duration-300 hover:bg-cyan-400 sm:h-auto sm:w-auto"
              aria-label="Add to cart"
            >
              <ShoppingCart size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex h-12 w-12 items-center justify-center rounded-full p-3 transition-all duration-300 sm:h-auto sm:w-auto ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-slate-900 hover:bg-red-500 hover:text-white'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4">
          <p className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
            {product.category}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-cyan-300 sm:mt-2 sm:text-base">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="mt-2 flex items-center gap-1">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${
                      i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-slate-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-slate-400">({product.reviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-2 flex items-center gap-2 sm:mt-3">
            <span className="text-base font-bold text-white sm:text-lg">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
