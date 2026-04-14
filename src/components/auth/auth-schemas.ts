import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'validation.required' })
    .email({ message: 'validation.emailInvalid' }),
  password: z.string().min(8, { message: 'validation.passwordMin' }),
  remember: z.boolean().optional(),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, { message: 'validation.nameRequired' }),
    confirmPassword: z.string().min(1, { message: 'validation.confirmPassword' }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'validation.passwordMismatch',
      });
    }
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
