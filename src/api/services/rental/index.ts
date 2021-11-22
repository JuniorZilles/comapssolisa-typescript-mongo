/* eslint-disable no-restricted-syntax */
import NotFound from '@errors/NotFound';
import { Endereco } from '@interfaces/rental/Endereco';
import { Paginate } from '@interfaces/Paginate';
import { Rental } from '@interfaces/rental/Rental';
import { RentalSearch } from '@interfaces/rental/RentalSearch';
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
    await validateOnUpdateRental(payload, id);
    payload.endereco = await this.getCepLocations(payload.endereco);
    const result = await RentalRepository.update(id, payload);
    this.checkIfIsDefined(result, id);
    return result;
  }

  async delete(id: string): Promise<Rental> {
    const result = await RentalRepository.delete(id);
    this.checkIfIsDefined(result, id);
    return result;
  }

  private checkIfIsDefined(result: Rental, id: string): void {
    if (!result) {
      throw new NotFound(id);
    }
  }

  async getById(id: string): Promise<Rental> {
    const result = await RentalRepository.findById(id);
    this.checkIfIsDefined(result, id);
    return result;
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
