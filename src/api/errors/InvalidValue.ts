export default class InvalidValue extends Error {
  public status:number;

  public description:string;

  constructor(field:string, value:string, useDefault:boolean = false) {
    let message = `The value '${value}' is invalid`;
    if (useDefault) {
      message = value;
    }
    super(message);
    this.description = field;
    this.name = 'InvalidField';
    this.status = 400;
  }
}
