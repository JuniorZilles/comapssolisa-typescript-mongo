import { InvalidField } from '@errors/InvalidField'
import { Accessory, Car } from '@models/CarModel'
import CarRepository from '@repositories/CarRepository'
class CarService {

    async create(payload: Car) {
        this.isValidAccessories(payload.acessorios)

        this.isValidYear(payload.ano)
        
        payload.acessorios = this.deDuplicate(payload.acessorios)

        return await CarRepository.create(payload)
    }

    isValidAccessories(acessories:Accessory[]){
        if (acessories.length == 0) {
            throw new InvalidField('acessorios')
        }
    }

    isValidYear(year:Number){
        if (year < 1950 || year > 2022) {
            throw new InvalidField('ano')
        }
    }

    deDuplicate(list: Accessory[]): Accessory[] {
        return list.filter((elem, index, arr) => arr.findIndex((t) => (
            t.descricao === elem.descricao)) === index)
    }

    getById() { }

    list() { }

    delete() { }

    update() { }
}

export default new CarService()