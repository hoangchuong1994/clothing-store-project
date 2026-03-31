'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { newArrivals } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Zap } from 'lucide-react';

export function NewArrivalsSection() {
  const t = useTranslations('home.newArrivals');

  return (
    <section className="relative py-20 sm:py-32" aria-label="New Arrivals scroll container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-cyan-400 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1 text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/20 backdrop-blur-md sm:mb-3 sm:px-4 sm:py-2 sm:text-sm">
            <Zap size={14} className="text-cyan-300 sm:size-16" />
            <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase sm:text-sm">
              <span className="relative mr-1 inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 align-middle sm:mr-2 sm:h-2 sm:w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-cyan-400 opacity-75"></span>
              </span>
              {t('badge')}
            </span>
          </div>
          <h2 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <p className="mt-3 text-base text-slate-400 sm:mt-4 sm:text-lg">{t('description')}</p>
        </motion.div>

        {/* Gradient Divider */}
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        {/* Grid Layout - Mobile Scrolls Horizontally, Desktop is Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {newArrivals.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
