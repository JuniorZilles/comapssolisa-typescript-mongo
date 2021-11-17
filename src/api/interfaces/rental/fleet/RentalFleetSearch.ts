import { Pagination } from '../../Pagination';

export interface RentalFleetSearch extends Pagination {
  id_listagem?: string;
  id_locadora?: string;
}
