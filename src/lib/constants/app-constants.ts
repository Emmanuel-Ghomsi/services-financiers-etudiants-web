export const APP_NAME = "Service Financier"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  COMPANIES: "/companies",
  SERVICES: "/services",
  PROFILE: "/profile",
}

export const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
}

