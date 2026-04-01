'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronRight, Zap } from 'lucide-react';

export function PromotionBanner() {
  const t = useTranslations('home.promotionBanner');
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-linear-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-80" />
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(34,211,238,0.3)_0%,transparent_50%)]"
            />
          </div>

          {/* Animated Shapes */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'loop' }}
            className="absolute -top-20 -right-20 h-40 w-40 rounded-full border-2 border-cyan-300/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: 'loop' }}
            className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full border-2 border-pink-300/30"
          />

          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            className="relative px-6 py-12 sm:px-12 sm:py-16 md:py-20"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <Zap size={28} className="text-white" />
              <span className="text-sm font-bold tracking-widest text-white/90 uppercase">
                {t('badge')}
              </span>
            </motion.div>

            <motion.h3
              variants={itemVariants}
              className="mt-6 text-4xl font-black sm:text-5xl md:text-6xl"
            >
              <span className="text-white">{t('headline1')}</span>
              <br />
              <span className="bg-linear-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                {t('headline2')}
              </span>
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl"
            >
              {t('description')} <span className="font-bold">{t('code')}</span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 font-bold text-purple-600 transition-all hover:shadow-2xl"
              >
                {t('primaryCta')}
                <ChevronRight size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg border-2 border-white px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
              >
                {t('secondaryCta')}
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3"
            >
              {[
                { label: t('stats.products'), value: '2000+' },
                { label: t('stats.discount'), value: '40%' },
                { label: t('stats.endsIn'), value: '5 Days' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white/10 px-4 py-3 text-center backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-sm font-medium text-white/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
