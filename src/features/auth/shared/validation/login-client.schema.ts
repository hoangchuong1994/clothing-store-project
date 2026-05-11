import { z } from 'zod';

export const LOGIN_CLIENT_ERRORS = {
  REQUIRED: 'REQUIRED',
  INVALID_EMAIL: 'INVALID_EMAIL',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
} as const;

export const loginClientSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: LOGIN_CLIENT_ERRORS.REQUIRED })
    .email({ message: LOGIN_CLIENT_ERRORS.INVALID_EMAIL }),
  password: z.string().min(1, { message: LOGIN_CLIENT_ERRORS.REQUIRED }),
  remember: z.boolean().optional(),
});

export type LoginClientSchema = z.infer<typeof loginClientSchema>;
