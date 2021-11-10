import CarModel from '@models/CarModel';
import { CarSearch } from '@interfaces/CarSearch';
import Vehicles from '@interfaces/Vehicle';
import Car from '@interfaces/Car';
import Accessory from '@interfaces/Accessory';
import Repository from './Repository';

class CarRepository extends Repository<CarSearch, Vehicles, Car> {
  constructor() {
    super(CarModel);
  }

  async updateAccessory(id: string, idAccessory: string, payload: Accessory) {
    const car = await CarModel.findOneAndUpdate(
      {
        _id: id,
        'acessorios._id': idAccessory
      },
      { $set: { 'acessorios.$.descricao': payload.descricao } },
      { returnOriginal: false }
    );
    return car;
  }
}

export default new CarRepository();
