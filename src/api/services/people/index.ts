/* eslint-disable no-param-reassign */
import bcrypt from 'bcryptjs';
import { Person } from '@interfaces/people/Person';
import PeopleRepository from '@repositories/PeopleRepository';
import { Paginate } from '@interfaces/Paginate';
import NotFound from '@errors/NotFound';
import PersonSearch from '@interfaces/people/PersonSearch';
import transformToDate from '@utils/transform';
import { validateOnCreatePerson, validateOnUpdatePerson, isOlderAndTransfromToDateString } from './validation';

class PeopleService {
  async create(payload: Person): Promise<Person> {
    payload.data_nascimento = isOlderAndTransfromToDateString(payload.data_nascimento as string);
    await validateOnCreatePerson(payload);
    const result = await PeopleRepository.create(payload);
    return result;
  }

  async getById(id: string): Promise<Person> {
    const result = await PeopleRepository.findById(id);
    this.checkIfIsDefined(result, id);
    return result;
  }

  private checkIfIsDefined(result: Person, id: string): void {
    if (!result) {
      throw new NotFound(id);
    }
  }

  async list(query: PersonSearch): Promise<Paginate<Person>> {
    if (query.data_nascimento) {
      query.data_nascimento = transformToDate(query.data_nascimento as string);
    }
    const result = await PeopleRepository.findAll(query);
    return result;
  }

  async delete(id: string): Promise<Person> {
    const result = await PeopleRepository.delete(id);
    this.checkIfIsDefined(result, id);
    return result;
  }

  async update(id: string, payload: Person): Promise<Person> {
    payload.data_nascimento = isOlderAndTransfromToDateString(payload.data_nascimento as string);
    if (payload.senha) {
      payload.senha = await bcrypt.hash(payload.senha, 10);
    }
    await validateOnUpdatePerson(payload, id);
    const result = await PeopleRepository.update(id, payload);
    this.checkIfIsDefined(result, id);
    return result;
  }
}

export default new PeopleService();
