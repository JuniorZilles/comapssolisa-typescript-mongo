import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { RentalFleetSearch } from '@interfaces/rental/fleet/RentalFleetSearch';
import rentalCarModel from '@models/RentalFleetModel';
import Repository from './Repository';

class RentalFleetRepository extends Repository<RentalFleetSearch, RentalFleet> {
  constructor() {
    super(rentalCarModel);
  }

  async validatePlate(plate: string): Promise<RentalFleet> {
    const result = await rentalCarModel.findOne({ placa: plate });
    return result as RentalFleet;
  }

  public async updateFleet(id: string, idFleet: string, payload: RentalFleet): Promise<RentalFleet> {
    const result = await rentalCarModel.findOneAndUpdate({ _id: idFleet, id_locadora: id }, payload, { new: true });
    return result as RentalFleet;
  }

  public async deleteFleet(id: string, idFleet: string): Promise<RentalFleet> {
    const result = await rentalCarModel.findOneAndDelete({ _id: idFleet, id_locadora: id });
    return result as RentalFleet;
  }

  public async getByIdFleet(id: string, idFleet: string): Promise<RentalFleet> {
    const result = await rentalCarModel.findOne({ _id: idFleet, id_locadora: id });
    return result as RentalFleet;
  }
}

export default new RentalFleetRepository();
