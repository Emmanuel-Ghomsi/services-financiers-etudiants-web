export const APP_NAME = 'Services Financiers Etudiants Cameroun';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH_URL;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  COMPANIES: '/companies',
  SERVICES: '/services',
  PROFILE: '/profile',
};

export const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
};
