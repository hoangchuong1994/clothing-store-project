'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function NewsletterSection() {
  const t = useTranslations('home.newsletter');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-slate-900 to-cyan-900" />
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,211,238,0.2)_0%,_transparent_50%)]"
            />
          </div>

          {/* Animated Background Elements */}
          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl"
          />

          {/* Content */}
          <div className="relative px-6 py-12 sm:px-12 sm:py-16">
            {/* Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mx-auto w-fit rounded-full bg-cyan-500/20 p-4"
            >
              <Mail size={32} className="text-cyan-400" />
            </motion.div>

            {/* Headline */}
            <h2 className="mt-6 text-center text-3xl font-black sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-white via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                {t('title')}
              </span>
            </h2>

            {/* Subheadline */}
            <p className="mt-4 text-center text-base text-slate-300 sm:text-lg">
              {t('description')}
            </p>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('placeholder')}
                  required
                  className="flex-1 rounded-lg rounded-r-none border border-r-0 border-slate-600 bg-slate-800/50 px-4 py-3 font-medium text-white placeholder-slate-500 transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg rounded-l-none bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-bold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  disabled={isSubmitted}
                >
                  {isSubmitted ? (
                    <>
                      <span>✓ {t('button')}</span>
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Checkbox */}
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-600 accent-cyan-500"
                />
                <label htmlFor="agree" className="text-sm text-slate-400">
                  I agree to receive marketing emails (we hate spam too)
                </label>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
