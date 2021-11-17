import PersonSearch from '@interfaces/people/PersonSearch';
import { Pagination, PaginationCounts } from '../Pagination';

export default interface People extends Pagination, PaginationCounts {
  pessoas: PersonSearch[];
}
