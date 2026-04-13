'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { Eye, EyeOff, GitBranch, Globe, Moon, Sun, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

type AuthTab = 'login' | 'register';

interface AuthShellProps {
  defaultTab?: AuthTab;
}

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const transition = { duration: 0.28, ease: 'easeOut' as const };

const strengthLevels = [
  { labelKey: 'strength.tooWeak', color: 'bg-rose-500' },
  { labelKey: 'strength.fair', color: 'bg-amber-400' },
  { labelKey: 'strength.good', color: 'bg-sky-400' },
  { labelKey: 'strength.strong', color: 'bg-emerald-400' },
];

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, strengthLevels.length - 1);
}

export function AuthShell({ defaultTab = 'login' }: AuthShellProps) {
  const t = useTranslations('auth');
  const [activeTab, setActiveTab] = React.useState<AuthTab>(defaultTab);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const loginForm = useForm<LoginValues>({
    mode: 'onTouched',
    defaultValues: { email: '', password: '', remember: true },
  });

  const registerForm = useForm<RegisterValues>({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = useWatch({
    control: registerForm.control,
    name: 'password',
    defaultValue: '',
  });

  const passwordScore = getPasswordStrength(passwordValue ?? '');
  const strength = strengthLevels[passwordScore];
  const progressWidth = `${(passwordScore / (strengthLevels.length - 1)) * 100}%`;

  const currentTheme = mounted ? theme || resolvedTheme : 'light';
  const themeLabel = currentTheme === 'dark' ? t('theme.lightMode') : t('theme.darkMode');
  const pageHeading = activeTab === 'login' ? t('form.loginHeading') : t('form.registerHeading');
  const accountPrompt = activeTab === 'login' ? t('footer.newHere') : t('footer.haveAccount');
  const accountAction = activeTab === 'login' ? t('footer.createAccount') : t('footer.signIn');
  const accountHref = activeTab === 'login' ? '/signup' : '/signin';

  const onLoginSubmit = async (values: LoginValues) => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    console.log('Login', values);
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    console.log('Register', values);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_18%)] px-4 py-10 text-slate-950 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/70 to-transparent dark:from-slate-950/80" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="relative mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[2rem] border border-slate-900/5 bg-white/80 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl md:grid-cols-[1.15fr_1fr] dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none"
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-slate-950 via-slate-900 to-purple-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-10">
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

        <div className="relative flex flex-col gap-6 p-6 sm:p-8">
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
              onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              aria-label={themeLabel}
            >
              {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="login-email">{t('signin.email')}</Label>
                      <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder={t('form.placeholderEmail')}
                        {...loginForm.register('email', {
                          required: t('validation.required'),
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t('validation.emailInvalid'),
                          },
                        })}
                        className="mt-2"
                        aria-invalid={loginForm.formState.errors.email ? 'true' : 'false'}
                      />
                      {loginForm.formState.errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-500"
                        >
                          {loginForm.formState.errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">{t('signin.password')}</Label>
                        <button
                          type="button"
                          onClick={(event) => event.preventDefault()}
                          className="text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          {t('form.forgotPassword')}
                        </button>
                      </div>
                      <div className="relative mt-2">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder={t('form.placeholderPassword')}
                          {...loginForm.register('password', {
                            required: t('validation.required'),
                            minLength: {
                              value: 8,
                              message: t('validation.passwordMin'),
                            },
                          })}
                          className="pr-12"
                          aria-invalid={loginForm.formState.errors.password ? 'true' : 'false'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          aria-label={
                            showPassword ? t('form.hidePassword') : t('form.showPassword')
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-500"
                        >
                          {loginForm.formState.errors.password.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          className="text-primary focus:ring-primary/60 h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                          {...loginForm.register('remember')}
                        />
                        {t('form.rememberMe')}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="button"
                      className="w-full rounded-3xl px-5 py-3 text-base font-semibold tracking-tight transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                      onClick={loginForm.handleSubmit(onLoginSubmit)}
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting ? t('form.signingIn') : t('signin.button')}
                    </Button>

                    <div className="flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                      {t('form.orContinueWith')}
                      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="grid gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        className="w-full gap-2 rounded-3xl border-slate-200 bg-white/80 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
                      >
                        <Globe className="h-4 w-4" />
                        {t('social.continueWithGoogle')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        className="w-full gap-2 rounded-3xl border-slate-200 bg-white/80 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
                      >
                        <GitBranch className="h-4 w-4" />
                        {t('social.continueWithGitHub')}
                      </Button>
                    </div>
                  </div>
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
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="register-name">{t('signup.name')}</Label>
                      <Input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        placeholder={t('form.placeholderName')}
                        {...registerForm.register('name', {
                          required: t('validation.nameRequired'),
                        })}
                        className="mt-2"
                        aria-invalid={registerForm.formState.errors.name ? 'true' : 'false'}
                      />
                      {registerForm.formState.errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-500"
                        >
                          {registerForm.formState.errors.name.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-email">{t('signup.email')}</Label>
                      <Input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        placeholder={t('form.placeholderEmail')}
                        {...registerForm.register('email', {
                          required: t('validation.required'),
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t('validation.emailInvalid'),
                          },
                        })}
                        className="mt-2"
                        aria-invalid={registerForm.formState.errors.email ? 'true' : 'false'}
                      />
                      {registerForm.formState.errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-500"
                        >
                          {registerForm.formState.errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="register-password">{t('signup.password')}</Label>
                      <div className="relative mt-2">
                        <Input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder={t('form.placeholderPasswordCreate')}
                          {...registerForm.register('password', {
                            required: t('validation.required'),
                            minLength: { value: 8, message: t('validation.passwordMin') },
                          })}
                          className="pr-12"
                          aria-invalid={registerForm.formState.errors.password ? 'true' : 'false'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          aria-label={
                            showPassword ? t('form.hidePassword') : t('form.showPassword')
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {registerForm.formState.errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-500"
                        >
                          {registerForm.formState.errors.password.message}
                        </motion.p>
                      )}
                      <div className="mt-3 rounded-3xl border border-slate-200 bg-white/80 p-3 text-sm dark:border-slate-800 dark:bg-slate-950/80">
                        <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                          <span>{t('form.passwordStrength')}</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {t(strength.labelKey)}
                          </span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-300',
                              strength.color,
                            )}
                            style={{ width: progressWidth }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="register-confirm-password">
                        {t('signup.confirmPassword')}
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="register-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder={t('form.placeholderPasswordRepeat')}
                          {...registerForm.register('confirmPassword', {
                            required: t('validation.confirmPassword'),
                            validate: (value) =>
                              value === registerForm.getValues('password') ||
                              t('validation.passwordMismatch'),
                          })}
                          className="pr-12"
                          aria-invalid={
                            registerForm.formState.errors.confirmPassword ? 'true' : 'false'
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((value) => !value)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          aria-label={
                            showConfirmPassword ? t('form.hidePassword') : t('form.showPassword')
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {registerForm.formState.errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-rose-500"
                        >
                          {registerForm.formState.errors.confirmPassword.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="button"
                      className="w-full rounded-3xl px-5 py-3 text-base font-semibold tracking-tight transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                      onClick={registerForm.handleSubmit(onRegisterSubmit)}
                      disabled={registerForm.formState.isSubmitting}
                    >
                      {registerForm.formState.isSubmitting
                        ? t('form.creatingAccount')
                        : t('signup.button')}
                    </Button>

                    <div className="flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                      {t('form.orContinueWith')}
                      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="grid gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        className="w-full gap-2 rounded-3xl border-slate-200 bg-white/80 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
                      >
                        <Globe className="h-4 w-4" />
                        {t('social.continueWithGoogle')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        className="w-full gap-2 rounded-3xl border-slate-200 bg-white/80 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200"
                      >
                        <GitBranch className="h-4 w-4" />
                        {t('social.continueWithGitHub')}
                      </Button>
                    </div>
                  </div>
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
