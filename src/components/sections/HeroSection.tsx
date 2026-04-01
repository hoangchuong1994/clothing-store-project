'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('home.hero');
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-16 sm:pt-20 lg:pt-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950" />

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/3 -right-1/3 h-64 w-64 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 opacity-20 blur-3xl sm:h-96 sm:w-96"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-0 -left-1/4 h-64 w-64 rounded-full bg-linear-to-tr from-pink-500 to-purple-500 opacity-20 blur-3xl sm:h-96 sm:w-96"
        />
      </div>

      {/* Animated Grid Background */}
      <svg
        className="absolute inset-0 -z-10 opacity-10"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">{t('badge')}</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span className="bg-linear-to-r from-white via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              {t('headline1')}
            </span>
            <br />
            <span className="mt-2 bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('headline2')}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base text-slate-300 sm:text-lg md:text-xl lg:max-w-2xl lg:text-2xl xl:mx-auto"
          >
            {t('description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgb(34, 211, 238)' }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-4 font-bold text-white transition-all duration-300 hover:shadow-2xl sm:w-auto sm:px-8"
            >
              {t('primaryCta')}
              <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, borderColor: 'rgb(34, 211, 238)' }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-lg border-2 border-slate-400 px-6 py-4 font-bold text-white transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 sm:w-auto sm:px-8"
            >
              {t('secondaryCta')}
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16 flex justify-center"
          >
            <div className="text-slate-400">
              <div className="text-sm font-medium">{t('scrollIndicator')}</div>
              <svg
                className="mx-auto mt-2 h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
