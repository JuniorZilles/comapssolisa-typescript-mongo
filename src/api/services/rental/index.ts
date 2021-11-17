/* eslint-disable no-restricted-syntax */
import NotFound from '@errors/NotFound';
import { Endereco } from '@interfaces/Endereco';
import { Paginate } from '@interfaces/Paginate';
import { Rental } from '@interfaces/Rental';
import { RentalSearch } from '@interfaces/RentalSearch';
import RentalRepository from '@repositories/RentalRepository';
import getCEP from '../CepService';
import { validateOnUpdateRental, validateOnCreateRental } from './validation';

class RentalService {
  async create(payload: Rental): Promise<Rental> {
    await validateOnCreateRental(payload);
    payload.endereco = await this.getCepLocations(payload.endereco);

    const rental = RentalRepository.create(payload);
    return rental;
  }

  private async getCepLocations(addresses: Endereco[]): Promise<Endereco[]> {
    const result: Endereco[] = [];
    const promissesResult: Endereco[] = await Promise.all(addresses.map(({ cep }) => getCEP(cep)));
    for (const address of addresses) {
      const addressNew = promissesResult.find(({ cep }) => cep === address.cep);
      if (addressNew) {
        result.push({ ...addressNew, ...address });
      }
    }
    return result;
  }

  async update(id: string, payload: Rental): Promise<Rental> {
    await this.getById(id);
    await validateOnUpdateRental(payload, id);
    payload.endereco = await this.getCepLocations(payload.endereco);
    const rental = await RentalRepository.update(id, payload);
    return rental;
  }

  async delete(id: string): Promise<Rental> {
    await this.getById(id);
    const result = await RentalRepository.delete(id);
    return result;
  }

  async getById(id: string): Promise<Rental> {
    const rental = await RentalRepository.findById(id);
    if (!rental) {
      throw new NotFound(id);
    }
    return rental;
  }

  private transformToQuery(query: RentalSearch): RentalSearch {
    const fields = ['bairro', 'uf', 'cep', 'complemento', 'localidade', 'logradouro', 'number'];
    fields.forEach(function updateQuery(index) {
      if (query[index]) {
        query[`endereco.${index}`] = query[index];
        delete query[index];
      }
    });
    return query;
  }

  async getAll(payload: RentalSearch): Promise<Paginate<Rental>> {
    const query = this.transformToQuery(payload);
    const result = await RentalRepository.findAll(query);
    return result;
  }
}

export default new RentalService();
