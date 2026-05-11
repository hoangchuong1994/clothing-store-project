import { z } from 'zod';

export const registerServerSchema = z
  .object({
    email: z.string().trim().toLowerCase().min(1).email(),
    name: z.string().trim().min(2).max(100),
    password: z.string().min(12).max(128),
    passwordConfirm: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        path: ['passwordConfirm'],
        message: 'PASSWORDS_DO_NOT_MATCH',
      });
    }
  });

export type RegisterServerInput = z.infer<typeof registerServerSchema>;
