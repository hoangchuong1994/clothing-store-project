import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { isPublicApiRoute } from '@/features/auth/config/api-access';
import { extractLocale, matchRoute } from '@/features/auth/lib/match-route';
import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from '@/features/auth/config/access';
import { auth } from '@/features/auth/server/auth-config';
import { getPathname } from '@/i18n/navigation';
import { APP_ROUTES } from '@/features/auth/config/app-routes';

const intlProxy = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Public API routes: bypass entirely
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. Public routes: allow without auth
  if (matchRoute(pathname, PUBLIC_ROUTES)) {
    return intlProxy(req);
  }

  const locale = extractLocale(pathname);

  // 3. Auth routes: redirect logged-in users to dashboard
  if (matchRoute(pathname, AUTH_ROUTES)) {
    const session = await auth();
    if (session) {
      const dashboardPath = getPathname({
        locale,
        href: APP_ROUTES.DASHBOARD,
      });
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }
    return intlProxy(req);
  }

  // 4. All other routes require authentication
  const session = await auth();
  if (!session) {
    const signInPath = getPathname({
      locale,
      href: APP_ROUTES.AUTH.SIGN_IN,
    });
    return NextResponse.redirect(new URL(signInPath, req.url));
  }

  const scopes = session.user.scopes ?? [];

  // 5. Admin routes: require 'admin' scope
  if (matchRoute(pathname, ADMIN_ROUTES) && !scopes.includes('admin')) {
    const forbiddenPath = getPathname({
      locale,
      href: APP_ROUTES.AUTH.FORBIDDEN,
    });
    return NextResponse.redirect(new URL(forbiddenPath, req.url));
  }

  // 6. Protected routes: require at least one scope
  if (matchRoute(pathname, PROTECTED_ROUTES) && scopes.length === 0) {
    const forbiddenPath = getPathname({
      locale,
      href: APP_ROUTES.AUTH.FORBIDDEN,
    });
    return NextResponse.redirect(new URL(forbiddenPath, req.url));
  }

  // 7. Allowed routes: proceed with i18n

  return intlProxy(req);
}

export const config = {
  matcher: ['/', '/(vi|en)/:path*'],
};
// export const config = {
//   matcher: ['/((?!_next|.*\\..*).*)'],
// };
