export default class InvalidValue extends Error {
  public status:number;

  constructor(value:string, useDefault:boolean = false) {
    let message = `O valor do campo '${value}' informado está inválido`;
    if (useDefault) {
      message = value;
    }
    super(message);
    this.name = 'InvalidField';
    this.status = 400;
  }
}
