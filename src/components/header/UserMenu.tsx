'use client';

import { useTranslations } from 'next-intl';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { userMenuOptions } from './config';

interface UserMenuProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function UserMenu({ isLoggedIn = false, onLogout }: UserMenuProps) {
  const t = useTranslations('header');

  if (!isLoggedIn) {
    return (
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center justify-center rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label={t('user.login')}
        title={t('user.login')}
      >
        <User className="h-5 w-5" />
      </motion.button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center justify-center rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="User menu"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="border-foreground bg-muted flex h-6 w-6 items-center justify-center rounded-full border"
          >
            <span className="text-xs font-bold">A</span>
          </motion.div>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {userMenuOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <DropdownMenuItem>{t(option.labelKey)}</DropdownMenuItem>
          </motion.div>
        ))}
        <DropdownMenuSeparator />
        <motion.div
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <DropdownMenuItem onClick={onLogout}>{t('user.logout')}</DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
