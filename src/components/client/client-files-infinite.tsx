'use client';

import { useEffect, useState } from 'react';
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
import { FileText, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { useClientFilePermissions } from '@/hooks/use-client-file-permissions';
import { ClientFileStatus } from '@/lib/constants/client-file-status';
import { ClientFileStatusBadge } from './client-file-status-badge';
import { ClientFileActionsMenu } from './client-file-actions-menu';

export function ClientFilesInfinite() {
  const { clientFiles, isLoading, error, refetch } = useClientFiles();
  const [displayedFiles, setDisplayedFiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5; // Nombre d'éléments à charger à chaque fois
  const permissions = useClientFilePermissions();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Fonction pour calculer la progression d'une fiche client
  const calculateCompletion = (clientFile: any) => {
    // Cette logique devra être adaptée selon votre modèle de données
    let completedSteps = 0;
    const totalSteps = 9; // Nombre total d'étapes

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

  // Vérifier si une fiche est en attente de validation
  const isAwaitingValidation = (status: string) => {
    return (
      status === ClientFileStatus.AWAITING_ADMIN_VALIDATION ||
      status === ClientFileStatus.AWAITING_SUPERADMIN_VALIDATION
    );
  };

  // Charger plus de fiches clients lorsque l'utilisateur atteint le bas de la liste
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const newItems = Array.isArray(clientFiles) ? clientFiles.slice(startIndex, endIndex) : [];

      if (newItems.length > 0) {
        setDisplayedFiles((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }

      if (endIndex >= (Array.isArray(clientFiles) ? clientFiles.length : 0)) {
        setHasMore(false);
      }
    }
  }, [inView, hasMore, isLoading, clientFiles, page, pageSize]);

  // Réinitialiser l'état lorsque les fiches clients changent
  useEffect(() => {
    if (Array.isArray(clientFiles) && !isLoading) {
      setDisplayedFiles(clientFiles.slice(0, pageSize));
      setPage(2);
      setHasMore(clientFiles.length > pageSize);
    }
  }, [clientFiles, isLoading, pageSize]);

  if (isLoading && displayedFiles.length === 0) {
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedFiles.map((client) => {
                    const completion = calculateCompletion(client);

                    return (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/clients/${client.id}/view`}
                            className="text-brand-blue hover:underline"
                          >
                            {client.reference}
                          </Link>
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
                          <ClientFileStatusBadge status={client.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            {permissions.canEditFile(client) ? (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/clients/${client.id}/edit`}>
                                  <FileText className="h-4 w-4 mr-1" />
                                  Continuer
                                </Link>
                              </Button>
                            ) : isAwaitingValidation(client.status) ? (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/clients/${client.id}/view`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Consulter
                                </Link>
                              </Button>
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

            {/* Élément de référence pour l'intersection observer */}
            {hasMore && (
              <div ref={ref} className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
