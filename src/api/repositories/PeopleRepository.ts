import PeopleModel from '@models/PeopleModel';
import { Person } from '@interfaces/Person';
import PersonModel from '@models/PersonModel';
import PersonSearch from '@interfaces/PersonSearch';
import { FindUserPayload } from '@interfaces/FindUserPayload';
import Repository from './Repository';

class PeopleRepository extends Repository<PersonSearch, PeopleModel, Person> {
  constructor() {
    super(PersonModel);
  }

  async findUser(payload: FindUserPayload) {
    return (await PersonModel.findOne(payload, {
      senha: true,
      habilitado: true,
      email: true
    }).exec()) as Person;
  }

  async getUserEmailOrCpf(email: string, cpf: string, id?: string) {
    let filter;
    if (id) {
      filter = { $and: [{ $or: [{ email }, { cpf }] }, { _id: { $ne: id } }] };
    } else {
      filter = { $or: [{ email }, { cpf }] };
    }

    return (await PersonModel.findOne(filter, {
      email: true,
      cpf: true
    }).exec()) as Person;
  }
}

export default new PeopleRepository();
