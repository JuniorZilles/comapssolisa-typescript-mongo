/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import InvalidField from '@errors/InvalidField';
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { Endereco, EnderecoPayload } from '@interfaces/Endereco';
import { Rental, RentalPayload } from '@interfaces/Rental';
import RentalsModel from '@models/RentalsModel';
import RentalRepository from '@repositories/RentalRepository';
import { Promise } from 'mongoose';
import getCEP from './CepService';
import validateCNPJ from './CnpjService';

class RentalService {
  async create(payload: RentalPayload): Promise<Rental> {
    this.checkCNPJ(payload.cnpj);
    await this.checkIfExistsCNPJ(payload.cnpj);
    this.checkIfExistsMoreThanOneFilial(payload.endereco);
    payload.endereco = await this.getCepLocations(payload.endereco);
    const rental = RentalRepository.create(payload);
    return rental;
  }

  private checkIfExistsMoreThanOneFilial(addresses: EnderecoPayload[]): void {
    const indexes = addresses.filter((address) => {
      return address.isFilial === false;
    });
    if (indexes.length > 1) {
      throw new InvalidValue(
        'invalid',
        `isFilial has more than one headquarters`,
        true
      );
    }
  }

  private async getCepLocations(
    addresses: EnderecoPayload[]
  ): Promise<Endereco[]> {
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

  private async checkIfExistsCNPJ(
    cnpj: string,
    id: string | undefined = undefined
  ) {
    const result = await RentalRepository.getRentalByCNPJ(cnpj, id);
    if (result) {
      if (result.id !== id) {
        this.checkIfIsValid(result, cnpj);
      }
    }
  }

  private checkIfIsValid(result: Rental, cnpj: string) {
    if (result.cnpj === cnpj) {
      throw new InvalidValue('conflict', `CNPJ ${cnpj} already in use`, true);
    }
  }

  private checkCNPJ(cnpj: string): void {
    if (!validateCNPJ(cnpj)) {
      throw new InvalidValue('invalid', `CNPJ ${cnpj} is invalid`, true);
    }
  }

  async update(id: string, payload: RentalPayload): Promise<Rental> {
    this.checkCNPJ(payload.cnpj);
    await this.checkIfExistsCNPJ(payload.cnpj);
    this.checkIfExistsMoreThanOneFilial(payload.endereco);
    payload.endereco = await this.getCepLocations(payload.endereco);
    await this.getById(id);
    const rental = await RentalRepository.update(id, payload);
    return rental;
  }

  async delete(id: string): Promise<boolean> {
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

  // async getAll(): Promise<RentalsModel> {
  //   //return new RentalsModel();
  // }
}

export default new RentalService();
