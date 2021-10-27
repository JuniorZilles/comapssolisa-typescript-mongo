/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';

export default class PersonPatchModel {
  constructor(
    public id?: string,
    public nome?: string,
    public cpf?: string,
    public data_nascimento?: string,
    public email?: string,
    public senha?: string,
    public habilitado?: string,
    public dataCriacao?: Date,
  ) {
    if (data_nascimento) {
      const date = new Date(data_nascimento);
      this.data_nascimento = moment(date).format('DD/MM/YYYY');
    }
  }
}
