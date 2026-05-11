import type { AuthErrorCode } from '../exceptions/auth-error.codes';

export interface AuthErrorPayload {
  code: AuthErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface AuthResponse<T = void> {
  success: boolean;
  data?: T;
  error?: AuthErrorPayload;
}

export interface SuccessResponse<T> extends AuthResponse<T> {
  success: true;
  data: T;
  error?: undefined;
}

export interface FailureResponse extends AuthResponse {
  success: false;
  data?: undefined;
  error: AuthErrorPayload;
}
