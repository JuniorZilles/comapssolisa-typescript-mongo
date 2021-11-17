import { Endereco } from './Endereco';

export interface Rental {
  _id?: string;
  nome: string;
  cnpj: string;
  atividades: string;
  endereco: Endereco[];
}
