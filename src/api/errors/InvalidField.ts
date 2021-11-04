export default class InvalidField extends Error {
  public status: number;

  public description: string;

  constructor(field: string) {
    super(`The field '${field}' is out of the standard format`);
    this.name = `The field '${field}' is out of the standard format`;
    this.description = 'InvalidField';
    this.status = 400;
  }
}
