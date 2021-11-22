import { Pagination } from '../../Pagination';

export interface RentalReserveSearch extends Pagination {
  id_user?: string;
  data_inicio?: string;
  data_fim?: string;
  id_carro?: string;
  id_locadora?: string;
  valor_final?: number;
}
