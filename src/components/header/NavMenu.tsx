'use client';

import { usePathname, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { navItems } from './config';
import { motion } from 'framer-motion';

export function NavMenu() {
  const t = useTranslations('header');
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navItems.map((item) => {
        const href = `/${item.href}`;
        const isActive = pathname.includes(item.href);

        return (
          <Link key={item.id} href={href} className="group relative">
            <motion.div
              className={`relative px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
              }`}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {t(item.labelKey)}

              {/* Active Indicator - Animated */}
              {isActive && (
                <motion.span
                  layoutId="navUnderline"
                  className="absolute right-0 bottom-0 left-0 h-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  style={{ originX: 0.5 }}
                />
              )}

              {/* Hover Indicator - Enhanced */}
              {!isActive && (
                <motion.span
                  className="absolute right-0 bottom-0 left-0 h-1 rounded-full bg-gradient-to-r from-cyan-500/60 via-blue-500/60 to-cyan-500/60"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{ originX: 0.5 }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
