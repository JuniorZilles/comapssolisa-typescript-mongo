import PeopleModel from '@models/PeopleModel';
import { Person } from '@interfaces/Person';
import PersonModel from '@models/PersonModel';
import PersonSearch from '@interfaces/PersonSearch';
import { FindUserPayload } from '@interfaces/FindUserPayload';
import { isValid } from '@models/Model';

class PeopleRepository {
  async create(payload: Person): Promise<Person> {
    return (await PersonModel.create(payload)) as Person;
  }

  async findAll(payload: PersonSearch, offset: number, limit: number): Promise<PeopleModel> {
    const count = await PersonModel.countDocuments(payload);
    const people = (await PersonModel.find(payload)
      .skip((offset as number) * (limit as number))
      .limit(limit as number)
      .exec()) as PersonSearch[];
    const offsets = Math.round(count / limit);
    return new PeopleModel(people, count, limit, offset, offsets);
  }

  async delete(id: string): Promise<Person> {
    const result = (await PersonModel.findByIdAndDelete(id).exec()) as Person;
    return result;
  }

  async findById(id: string): Promise<PersonSearch> {
    return (await PersonModel.findById(id)) as PersonSearch;
  }

  validId(id: string): boolean {
    return isValid(id);
  }

  async update(id: string, payload: Person) {
    return (await PersonModel.findByIdAndUpdate(id, payload, {
      returnOriginal: false
    }).exec()) as Person;
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
