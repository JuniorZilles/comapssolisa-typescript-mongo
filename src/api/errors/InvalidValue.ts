export default class InvalidValue extends Error {
  public status: number;

  public description: string;

  constructor(field: string, value: string, useDefault = false) {
    let message = `The value '${value}' is invalid`;
    if (useDefault) {
      message = value;
    }
    super(message);
    this.description = 'InvalidField';
    this.name = message;
    this.status = 400;
  }
}
