import { InvalidField } from '@errors/InvalidField'
import { MissingBody } from '@errors/MissingBody'
import { NotFound } from '@errors/NotFound'
import { Accessory, Car, CarUpdateModel } from '@models/CarModel'
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

    async delete(id:string) { 
        await this.getById(id)
        return await CarRepository.delete(id)
    }

    isEmpty(car:CarUpdateModel):boolean{
        let count = 0
        if (car.modelo)
            count ++
        if(car.acessorios)
            count ++
        if(car.cor)
            count ++
        if(car.ano)
            count ++
        if(car.quantidadePassageiros)
            count ++
        if(count > 0)
            return false
        else
            return true
    }

    async update(id:string, payload:CarUpdateModel) { 
        await this.getById(id)
        if(this.isEmpty(payload)){
            throw new MissingBody()
        }
        if(payload.acessorios){
            this.isValidAccessories(payload.acessorios)
            payload.acessorios = this.deDuplicate(payload.acessorios)
        }
        if(payload.ano){
            this.isValidYear(payload.ano)
        }
        return await CarRepository.update(id, payload)
    }
}

export default new CarService()