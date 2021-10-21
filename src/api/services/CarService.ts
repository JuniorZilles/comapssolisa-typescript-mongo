import { InvalidField } from '@errors/InvalidField'
import { NotFound } from '@errors/NotFound'
import { Accessory, Car } from '@models/CarModel'
import { CarSearch } from '@models/CarSearchModel'
import CarRepository from '@repositories/CarRepository'
class CarService {

    async create(payload: Car) {
        this.isValidAccessories(payload.acessorios)

        this.isValidYear(payload.ano)
        
        payload.acessorios = this.deDuplicate(payload.acessorios)

        return await CarRepository.create(payload)
    }

    private isValidAccessories(acessories:Accessory[]){
        if (acessories.length == 0) {
            throw new InvalidField('acessorios')
        }
    }

    private isValidYear(year:Number){
        if (year < 1950 || year > 2022) {
            throw new InvalidField('ano')
        }
    }

    deDuplicate(list: Accessory[]): Accessory[] {
        return list.filter((elem, index, arr) => arr.findIndex((t) => (
            t.descricao === elem.descricao)) === index)
    }

    async getById(id:string) { 
        if (!CarRepository.validId(id)){
            throw new InvalidField('id')
        }
        const car = await CarRepository.findById(id)
        if(!car){
            throw new NotFound(id)
        }
        return car
    }

    async list(payload:CarSearch, start:number = 0, size:number=10) {
        if (payload.acessorio){
            payload['acessorios.descricao'] = payload.acessorio
            payload.acessorio = undefined
        }
        return await CarRepository.findAll(payload, start, size)
    }

    delete(id:string) { 
        this.getById(id)
        CarRepository.delete(id)
    }

    update(id:string) { 
        this.getById(id)
    }
}

export default new CarService()