'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { LeaveBalanceDTO } from '@/types/leave';

interface LeaveBalanceCardProps {
  balance: LeaveBalanceDTO;
  employeeName: string;
}

export function LeaveBalanceCard({ balance, employeeName }: LeaveBalanceCardProps) {
  const usagePercentage =
    balance.accruedDays > 0 ? (balance.takenDays / balance.accruedDays) * 100 : 0;
  const remainingPercentage = 100 - usagePercentage;

  const getStatusColor = () => {
    if (remainingPercentage > 50) return 'text-green-600';
    if (remainingPercentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (remainingPercentage > 50) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (remainingPercentage > 20) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Solde de congés - {employeeName}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{balance.year}</Badge>
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {balance.remainingDays} jour(s) restant(s)
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Utilisation des congés</span>
            <span>{Math.round(usagePercentage)}%</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-600">{balance.accruedDays}</div>
            <div className="text-xs text-gray-600">Acquis</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-orange-600">{balance.takenDays}</div>
            <div className="text-xs text-gray-600">Pris</div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${getStatusColor()}`}>{balance.remainingDays}</div>
            <div className="text-xs text-gray-600">Restants</div>
          </div>
        </div>

        {/* Alerte si peu de congés restants */}
        {remainingPercentage <= 20 && balance.remainingDays > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Attention : Il vous reste peu de jours de congés disponibles.
              </span>
            </div>
          </div>
        )}

        {/* Alerte si plus de congés */}
        {balance.remainingDays <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                Vous avez épuisé votre quota de congés pour cette année.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
