export default class InvalidField extends Error {
  public status:number;

  constructor(field:string) {
    super(`O campo '${field}' está fora do formato padrão`);
    this.name = 'InvalidField';
    this.status = 400;
  }
}
