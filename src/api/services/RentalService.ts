/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import InvalidField from '@errors/InvalidField';
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { Endereco, EnderecoPayload } from '@interfaces/Endereco';
import { Rental, RentalPayload } from '@interfaces/Rental';
import { RentalSearch } from '@interfaces/RentalSearch';
import RentalsModel from '@models/RentalsModel';
import RentalRepository from '@repositories/RentalRepository';
import { Promise } from 'mongoose';
import getCEP from './CepService';
import validateCNPJ from './CnpjService';

class RentalService {
  async create(payload: RentalPayload): Promise<Rental> {
    this.checkIfValidCNPJ(payload.cnpj);
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

  private checkIfValidCNPJ(cnpj: string): void {
    if (!validateCNPJ(cnpj)) {
      throw new InvalidValue('invalid', `CNPJ ${cnpj} is invalid`, true);
    }
  }

  async update(id: string, payload: RentalPayload): Promise<Rental> {
    this.checkIfValidCNPJ(payload.cnpj);
    await this.getById(id);
    await this.checkIfExistsCNPJ(payload.cnpj, id);
    this.checkIfExistsMoreThanOneFilial(payload.endereco);
    payload.endereco = await this.getCepLocations(payload.endereco);
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

  async getAll(payload: RentalSearch): Promise<RentalsModel> {
    let offset = 0;
    let limit = 10;
    if (payload.uf) {
      payload['endereco.uf'] = payload.uf;
      payload.uf = undefined;
    }
    if (payload.bairro) {
      payload['endereco.bairro'] = payload.bairro;
      payload.bairro = undefined;
    }
    if (payload.cep) {
      payload['endereco.cep'] = payload.cep;
      payload.cep = undefined;
    }
    if (payload.complemento) {
      payload['endereco.complemento'] = payload.complemento;
      payload.complemento = undefined;
    }
    if (payload.localidade) {
      payload['endereco.localidade'] = payload.localidade;
      payload.localidade = undefined;
    }
    if (payload.logradouro) {
      payload['endereco.logradouro'] = payload.logradouro;
      payload.logradouro = undefined;
    }
    if (payload.number) {
      payload['endereco.number'] = payload.number;
      payload.number = undefined;
    }
    if (payload.limit) {
      limit = parseInt(payload.limit, 10);
      payload.limit = undefined;
    }
    if (payload.offset) {
      offset = parseInt(payload.offset, 10);
      payload.offset = undefined;
    }
    return (await RentalRepository.findAll(
      payload,
      offset,
      limit
    )) as RentalsModel;
  }
}

export default new RentalService();
