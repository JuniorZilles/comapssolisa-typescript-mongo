/* eslint-disable class-methods-use-this */
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

    return CarRepository.create(payload);
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
    const newList = list.filter(
      (elem, index, arr) =>
        arr.findIndex((t) => t.descricao === elem.descricao) === index
    );
    if (newList.length !== list.length) {
      throw new InvalidField('acessorios');
    }
  }

  async getById(id: string) {
    if (!CarRepository.validId(id)) {
      throw new InvalidField('id');
    }
    const car = await CarRepository.findById(id);
    if (!car) {
      throw new NotFound(id);
    }
    return car;
  }

  async list(payload: CarSearch) {
    let offset = 0;
    let limit = 10;
    if (payload.descricao) {
      payload['acessorios.descricao'] = payload.descricao;
      payload.descricao = undefined;
    }
    if (payload.limit) {
      limit = parseInt(payload.limit, 10);
      payload.limit = undefined;
    }
    if (payload.offset) {
      offset = parseInt(payload.offset, 10);
      payload.offset = undefined;
    }

    return CarRepository.findAll(payload, offset, limit);
  }

  async delete(id: string) {
    await this.getById(id);
    return CarRepository.delete(id);
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
    return CarRepository.update(id, payload);
  }

  updateAccessory(id: string, idAccessory: string, payload: Accessory) {
    // return CarRepository.updateAccessory(id, idAccessory, payload);
  }
}

export default new CarService();
