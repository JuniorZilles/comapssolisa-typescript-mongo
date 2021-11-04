import { CepPayload } from './CepPayload';

export interface EnderecoPayload {
  cep: string;
  number: string;
  isFilial: boolean;
  complemento?: string;
}

export interface Endereco extends CepPayload {
  id?: string;
  cep: string;
  number: string;
  isFilial: boolean;
  complemento?: string;
}
