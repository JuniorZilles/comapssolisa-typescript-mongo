/* eslint-disable no-param-reassign */
import bcrypt from 'bcryptjs';
import { Person } from '@interfaces/Person';
import PeopleRepository from '@repositories/PeopleRepository';
import { Paginate } from '@interfaces/Paginate';
import NotFound from '@errors/NotFound';
import PersonSearch from '@interfaces/PersonSearch';
import transformToDate from '@utils/transform';
import { validateOnCreatePerson, validateOnUpdatePerson, isOlderAndTransfromToDateString } from './validation';

class PeopleService {
  async create(payload: Person): Promise<Person> {
    payload.data_nascimento = isOlderAndTransfromToDateString(payload.data_nascimento as string);
    await validateOnCreatePerson(payload);
    const person = await PeopleRepository.create(payload);
    return person;
  }

  async getById(id: string): Promise<Person> {
    const person = await PeopleRepository.findById(id);
    if (!person) {
      throw new NotFound(id);
    }
    return person;
  }

  async list(query: PersonSearch): Promise<Paginate<Person>> {
    if (query.data_nascimento) {
      query.data_nascimento = transformToDate(query.data_nascimento as string);
    }
    const result = await PeopleRepository.findAll(query);
    return result;
  }

  async delete(id: string): Promise<Person> {
    await this.getById(id);
    const result = await PeopleRepository.delete(id);
    return result;
  }

  async update(id: string, payload: Person): Promise<Person> {
    await this.getById(id);
    payload.data_nascimento = isOlderAndTransfromToDateString(payload.data_nascimento as string);
    if (payload.senha) {
      payload.senha = await bcrypt.hash(payload.senha, 10);
    }
    await validateOnUpdatePerson(payload, id);
    const person = await PeopleRepository.update(id, payload);
    return person;
  }
}

export default new PeopleService();
