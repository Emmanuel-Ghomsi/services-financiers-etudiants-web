'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useClientFileStore } from '@/lib/stores/client-file-store';
import type { ClientFileDTO, ClientFileCreateRequest } from '@/types/client-file';
import { apiRequest } from '@/lib/api/api-client';
import { ClientFileStatus } from '@/lib/constants/client-file-status';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useEffect, useRef } from 'react';
import { EXPORT_API_URL } from '@/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH_URL;

export function useClientFiles() {
  const { data: session } = useSession();
  const { profile } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setClientFiles, setLoading, setError } = useClientFileStore();

  // Récupérer toutes les fiches clients
  const query = useQuery<ClientFileDTO[]>({
    queryKey: ['clientFiles'],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      // Si l'utilisateur est ADMIN ou SUPER_ADMIN, récupérer toutes les fiches
      const isAdmin = profile?.roles?.some(
        (role) => role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'SUPER_ADMIN'
      );

      // Construire les paramètres de requête pour la pagination
      const queryParams = new URLSearchParams();
      queryParams.append('page', '1');
      queryParams.append('pageSize', '50'); // Augmenter la taille de page pour voir plus de fiches

      const endpoint = isAdmin
        ? `/client-files?${queryParams.toString()}`
        : `/client-files/me?${queryParams.toString()}`;

      // Utiliser apiRequest pour faire la requête
      const response = await apiRequest<{ items: ClientFileDTO[]; totalItems: number }>(endpoint);

      // Retourner les items de la réponse paginée
      return response.items || [];
    },
    enabled: !!session?.accessToken && !!profile,
  });

  // Utiliser une référence pour suivre l'état précédent
  const prevLoadingRef = useRef(query.isPending);
  const prevDataRef = useRef(query.data);
  const prevErrorRef = useRef(query.error);

  useEffect(() => {
    // Ne mettre à jour le store que si l'état a réellement changé
    if (prevLoadingRef.current !== query.isPending) {
      prevLoadingRef.current = query.isPending;
      // Éviter d'appeler setLoading qui cause la boucle infinie
      setLoading(query.isPending);
    }

    // Mettre à jour les données seulement si elles ont changé
    if (query.data && prevDataRef.current !== query.data) {
      prevDataRef.current = query.data;
      setClientFiles(query.data);
    }

    // Gérer les erreurs seulement si elles ont changé
    if (query.error && prevErrorRef.current !== query.error) {
      prevErrorRef.current = query.error;
      const errorMessage =
        query.error instanceof Error ? query.error.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [query.data, query.isPending, query.error, setClientFiles, setError, toast, setLoading]);

  // Mutation pour créer une nouvelle fiche client
  const createClientFileMutation = useMutation({
    mutationFn: async (data: ClientFileCreateRequest) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>('/client-files', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Succès',
        description: 'Fiche client créée avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFiles'] });
      return data;
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Erreur lors de la création de la fiche client',
        variant: 'destructive',
      });
      throw error;
    },
  });

  // Mutation pour mettre à jour une fiche client
  const updateClientFileMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClientFileDTO> }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Succès',
        description: 'Fiche client mise à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFiles'] });
      return data;
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour de la fiche client',
        variant: 'destructive',
      });
      throw error;
    },
  });

  // Mutation pour soumettre une fiche client pour validation
  const submitFileMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      // Déterminer le statut cible en fonction du rôle de l'utilisateur
      const isAdmin = profile?.roles?.includes('ADMIN');
      const targetStatus = isAdmin
        ? ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION
        : ClientFileStatus.AWAITING_ADMIN_VALIDATION;

      return apiRequest<ClientFileDTO>(`/client-files/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: targetStatus }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientFiles'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la soumission de la fiche client',
        variant: 'destructive',
      });
      throw error;
    },
  });

  // Mutation pour valider une fiche client en tant qu'admin
  const validateAsAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${id}/validate-admin`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientFiles'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la validation de la fiche client',
        variant: 'destructive',
      });
      throw error;
    },
  });

  // Mutation pour valider une fiche client en tant que super-admin
  const validateAsSuperAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${id}/validate-superadmin`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientFiles'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la validation de la fiche client',
        variant: 'destructive',
      });
      throw error;
    },
  });

  // Mutation pour rejeter une fiche client
  const rejectFileMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientFiles'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Erreur lors du rejet de la fiche client',
        variant: 'destructive',
      });
      throw error;
    },
  });

  // Mutation pour supprimer une fiche client
  const deleteFileMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<void>(`/client-files/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientFiles'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la suppression de la fiche client',
        variant: 'destructive',
      });
      throw error;
    },
  });

  // Fonction pour exporter une fiche client en PDF
  const exportFileToPDF = async (id: string) => {
    if (!session?.accessToken) {
      throw new Error('Non authentifié');
    }

    try {
      console.log(`Début de l'export PDF pour la fiche client ${id}`);

      // Récupérer d'abord les données de la fiche client
      const clientFile = await apiRequest<ClientFileDTO>(`/client-files/${id}`);

      // Récupérer le fichier template
      const templateResponse = await fetch('/assets/template.docx');
      if (!templateResponse.ok) {
        throw new Error('Impossible de charger le fichier template');
      }
      const templateBlob = await templateResponse.blob();
      const templateFile = new File([templateBlob], 'template.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // Préparer les options
      const options = {
        format: 'pdf',
        template_filename: 'template.docx',
        data: clientFile,
      };

      // Créer le FormData
      const formData = new FormData();
      formData.append('file', templateFile);
      formData.append('options', JSON.stringify(options));

      // Faire la requête
      const response = await fetch(EXPORT_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      console.log(
        `Réponse reçue: status=${response.status}, contentType=${response.headers.get(
          'content-type'
        )}`
      );

      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => "Impossible de lire le message d'erreur");
        console.error(`Erreur HTTP ${response.status}: ${errorText}`);
        throw new Error(`Erreur lors de l'export PDF: ${response.status} ${response.statusText}`);
      }

      // Récupérer le blob de la réponse
      const blob = await response.blob();
      console.log(`Blob reçu: taille=${blob.size}, type=${blob.type}`);

      // Créer une URL d'objet pour le blob
      const url = window.URL.createObjectURL(blob);

      // Créer un lien temporaire et déclencher un téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche-client-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      console.log('Téléchargement déclenché');

      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Succès',
        description: 'Export PDF téléchargé avec succès',
      });
    } catch (error) {
      console.error("Erreur complète lors de l'export PDF:", error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : "Erreur lors de l'export PDF",
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Fonction pour exporter une fiche client en Excel
  const exportFileToExcel = async (id: string) => {
    if (!session?.accessToken) {
      throw new Error('Non authentifié');
    }

    try {
      console.log(`Début de l'export Excel pour la fiche client ${id}`);

      // Récupérer d'abord les données de la fiche client
      const clientFile = await apiRequest<ClientFileDTO>(`/client-files/${id}`);

      // Récupérer le fichier template
      const templateResponse = await fetch('/assets/template.docx');
      if (!templateResponse.ok) {
        throw new Error('Impossible de charger le fichier template');
      }
      const templateBlob = await templateResponse.blob();
      const templateFile = new File([templateBlob], 'template.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      // Préparer les options
      const options = {
        format: 'xlsx',
        template_filename: 'template.docx',
        data: clientFile,
      };

      // Créer le FormData
      const formData = new FormData();
      formData.append('file', templateFile);
      formData.append('options', JSON.stringify(options));

      // Faire la requête
      const response = await fetch(EXPORT_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      console.log(
        `Réponse reçue: status=${response.status}, contentType=${response.headers.get(
          'content-type'
        )}`
      );

      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => "Impossible de lire le message d'erreur");
        console.error(`Erreur HTTP ${response.status}: ${errorText}`);
        throw new Error(`Erreur lors de l'export Excel: ${response.status} ${response.statusText}`);
      }

      // Récupérer le blob de la réponse
      const blob = await response.blob();
      console.log(`Blob reçu: taille=${blob.size}, type=${blob.type}`);

      // Créer une URL d'objet pour le blob
      const url = window.URL.createObjectURL(blob);

      // Créer un lien temporaire et déclencher un téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche-client-${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      console.log('Téléchargement déclenché');

      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Succès',
        description: 'Export Excel téléchargé avec succès',
      });
    } catch (error) {
      console.error("Erreur complète lors de l'export Excel:", error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : "Erreur lors de l'export Excel",
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Fonction pour créer une nouvelle fiche client avec gestion d'erreur
  const createClientFile = async (data: ClientFileCreateRequest): Promise<ClientFileDTO | null> => {
    try {
      return await createClientFileMutation.mutateAsync(data);
    } catch (error) {
      console.error('Erreur lors de la création de la fiche client:', error);
      return null;
    }
  };

  // Fonction pour mettre à jour une fiche client avec gestion d'erreur
  const updateClientFile = async (
    id: string,
    data: Partial<ClientFileDTO>
  ): Promise<ClientFileDTO | null> => {
    try {
      return await updateClientFileMutation.mutateAsync({ id, data });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la fiche client:', error);
      return null;
    }
  };

  // Fonction pour soumettre une fiche client pour validation
  const submitFile = async (id: string): Promise<void> => {
    await submitFileMutation.mutateAsync(id);
  };

  // Fonction pour valider une fiche client en tant qu'admin
  const validateAsAdmin = async (id: string): Promise<void> => {
    await validateAsAdminMutation.mutateAsync(id);
  };

  // Fonction pour valider une fiche client en tant que super-admin
  const validateAsSuperAdmin = async (id: string): Promise<void> => {
    await validateAsSuperAdminMutation.mutateAsync(id);
  };

  // Fonction pour rejeter une fiche client
  const rejectFile = async (id: string, reason: string): Promise<void> => {
    await rejectFileMutation.mutateAsync({ id, reason });
  };

  // Fonction pour supprimer une fiche client
  const deleteFile = async (id: string): Promise<void> => {
    await deleteFileMutation.mutateAsync(id);
  };

  return {
    clientFiles: query.data || [],
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    createClientFile,
    updateClientFile,
    submitFile,
    validateAsAdmin,
    validateAsSuperAdmin,
    rejectFile,
    deleteFile,
    exportFileToPDF,
    exportFileToExcel,
    isCreating: createClientFileMutation.isPending,
    isUpdating: updateClientFileMutation.isPending,
  };
}
