export default class InvalidValue extends Error {
  public status: number;

  public description: string;

  constructor(field: string, value: string, useDefault = true) {
    let message = `The field '${field}' is out of the standard format`;
    if (useDefault) {
      message = value;
    }
    super(message);
    this.description = field;
    this.name = message;
    this.status = 400;
  }
}
