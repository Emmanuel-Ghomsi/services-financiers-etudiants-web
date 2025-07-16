'use client';

import { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Filter, Calendar } from 'lucide-react';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { useLeaves, useLeaveMutations } from '@/lib/api/hooks/use-leaves';
import { LeaveForm } from '@/components/leave/leave-form';
import { LeavesTable } from '@/components/leave/leaves-table';
import { LeaveBalanceCard } from '@/components/leave/leave-balance-card';
import { AbsenceCalendar } from '@/components/leave/absence-calendar';
import { useLeaveBalance, useAbsenceCalendar } from '@/lib/api/hooks/use-leaves';
import { type LeaveDTO, type LeaveType, ValidationStatus } from '@/types/leave';
import { LEAVE_TYPE_LABELS } from '@/lib/constants/leave-constants';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from 'sonner';

export default function LeavesPage() {
  const { profile } = useProfile();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<LeaveType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ValidationStatus | 'all'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveDTO | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Hooks pour les données
  const { data: leavesData, isLoading: leavesLoading } = useLeaves({
    page: currentPage,
    limit: 10,
    filters: {
      employeeUsername: searchTerm === '' ? undefined : searchTerm,
      leaveType: selectedType === 'all' ? undefined : selectedType,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
    },
  });

  const { data: leaveBalance } = useLeaveBalance({
    employeeId: profile?.id || '',
    year: new Date().getFullYear(),
  });

  const { data: absenceCalendar, isLoading: calendarLoading } = useAbsenceCalendar();

  const {
    createLeave,
    updateLeave,
    deleteLeave,
    validateAsAdmin,
    validateAsSuperAdmin,
    rejectLeave,
  } = useLeaveMutations();

  // Vérifier les permissions
  const canCreateLeave = !!profile?.roles?.length;
  const canValidate = profile?.roles?.some((role) =>
    ['ADMIN', 'SUPER_ADMIN', 'RH'].includes(role.toUpperCase())
  );

  const handleCreateLeave = async (data: any) => {
    try {
      await createLeave.mutateAsync(data);
      setShowCreateDialog(false);
    } catch (error) {
      // L'erreur est gérée dans le hook
    }
  };

  const handleUpdateLeave = async (data: any) => {
    if (!selectedLeave) return;
    try {
      await updateLeave.mutateAsync({ id: selectedLeave.id, data });
      setShowEditDialog(false);
      setSelectedLeave(null);
    } catch (error) {
      // L'erreur est gérée dans le hook
    }
  };

  const handleDeleteLeave = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande de congé ?')) {
      try {
        await deleteLeave.mutateAsync(id);
      } catch (error) {
        // L'erreur est gérée dans le hook
      }
    }
  };

  const handleValidateAdmin = async (id: string) => {
    try {
      await validateAsAdmin.mutateAsync({
        id,
        data: { validatorId: profile?.id || '' },
      });
    } catch (error) {
      // L'erreur est gérée dans le hook
    }
  };

  const handleValidateSuperAdmin = async (id: string) => {
    try {
      await validateAsSuperAdmin.mutateAsync({
        id,
        data: { validatorId: profile?.id || '' },
      });
    } catch (error) {
      // L'erreur est gérée dans le hook
    }
  };

  const handleRejectLeave = async (id: string, reason: string) => {
    try {
      await rejectLeave.mutateAsync({ id, data: { reason } });
    } catch (error) {
      // L'erreur est gérée dans le hook
    }
  };

  const handleViewLeave = (leave: LeaveDTO) => {
    setSelectedLeave(leave);
    // Ici vous pourriez ouvrir un modal de détails
    toast.info('Fonctionnalité de visualisation à implémenter');
  };

  const handleEditLeave = (leave: LeaveDTO) => {
    setSelectedLeave(leave);
    setShowEditDialog(true);
  };

  return (
    <AuthenticatedLayout title="Gestion des Congés" userName={profile?.firstname || ''}>
      <div className="space-y-6">
        {/* En-tête avec actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gestion des Congés</h1>
            <p className="text-gray-600">Gérez les demandes de congé et consultez les soldes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCalendarView(!showCalendarView)}>
              <Calendar className="mr-2 h-4 w-4" />
              {showCalendarView ? 'Vue Liste' : 'Calendrier'}
            </Button>
            {canCreateLeave && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle demande
              </Button>
            )}
          </div>
        </div>

        {/* Solde de congés de l'utilisateur */}
        {leaveBalance && (
          <LeaveBalanceCard
            balance={leaveBalance}
            employeeName={`${profile?.firstname} ${profile?.lastname}`}
          />
        )}

        {/* Vue calendrier ou liste */}
        {showCalendarView ? (
          <AbsenceCalendar absences={absenceCalendar || []} isLoading={calendarLoading} />
        ) : (
          <>
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rechercher</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher par employé..."
                        value={canValidate ? searchTerm : profile?.username}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de congé</label>
                    <Select
                      value={selectedType}
                      onValueChange={(value) => setSelectedType(value as LeaveType | 'all')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Statut</label>
                    <Select
                      value={selectedStatus}
                      onValueChange={(value) =>
                        setSelectedStatus(value as ValidationStatus | 'all')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value={ValidationStatus.AWAITING_ADMIN_VALIDATION}>
                          En attente (Conformité)
                        </SelectItem>
                        <SelectItem value={ValidationStatus.AWAITING_SUPERADMIN_VALIDATION}>
                          En attente (Contrôle Interne)
                        </SelectItem>
                        <SelectItem value={ValidationStatus.VALIDATED}>Validé</SelectItem>
                        <SelectItem value={ValidationStatus.REJECTED}>Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tableau des congés */}
            <LeavesTable
              leaves={leavesData?.items || []}
              onView={handleViewLeave}
              onEdit={handleEditLeave}
              onDelete={handleDeleteLeave}
              onValidateAdmin={handleValidateAdmin}
              onValidateSuperAdmin={handleValidateSuperAdmin}
              onReject={handleRejectLeave}
              isLoading={
                createLeave.isPending ||
                updateLeave.isPending ||
                deleteLeave.isPending ||
                validateAsAdmin.isPending ||
                validateAsSuperAdmin.isPending ||
                rejectLeave.isPending
              }
            />

            {/* Pagination */}
            {leavesData && leavesData.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Page {currentPage} sur {leavesData.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(leavesData.totalPages, currentPage + 1))}
                    disabled={currentPage === leavesData.totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Dialog de création */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle demande de congé</DialogTitle>
            </DialogHeader>
            <LeaveForm
              onSubmit={handleCreateLeave}
              onCancel={() => setShowCreateDialog(false)}
              isLoading={createLeave.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog de modification */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la demande de congé</DialogTitle>
            </DialogHeader>
            <LeaveForm
              leave={selectedLeave}
              onUpdate={handleUpdateLeave}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedLeave(null);
              }}
              isLoading={updateLeave.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
