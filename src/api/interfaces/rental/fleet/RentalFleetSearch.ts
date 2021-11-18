import { Pagination } from '../../Pagination';

export interface RentalFleetSearch extends Pagination {
  id_carro?: string;
  status?: string;
  valor_diaria?: number;
  placa?: string;
}
