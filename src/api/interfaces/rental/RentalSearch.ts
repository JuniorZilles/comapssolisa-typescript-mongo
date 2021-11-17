import { Pagination } from '../Pagination';

export interface RentalSearch extends Pagination {
  nome?: string;
  cnpj?: string;
  atividades?: string;
  uf?: string;
  'endereco.uf'?: string;
  cep?: string;
  'endereco.cep'?: string;
  logradouro?: string;
  'endereco.logradouro'?: string;
  complemento?: string;
  'endereco.complemento'?: string;
  bairro?: string;
  'endereco.bairro'?: string;
  number?: string;
  'endereco.number'?: string;
  localidade?: string;
  'endereco.localidade'?: string;
}
