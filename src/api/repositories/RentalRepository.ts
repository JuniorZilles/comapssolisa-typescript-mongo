import { Rental } from '@interfaces/Rental';
import { RentalSearch } from '@interfaces/RentalSearch';
import RentalModel from '@models/RentalModel';
import Repository from './Repository';

class RentalRepository extends Repository<RentalSearch, Rental> {
  constructor() {
    super(RentalModel);
  }

  async getRentalByCNPJ(cnpj: string, id?: string) {
    let filter;
    if (id) {
      filter = { $and: [{ cnpj }, { _id: { $ne: id } }] };
    } else {
      filter = { cnpj };
    }

    const result = await RentalModel.findOne(filter, {
      cnpj: true
    });
    return result;
  }
}

export default new RentalRepository();
