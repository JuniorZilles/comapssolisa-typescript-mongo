import { Rental } from '@interfaces/Rental';

export default class RentalsModel {
  constructor(
    public locadoras: Rental[],
    public total: number,
    public limit: number,
    public offset: number,
    public offsets: number
  ) {}
}
