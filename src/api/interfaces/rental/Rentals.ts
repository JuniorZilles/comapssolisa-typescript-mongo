import { Rental } from '@interfaces/rental/Rental';
import { Pagination, PaginationCounts } from '../Pagination';

export default interface Rentals extends Pagination, PaginationCounts {
  locadoras: Rental[];
}
