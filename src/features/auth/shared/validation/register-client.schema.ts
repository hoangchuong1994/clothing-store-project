import { z } from 'zod';
import { loginClientSchema } from './login-client.schema';

export const REGISTER_CLIENT_ERRORS = {
  REQUIRED: 'REQUIRED',
  INVALID_EMAIL: 'INVALID_EMAIL',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',
  PASSWORDS_DO_NOT_MATCH: 'PASSWORDS_DO_NOT_MATCH',
  NAME_TOO_SHORT: 'NAME_TOO_SHORT',
} as const;

export const registerClientSchema = loginClientSchema
  .extend({
    name: z.string().trim().min(2, { message: REGISTER_CLIENT_ERRORS.NAME_TOO_SHORT }),
    passwordConfirm: z.string().min(1, { message: REGISTER_CLIENT_ERRORS.REQUIRED }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        path: ['passwordConfirm'],
        message: REGISTER_CLIENT_ERRORS.PASSWORDS_DO_NOT_MATCH,
      });
    }
  });

export type RegisterClientSchema = z.infer<typeof registerClientSchema>;
