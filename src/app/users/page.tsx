'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  PlusIcon,
  SearchIcon,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useUsers } from '@/lib/api/hooks/use-users';
import { formatDate } from '@/lib/utils/format';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { UserStatusBadge } from '@/components/user/user-status-badge';
import { UserRoleBadge } from '@/components/user/user-role-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditUserModal } from '@/components/user/edit-user-modal';
import { EditRolesModal } from '@/components/user/edit-roles-modal';
import { EditStatusModal } from '@/components/user/edit-status-modal';
import { ResendPasswordModal } from '@/components/user/resend-password-modal';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import type { UserDTO } from '@/types/user';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAdmin, setIsAdmin] = useState(false);
  const { profile, isLoading: isProfileLoading } = useProfile();
  const router = useRouter();

  // Modales
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editRolesOpen, setEditRolesOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [resendPasswordOpen, setResendPasswordOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      // Vérification des rôles insensible à la casse
      const hasAdminRole = profile.roles?.some(
        (role) => role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'SUPER_ADMIN'
      );

      setIsAdmin(hasAdminRole);

      // Ne rediriger que si nous sommes sûrs que l'utilisateur n'est pas admin
      if (profile.roles && !hasAdminRole) {
        router.push('/dashboard');
      }
    }
  }, [profile, router]);

  // Récupérer les utilisateurs
  const { data, isLoading, error, refetch } = useUsers({
    page: currentPage,
    pageSize,
    filters: searchTerm
      ? {
          username: searchTerm,
          email: searchTerm,
        }
      : undefined,
  });

  const handleSearch = () => {
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  const handleActionClick = (user: UserDTO, action: string) => {
    setSelectedUser(user);

    switch (action) {
      case 'edit':
        setEditUserOpen(true);
        break;
      case 'roles':
        setEditRolesOpen(true);
        break;
      case 'status':
        setEditStatusOpen(true);
        break;
      case 'resend':
        setResendPasswordOpen(true);
        break;
    }
  };

  const handleSuccess = () => {
    refetch();
  };

  const renderPagination = () => {
    // Vérifier si data existe et contient les propriétés nécessaires
    if (!data || typeof data.totalPages !== 'number' || typeof data.currentPage !== 'number') {
      return null;
    }

    const { totalPages, currentPage } = data;
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="p-4 flex items-center justify-center border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Précédent</span>
              </Button>
            </PaginationItem>

            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Suivant</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  if (!isProfileLoading && profile && !isAdmin) {
    return null;
  }

  return (
    <AuthenticatedLayout title="Utilisateurs" userName={profile?.firstName || ''}>
      <Breadcrumb segments={[{ name: 'Utilisateurs', href: '/users' }]} />

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <Button variant="default" className="bg-brand-blue hover:bg-brand-blue/90 mr-4">
            Utilisateurs
          </Button>
          <Button variant="outline" asChild>
            <Link href="/clients">Clients enregistrés</Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href="/users/add">
            <PlusIcon className="h-4 w-4" />
            <span>Ajouter un utilisateur</span>
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Input
                placeholder="Rechercher un utilisateur"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <Button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 bg-brand-blue hover:bg-brand-blue/90"
                size="sm"
              >
                Rechercher
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">afficher</span>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-16">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">Par page</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <Button variant="outline" className="text-sm" onClick={() => refetch()}>
              Actualiser
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/90 text-sm">Exporter</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Une erreur est survenue lors du chargement des utilisateurs.
            <Button variant="link" onClick={() => refetch()} className="ml-2">
              Réessayer
            </Button>
          </div>
        ) : !data || !Array.isArray(data.items) || data.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucun utilisateur trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4 whitespace-nowrap">Nom & prénom</th>
                  <th className="p-4 whitespace-nowrap">Email</th>
                  <th className="p-4 whitespace-nowrap">Nom d'utilisateur</th>
                  <th className="p-4 whitespace-nowrap">Date de création</th>
                  <th className="p-4 whitespace-nowrap">Statut</th>
                  <th className="p-4 whitespace-nowrap">Roles</th>
                  <th className="p-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.items.map((user: UserDTO) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4 whitespace-nowrap">
                      {user.lastName} {user.firstName}
                    </td>
                    <td className="p-4 whitespace-nowrap">{user.email}</td>
                    <td className="p-4 whitespace-nowrap">{user.username}</td>
                    <td className="p-4 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                    <td className="p-4 whitespace-nowrap">
                      <UserStatusBadge
                        status={user.status || (user.isActive ? 'ACTIVE' : 'INACTIVE')}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <UserRoleBadge key={role} role={role} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleActionClick(user, 'edit')}>
                            Modifier l'utilisateur
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick(user, 'roles')}>
                            Modifier les rôles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick(user, 'status')}>
                            Modifier le statut
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick(user, 'resend')}>
                            Renvoyer l'email de mot de passe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {renderPagination()}
      </div>

      {/* Modales */}
      {selectedUser && (
        <>
          <EditUserModal
            user={selectedUser}
            isOpen={editUserOpen}
            onClose={() => setEditUserOpen(false)}
            onSuccess={handleSuccess}
          />
          <EditRolesModal
            user={selectedUser}
            isOpen={editRolesOpen}
            onClose={() => setEditRolesOpen(false)}
            onSuccess={handleSuccess}
          />
          <EditStatusModal
            user={selectedUser}
            isOpen={editStatusOpen}
            onClose={() => setEditStatusOpen(false)}
            onSuccess={handleSuccess}
          />
          <ResendPasswordModal
            user={selectedUser}
            isOpen={resendPasswordOpen}
            onClose={() => setResendPasswordOpen(false)}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </AuthenticatedLayout>
  );
}
