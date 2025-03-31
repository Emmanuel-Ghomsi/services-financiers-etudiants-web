export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

export type ApiError = {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export type SortDirection = "asc" | "desc"

export type SortParams = {
  field: string
  direction: SortDirection
}

export type FilterParams = Record<string, string | number | boolean | null>

export type QueryParams = PaginationParams & {
  sort?: SortParams
  filters?: FilterParams
  search?: string
}

