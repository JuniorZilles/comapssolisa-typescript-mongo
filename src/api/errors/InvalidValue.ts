export default class InvalidValue extends Error {
  public status:number;

  constructor(field:string) {
    super(`O valor do campo '${field}' informado está inválido`);
    this.name = 'InvalidField';
    this.status = 400;
  }
}
