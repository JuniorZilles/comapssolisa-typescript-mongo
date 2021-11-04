/* eslint-disable class-methods-use-this */
import CarModel from '@models/CarModel';
import { CarSearch } from '@interfaces/CarSearch';
import VehiclesModel from '@models/VehicleModel';
import Car from '@interfaces/Car';
import Accessory from '@interfaces/Accessory';
import { isValid } from '@models/Model';

class CarRepository {
  async create(payload: Car): Promise<Car> {
    return CarModel.create(payload);
  }

  async findAll(
    payload: CarSearch,
    offset: number,
    limit: number
  ): Promise<VehiclesModel> {
    const count = await CarModel.countDocuments(payload);
    const cars = await CarModel.find(payload)
      .skip(offset * limit)
      .limit(limit)
      .exec();
    const offsets = Math.round(count / limit);
    return new VehiclesModel(cars, count, limit, offset, offsets);
  }

  async delete(id: string): Promise<boolean> {
    await CarModel.findByIdAndRemove(id).exec();
    return true;
  }

  async findById(id: string): Promise<Car> {
    return (await CarModel.findById(id)) as Car;
  }

  validId(id: string): boolean {
    return isValid(id);
  }

  async update(id: string, payload: Car) {
    return (await CarModel.findByIdAndUpdate(id, payload, {
      returnOriginal: false,
    }).exec()) as Car;
  }

  async updateAccessory(id: string, idAccessory: string, payload: Accessory) {
    const car = await CarModel.findOne({
      _id: id,
      'acessorios._id': idAccessory,
    }).exec();
    if (car) {
      const { descricao } = car.acessorios.id(idAccessory);
      if (descricao !== payload.descricao) {
        car.acessorios.id(idAccessory).descricao = payload.descricao;
      } else {
        car.acessorios.id(idAccessory).remove();
      }
      car.markModified('acessorios');
      await car.save();
      return car as Car;
    }
    return null;
  }
}

export default new CarRepository();
