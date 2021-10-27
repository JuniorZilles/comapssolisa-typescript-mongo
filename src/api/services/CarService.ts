/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import InvalidField from '@errors/InvalidField';
import NotFound from '@errors/NotFound';
import { Accessory, Car } from '@models/CarModel';
import { CarSearch } from '@models/CarSearchModel';
import CarRepository from '@repositories/CarRepository';

class CarService {
  async create(payload: Car) {
    this.isValidAccessories(payload.acessorios);

    this.isValidYear(payload.ano);

    payload.acessorios = this.deDuplicate(payload.acessorios);

    return CarRepository.create(payload);
  }

  private isValidAccessories(acessories: Accessory[]) {
    if (acessories.length === 0) {
      throw new InvalidField('acessorios');
    }
  }

  private isValidYear(year: Number) {
    if (year < 1950 || year > 2022) {
      throw new InvalidField('ano');
    }
  }

  deDuplicate(list: Accessory[]): Accessory[] {
    return list.filter((elem, index, arr) => arr.findIndex((t) => (
      t.descricao === elem.descricao)) === index);
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
    let offset: number = 0;
    let limit: number = 10;
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
      payload.acessorios = this.deDuplicate(payload.acessorios);
    }
    if (payload.ano) {
      this.isValidYear(payload.ano);
    }
    return CarRepository.update(id, payload);
  }
}

export default new CarService();
