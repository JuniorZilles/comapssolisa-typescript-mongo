export default class MissingBody extends Error {
  public status: number;

  public description: string;

  constructor() {
    super('Missing requisition body');
    this.name = 'Missing requisition body';
    this.description = 'Bad Request';
    this.status = 400;
  }
}
