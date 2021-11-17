import NotFound from '@errors/NotFound';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { RentalFleetSearch } from '@interfaces/rental/fleet/RentalFleetSearch';
import RentalFleetRepository from '@repositories/RentalFleetRepository';

class RentalFleetService {
  async create(payload: RentalFleet) {
    const result = await RentalFleetRepository.create(payload);
    return result;
  }

  async update(payload: RentalFleet, id: string) {
    await this.getById(id);
    const result = await RentalFleetRepository.update(id, payload);
    return result;
  }

  async delete(id: string) {
    await this.getById(id);
    const result = await RentalFleetRepository.delete(id);
    return result;
  }

  async getById(id: string) {
    const result = await RentalFleetRepository.findById(id);
    if (!result) {
      throw new NotFound(id);
    }
    return result;
  }

  async getAll(payload: RentalFleetSearch) {
    const result = await RentalFleetRepository.findAll(payload);
    return result;
  }
}

export default new RentalFleetService();
