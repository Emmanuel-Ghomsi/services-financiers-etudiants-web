import type { ClientFileListRequest, ClientFilePaginationDTO } from '@/types/client-file';
import type { UserProfile } from '@/types/user-profile';
import type {
  UserListRequest,
  UserPaginationDTO,
  RegisterUserRequest,
  SetPasswordRequest,
} from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090/api/v1';

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

// Service pour les utilisateurs
export const userService = {
  getAllUsers: async (token: string, params: UserListRequest): Promise<UserPaginationDTO> => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', params.page.toString());
    queryParams.append('pageSize', params.pageSize.toString());

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(`filters[${key}]`, value);
        }
      });
    }

    return fetchApi<UserPaginationDTO>(`/user?${queryParams.toString()}`, { method: 'GET' }, token);
  },

  registerUser: async (token: string, userData: RegisterUserRequest): Promise<UserProfile> => {
    return fetchApi<UserProfile>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      token
    );
  },

  setPassword: async (data: SetPasswordRequest): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>('/auth/set-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
