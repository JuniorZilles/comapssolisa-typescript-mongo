import NotFound from '@errors/NotFound';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { RentalFleetSearch } from '@interfaces/rental/fleet/RentalFleetSearch';
import RentalFleetRepository from '@repositories/RentalFleetRepository';
import { validateOnCreateRentalFleet, validateOnUpdateRentalFleet } from './validation';

class RentalFleetService {
  async create(id: string, payload: RentalFleet) {
    payload.id_locadora = id;
    await validateOnCreateRentalFleet(payload);
    const result = await RentalFleetRepository.create(payload);
    return result;
  }

  async update(id: string, idFleet: string, payload: RentalFleet) {
    payload.id_locadora = id;
    await validateOnUpdateRentalFleet(idFleet, payload);
    const result = await RentalFleetRepository.update(id, payload);
    if (!result) {
      throw new NotFound(`id: ${id} - idFleet: ${idFleet}`);
    }
    return result;
  }

  async delete(id: string, idFleet: string) {
    const result = await RentalFleetRepository.delete(id);
    if (!result) {
      throw new NotFound(`id: ${id} - idFleet: ${idFleet}`);
    }
    return result;
  }

  async getById(id: string, idFleet: string) {
    const result = await RentalFleetRepository.findById(id);
    if (!result) {
      throw new NotFound(`id: ${id} - idFleet: ${idFleet}`);
    }
    return result;
  }

  async getAll(id: string, payload: RentalFleetSearch) {
    const result = await RentalFleetRepository.findAll(payload);
    return result;
  }
}

export default new RentalFleetService();
