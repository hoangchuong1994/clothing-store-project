import { z } from 'zod';

export const loginServerSchema = z.object({
  email: z.string().trim().toLowerCase().min(1).email(),
  password: z.string().min(1),
});

export type LoginServerInput = z.infer<typeof loginServerSchema>;
