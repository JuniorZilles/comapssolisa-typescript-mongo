import { Rental, RentalPayload } from '@interfaces/Rental';
import { RentalSearch } from '@interfaces/RentalSearch';
import { isValid } from '@models/Model';
import RentalModel from '@models/RentalModel';
import RentalsModel from '@models/RentalsModel';

class RentalRepository {
  async create(paylod: RentalPayload): Promise<Rental> {
    return (await RentalModel.create(paylod)) as Rental;
  }

  async findAll(payload: RentalSearch, offset: number, limit: number): Promise<RentalsModel> {
    const count = await RentalModel.countDocuments(payload);
    const rental = (await RentalModel.find(payload)
      .skip((offset as number) * (limit as number))
      .limit(limit as number)
      .exec()) as Rental[];
    const offsets = Math.round(count / limit);
    return new RentalsModel(rental, count, limit, offset, offsets);
  }

  async delete(id: string): Promise<Rental> {
    const result = (await RentalModel.findByIdAndDelete(id).exec()) as Rental;
    return result;
  }

  async findById(id: string): Promise<Rental> {
    return (await RentalModel.findById(id)) as Rental;
  }

  validId(id: string): boolean {
    return isValid(id);
  }

  async update(id: string, payload: RentalPayload): Promise<Rental> {
    return (await RentalModel.findByIdAndUpdate(id, payload, {
      returnOriginal: false
    })) as Rental;
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
