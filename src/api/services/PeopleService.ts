import moment from 'moment'
import { PersonCreateModel } from "@models/PersonCreateModel"
import PeopleRepository from "@repositories/PeopleRepository"
import { InvalidField } from '@errors/InvalidField'
import { PersonUpdateModel } from '@models/PersonUpdateModel'
import { PersonSearch } from '@models/PersonSearch'
import { NotFound } from '@errors/NotFound'


export class PeopleService {
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

    async getById(id: string):Promise<PersonUpdateModel> {
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
        let start: number = 0
        let size: number = 10

        if (payload.size) {
            size = payload.size
            payload.size = undefined
        }
        if (payload.start) {
            start = payload.start
            payload.start = undefined
        }
        if (payload.senha) {
            payload.senha = undefined
        }
        return await PeopleRepository.findAll(payload, start, size)
    }

    async delete(id: string) {
        await this.getById(id)

        return await PeopleRepository.delete(id)
    }

    async update(id: string, payload: PersonUpdateModel) {
        await this.getById(id)
        if (payload.data_nascimento) {
            this.isOlder(payload.data_nascimento)
        }


    }
}

export default new PeopleService()