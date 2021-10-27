import faker from 'faker';
import { factory } from 'factory-girl';
import PersonModel from '@models/PersonModel';

factory.define('People', PersonModel, {
  nome: faker.name.findName(),
  cpf: `${faker.datatype.number({ max: 999, min: 100 })}.${faker.datatype.number({ max: 999, min: 100 })}.${faker.datatype.number({ max: 999, min: 100 })}-${faker.datatype.number({ max: 99, min: 10 })}`,
  data_nascimento: faker.datatype.datetime(),
  email: faker.internet.email(),
  senha: faker.internet.password(),
  habilitado: faker.random.arrayElement(['sim', 'não']),
});
export default factory;
