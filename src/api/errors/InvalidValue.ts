export default class InvalidValue extends Error {
  public status: number;

  public description: string;

  constructor(field: string, value: string) {
    super(value);
    this.description = field;
    this.name = value;
    this.status = 400;
  }
}
