/* eslint-disable no-param-reassign */
import InvalidField from '@errors/InvalidField';
import NotFound from '@errors/NotFound';
import Car from '@interfaces/Car';
import Accessory from '@interfaces/Accessory';
import { CarSearch } from '@interfaces/CarSearch';
import CarRepository from '@repositories/CarRepository';

class CarService {
  async create(payload: Car) {
    this.isValidAccessories(payload.acessorios);

    this.isValidYear(payload.ano);

    this.hasDuplicate(payload.acessorios);

    const result = await CarRepository.create(payload);
    return result;
  }

  private isValidAccessories(acessories: Accessory[]) {
    if (acessories.length === 0) {
      throw new InvalidField('acessorios');
    }
  }

  private isValidYear(year: number) {
    if (year < 1950 || year > 2022) {
      throw new InvalidField('ano');
    }
  }

  hasDuplicate(list: Accessory[]) {
    const newList = list.filter((elem, index, arr) => arr.findIndex((t) => t.descricao === elem.descricao) === index);
    if (newList.length !== list.length) {
      throw new InvalidField('acessorios');
    }
  }

  async getById(id: string) {
    this.checkInvalidId(id, 'id');
    const car = await CarRepository.findById(id);
    if (!car) {
      throw new NotFound(id);
    }
    return car;
  }

  async list(offset: number, limit: number, query: CarSearch) {
    if (query.descricao) {
      query['acessorios.descricao'] = query.descricao;
      delete query.descricao;
    }

    return CarRepository.findAll(query, offset, limit);
  }

  async delete(id: string) {
    await this.getById(id);
    const result = await CarRepository.delete(id);
    return result;
  }

  async update(id: string, payload: Car) {
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

  private checkInvalidId(id: string, name: string) {
    if (!CarRepository.validId(id)) {
      throw new InvalidField(name);
    }
  }

  async updateAccessory(id: string, idAccessory: string, payload: Accessory) {
    this.checkInvalidId(id, 'id');
    this.checkInvalidId(idAccessory, 'idAccessory');
    const car = await CarRepository.updateAccessory(id, idAccessory, payload);
    if (!car) {
      throw new NotFound(`id: ${id} - idAccessory: ${idAccessory}`);
    }
    return car;
  }
}

export default new CarService();
