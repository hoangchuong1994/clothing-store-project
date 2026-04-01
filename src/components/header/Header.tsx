'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { NavMenu } from './NavMenu';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { ModeToggle } from '@/components/ModeToggle';

interface HeaderProps {
  cartItems?: number;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function Header({ cartItems = 0, isLoggedIn = false, onLogout }: HeaderProps) {
  const t = useTranslations('header');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-border/60 bg-background/40 supports-backdrop-filter:bg-background/30 border-b backdrop-blur-lg'
          : 'border-border/40 bg-background/80 border-b'
      }`}
    >
      <div className="flex h-16 items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="group relative shrink-0">
          <h1 className="text-foreground text-base font-black tracking-widest uppercase sm:text-lg">
            {t('brand')}
          </h1>
          <span className="absolute right-0 -bottom-1 left-0 h-1 rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-cyan-500" />
        </div>

        {/* Center Navigation */}
        <NavMenu />

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ModeToggle />
          </div>

          {/* Search */}
          <SearchBar />

          {/* Cart */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-foreground focus-visible:ring-ring relative inline-flex items-center justify-center rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none"
            aria-label={`Shopping cart with ${cartItems} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold sm:h-5 sm:w-5"
              >
                {cartItems > 9 ? '9+' : cartItems}
              </motion.span>
            )}
          </motion.button>

          {/* User Menu */}
          <div className="hidden sm:block">
            <UserMenu isLoggedIn={isLoggedIn} onLogout={onLogout} />
          </div>

          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu */}
          <div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
