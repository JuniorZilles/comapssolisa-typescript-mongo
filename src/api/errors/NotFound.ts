export default class NotFound extends Error {
  public status: number;

  public description: string;

  constructor(name: string) {
    super(`Value ${name} not found`);
    this.name = `Value ${name} not found`;
    this.description = 'Not Found';
    this.status = 404;
  }
}
