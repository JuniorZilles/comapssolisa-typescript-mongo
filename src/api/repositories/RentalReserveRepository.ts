import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { RentalReserveSearch } from '@interfaces/rental/reserve/RentalReserveSearch';
import rentalReserveModel from '@models/RentalReserveModel';
import Repository from './Repository';

class RentalReserveRepository extends Repository<RentalReserveSearch, RentalReserve> {
  constructor() {
    super(rentalReserveModel);
  }
}

export default new RentalReserveRepository();
