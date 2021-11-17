import { Pagination } from '../../Pagination';

export interface RentalCarSearch extends Pagination {
  id_carro?: string;
  status?: string;
  id_locacao?: string;
  valor_diaria?: number;
  id_locadora?: string;
  placa?: string;
}
