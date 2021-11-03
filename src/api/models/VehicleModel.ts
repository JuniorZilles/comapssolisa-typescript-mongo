import Car from '@interfaces/Car';

export default class VehiclesModel {
  constructor(
    public veiculos: Car[],
    public total: number,
    public limit: number,
    public offset: number,
    public offsets: number
  ) {}
}
