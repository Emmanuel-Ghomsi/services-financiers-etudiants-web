'use client';

import type React from 'react';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  MoreHorizontal,
  Pencil,
  Shield,
  ToggleRight,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '@/lib/api/hooks/use-profile';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { useUsers } from '@/lib/api/hooks/use-users';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation'; // Ajout de useSearchParams
import { EditUserModal } from '@/components/user/edit-user-modal';
import { EditRolesModal } from '@/components/user/edit-roles-modal';
import { EditStatusModal } from '@/components/user/edit-status-modal';
import { ResendPasswordModal } from '@/components/user/resend-password-modal';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import type { UserDTO } from '@/types/user';
import { UserRoleBadge } from '@/components/user/user-role-badge';
import { UserStatusBadge } from '@/components/user/user-status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';

export default function UsersPage() {
  const searchParams = useSearchParams(); // Récupérer les paramètres d'URL
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
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

  // Utiliser un debounce pour la recherche
  const debouncedSearch = useDebounce((value: string) => {
    setDebouncedSearchTerm(value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
  }, 300);

  // Mettre à jour le terme de recherche et déclencher la recherche debounced
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Vérifier si l'utilisateur vient d'être redirigé depuis la page d'ajout
  useEffect(() => {
    const fromAdd = searchParams.get('fromAdd') === 'true';
    if (fromAdd) {
      // Mettre à jour l'URL sans le paramètre pour éviter de refaire la requête lors des navigations futures
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('fromAdd');
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [searchParams, router]);

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
    filters: debouncedSearchTerm
      ? {
          username: debouncedSearchTerm,
        }
      : undefined,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  const handleActionClick = (user: UserDTO, action: string) => {
    // Définir explicitement l'utilisateur sélectionné avant d'ouvrir la modale
    setSelectedUser(user);

    // Utiliser setTimeout pour s'assurer que l'état est mis à jour avant d'ouvrir la modale
    setTimeout(() => {
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
    }, 0);
  };

  const handleSuccess = () => {
    refetch();
  };

  // Vérifier si un utilisateur peut être modifié
  const canEditUser = useCallback((user: UserDTO) => {
    return !user.emailVerified;
  }, []);

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
      <div className="p-4 flex items-center justify-between border-t">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">
            Affichage de {data.items.length} sur {data.totalItems} utilisateurs
          </span>
        </div>
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
    <AuthenticatedLayout title="Utilisateurs">
      <Breadcrumb segments={[{ name: 'Utilisateurs', href: '/users' }]} />

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <Button variant="default" className="bg-brand-blue hover:bg-brand-blue/90">
            Utilisateurs
          </Button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link href="/users/add">
            <PlusIcon className="h-4 w-4" />
            <span>Ajouter un utilisateur</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-64 pl-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle>Liste des utilisateurs</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Afficher</span>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">par page</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Une erreur est survenue lors du chargement des utilisateurs.
            </div>
          ) : data?.items && data.items.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom d'utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôles</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <UserRoleBadge key={role} role={role} />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <UserStatusBadge
                          status={user.status || (user.isActive ? 'ACTIVE' : 'INACTIVE')}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir le menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Option Modifier les informations - désactivée si l'utilisateur est déjà connecté */}
                            {canEditUser(user) ? (
                              <DropdownMenuItem onClick={() => handleActionClick(user, 'edit')}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Modifier les informations</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Modifier les informations</span>
                              </DropdownMenuItem>
                            )}

                            {/* Gestion des rôles - toujours disponible */}
                            <DropdownMenuItem onClick={() => handleActionClick(user, 'roles')}>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Gérer les rôles</span>
                            </DropdownMenuItem>

                            {/* Changement de statut - toujours disponible */}
                            <DropdownMenuItem onClick={() => handleActionClick(user, 'status')}>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              <span>Changer le statut</span>
                            </DropdownMenuItem>

                            {/* Renvoi d'email - uniquement visible si l'utilisateur n'a pas défini de mot de passe ou est en attente de vérification */}
                            {canEditUser(user) ? (
                              <DropdownMenuItem onClick={() => handleActionClick(user, 'resend')}>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Renvoyer l'email de connexion</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Renvoyer l'email de connexion</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Aucun utilisateur trouvé.</div>
          )}

          {renderPagination()}
        </CardContent>
      </Card>

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
