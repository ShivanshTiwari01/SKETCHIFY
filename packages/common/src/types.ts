import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.email(),
  username: z.string(),
  password: z.string(),
  name: z.string(),
});

export const SignInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const CreateRoomSchema = z.object({
  name: z.string(),
});
