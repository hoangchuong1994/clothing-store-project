import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: {
      header: (await import(`../../messages/${locale}/header.json`)).default,
      errors: (await import(`../../messages/${locale}/errors.json`)).default,
      notFound: (await import(`../../messages/${locale}/notFound.json`)).default,
    },
  };
});
