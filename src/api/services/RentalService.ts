/* eslint-disable no-param-reassign */
import InvalidField from '@errors/InvalidField';
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { Endereco } from '@interfaces/Endereco';
import { Paginate } from '@interfaces/Paginate';
import { Rental } from '@interfaces/Rental';
import { RentalSearch } from '@interfaces/RentalSearch';
import RentalRepository from '@repositories/RentalRepository';
import getCEP from './CepService';
import validateCNPJ from './CnpjService';

class RentalService {
  async create(payload: Rental): Promise<Rental> {
    this.checkIfValidCNPJ(payload.cnpj);
    await this.checkIfExistsCNPJ(payload.cnpj);
    this.checkIfExistsMoreThanOneFilial(payload.endereco);
    payload.endereco = await this.getCepLocations(payload.endereco);
    const rental = RentalRepository.create(payload);
    return rental;
  }

  private checkIfExistsMoreThanOneFilial(addresses: Endereco[]): void {
    const indexes = addresses.filter((address) => {
      return address.isFilial === false;
    });
    if (indexes.length > 1) {
      throw new InvalidValue('Bad Request', `isFilial has more than one headquarters`, true);
    }
  }

  private async getCepLocations(addresses: Endereco[]): Promise<Endereco[]> {
    const addressesNew: Endereco[] = await Promise.all(
      addresses.map(async function findCep(address) {
        const { cep } = address;
        const data = (await getCEP(cep)) as Endereco;
        data.number = address.number;
        data.isFilial = address.isFilial as boolean;
        if (address.complemento) {
          data.complemento = address.complemento;
        }
        return data;
      })
    );

    return addressesNew;
  }

  private async checkIfExistsCNPJ(cnpj: string, id: string | undefined = undefined): Promise<void> {
    const result = await RentalRepository.getRentalByCNPJ(cnpj, id);
    if (result) {
      if (result.id !== id) {
        this.checkIfIsValid(result, cnpj);
      }
    }
  }

  private checkIfIsValid(result: Rental, cnpj: string): void {
    if (result.cnpj === cnpj) {
      throw new InvalidValue('Conflict', `CNPJ ${cnpj} already in use`, true);
    }
  }

  private checkIfValidCNPJ(cnpj: string): void {
    if (!validateCNPJ(cnpj)) {
      throw new InvalidValue('Bad Request', `CNPJ ${cnpj} is invalid`, true);
    }
  }

  async update(id: string, payload: Rental): Promise<Rental> {
    this.checkIfValidCNPJ(payload.cnpj);
    await this.getById(id);
    await this.checkIfExistsCNPJ(payload.cnpj, id);
    this.checkIfExistsMoreThanOneFilial(payload.endereco);
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
    if (!RentalRepository.validId(id)) {
      throw new InvalidField('id');
    }
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
