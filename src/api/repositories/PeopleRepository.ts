import { Person } from '@interfaces/people/Person';
import PersonModel from '@models/PersonModel';
import PersonSearch from '@interfaces/people/PersonSearch';
import { FindUserPayload } from '@interfaces/FindUserPayload';
import Repository from './Repository';

class PeopleRepository extends Repository<PersonSearch, Person> {
  constructor() {
    super(PersonModel);
  }

  async findUser(payload: FindUserPayload) {
    const result = await PersonModel.findOne(payload, {
      senha: true,
      habilitado: true,
      email: true
    });
    return result;
  }

  async getUserEmailOrCpf(email: string, cpf: string, id?: string) {
    let filter;
    if (id) {
      filter = { $and: [{ $or: [{ email }, { cpf }] }, { _id: { $ne: id } }] };
    } else {
      filter = { $or: [{ email }, { cpf }] };
    }

    const result = await PersonModel.findOne(filter, {
      email: true,
      cpf: true
    });

    return result;
  }
}

export default new PeopleRepository();
