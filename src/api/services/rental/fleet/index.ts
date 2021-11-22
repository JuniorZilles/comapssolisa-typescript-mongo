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
    const result = await RentalFleetRepository.updateFleet(id, idFleet, payload);
    this.checkIfIsDefined(result, id, idFleet);
    return result;
  }

  private checkIfIsDefined(result: RentalFleet, id: string, idFleet: string): void {
    if (!result) {
      throw new NotFound(`id: ${id} - idFleet: ${idFleet}`);
    }
  }

  async delete(id: string, idFleet: string) {
    const result = await RentalFleetRepository.deleteFleet(id, idFleet);
    this.checkIfIsDefined(result, id, idFleet);
    return result;
  }

  async getById(id: string, idFleet: string) {
    const result = await RentalFleetRepository.getByIdFleet(id, idFleet);
    this.checkIfIsDefined(result, id, idFleet);
    return result;
  }

  async getAll(id: string, payload: RentalFleetSearch) {
    payload.id_locadora = id;
    const result = await RentalFleetRepository.findAll(payload);
    return result;
  }
}

export default new RentalFleetService();
