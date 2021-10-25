import moment from 'moment'
import { PersonCreateModel } from "@models/PersonCreateModel"
import PeopleRepository from "@repositories/PeopleRepository"
import { InvalidField } from '@errors/InvalidField'
import { PersonSearch } from '@models/PersonSearch'
import { NotFound } from '@errors/NotFound'

class PeopleService {
    async create(payload: PersonCreateModel): Promise<PersonCreateModel> {
        this.isOlder(payload.data_nascimento)
        return await PeopleRepository.create(payload)
    }

    isOlder(date: string) {
        const birthday = moment(date, 'DD/MM/YYYY').format(
            'YYYY-MM-DD HH:mm:ss'
        )
        const age = moment().diff(birthday, 'years', false)
        if (age < 18) {
            throw new InvalidField('data_nascimento')
        }
    }

    async getById(id: string):Promise<PersonCreateModel> {
        if (!PeopleRepository.validId(id)){
            throw new InvalidField('id')
        }
        const person = await PeopleRepository.findById(id)
        if (!person){
            throw new NotFound(id)
        }
        return person
    }

    async list(payload: PersonSearch) {
        let offset: number = 0
        let limit: number = 10
        
        if (payload.limit) {
            limit = parseInt(payload.limit)
            payload.limit = undefined
        }
        if (payload.offset) {
            offset = parseInt(payload.offset)
            payload.offset = undefined
        }
        if (payload.senha) {
            payload.senha = undefined
        }
        return await PeopleRepository.findAll(payload, offset, limit)
    }

    async delete(id: string) {
        await this.getById(id)
        return await PeopleRepository.delete(id)
    }

    async update(id: string, payload: PersonCreateModel) {
        await this.getById(id)
        if (payload.data_nascimento) {
            this.isOlder(payload.data_nascimento)
        }
        return await PeopleRepository.update(id, payload)

    }
}

export default new PeopleService()