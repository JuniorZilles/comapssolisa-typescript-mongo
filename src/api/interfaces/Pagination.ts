export interface Pagination {
  offset?: string;
  limit?: string;
}

export interface PaginationCounts {
  offsets: number;
  total: number;
}
