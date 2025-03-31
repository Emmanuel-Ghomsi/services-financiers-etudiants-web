import type { ClientFileListRequest, ClientFilePaginationDTO } from '@/types/client-file';
import type { UserProfile } from '@/types/user-profile';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH_URL;

// Fonction utilitaire pour les requêtes API
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }

  return response.json();
}

// Service pour le profil utilisateur
export const profileService = {
  getProfile: async (token: string): Promise<UserProfile> => {
    return fetchApi<UserProfile>('/auth/me', { method: 'GET' }, token);
  },
};

// Service pour les fiches clients
export const clientFileService = {
  getMyClientFiles: async (
    token: string,
    params: ClientFileListRequest
  ): Promise<ClientFilePaginationDTO> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', params.page.toString());
    queryParams.append('pageSize', params.pageSize.toString());
    queryParams.append('pageLimit', params.pageLimit.toString());

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(`filters[${key}]`, value);
        }
      });
    }

    return fetchApi<ClientFilePaginationDTO>(
      `/client-files/me?${queryParams.toString()}`,
      { method: 'GET' },
      token
    );
  },

  getAllClientFiles: async (
    token: string,
    params: ClientFileListRequest
  ): Promise<ClientFilePaginationDTO> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', params.page.toString());
    queryParams.append('pageSize', params.pageSize.toString());
    queryParams.append('pageLimit', params.pageLimit.toString());

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(`filters[${key}]`, value);
        }
      });
    }

    return fetchApi<ClientFilePaginationDTO>(
      `/client-files?${queryParams.toString()}`,
      { method: 'GET' },
      token
    );
  },
};
