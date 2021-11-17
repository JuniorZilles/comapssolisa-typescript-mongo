import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { RentalFleetSearch } from '@interfaces/rental/fleet/RentalFleetSearch';
import rentalFleetModel from '@models/RentalFleetModel';
import Repository from './Repository';

class RentalFleetRepository extends Repository<RentalFleetSearch, RentalFleet> {
  constructor() {
    super(rentalFleetModel);
  }
}

export default new RentalFleetRepository();
