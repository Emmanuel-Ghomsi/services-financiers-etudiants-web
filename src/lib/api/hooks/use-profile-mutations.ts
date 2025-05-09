'use client';

import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useProfileStore } from '@/lib/stores/profile-store';
import type {
  UpdateUserRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
} from '@/lib/validators/profile';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH_URL;

export function useUpdateProfile() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { setProfile } = useProfileStore();

  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast('Profil mis à jour avec succès');
      // Mettre à jour le store avec les nouvelles données
      setProfile(data);
    },
    onError: (error) => {
      toast(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil');
    },
  });
}

export function useUpdateProfilePicture() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { updateProfilePicture } = useProfileStore();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      // Vérifier la taille du fichier (5Mo max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille du fichier ne doit pas dépasser 5Mo');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/media/profile-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour de la photo de profil');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast('Photo de profil mise à jour avec succès');

      // Mettre à jour le store avec la nouvelle URL de la photo de profil
      if (data && data.url) {
        updateProfilePicture(data.url);
      }
    },
    onError: (error) => {
      toast(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la mise à jour de la photo de profil'
      );
    },
  });
}

export function useChangePassword() {
  const { data: session } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors du changement de mot de passe');
      }

      return response.json();
    },
    onSuccess: () => {
      toast('Mot de passe modifié avec succès');
    },
    onError: (error) => {
      toast(error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe');
    },
  });
}

export function useRequestDeleteAccount() {
  const { data: session } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: DeleteAccountRequest) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/user/me/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la demande de suppression de compte');
      }

      return response.json();
    },
    onSuccess: () => {
      toast('Demande de suppression de compte envoyée avec succès');
    },
    onError: (error) => {
      toast(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la demande de suppression de compte'
      );
    },
  });
}
