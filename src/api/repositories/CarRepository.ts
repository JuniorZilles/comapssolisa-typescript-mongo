import CarModel from '@models/CarModel';
import { CarSearch } from '@interfaces/CarSearch';
import VehiclesModel from '@models/VehicleModel';
import Car from '@interfaces/Car';
import Accessory from '@interfaces/Accessory';
import { isValid } from '@models/Model';

class CarRepository {
  async create(payload: Car): Promise<Car> {
    return (await CarModel.create(payload)) as Car;
  }

  async findAll(payload: CarSearch): Promise<VehiclesModel> {
    const { offset, limit, ...query } = payload;
    const limitNumber = limit ? parseInt(limit as string, 10) : 100;
    const offsetNumber = offset ? parseInt(offset as string, 10) : 0;
    const count = await CarModel.countDocuments(query);
    const cars = (await CarModel.find(query)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber)
      .exec()) as Car[];
    const offsets = Math.round(count / limitNumber);
    return new VehiclesModel(cars, count, limitNumber, offsetNumber, offsets);
  }

  async delete(id: string): Promise<Car> {
    const result = (await CarModel.findByIdAndDelete(id).exec()) as Car;
    return result;
  }

  async findById(id: string): Promise<Car> {
    return (await CarModel.findById(id)) as Car;
  }

  validId(id: string): boolean {
    return isValid(id);
  }

  async update(id: string, payload: Car) {
    return (await CarModel.findByIdAndUpdate(id, payload, {
      returnOriginal: false
    }).exec()) as Car;
  }

  async updateAccessory(id: string, idAccessory: string, payload: Accessory) {
    const car = await CarModel.findOneAndUpdate(
      {
        _id: id,
        'acessorios._id': idAccessory,
        'acessorios.descricao': { $ne: payload.descricao }
      },
      { $set: { 'acessorios.$.descricao': payload.descricao } },
      { returnOriginal: false }
    ).exec();
    if (!car) {
      return null;
    }
    return car;
  }
}

export default new CarRepository();
