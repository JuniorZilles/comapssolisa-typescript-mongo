import { PersonCreateModel } from "@models/PersonCreateModel";
import PersonModel, { isValid } from "@models/PersonModel";

class CarRepository  {
    async create(payload:PersonCreateModel):Promise<PersonCreateModel> {
        return await PersonModel.create(payload)
    }

    async findAll(payload:any, start:number, size:number):Promise<any> {
     
    }

    async delete(id:string):Promise<boolean>{
      
      return true
    }

    async findById(id:string):Promise<any>{
     
    } 

    validId(id:string):boolean{
      return isValid(id);
    }

    async update(id:string, payload:any){
      
    }
  }

export default new CarRepository()