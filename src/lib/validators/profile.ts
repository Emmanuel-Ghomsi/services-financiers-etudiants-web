import { z } from 'zod';

/**
 * Requête de mise à jour du profil utilisateur
 */
export const UpdateUserRequestSchema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis'),
  lastname: z.string().min(1, 'Le nom est requis'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  address: z.string().min(3, 'Adresse invalide'),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

/**
 * Requête pour modifier le mot de passe sans ancien mot de passe
 */
export const ChangePasswordRequestSchema = z.object({
  newPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

/**
 * Requête de demande de suppression de compte par l'utilisateur
 */
export const DeleteAccountRequestSchema = z.object({
  reason: z.string().min(10, 'Merci de spécifier la raison de votre demande.'),
});

export type DeleteAccountRequest = z.infer<typeof DeleteAccountRequestSchema>;

export const UpdateProfilePictureRequestSchema = z.object({
  file: z.any(), // fichier uploadé via multipart
});

export type UpdateProfilePictureRequest = z.infer<typeof UpdateProfilePictureRequestSchema>;
