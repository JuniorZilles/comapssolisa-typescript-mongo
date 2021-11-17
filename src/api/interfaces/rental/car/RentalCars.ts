import { RentalCar } from './RentalCar';
import { Pagination, PaginationCounts } from '../../Pagination';

export default interface RentalCars extends Pagination, PaginationCounts {
  frota: RentalCar[];
}
