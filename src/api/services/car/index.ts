/* eslint-disable no-param-reassign */
import NotFound from '@errors/NotFound';
import Car from '@interfaces/Car';
import Accessory from '@interfaces/Accessory';
import { CarSearch } from '@interfaces/CarSearch';
import CarRepository from '@repositories/CarRepository';
import { Paginate } from '@interfaces/Paginate';

class CarService {
  async create(payload: Car): Promise<Car> {
    const result = await CarRepository.create(payload);
    return result;
  }

  async getById(id: string): Promise<Car> {
    const car = await CarRepository.findById(id);
    if (!car) {
      throw new NotFound(id);
    }
    return car;
  }

  async list(query: CarSearch): Promise<Paginate<Car>> {
    if (query.descricao) {
      query['acessorios.descricao'] = query.descricao;
      delete query.descricao;
    }
    return CarRepository.findAll(query);
  }

  async delete(id: string): Promise<Car> {
    await this.getById(id);
    const result = await CarRepository.delete(id);
    return result;
  }

  async update(id: string, payload: Car): Promise<Car> {
    await this.getById(id);
    const result = await CarRepository.update(id, payload);
    return result;
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
