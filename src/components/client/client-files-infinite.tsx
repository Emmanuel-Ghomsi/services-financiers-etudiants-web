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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import type { ClientFileDTO } from '@/types/client-file';

export function ClientFilesInfinite() {
  const { setFilters, filters } = useClientFilesStore();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    infiniteData,
    infiniteIsLoading,
    infiniteError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClientFiles({
    filters,
  });

  const handleSearch = () => {
    setFilters({
      lastName: searchTerm,
      email: searchTerm,
      reference: searchTerm,
      clientCode: searchTerm,
    });
  };

  // Aplatir les données paginées
  const clientFiles = infiniteData?.pages.flatMap((page) => page.items) || [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Fiches Clients (Chargement Infini)</CardTitle>
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
          </div>
        </div>

        {infiniteIsLoading && !infiniteData ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          </div>
        ) : infiniteError ? (
          <div className="text-center text-red-500 py-8">
            Une erreur est survenue lors du chargement des fiches clients.
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

        {hasNextPage && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isFetchingNextPage ? (
                <div className="animate-spin h-4 w-4 border-2 border-brand-blue border-t-transparent rounded-full"></div>
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {isFetchingNextPage ? 'Chargement...' : 'Charger plus'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
