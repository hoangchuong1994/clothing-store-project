'use server';

import { cookies, headers } from 'next/headers';
import { loginUseCaseFactory } from '../../infrastructure/adapters/login-use-case.factory';
import { createRequestContext } from '../../application/context/request-context';
import { createSecurityContext } from '../../application/context/security-context';
import type { LoginRequestDTO } from '../../application/dto/login-request.dto';
import type { LoginResponseDTO } from '../../application/dto/login-response.dto';

/**
 * Presentation server action for the login flow.
 * Responsibility: receive transport input, build request context, delegate to use-case.
 * Must not contain business rules, password validation, or session orchestration logic.
 */
export async function loginAction(input: LoginRequestDTO): Promise<LoginResponseDTO> {
  const headersList = await headers();

  const requestContext = createRequestContext({
    ipAddress: headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? undefined,
    userAgent: headersList.get('user-agent') ?? undefined,
    path: headersList.get('x-invoke-path') ?? undefined,
    method: headersList.get('x-invoke-method') ?? undefined,
  });

  const securityContext = createSecurityContext({
    roles: [],
    permissions: [],
    isAuthenticated: false,
    isEmailVerified: false,
    hasTwoFactorEnabled: false,
  });

  const loginUseCase = loginUseCaseFactory();
  const result = await loginUseCase.execute(input, {
    requestContext,
    securityContext,
  });

  const cookieStore = await cookies();
  cookieStore.set('auth_session_token', result.sessionToken ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return result;
}
