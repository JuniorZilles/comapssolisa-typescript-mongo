import CarModel from '@models/CarModel';
import { CarSearch } from '@interfaces/car/CarSearch';
import Car from '@interfaces/car/Car';
import Accessory from '@interfaces/car/Accessory';
import Repository from './Repository';

class CarRepository extends Repository<CarSearch, Car> {
  constructor() {
    super(CarModel);
  }

  async updateAccessory(id: string, idAccessory: string, payload: Accessory): Promise<Car> {
    const car = await CarModel.findOneAndUpdate(
      {
        _id: id,
        'acessorios._id': idAccessory
      },
      { $set: { 'acessorios.$.descricao': payload.descricao } },
      { returnOriginal: false }
    );
    return car as Car;
  }
}

export default new CarRepository();
