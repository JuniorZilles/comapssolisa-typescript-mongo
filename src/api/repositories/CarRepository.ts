import CarModel, { Car }  from "@models/CarModel";
import { VehiclesModel } from "@models/VehicleModel";

class CarRepository  {
    async create(payload:Car):Promise<Car> {
      return await CarModel.create(payload)
    }

    async findAll(payload:Object, start:number, size:number):Promise<VehiclesModel> {
      const count = await CarModel.countDocuments(payload)
      const cars = await CarModel.find(payload).skip( start ).limit( size ).exec()
      const offsets = Math.round(count/size)
      return new VehiclesModel(cars, count, size, start, offsets)
    }
  }

export default new CarRepository()