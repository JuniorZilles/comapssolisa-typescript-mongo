import { RentalFleet } from './RentalFleet';
import { Pagination, PaginationCounts } from '../../Pagination';

export default interface RentalFleets extends Pagination, PaginationCounts {
  reservas: RentalFleet[];
}
