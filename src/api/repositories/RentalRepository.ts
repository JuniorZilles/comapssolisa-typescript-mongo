import { Rental, RentalPayload } from '@interfaces/Rental';
import { RentalSearch } from '@interfaces/RentalSearch';
import { isValid } from '@models/Model';
import RentalModel from '@models/RentalModel';
import RentalsModel from '@models/RentalsModel';

class RentalRepository {
  async create(paylod: RentalPayload): Promise<Rental> {
    return (await RentalModel.create(paylod)) as Rental;
  }

  async findAll(payload: RentalSearch): Promise<RentalsModel> {
    const { offset, limit, ...query } = payload;
    const limitNumber = limit ? parseInt(limit as string, 10) : 100;
    const offsetNumber = offset ? parseInt(offset as string, 10) : 0;
    const count = await RentalModel.countDocuments(query);
    const rental = (await RentalModel.find(query)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber)
      .exec()) as Rental[];
    const offsets = Math.round(count / limitNumber);
    return new RentalsModel(rental, count, limitNumber, offsetNumber, offsets);
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
