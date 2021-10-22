import moment from 'moment'
import { PersonCreateModel } from "@models/PersonCreateModel"
import PeopleRepository from "@repositories/PeopleRepository"
import { InvalidField } from '@errors/InvalidField'
import { PersonUpdateModel } from '@models/PersonUpdateModel'


export class PeopleService{
    async create(payload: PersonCreateModel):Promise<PersonCreateModel> {
        this.isOlder(payload.data_nascimento)
        return await PeopleRepository.create(payload)
    }

    isOlder(date:string){
        const birthday = moment(date, 'DD/MM/YYYY').format(
            'YYYY-MM-DD HH:mm:ss'
          )
        const age = moment().diff(birthday, 'years', false)
        if(age<18){
            throw new InvalidField('data_nascimento')
        }
    }

    async getById(id:string) { 
        
    }

    async list(payload:any) {
        let start:number = 0
        let size:number=10
        
        if(payload.size){
            size = payload.size
            payload.size = undefined
        }
        if(payload.start){
            start = payload.start
            payload.start = undefined
        }  
    }

    async delete(id:string) { 
        await this.getById(id)
       
    }

    async update(id:string, payload:PersonUpdateModel) { 
        await this.getById(id)
        if(payload.data_nascimento){
            this.isOlder(payload.data_nascimento)
        }
        
        
    }
}

export default new PeopleService()