import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { RentalFleetSearch } from '@interfaces/rental/fleet/RentalFleetSearch';
import rentalCarModel from '@models/RentalFleetModel';
import Repository from './Repository';

class RentalCarRepository extends Repository<RentalFleetSearch, RentalFleet> {
  constructor() {
    super(rentalCarModel);
  }
}

export default new RentalCarRepository();
