import { create } from 'zustand';
import type { UserDTO, UserPaginationDTO } from '@/types/user';

interface UserState {
  users: UserDTO[];
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
    username?: string;
    email?: string;
  };
  setUsers: (data: UserPaginationDTO) => void;
  addUser: (user: UserDTO) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Record<string, string | undefined>) => void;
  clearFilters: () => void;
  clearUsers: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {},
  setUsers: (data) =>
    set({
      users: data.items,
      pagination: {
        currentPage: data.currentPage,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        pageSize: data.pageSize,
        pageLimit: data.pageLimit || 10,
      },
      error: null,
    }),
  addUser: (user) =>
    set((state) => ({
      users: [user, ...state.users],
      pagination: state.pagination
        ? {
            ...state.pagination,
            totalItems: state.pagination.totalItems + 1,
            totalPages: Math.ceil((state.pagination.totalItems + 1) / state.pagination.pageSize),
          }
        : null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  clearFilters: () => set({ filters: {} }),
  clearUsers: () => set({ users: [], pagination: null, error: null }),
}));
