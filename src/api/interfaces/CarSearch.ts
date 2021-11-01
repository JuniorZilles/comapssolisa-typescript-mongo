import { Pagination } from './Pagination';

export interface CarSearch extends Pagination {
  modelo?: string
  cor?: string
  ano?: Number
  descricao?: string
  quantidadePassageiros?: Number
  'acessorios.descricao'?: string
}
