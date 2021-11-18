import NotFound from '@errors/NotFound';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { RentalReserveSearch } from '@interfaces/rental/reserve/RentalReserveSearch';
import RentalReserveRepository from '@repositories/RentalReserveRepository';

class RentalReserveService {
  async create(id: string, payload: RentalReserve) {
    // check habilitacao
    // calculate price
    // check if car is available
    // check dates
    const result = await RentalReserveRepository.create(payload);
    return result;
  }

  async update(id: string, idReserve: string, payload: RentalReserve) {
    // check habilitacao
    // calculate price
    // check if car is available
    // check dates
    const result = await RentalReserveRepository.update(id, payload);
    return result;
  }

  async delete(id: string, idReserve: string) {
    const result = await RentalReserveRepository.delete(id);
    return result;
  }

  async getById(id: string, idReserve: string) {
    const result = await RentalReserveRepository.findById(id);
    if (!result) {
      throw new NotFound(id);
    }
    return result;
  }

  async getAll(id: string, payload: RentalReserveSearch) {
    const result = await RentalReserveRepository.findAll(payload);
    return result;
  }
}

export default new RentalReserveService();
