export interface UserDTO {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  roles: string[];
  isActive: boolean;
  status?: string;
  hasSetPassword?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListRequest {
  page: number;
  pageSize: number;
  filters?: {
    username?: string;
    email?: string;
  };
}

export interface UserPaginationDTO {
  items: UserDTO[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageLimit: number;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  roles: string[];
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface UpdateUserRequest {
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  profilePicture?: string;
}

export interface AddRoleRequest {
  role: string;
}

export interface ChangeUserStatusRequest {
  status: string;
}

export interface ResendFirstLoginEmailRequest {
  email: string;
}
