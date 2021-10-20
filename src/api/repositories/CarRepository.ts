import CarModel, { Car }  from "@models/CarModel";

class CarRepository  {
    async create(payload:Car):Promise<Car> {
      return await CarModel.create(payload);
    }
  }

export default new CarRepository()