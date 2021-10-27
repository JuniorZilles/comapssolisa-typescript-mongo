/* eslint-disable class-methods-use-this */
import PeopleModel from '@models/PeopleModel';
import { PersonCreateModel } from '@models/PersonCreateModel';
import PersonModel, { isValid } from '@models/PersonModel';
import { PersonSearch } from '@models/PersonSearch';

class PeopleRepository {
  async create(payload:PersonCreateModel):Promise<PersonCreateModel> {
    return PersonModel.create(payload);
  }

  async findAll(payload:PersonSearch, offset:number, limit:number):Promise<PeopleModel> {
    const count = await PersonModel.countDocuments(payload);
    const people = await PersonModel.find(payload, {
      data_nascimento: {
        $dateToString: {
          format: '%d/%m/%Y',
          date: '$data_nascimento',
        },
      },
    }, { skip: offset, limit }).exec();
    const offsets = Math.round(count / limit);
    return new PeopleModel(people, count, limit, offset, offsets);
  }

  async delete(id:string):Promise<boolean> {
    await PersonModel.findByIdAndRemove(id).exec();
    return true;
  }

  async findById(id:string):Promise<PersonCreateModel> {
    return await PersonModel.findById(id, null, {
      data_nascimento: {
        $dateToString: {
          format: '%d/%m/%Y',
          date: '$data_nascimento',
        },
      },
    }) as PersonCreateModel;
  }

  validId(id:string):boolean {
    return isValid(id);
  }

  async update(id:string, payload:PersonCreateModel) {
    return await PersonModel.findByIdAndUpdate(id, payload,
      {
        returnOriginal: false,
        data_nascimento: {
          $dateToString: {
            format: '%d/%m/%Y',
            date: '$data_nascimento',
          },
        },
      }).exec() as PersonCreateModel;
  }

  async findUser(payload:any) {
    return await PersonModel.findOne(payload,
      { senha: true, habilitado: true, email: true }).exec() as PersonCreateModel;
  }
}

export default new PeopleRepository();
