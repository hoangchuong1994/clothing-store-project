'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { categories } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CategoriesSection() {
  const t = useTranslations('home.categories');
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center sm:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-cyan-400 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 py-1 text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/20 backdrop-blur-md sm:mb-3 sm:px-4 sm:py-2 sm:text-sm">
              <span className="relative flex h-1.5 w-1.5 rounded-full bg-cyan-400 sm:h-2 sm:w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-cyan-400 opacity-75"></span>
              </span>
              {t('badge')}
            </p>
            <h2 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-400 sm:mt-4 sm:text-lg">{t('description')}</p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="group relative h-48 overflow-hidden rounded-xl bg-slate-800 sm:h-56 lg:h-64"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-black text-white sm:text-3xl"
                >
                  {category.name}
                </motion.h3>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-bold text-white"
                >
                  {t('explore')} <ArrowRight size={18} />
                </motion.div>
              </div>

              {/* Badge */}
              <div className="absolute top-3 right-3 rounded-lg bg-cyan-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {index + 1} of {categories.length}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
