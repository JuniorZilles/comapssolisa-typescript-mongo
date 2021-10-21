import CarModel, { Car, CarUpdateModel, isValid }  from "@models/CarModel";
import { CarSearch } from "@models/CarSearchModel";
import { VehiclesModel } from "@models/VehicleModel";

class CarRepository  {
    async create(payload:Car):Promise<Car> {
      return await CarModel.create(payload)
    }

    async findAll(payload:CarSearch, start:number, size:number):Promise<VehiclesModel> {
      const count = await CarModel.countDocuments(payload)
      const cars = await CarModel.find(payload).skip( start ).limit( size ).exec()
      const offsets = Math.round(count/size)
      return new VehiclesModel(cars, count, size, start, offsets)
    }

    async delete(id:string):Promise<boolean>{
      await CarModel.findByIdAndRemove(id).exec()
      return true
    }

    async findById(id:string):Promise<Car>{
      return await CarModel.findById(id) as Car
    } 

    validId(id:string):boolean{
      return isValid(id);
    }

    async update(id:string, payload:CarUpdateModel){
      await CarModel.findByIdAndUpdate(id, payload).exec()
      return true
    }
  }

export default new CarRepository()