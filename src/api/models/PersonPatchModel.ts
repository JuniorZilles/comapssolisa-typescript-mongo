/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';

export default interface PersonPatchModel {
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
