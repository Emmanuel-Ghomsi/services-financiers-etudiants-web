'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';
import type { ExpenseFilterRequest } from '@/types/expense';
import {
  EXPENSE_CATEGORY_GROUP_LABELS,
  EXPENSE_CATEGORY_LABELS,
} from '@/lib/constants/expense-categories';
import { useUsers } from '@/lib/api/hooks/use-users';

interface ExpenseFiltersProps {
  onFilter: (filters: ExpenseFilterRequest) => void;
  onReset: () => void;
}

export function ExpenseFilters({ onFilter, onReset }: ExpenseFiltersProps) {
  const [filters, setFilters] = useState<ExpenseFilterRequest>({});
  const [isOpen, setIsOpen] = useState(false);

  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });

  const handleFilterChange = (key: keyof ExpenseFilterRequest, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({});
    onReset();
    setIsOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtres
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
              {Object.values(filters).filter((v) => v).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres de recherche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Groupe de catégorie</Label>
                <Select
                  value={filters.group || 'allGroups'}
                  onValueChange={(value) => handleFilterChange('group', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les groupes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allGroups">Tous les groupes</SelectItem>
                    {Object.entries(EXPENSE_CATEGORY_GROUP_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={filters.category || 'allCategories'}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allCategories">Toutes les catégories</SelectItem>
                    {Object.entries(EXPENSE_CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Employé</Label>
                <Select
                  value={filters.employeeId || 'allEmployees'}
                  onValueChange={(value) => handleFilterChange('employeeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les employés" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allEmployees">Tous les employés</SelectItem>
                    {usersData?.items?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstname} {user.lastname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleApplyFilters}>Appliquer les filtres</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
