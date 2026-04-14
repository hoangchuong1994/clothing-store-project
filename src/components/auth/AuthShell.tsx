'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Sparkles, ShieldCheck, Moon, Sun } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type AuthTab = 'login' | 'register';

interface AuthShellProps {
  defaultTab?: AuthTab;
}

type ToastVariant = 'success' | 'info' | 'error';

interface ToastState {
  message: string;
  variant: ToastVariant;
}

const transition = { duration: 0.28, ease: 'easeOut' as const };

function ToastBanner({ message, variant, onClose }: ToastState & { onClose: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed top-6 left-1/2 z-50 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 rounded-3xl border px-5 py-4 text-sm shadow-xl shadow-slate-950/10',
        variant === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-950',
        variant === 'info' && 'border-slate-200 bg-slate-50 text-slate-950',
        variant === 'error' && 'border-rose-200 bg-rose-50 text-rose-950',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <p>{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function AuthShell({ defaultTab = 'login' }: AuthShellProps) {
  const t = useTranslations('auth');
  const [activeTab, setActiveTab] = React.useState<AuthTab>(defaultTab);
  const [mounted, setMounted] = React.useState(false);
  const [toast, setToast] = React.useState<ToastState | null>(null);
  const { theme, resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const isDarkMode = mounted ? theme === 'dark' || resolvedTheme === 'dark' : false;
  const themeLabel = mounted
    ? isDarkMode
      ? t('theme.lightMode')
      : t('theme.darkMode')
    : t('theme.darkMode');
  const pageHeading = activeTab === 'login' ? t('form.loginHeading') : t('form.registerHeading');
  const accountPrompt = activeTab === 'login' ? t('footer.newHere') : t('footer.haveAccount');
  const accountAction = activeTab === 'login' ? t('footer.createAccount') : t('footer.signIn');
  const accountHref = activeTab === 'login' ? '/signup' : '/signin';

  const handleAuthSuccess = (action: 'login' | 'register') => {
    setToast({
      message: action === 'login' ? 'Signed in successfully.' : 'Account created successfully.',
      variant: 'success',
    });
  };

  const handleSocialAuth = (provider: 'google' | 'github') => {
    setToast({
      message: `${provider === 'google' ? 'Google' : 'GitHub'} sign-in is not configured yet.`,
      variant: 'info',
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_18%)] px-4 py-10 text-slate-950 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      {toast && <ToastBanner {...toast} onClose={() => setToast(null)} />}
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/70 to-transparent dark:from-slate-950/80" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="relative mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[2rem] border border-slate-900/5 bg-white/80 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:gap-6 md:grid-cols-[1.15fr_1fr] dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none"
      >
        <div className="order-last rounded-[2rem] bg-linear-to-br from-slate-950 via-slate-900 to-purple-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-10 md:order-first">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.25),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.16),transparent_20%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-sm font-medium tracking-[0.3em] text-slate-300 uppercase">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl border border-white/15 bg-white/5">
                  <Sparkles className="h-5 w-5 text-violet-300" />
                </span>
                {t('hero.badge')}
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t('hero.title')}
                </h1>
                <p className="max-w-md text-base leading-7 text-slate-300">
                  {t('hero.description')}
                </p>
              </div>
            </div>
            <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/10 p-6 shadow-xl shadow-slate-950/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-white/10 text-slate-100">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                {t('hero.secureByDesign')}
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>• {t('hero.feature1')}</li>
                <li>• {t('hero.feature2')}</li>
                <li>• {t('hero.feature3')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative z-50 flex flex-col gap-6 p-6 sm:p-8 md:order-last">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase dark:text-slate-400">
                {t('header.welcomeBack')}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {pageHeading}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="border border-slate-200/80 bg-slate-100/80 text-slate-700 transition hover:scale-[1.03] hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              aria-label={themeLabel}
            >
              {mounted ? (
                isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="rounded-full bg-slate-100 p-1.5 dark:bg-slate-900/95">
            <div className="grid grid-cols-2 gap-1 rounded-full bg-slate-100/80 p-1 shadow-sm shadow-slate-950/5 dark:bg-slate-950/80 dark:shadow-none">
              {(['login', 'register'] as AuthTab[]).map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'relative flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-all',
                      active
                        ? 'bg-white text-slate-950 shadow-sm shadow-slate-950/10 dark:bg-slate-950 dark:text-white'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                    )}
                  >
                    {tab === 'login' ? t('tabs.login') : t('tabs.register')}
                    {active && (
                      <motion.span
                        layoutId="auth-tab"
                        className="absolute inset-0 rounded-full bg-white/90 dark:bg-slate-950"
                        transition={transition}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5 rounded-[2rem] border border-slate-200/70 bg-slate-50/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80 dark:shadow-none">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={transition}
                  className="space-y-6"
                >
                  <LoginForm
                    onSubmit={async (values) => {
                      await new Promise((resolve) => setTimeout(resolve, 650));
                      handleAuthSuccess('login');
                      console.log('Login', values);
                    }}
                    onSocialAuth={handleSocialAuth}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={transition}
                  className="space-y-6"
                >
                  <RegisterForm
                    onSubmit={async (values) => {
                      await new Promise((resolve) => setTimeout(resolve, 650));
                      handleAuthSuccess('register');
                      console.log('Register', values);
                    }}
                    onSocialAuth={handleSocialAuth}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
            <p>
              {accountPrompt}{' '}
              <Link
                href={accountHref}
                className="font-semibold text-slate-950 underline-offset-4 transition hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-50"
              >
                {accountAction}
              </Link>
            </p>
            <p className="text-xs text-slate-400">{t('footer.onboarding')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
