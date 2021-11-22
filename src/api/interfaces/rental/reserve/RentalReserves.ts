import { RentalReserve } from './RentalReserve';
import { Pagination, PaginationCounts } from '../../Pagination';

export default interface RentalReserves extends Pagination, PaginationCounts {
  reservas: RentalReserve[];
}
