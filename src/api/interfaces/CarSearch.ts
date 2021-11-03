import { Pagination } from './Pagination';

export interface CarSearch extends Pagination {
  modelo?: string;
  cor?: string;
  ano?: number;
  descricao?: string;
  quantidadePassageiros?: number;
  'acessorios.descricao'?: string;
}
