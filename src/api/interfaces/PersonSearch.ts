import { Pagination } from './Pagination';

export default interface PersonSearch extends Pagination{
  id?: string
  nome?: string
  cpf?: string
  data_nascimento?: string | Date
  email?: string
  senha?: string
  habilitado?: string
  dataCriacao?: Date
  dataAtualizacao?: Date
}
