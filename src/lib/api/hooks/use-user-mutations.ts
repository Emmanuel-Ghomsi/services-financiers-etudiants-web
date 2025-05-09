'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import type {
  AddRoleRequest,
  ChangeUserStatusRequest,
  ResendFirstLoginEmailRequest,
} from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH_URL;

export function useUpdateUser() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: any }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour de l'utilisateur");
      }

      return response.json();
    },
    onSuccess: () => {
      toast('Utilisateur mis à jour avec succès', 'success');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast(
        error instanceof Error ? error.message : "Erreur lors de la mise à jour de l'utilisateur",
        'error'
      );
    },
  });
}

export function useUpdateUserRole() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AddRoleRequest }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/user/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(role),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du rôle');
      }

      return response.json();
    },
    onSuccess: () => {
      toast('Rôle mis à jour avec succès', 'success');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast(
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour du rôle',
        'error'
      );
    },
  });
}

export function useUpdateUserStatus() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: ChangeUserStatusRequest }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/user/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(status),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du statut');
      }

      return response.json();
    },
    onSuccess: () => {
      toast('Statut mis à jour avec succès', 'success');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast(
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour du statut',
        'error'
      );
    },
  });
}

export function useResendFirstLoginEmail() {
  const { data: session } = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ResendFirstLoginEmailRequest) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_BASE_URL}/resend-first-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'envoi de l'email");
      }

      return response.json();
    },
    onSuccess: () => {
      toast('Email de définition de mot de passe envoyé avec succès', 'success');
    },
    onError: (error) => {
      toast(error instanceof Error ? error.message : "Erreur lors de l'envoi de l'email", 'error');
    },
  });
}
