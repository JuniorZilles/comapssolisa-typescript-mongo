import faker from 'faker'
import { factory } from 'factory-girl'
import RandExp from 'randexp'
import  PersonModel  from '@models/PersonModel'

factory.define('People', PersonModel,{
    nome: faker.name.findName(),
    cpf: new RandExp(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/),
    data_nascimento: faker.datatype.datetime(),
    email: faker.internet.email(),
    senha:  faker.internet.password(),
    habilitado: faker.random.arrayElement(['sim', 'não']),
})
export default factory