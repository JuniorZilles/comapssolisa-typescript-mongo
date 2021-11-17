import NotFound from '@errors/NotFound';
import { RentalCar } from '@interfaces/rental/car/RentalCar';
import { RentalCarSearch } from '@interfaces/rental/car/RentalCarSearch';
import RentalCarRepository from '@repositories/RentalCarRepository';

class RentalCarService {
  async create(payload: RentalCar) {
    const result = await RentalCarRepository.create(payload);
    return result;
  }

  async update(payload: RentalCar, id: string) {
    await this.getById(id);
    const result = await RentalCarRepository.update(id, payload);
    return result;
  }

  async delete(id: string) {
    await this.getById(id);
    const result = await RentalCarRepository.delete(id);
    return result;
  }

  async getById(id: string) {
    const result = await RentalCarRepository.findById(id);
    if (!result) {
      throw new NotFound(id);
    }
    return result;
  }

  async getAll(payload: RentalCarSearch) {
    const result = await RentalCarRepository.findAll(payload);
    return result;
  }
}

export default new RentalCarService();
