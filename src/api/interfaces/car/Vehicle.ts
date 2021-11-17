import Car from '@interfaces/car/Car';
import { Pagination, PaginationCounts } from '../Pagination';

export default interface Vehicles extends Pagination, PaginationCounts {
  veiculos: Car[];
}
