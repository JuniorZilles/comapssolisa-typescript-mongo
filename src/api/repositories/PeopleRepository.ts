import { PeopleModel } from "@models/PeopleModel";
import { PersonCreateModel } from "@models/PersonCreateModel";
import PersonModel, { isValid } from "@models/PersonModel";
import { PersonSearch } from "@models/PersonSearch";
import { PersonUpdateModel } from "@models/PersonUpdateModel";

class CarRepository  {
    async create(payload:PersonCreateModel):Promise<PersonCreateModel> {
        return await PersonModel.create(payload)
    }

    async findAll(payload:PersonSearch, start:number, size:number):Promise<PeopleModel> {
        const count = await PersonModel.countDocuments(payload)
        const people = await PersonModel.find(payload).select('-senha').skip( start ).limit( size ).exec()
        const offsets = Math.round(count/size)
        return new PeopleModel(people, count, size, start, offsets)
    }

    async delete(id:string):Promise<boolean>{
        await PersonModel.findByIdAndRemove(id).exec()
        return true
    }

    async findById(id:string):Promise<PersonUpdateModel>{
        return await PersonModel.findById(id) as PersonUpdateModel
    } 

    validId(id:string):boolean{
      return isValid(id);
    }

    async update(id:string, payload:PersonUpdateModel){
        await PersonModel.findByIdAndUpdate(id, payload).exec()
        return true
    }
  }

export default new CarRepository()