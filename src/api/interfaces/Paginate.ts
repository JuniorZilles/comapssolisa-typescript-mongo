import { Pagination, PaginationCounts } from './Pagination';

export interface Paginate<DocsModel> extends Pagination, PaginationCounts {
  docs: DocsModel[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pagingCounter: number;
}
