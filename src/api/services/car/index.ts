/* eslint-disable no-param-reassign */
import NotFound from '@errors/NotFound';
import Car from '@interfaces/car/Car';
import Accessory from '@interfaces/car/Accessory';
import { CarSearch } from '@interfaces/car/CarSearch';
import CarRepository from '@repositories/CarRepository';
import { Paginate } from '@interfaces/Paginate';

class CarService {
  async create(payload: Car): Promise<Car> {
    const result = await CarRepository.create(payload);
    return result;
  }

  async getById(id: string): Promise<Car> {
    const result = await CarRepository.findById(id);
    this.checkIfIsDefined(result, id);
    return result;
  }

  async list(query: CarSearch): Promise<Paginate<Car>> {
    if (query.descricao) {
      query['acessorios.descricao'] = query.descricao;
      delete query.descricao;
    }
    return CarRepository.findAll(query);
  }

  async delete(id: string): Promise<Car> {
    const result = await CarRepository.delete(id);
    this.checkIfIsDefined(result, id);
    return result;
  }

  async update(id: string, payload: Car): Promise<Car> {
    const result = await CarRepository.update(id, payload);
    this.checkIfIsDefined(result, id);
    return result;
  }

  private checkIfIsDefined(result: Car, id: string): void {
    if (!result) {
      throw new NotFound(id);
    }
  }

  async updateAccessory(id: string, idAccessory: string, payload: Accessory): Promise<Car> {
    const car = await CarRepository.updateAccessory(id, idAccessory, payload);
    if (!car) {
      throw new NotFound(`id: ${id} - idAccessory: ${idAccessory} - descricao: ${payload.descricao}`);
    }
    return car;
  }
}

export default new CarService();
