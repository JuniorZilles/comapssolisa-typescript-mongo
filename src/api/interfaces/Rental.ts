import { Endereco, EnderecoPayload } from './Endereco';

export interface Rental {
  id?: string;
  nome: string;
  cnpj: string;
  atividades: string;
  endereco: Endereco[];
}

export interface RentalPayload {
  id?: string;
  nome: string;
  cnpj: string;
  atividades: string;
  endereco: EnderecoPayload[] | Endereco[];
}
