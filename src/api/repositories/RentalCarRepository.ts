import { RentalCar } from '@interfaces/rental/car/RentalCar';
import { RentalCarSearch } from '@interfaces/rental/car/RentalCarSearch';
import rentalCarModel from '@models/RentalCarModel';
import Repository from './Repository';

class RentalCarRepository extends Repository<RentalCarSearch, RentalCar> {
  constructor() {
    super(rentalCarModel);
  }
}

export default new RentalCarRepository();
