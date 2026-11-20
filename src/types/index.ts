export interface User {
  id: string | number;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  status?: string;
  createdAt?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
}
