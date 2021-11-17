import { CepPayload } from './CepPayload';

export interface Endereco extends CepPayload {
  _id?: string;
  number: string;
  isFilial: boolean;
}
