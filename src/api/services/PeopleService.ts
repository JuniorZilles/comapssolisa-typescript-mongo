/* eslint-disable no-param-reassign */
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { Person } from '@interfaces/Person';
import PeopleRepository from '@repositories/PeopleRepository';
import InvalidField from '@errors/InvalidField';
import { Paginate } from '@interfaces/Paginate';
import NotFound from '@errors/NotFound';
import PersonSearch from '@interfaces/PersonSearch';
import InvalidValue from '@errors/InvalidValue';
import validateCPF from './CpfService';

moment.locale('pt-BR');
class PeopleService {
  async create(payload: Person): Promise<Person> {
    payload.data_nascimento = this.isOlderAndTransfromToDateString(payload.data_nascimento as string);
    const { cpf, email } = payload;
    this.checkCpf(cpf);
    await this.checkIfExistsEmailOrCpf(email, cpf);
    const person = await PeopleRepository.create(payload);
    return person;
  }

  private async checkIfExistsEmailOrCpf(email: string, cpf: string, id: string | undefined = undefined): Promise<void> {
    const result = await PeopleRepository.getUserEmailOrCpf(email, cpf, id);
    if (result) {
      if (result.id !== id) {
        this.checkIfIsValid(result, cpf, email);
      }
    }
  }

  private checkCpf(cpf: string): void {
    if (!validateCPF(cpf)) {
      throw new InvalidValue('Bad Request', `CPF ${cpf} is invalid`, true);
    }
  }

  private isOlderAndTransfromToDateString(date: string): Date {
    const birthday = moment(date, 'DD/MM/YYYY');
    const age = moment().diff(birthday, 'years', false);
    if (age < 18) {
      throw new InvalidField('data_nascimento');
    }
    return birthday.toDate();
  }

  private transfromToDate(date: string): string {
    return moment(date, 'DD/MM/YYYY').toISOString();
  }

  async getById(id: string): Promise<Person> {
    if (!PeopleRepository.validId(id)) {
      throw new InvalidField('id');
    }
    const person = await PeopleRepository.findById(id);
    if (!person) {
      throw new NotFound(id);
    }
    return person;
  }

  async list(query: PersonSearch): Promise<Paginate<Person>> {
    if (query.data_nascimento) {
      query.data_nascimento = this.transfromToDate(query.data_nascimento as string);
    }
    const result = await PeopleRepository.findAll(query);
    return result;
  }

  async delete(id: string): Promise<Person> {
    await this.getById(id);
    const result = await PeopleRepository.delete(id);
    return result;
  }

  private checkIfIsValid(result: Person, cpf: string, email: string): void {
    if (result.cpf === cpf) {
      throw new InvalidValue('Conflict', `CPF ${cpf} already in use`, true);
    } else if (result.email === email) {
      throw new InvalidValue('Conflict', `Email ${email} already in use`, true);
    }
  }

  async update(id: string, payload: Person): Promise<Person> {
    await this.getById(id);
    payload.data_nascimento = this.isOlderAndTransfromToDateString(payload.data_nascimento as string);
    if (payload.senha) {
      payload.senha = await bcrypt.hash(payload.senha, 10);
    }
    const { cpf, email } = payload;
    this.checkCpf(cpf);
    await this.checkIfExistsEmailOrCpf(email, cpf, id);
    const person = await PeopleRepository.update(id, payload);
    return person;
  }
}

export default new PeopleService();
