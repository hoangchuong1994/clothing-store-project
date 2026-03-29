import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlProxy = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  return intlProxy(req);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
