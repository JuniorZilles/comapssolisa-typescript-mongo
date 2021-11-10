import { CepPayload } from './CepPayload';

export interface Endereco extends CepPayload {
  id?: string;
  number: string;
  isFilial: boolean;
}
