import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().min(1, { message: 'required' }).email({ message: 'email.invalid' }),
  password: z.string().min(8, { message: 'password.min' }),
  remember: z.boolean().optional(),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2, { message: 'name.required' }),
  passwordConfirm: z.string().min(1, { message: 'confirmPassword.required' }),
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirm) {
    ctx.addIssue({
      code: 'custom',
      path: ['passwordConfirm'],
      message: 'password.mismatch',
    });
  }
});

export type LoginSchema = z.infer<typeof LoginSchema>;
export type RegisterSchema = z.infer<typeof RegisterSchema>;
