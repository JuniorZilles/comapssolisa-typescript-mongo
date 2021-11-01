/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { PersonCreateModel } from '@models/PersonCreateModel';
import PeopleRepository from '@repositories/PeopleRepository';
import InvalidField from '@errors/InvalidField';
import { PersonSearch } from '@models/PersonSearch';
import NotFound from '@errors/NotFound';
import PersonPatchModel from '@models/PersonPatchModel';
import InvalidValue from '@errors/InvalidValue';

moment.locale('pt-BR');
class PeopleService {
  async create(payload: PersonCreateModel): Promise<PersonPatchModel> {
    payload.data_nascimento = this.isOlderAndTransfromToDateString(
      payload.data_nascimento as string,
    );
    await this.isUnique(payload.email, payload.cpf);
    const person = await PeopleRepository.create(payload) as PersonPatchModel;
    person.senha = undefined;
    return person;
  }

  private async isUnique(email:string, cpf:string) {
    const result = await PeopleRepository.getUserEmailOrCpf(email, cpf);
    if (result) {
      if (result.cpf === cpf) {
        throw new InvalidValue('conflict', `CPF ${cpf} already in use`, true);
      } else if (result.email === email) {
        throw new InvalidValue('conflict', `Email ${cpf} already in use`, true);
      }
    }
  }

  private isOlderAndTransfromToDateString(date: string) {
    const birthday = moment(date, 'DD/MM/YYYY');
    const age = moment().diff(birthday, 'years', false);
    if (age < 18) {
      throw new InvalidField('data_nascimento');
    }
    return birthday.toDate();
  }

  private transfromToDateString(date: string) {
    return moment(date, 'DD/MM/YYYY').format(
      'YYYY-MM-DD',
    );
  }

  async getById(id: string):Promise<PersonPatchModel> {
    if (!PeopleRepository.validId(id)) {
      throw new InvalidField('id');
    }
    const person = await PeopleRepository.findById(id);
    if (!person) {
      throw new NotFound(id);
    }
    return person;
  }

  async list(payload: PersonSearch) {
    let offset: number = 0;
    let limit: number = 10;

    if (payload.limit) {
      limit = parseInt(payload.limit, 10);
      payload.limit = undefined;
    }
    if (payload.offset) {
      offset = parseInt(payload.offset, 10);
      payload.offset = undefined;
    }
    if (payload.senha) {
      payload.senha = undefined;
    }
    if (payload.data_nascimento) {
      payload.data_nascimento = this.transfromToDateString(payload.data_nascimento as string);
    }
    return PeopleRepository.findAll(payload, offset, limit);
  }

  async delete(id: string) {
    await this.getById(id);
    return PeopleRepository.delete(id);
  }

  private async isUniqueOrNotSamePerson(email:string, id:string, cpf:string) {
    const result = await PeopleRepository.getUserEmailOrCpf(email, cpf, id);
    if (result) {
      if (result.id !== id) {
        throw new InvalidValue('conflict', 'cpf or email already exists, use another', true);
      }
    }
  }

  async update(id: string, payload: PersonCreateModel) {
    await this.getById(id);
    payload.data_nascimento = this.isOlderAndTransfromToDateString(
      payload.data_nascimento as string,
    );
    if (payload.senha) {
      payload.senha = await bcrypt.hash(payload.senha, 10);
    }
    await this.isUniqueOrNotSamePerson(payload.email, id, payload.cpf);
    const person = await PeopleRepository.update(id, payload);
    return person;
  }
}

export default new PeopleService();
