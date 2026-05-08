import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: {
      auth: (await import(`../../messages/${locale}/auth.json`)).default,
      common: (await import(`../../messages/${locale}/common.json`)).default,
      errors: (await import(`../../messages/${locale}/errors.json`)).default,
      footer: (await import(`../../messages/${locale}/footer.json`)).default,
      header: (await import(`../../messages/${locale}/header.json`)).default,
      home: (await import(`../../messages/${locale}/home.json`)).default,
      notFound: (await import(`../../messages/${locale}/notFound.json`)).default,
      products: (await import(`../../messages/${locale}/products.json`)).default,
      validation: (await import(`../../messages/${locale}/validation.json`)).default,
    },
  };
});
