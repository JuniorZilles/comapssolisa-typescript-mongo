export default class NotFound extends Error {
  public status:number;

  constructor(name:String) {
    super(`Valor ${name} não encontrado`);
    this.name = 'NotFound';
    this.status = 404;
  }
}
