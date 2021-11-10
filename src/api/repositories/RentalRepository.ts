import { Rental } from '@interfaces/Rental';
import { RentalSearch } from '@interfaces/RentalSearch';
import RentalModel from '@models/RentalModel';
import Rentals from '@interfaces/Rentals';
import Repository from './Repository';

class RentalRepository extends Repository<RentalSearch, Rentals, Rental> {
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

    return (await RentalModel.findOne(filter, {
      cnpj: true
    }).exec()) as Rental;
  }
}

export default new RentalRepository();
