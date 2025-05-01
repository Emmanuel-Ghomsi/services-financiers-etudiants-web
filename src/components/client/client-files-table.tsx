'use client';

import { useState, useEffect, useRef } from 'react';
import { useClientFiles } from '@/lib/api/hooks/use-client-files';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon, FileText, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { ClientFileStatusBadge } from './client-file-status-badge';
import { ClientFileActionsMenu } from './client-file-actions-menu';
import { useClientFilePermissions } from '@/hooks/use-client-file-permissions';
import { useToast } from '@/hooks/use-toast';
import { ClientFileStatus } from '@/lib/constants/client-file-status';

export function ClientFilesTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { clientFiles, isLoading: queryIsLoading, error: queryError, refetch } = useClientFiles();
  const permissions = useClientFilePermissions();

  // Ajouter ce console.log pour déboguer
  useEffect(() => {
    console.log('Client files data:', clientFiles);
  }, [clientFiles]);

  // Fonction pour calculer la progression d'une fiche client
  const calculateCompletion = (clientFile: any) => {
    let completedSteps = 0;
    const totalSteps = 9;

    // Vérifier chaque étape
    if (clientFile.reference && clientFile.clientCode) completedSteps++;
    if (clientFile.lastName && clientFile.firstName) completedSteps++;
    if (clientFile.homeAddress) completedSteps++;
    if (clientFile.profession) completedSteps++;
    if (clientFile.incomeSources) completedSteps++;
    if (clientFile.hasInternationalOps !== null) completedSteps++;
    if (clientFile.offeredAccounts) completedSteps++;
    if (clientFile.isPEP !== null) completedSteps++;
    if (clientFile.riskLevel) completedSteps++;

    return Math.round((completedSteps / totalSteps) * 100);
  };
  
  const prevLoadingRef = useRef(queryIsLoading);
  const prevErrorRef = useRef(queryError);

  useEffect(() => {
    // Ne mettre à jour l'état local que si l'état a réellement changé
    if (prevLoadingRef.current !== queryIsLoading) {
      prevLoadingRef.current = queryIsLoading;
      setLoading(queryIsLoading);
    }

    // Gérer les erreurs seulement si elles ont changé
    if (queryError && prevErrorRef.current !== queryError) {
      prevErrorRef.current = queryError;
      const errorMessage =
        queryError instanceof Error ? queryError.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [queryIsLoading, queryError, toast]);

  // Vérifier si une fiche est en attente de validation
  const isAwaitingValidation = (status: string) => {
    return (
      status === ClientFileStatus.AWAITING_ADMIN_VALIDATION ||
      status === ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          <span className="ml-2">Chargement des fiches clients...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Une erreur est survenue lors du chargement des fiches clients.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Pagination simple
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFiles = Array.isArray(clientFiles) ? clientFiles.slice(startIndex, endIndex) : [];
  const totalPages = Array.isArray(clientFiles) ? Math.ceil(clientFiles.length / pageSize) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des fiches clients</CardTitle>
      </CardHeader>
      <CardContent>
        {clientFiles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Aucune fiche client</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer une nouvelle fiche client
            </p>
            {permissions.canCreateFile() && (
              <Button asChild>
                <Link href="/clients/new">Créer une fiche client</Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Code client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Opérateur</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFiles.map((client) => {
                    const completion = calculateCompletion(client);
                    const canView = permissions.canViewFile(client);

                    return (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          {canView ? (
                            <Link
                              href={`/clients/${client.id}/view`}
                              className="text-brand-blue hover:underline"
                            >
                              {client.reference}
                            </Link>
                          ) : (
                            client.reference
                          )}
                        </TableCell>
                        <TableCell>{client.clientCode}</TableCell>
                        <TableCell>{client.clientType}</TableCell>
                        <TableCell>{client.reason}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-brand-blue h-2.5 rounded-full"
                                style={{ width: `${completion}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{completion}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ClientFileStatusBadge reject={client.rejectionReason} status={client.status} />
                        </TableCell>
                        <TableCell>{client.creatorUsername}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            {permissions.canEditFile(client) ? (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/clients/${client.id}/edit`}>
                                  <FileText className="h-4 w-4 mr-1" />
                                  Continuer
                                </Link>
                              </Button>
                            ) : isAwaitingValidation(client.status) && canView ? (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/clients/${client.id}/view`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Consulter
                                </Link>
                              </Button>
                            ) : isAwaitingValidation(client.status) ? (
                              <span className="text-xs text-amber-600">
                                En attente de validation
                              </span>
                            ) : null}
                            <ClientFileActionsMenu file={client} onActionComplete={refetch} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        <span className="sr-only">Page précédente</span>
                      </Button>
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => setPage(index + 1)}
                          isActive={page === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                        <span className="sr-only">Page suivante</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
