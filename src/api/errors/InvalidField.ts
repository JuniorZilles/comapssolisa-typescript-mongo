export default class InvalidField extends Error {
  public status:number;

  public description:string;

  constructor(field:string) {
    super(`The field '${field}' is out of the standard format`);
    this.name = 'InvalidField';
    this.description = field;
    this.status = 400;
  }
}
