import { Endereco } from './Endereco';

export interface Rental {
  id?: string;
  nome: string;
  cnpj: string;
  atividades: string;
  endereco: Endereco[];
}
