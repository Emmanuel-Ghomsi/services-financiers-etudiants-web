import { create } from 'zustand';
import type { ClientFileDTO, ClientFilePaginationDTO } from '@/types/client-file';

interface ClientFilesState {
  clientFiles: ClientFileDTO[];
  pagination: {
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
    pageLimit: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    reference?: string;
    lastName?: string;
    clientCode?: string;
    status?: string;
    email?: string;
  };
  setClientFiles: (data: ClientFilePaginationDTO) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Record<string, string | undefined>) => void;
  clearFilters: () => void;
  clearClientFiles: () => void;
}

export const useClientFilesStore = create<ClientFilesState>((set) => ({
  clientFiles: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {},
  setClientFiles: (data) =>
    set({
      clientFiles: data.items,
      pagination: {
        currentPage: data.currentPage,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        pageSize: data.pageSize,
        pageLimit: data.pageLimit,
      },
      error: null,
    }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  clearFilters: () => set({ filters: {} }),
  clearClientFiles: () => set({ clientFiles: [], pagination: null, error: null }),
}));
