import { useProfile } from '@/lib/api/hooks/use-profile';
import { ClientFileStatus } from '@/lib/constants/client-file-status';
import type { ClientFileDTO } from '@/types/client-file';

export function useClientFilePermissions() {
  const { profile } = useProfile();

  const hasRole = (role: string) => {
    return profile?.roles?.some((r) => r.toUpperCase() === role.toUpperCase()) || false;
  };

  const isAdmin = hasRole('ADMIN');
  const isSuperAdmin = hasRole('SUPER_ADMIN');
  const isAdvisor = hasRole('ADVISOR');

  const canCreateFile = () => {
    // Seuls les ADMIN et ADVISOR peuvent créer des fiches
    return isAdmin || isAdvisor;
  };

  // Corriger la vérification du créateur de la fiche
  const canEditFile = (file: ClientFileDTO) => {
    // Vérifier si l'utilisateur est le créateur de la fiche
    // Utiliser creatorId au lieu de userId qui n'existe peut-être pas
    const isCreator = file.creatorId === profile?.id;

    // Statuts permettant la modification
    const editableStatuses = [
      ClientFileStatus.IN_PROGRESS,
      ClientFileStatus.REJECTED,
      ClientFileStatus.BEING_MODIFIED,
    ];

    return isCreator && editableStatuses.includes(file.status as ClientFileStatus);
  };

  // Nouvelle fonction pour déterminer si l'utilisateur peut consulter une fiche
  const canViewFile = (file: ClientFileDTO) => {
    // Le créateur peut toujours consulter sa fiche
    const isCreator = file.creatorId === profile?.id;
    if (isCreator) return true;

    // Les admins peuvent consulter les fiches en attente de validation admin
    if (isAdmin && file.status === ClientFileStatus.AWAITING_ADMIN_VALIDATION) return true;

    // Les super admins peuvent consulter les fiches en attente de validation super admin
    if (isSuperAdmin && file.status === ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION)
      return true;

    // Les admins et super admins peuvent consulter toutes les fiches validées
    if ((isAdmin || isSuperAdmin) && file.status === ClientFileStatus.VALIDATED) return true;

    return false;
  };

  // Corriger également les autres fonctions qui utilisent userId
  const canDeleteFile = (file: ClientFileDTO) => {
    // Vérifier si l'utilisateur est le créateur de la fiche
    const isCreator = file.creatorId === profile?.id;

    // Uniquement si le statut est IN_PROGRESS
    return isCreator && file.status === ClientFileStatus.IN_PROGRESS;
  };

  const canSubmitFile = (file: ClientFileDTO) => {
    // Vérifier si l'utilisateur est le créateur de la fiche
    const isCreator = file.creatorId === profile?.id;

    // Statuts permettant la soumission
    const submittableStatuses = [ClientFileStatus.IN_PROGRESS, ClientFileStatus.BEING_MODIFIED];

    return isCreator && submittableStatuses.includes(file.status as ClientFileStatus);
  };

  const canValidateAsAdmin = (file: ClientFileDTO) => {
    return isAdmin && file.status === ClientFileStatus.AWAITING_ADMIN_VALIDATION;
  };

  const canValidateAsSuperAdmin = (file: ClientFileDTO) => {
    return isSuperAdmin && file.status === ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION;
  };

  const canRejectFile = (file: ClientFileDTO) => {
    if (isAdmin && file.status === ClientFileStatus.AWAITING_ADMIN_VALIDATION) {
      return true;
    }

    if (isSuperAdmin && file.status === ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION) {
      return true;
    }

    return false;
  };

  const canExportFile = (file: ClientFileDTO) => {
    const userId = profile?.id;
    const userRole = profile?.roles?.[0]?.toUpperCase() || '';

    // Tous les utilisateurs peuvent exporter/envoyer par email une fiche validée
    if (file.validationDateSuper && file.status === ClientFileStatus.VALIDATED) {
      return true;
    }

    // Les admins et super-admins peuvent exporter/envoyer par email n'importe quelle fiche
    if (
      (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') &&
      file.status === ClientFileStatus.VALIDATED
    ) {
      return true;
    }

    // L'auteur peut exporter/envoyer par email sa propre fiche
    if (file.creatorId === userId && file.status === ClientFileStatus.VALIDATED) {
      return true;
    }

    return false;
  };

  return {
    isAdmin,
    isSuperAdmin,
    isAdvisor,
    canCreateFile,
    canEditFile,
    canViewFile,
    canDeleteFile,
    canSubmitFile,
    canValidateAsAdmin,
    canValidateAsSuperAdmin,
    canRejectFile,
    canExportFile,
  };
}
