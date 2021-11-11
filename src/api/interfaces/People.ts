import PersonSearch from '@interfaces/PersonSearch';
import { Pagination, PaginationCounts } from './Pagination';

export default interface People extends Pagination, PaginationCounts {
  pessoas: PersonSearch[];
}
