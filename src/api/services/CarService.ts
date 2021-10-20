import { InvalidField } from '@errors/InvalidField'
import { Car } from '@models/CarModel'
import CarRepository from '@repositories/CarRepository'
class CarService {

    async create(payload: Car) {
        if(payload.acessorios.length == 0){
            throw new InvalidField('acessorios')
        }
        const car = await CarRepository.create(payload)
        return car
    }

    getById() { }

    list() { }

    delete() { }

    update() { }
}

export default new CarService()