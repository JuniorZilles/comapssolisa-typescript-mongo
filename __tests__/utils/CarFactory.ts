import faker from 'faker'
import { factory } from 'factory-girl'
import  Car  from '@models/CarModel'

factory.define('Car', Car,{
    modelo: faker.vehicle.model(),
    cor: faker.vehicle.color(),
    ano: faker.date.past().getFullYear(),
    acessorios: [{descricao: faker.vehicle.fuel}],
    quantidadePassageiros: faker.datatype.number(5)
})
export default factory