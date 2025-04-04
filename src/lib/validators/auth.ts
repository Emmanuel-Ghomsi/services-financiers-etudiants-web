import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide' }),
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    email: z.string().email({ message: 'Adresse email invalide' }),
    password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
