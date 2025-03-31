'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClientFiles } from '@/lib/api/hooks/use-client-files';
import { useClientFilesStore } from '@/lib/stores/client-files-store';
import { ClientStatusBadge } from './client-status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import type { ClientFileDTO } from '@/types/client-file';

export function ClientFilesTable() {
  const { setFilters, filters } = useClientFilesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Page 1 par défaut
  const pageSize = 10;

  const { clientFiles, pagination, isLoading, error, refetch } = useClientFiles({
    page: currentPage,
    pageSize,
    filters,
  });

  const handleSearch = () => {
    setFilters({
      lastName: searchTerm,
      email: searchTerm,
      reference: searchTerm,
      clientCode: searchTerm,
    });
    setCurrentPage(1); // Retour à la page 1 après une recherche
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { totalPages, currentPage } = pagination;
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
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={currentPage === 1 ? 'opacity-50' : ''}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Page précédente</span>
            </Button>
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <span className="px-4 py-2">...</span>
                </PaginationItem>
              )}
            </>
          )}

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

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <span className="px-4 py-2">...</span>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'opacity-50' : ''}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Page suivante</span>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Fiches Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <Input
              placeholder="Rechercher par nom, email, référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
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
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Actualiser
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            Une erreur est survenue lors du chargement des fiches clients.
            <Button variant="link" onClick={() => refetch()} className="ml-2">
              Réessayer
            </Button>
          </div>
        ) : clientFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucune fiche client trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientFiles.map((client: ClientFileDTO) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.reference}</TableCell>
                    <TableCell>
                      {client.lastName} {client.firstName}
                    </TableCell>
                    <TableCell>{client.email || '-'}</TableCell>
                    <TableCell>{client.clientType}</TableCell>
                    <TableCell>
                      <ClientStatusBadge status={client.status} />
                    </TableCell>
                    <TableCell>{formatDate(client.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-brand-blue hover:text-brand-blue/80"
                      >
                        <Link href={`/clients/${client.id}`}>Voir</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {renderPagination()}
      </CardContent>
    </Card>
  );
}
