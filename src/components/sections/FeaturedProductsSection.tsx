'use client';

import { motion } from 'framer-motion';
import { featuredProducts } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function FeaturedProductsSection() {
  const t = useTranslations('home.featured');
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-orange-400 bg-linear-to-r from-orange-500/20 to-red-500/20 px-3 py-1 text-xs font-bold text-orange-300 shadow-lg shadow-orange-500/20 backdrop-blur-md sm:mb-3 sm:px-4 sm:py-2 sm:text-sm">
              <Flame size={14} className="sm:size-16" />
              <span className="text-xs font-bold tracking-widest text-orange-300 uppercase sm:text-sm">
                <span className="relative mr-1 inline-flex h-1.5 w-1.5 rounded-full bg-orange-400 align-middle sm:mr-2 sm:h-2 sm:w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-orange-400 opacity-75"></span>
                </span>
                {t('badge')}
              </span>
            </div>
            <h2 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-400 sm:mt-4 sm:text-lg">{t('description')}</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="hidden w-full rounded-lg border-2 border-cyan-500 px-4 py-3 font-bold text-cyan-300 transition-all hover:bg-cyan-500/10 sm:block sm:w-auto sm:px-6"
          >
            {t('viewAll')}
          </motion.button>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center sm:hidden"
        >
          <button className="w-full rounded-lg border-2 border-cyan-500 py-3 font-bold text-cyan-300 transition-all hover:bg-cyan-500/10">
            {t('viewAllMobile')}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
