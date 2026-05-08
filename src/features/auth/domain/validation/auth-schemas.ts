import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'required' })
  .email({ message: 'email.invalid' })
  .max(254, { message: 'email.max' });

export const passwordSchema = z
  .string()
  .min(12, { message: 'password.min' })
  .max(128, { message: 'password.max' });

export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: 'name.min' })
  .max(100, { message: 'name.max' });

export const confirmPasswordSchema = z.string().min(1, { message: 'confirmPassword.required' });

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional(),
});

export const RegisterSchema = LoginSchema.extend({
  name: nameSchema,
  passwordConfirm: confirmPasswordSchema,
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirm) {
    ctx.addIssue({
      code: 'custom',
      path: ['passwordConfirm'],
      message: 'password.mismatch',
    });
  }
});

export const ForgotPasswordSchema = z.object({
  email: emailSchema,
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'token.required'),
    password: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (!data.token) {
      ctx.addIssue({
        code: 'custom',
        path: ['token'],
        message: 'token.required',
      });
    }
  });

export type LoginSchema = z.infer<typeof LoginSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterSchema = z.infer<typeof RegisterSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
