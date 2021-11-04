import { Rental, RentalPayload } from '@interfaces/Rental';
import { isValid } from '@models/Model';
import RentalModel from '@models/RentalModel';

/* eslint-disable class-methods-use-this */
class RentalRepository {
  async create(paylod: RentalPayload): Promise<Rental> {
    return (await RentalModel.create(paylod)) as Rental;
  }

  async findAll(): Promise<string> {
    return '';
  }

  async delete(id: string): Promise<boolean> {
    return true;
  }

  async findById(id: string): Promise<string> {
    return '';
  }

  validId(id: string): boolean {
    return isValid(id);
  }

  async update(id: string): Promise<string> {
    return '';
  }

  async getRentalByCNPJ(cnpj: string, id?: string) {
    let filter;
    if (id) {
      filter = { $and: [{ cnpj }, { _id: { $ne: id } }] };
    } else {
      filter = { cnpj };
    }

    return (await RentalModel.findOne(filter, {
      cnpj: true,
    }).exec()) as Rental;
  }
}

export default new RentalRepository();
