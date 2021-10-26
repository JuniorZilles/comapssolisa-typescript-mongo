import { PeopleModel } from "@models/PeopleModel";
import { PersonCreateModel } from "@models/PersonCreateModel";
import PersonModel, { isValid } from "@models/PersonModel";
import { PersonPatchModel } from "@models/PersonPatchModel";
import { PersonSearch } from "@models/PersonSearch";

class CarRepository  {
    async create(payload:PersonCreateModel):Promise<PersonCreateModel> {
        return await PersonModel.create(payload)
    }

    async findAll(payload:PersonSearch, offset:number, limit:number):Promise<PeopleModel> {
        const count = await PersonModel.countDocuments(payload)
        const people = await PersonModel.find(payload, null,{skip:offset, limit:limit}).exec()
        const offsets = Math.round(count/limit)
        return new PeopleModel(people, count, limit, offset, offsets)
    }

    async delete(id:string):Promise<boolean>{
        await PersonModel.findByIdAndRemove(id).exec()
        return true
    }

    async findById(id:string):Promise<PersonCreateModel>{
        return await PersonModel.findById(id) as PersonCreateModel
    } 

    validId(id:string):boolean{
      return isValid(id);
    }

    async update(id:string, payload:PersonCreateModel){
        return await PersonModel.findByIdAndUpdate(id, payload, {returnOriginal: false}).exec() as PersonCreateModel
    }

    async findUser(payload:any){      
        return await PersonModel.findOne(payload, {senha:true, habilitado:true, email:true}).exec() as PersonCreateModel
    }
  }

export default new CarRepository()