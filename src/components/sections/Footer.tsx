'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Heart, Share2, Send, Play, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  const footerLinks = {
    shop: [
      { label: t('shop.newArrivals'), href: '#' },
      { label: t('shop.bestSellers'), href: '#' },
      { label: t('shop.allCollections'), href: '#' },
      { label: t('shop.limitedEdition'), href: '#' },
    ],
    company: [
      { label: t('company.about'), href: '#' },
      { label: t('company.careers'), href: '#' },
      { label: t('company.blog'), href: '#' },
      { label: t('company.press'), href: '#' },
    ],
    support: [
      { label: t('support.contact'), href: '#' },
      { label: t('support.faq'), href: '#' },
      { label: t('support.shipping'), href: '#' },
      { label: t('support.returns'), href: '#' },
    ],
    legal: [
      { label: t('legal.privacy'), href: '#' },
      { label: t('legal.terms'), href: '#' },
      { label: t('legal.cookies'), href: '#' },
      { label: t('legal.accessibility'), href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Heart, href: '#', label: t('social.instagram') },
    { icon: Share2, href: '#', label: t('social.twitter') },
    { icon: Send, href: '#', label: t('social.facebook') },
    { icon: Play, href: '#', label: t('social.youtube') },
  ];

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
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-5"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="col-span-2 sm:col-span-1">
            <h3 className="text-2xl font-black text-white">
              <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CYBER
              </span>
            </h3>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-cyan-400"
              >
                <Mail size={16} />
                <a href="mailto:hello@cyberbrand.com">hello@cyberbrand.com</a>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 text-sm text-slate-400 transition-colors hover:text-cyan-400"
              >
                <Phone size={16} />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </motion.div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={16} />
                <span>New York, USA</span>
              </div>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white">{t('shop.title')}</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white">{t('company.title')}</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white">{t('support.title')}</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-white">{t('legal.title')}</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="my-8 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent sm:my-12" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          {/* Copyright */}
          <div className="text-center text-sm text-slate-500 sm:text-left">
            <p>{t('copyright')}</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-all hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Accept:</span>
            {['💳', '🏦', '📱'].map((icon, i) => (
              <span key={i} className="text-base">
                {icon}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed right-8 bottom-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg transition-all hover:shadow-2xl"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7-7m0 0l-7 7m7-7v12"
          />
        </svg>
      </motion.button>
    </footer>
  );
}
