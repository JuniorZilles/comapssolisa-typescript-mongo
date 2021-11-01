/* eslint-disable class-methods-use-this */
import CarModel, { Car, isValid } from '@models/CarModel';
import { CarSearch } from '@interfaces/CarSearchModel';
import VehiclesModel from '@models/VehicleModel';

class CarRepository {
  async create(payload:Car):Promise<Car> {
    return CarModel.create(payload);
  }

  async findAll(payload:CarSearch, offset:number, limit:number):Promise<VehiclesModel> {
    const count = await CarModel.countDocuments(payload);
    const cars = await CarModel.find(payload).skip(offset * limit).limit(limit).exec();
    const offsets = Math.round(count / limit);
    return new VehiclesModel(cars, count, limit, offset, offsets);
  }

  async delete(id:string):Promise<boolean> {
    await CarModel.findByIdAndRemove(id).exec();
    return true;
  }

  async findById(id:string):Promise<Car> {
    return await CarModel.findById(id) as Car;
  }

  validId(id:string):boolean {
    return isValid(id);
  }

  async update(id:string, payload:Car) {
    return await CarModel.findByIdAndUpdate(id, payload, { returnOriginal: false }).exec() as Car;
  }
}

export default new CarRepository();
