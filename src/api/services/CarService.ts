/* eslint-disable no-param-reassign */
import InvalidField from '@errors/InvalidField';
import NotFound from '@errors/NotFound';
import Car from '@interfaces/Car';
import Accessory from '@interfaces/Accessory';
import { CarSearch } from '@interfaces/CarSearch';
import CarRepository from '@repositories/CarRepository';
import { Paginate } from '@interfaces/Paginate';

class CarService {
  async create(payload: Car): Promise<Car> {
    this.isValidAccessories(payload.acessorios);

    this.isValidYear(payload.ano);

    this.hasDuplicate(payload.acessorios);

    const result = await CarRepository.create(payload);
    return result;
  }

  private isValidAccessories(acessories: Accessory[]): void {
    if (acessories.length === 0) {
      throw new InvalidField('acessorios');
    }
  }

  private isValidYear(year: number): void {
    if (year < 1950 || year > 2022) {
      throw new InvalidField('ano');
    }
  }

  hasDuplicate(list: Accessory[]): void {
    const newList = list.filter((elem, index, arr) => arr.findIndex((t) => t.descricao === elem.descricao) === index);
    if (newList.length !== list.length) {
      throw new InvalidField('acessorios');
    }
  }

  async getById(id: string): Promise<Car> {
    this.checkInvalidId(id, 'id');
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
    if (payload.acessorios) {
      this.isValidAccessories(payload.acessorios);
      this.hasDuplicate(payload.acessorios);
    }
    if (payload.ano) {
      this.isValidYear(payload.ano);
    }
    const result = await CarRepository.update(id, payload);
    return result;
  }

  private checkInvalidId(id: string, name: string): void {
    if (!CarRepository.validId(id)) {
      throw new InvalidField(name);
    }
  }

  async updateAccessory(id: string, idAccessory: string, payload: Accessory): Promise<Car> {
    this.checkInvalidId(id, 'id');
    this.checkInvalidId(idAccessory, 'idAccessory');
    const car = await CarRepository.updateAccessory(id, idAccessory, payload);
    if (!car) {
      throw new NotFound(`id: ${id} - idAccessory: ${idAccessory} - descricao: ${payload.descricao}`);
    }
    return car;
  }
}

export default new CarService();
