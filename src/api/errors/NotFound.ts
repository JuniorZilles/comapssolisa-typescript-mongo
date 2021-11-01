export default class NotFound extends Error {
  public status:number;

  public description:string;

  constructor(name:String) {
    super(`Value ${name} not found`);
    this.name = 'NotFound';
    this.description = 'Not Found';
    this.status = 404;
  }
}
