import faker from 'faker'
import { factory } from 'factory-girl'
import  PersonModel  from '@models/PersonModel'

factory.define('People', PersonModel,{
    nome: faker.name.findName(),
    cpf: '131.147.860-49',
    data_nascimento: faker.datatype.datetime(),
    email: faker.internet.email(),
    senha:  faker.internet.password(),
    habilitado: faker.random.arrayElement(['sim', 'não']),
})
export default factory