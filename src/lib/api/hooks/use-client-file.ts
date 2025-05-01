'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { useClientFileStore } from '@/lib/stores/client-file-store';
import type {
  ClientFileDTO,
  ClientFileIdentityRequest,
  ClientFileAddressRequest,
  ClientFileActivityRequest,
  ClientFileSituationRequest,
  ClientFileInternationalRequest,
  ClientFileServicesRequest,
  ClientFileOperationRequest,
  ClientFilePepRequest,
  ClientFileComplianceRequest,
  ClientFileFundOriginRequest,
} from '@/types/client-file';
import { apiRequest } from '@/lib/api/api-client';
import { useEffect } from 'react';

export function useClientFile(clientFileId?: string) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setCurrentClientFile } = useClientFileStore();

  // Récupérer une fiche client spécifique
  const query = useQuery<ClientFileDTO>({
    queryKey: ['clientFile', clientFileId],
    queryFn: async () => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${clientFileId}`);
    },
    enabled: !!session?.accessToken && !!clientFileId,
  });

  useEffect(() => {
    if (query.data) {
      setCurrentClientFile(query.data);
    }
  }, [query.data, setCurrentClientFile]);

  // Mutation générique pour mettre à jour une fiche client
  const updateClientFileMutation = useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${clientFileId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
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
            : 'Erreur lors de la mise à jour de la fiche client',
        variant: 'destructive',
      });
    },
  });

  const updateClientFileStatusMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${clientFileId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
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
    },
  });

  // Mutation pour mettre à jour l'identité
  const updateIdentityMutation = useMutation({
    mutationFn: async (data: ClientFileIdentityRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/identity`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Identité mise à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : "Erreur lors de la mise à jour de l'identité",
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour les coordonnées
  const updateAddressMutation = useMutation({
    mutationFn: async (data: ClientFileAddressRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/address`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Coordonnées mises à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Erreur lors de la mise à jour des coordonnées',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour l'activité
  const updateActivityMutation = useMutation({
    mutationFn: async (data: ClientFileActivityRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/activity`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Activité mise à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : "Erreur lors de la mise à jour de l'activité",
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour la situation
  const updateSituationMutation = useMutation({
    mutationFn: async (data: ClientFileSituationRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/situation`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Situation mise à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la situation',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour les transactions internationales
  const updateInternationalMutation = useMutation({
    mutationFn: async (data: ClientFileInternationalRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/international`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Transactions internationales mises à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour des transactions internationales',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour les services
  const updateServicesMutation = useMutation({
    mutationFn: async (data: ClientFileServicesRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/services`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Services mis à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Erreur lors de la mise à jour des services',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour le fonctionnement du compte
  const updateOperationMutation = useMutation({
    mutationFn: async (data: ClientFileOperationRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/operation`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Fonctionnement du compte mis à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour du fonctionnement du compte',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour les informations PEP
  const updatePepMutation = useMutation({
    mutationFn: async (data: ClientFilePepRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/pep`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Informations PEP mises à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour des informations PEP',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour la conformité
  const updateComplianceMutation = useMutation({
    mutationFn: async (data: ClientFileComplianceRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/compliance`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Classification LBC/FT mise à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : 'Erreur lors de la mise à jour de la classification LBC/FT',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour mettre à jour l'origine des fonds
  const updateFundOriginMutation = useMutation({
    mutationFn: async (data: ClientFileFundOriginRequest) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<{ message: string }>(`/client-files/${clientFileId}/fund-origin`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Origine des fonds mise à jour avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour de l'origine des fonds",
        variant: 'destructive',
      });
    },
  });

  // NOUVELLES MUTATIONS POUR LA VALIDATION ET LE REJET

  // Mutation pour valider une fiche client en tant qu'admin
  const validateAsAdminMutation = useMutation({
    mutationFn: async () => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${clientFileId}/validate-admin`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Fiche client validée avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
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
    },
  });

  // Mutation pour valider une fiche client en tant que super-admin
  const validateAsSuperAdminMutation = useMutation({
    mutationFn: async () => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${clientFileId}/validate-superadmin`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Fiche client validée avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
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
    },
  });

  // Mutation pour rejeter une fiche client
  const rejectFileMutation = useMutation({
    mutationFn: async (reason: string) => {
      if (!clientFileId) {
        throw new Error('ID de fiche client non fourni');
      }

      if (!session?.accessToken) {
        throw new Error('Non authentifié');
      }

      return apiRequest<ClientFileDTO>(`/client-files/${clientFileId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Fiche client rejetée avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['clientFile', clientFileId] });
      queryClient.invalidateQueries({ queryKey: ['clientFiles'] });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description:
          error instanceof Error ? error.message : 'Erreur lors du rejet de la fiche client',
        variant: 'destructive',
      });
    },
  });

  // Fonction pour mettre à jour une fiche client
  const updateClientFile = async (id: string, data: any): Promise<ClientFileDTO | null> => {
    try {
      return await updateClientFileMutation.mutateAsync({ data });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la fiche client:', error);
      return null;
    }
  };

  const updateClientFileStatus = async (
    id: string,
    status: string
  ): Promise<ClientFileDTO | null> => {
    try {
      return await updateClientFileStatusMutation.mutateAsync({ status });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la fiche client:', error);
      return null;
    }
  };

  // Fonction pour mettre à jour l'identité
  const updateIdentity = async (data: ClientFileIdentityRequest): Promise<void> => {
    await updateIdentityMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour les coordonnées
  const updateAddress = async (data: ClientFileAddressRequest): Promise<void> => {
    await updateAddressMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour l'activité
  const updateActivity = async (data: ClientFileActivityRequest): Promise<void> => {
    await updateActivityMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour la situation
  const updateSituation = async (data: ClientFileSituationRequest): Promise<void> => {
    await updateSituationMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour les transactions internationales
  const updateInternational = async (data: ClientFileInternationalRequest): Promise<void> => {
    await updateInternationalMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour les services
  const updateServices = async (data: ClientFileServicesRequest): Promise<void> => {
    await updateServicesMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour le fonctionnement du compte
  const updateOperation = async (data: ClientFileOperationRequest): Promise<void> => {
    await updateOperationMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour les informations PEP
  const updatePep = async (data: ClientFilePepRequest): Promise<void> => {
    await updatePepMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour la conformité
  const updateCompliance = async (data: ClientFileComplianceRequest): Promise<void> => {
    await updateComplianceMutation.mutateAsync(data);
  };

  // Fonction pour mettre à jour l'origine des fonds
  const updateFundOrigin = async (data: ClientFileFundOriginRequest): Promise<void> => {
    await updateFundOriginMutation.mutateAsync(data);
  };

  // NOUVELLES FONCTIONS POUR LA VALIDATION ET LE REJET

  // Fonction pour valider une fiche client en tant qu'admin
  const validateAsAdmin = async (): Promise<void> => {
    await validateAsAdminMutation.mutateAsync();
  };

  // Fonction pour valider une fiche client en tant que super-admin
  const validateAsSuperAdmin = async (): Promise<void> => {
    await validateAsSuperAdminMutation.mutateAsync();
  };

  // Fonction pour rejeter une fiche client
  const rejectFile = async (reason: string): Promise<void> => {
    await rejectFileMutation.mutateAsync(reason);
  };

  return {
    clientFile: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    updateClientFile,
    isUpdating: updateClientFileMutation.isPending,
    updateClientFileStatus,
    isUpdatingStatus: updateClientFileStatusMutation.isPending,
    updateIdentity,
    isUpdatingIdentity: updateIdentityMutation.isPending,
    updateAddress,
    isUpdatingAddress: updateAddressMutation.isPending,
    updateActivity,
    isUpdatingActivity: updateActivityMutation.isPending,
    updateSituation,
    isUpdatingSituation: updateSituationMutation.isPending,
    updateInternational,
    isUpdatingInternational: updateInternationalMutation.isPending,
    updateServices,
    isUpdatingServices: updateServicesMutation.isPending,
    updateOperation,
    isUpdatingOperation: updateOperationMutation.isPending,
    updatePep,
    isUpdatingPep: updatePepMutation.isPending,
    updateCompliance,
    isUpdatingCompliance: updateComplianceMutation.isPending,
    updateFundOrigin,
    isUpdatingFundOrigin: updateFundOriginMutation.isPending,
    // NOUVELLES FONCTIONS EXPOSÉES
    validateAsAdmin,
    isValidatingAsAdmin: validateAsAdminMutation.isPending,
    validateAsSuperAdmin,
    isValidatingAsSuperAdmin: validateAsSuperAdminMutation.isPending,
    rejectFile,
    isRejecting: rejectFileMutation.isPending,
  };
}
