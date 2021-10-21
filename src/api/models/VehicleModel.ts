import { Car } from "./CarModel";

export class VehiclesModel{
    constructor(
    public veiculos: Car[],
    public total: Number,
    public limit: Number,
    public offset: Number,
    public offsets:Number){}
}