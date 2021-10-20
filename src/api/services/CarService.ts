import { InvalidField } from '@errors/InvalidField'
import { Accessory, Car } from '@models/CarModel'
import CarRepository from '@repositories/CarRepository'
class CarService {

    async create(payload: Car) {
        if (payload.acessorios.length == 0) {
            throw new InvalidField('acessorios')
        }
        if (payload.ano < 1950 || payload.ano > 2022) {
            throw new InvalidField('ano')
        }
        
        payload.acessorios = this.deDuplicate(payload.acessorios)

        return await CarRepository.create(payload)
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