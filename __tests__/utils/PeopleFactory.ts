import faker from 'faker';
import { factory } from 'factory-girl';
import PersonModel from '@models/PersonModel';

factory.define('People', PersonModel, {
  nome: factory.sequence(() => faker.name.findName()),
  cpf: factory.sequence(
    () =>
      `${faker.datatype.number({
        max: 999,
        min: 100
      })}.${faker.datatype.number({
        max: 999,
        min: 100
      })}.${faker.datatype.number({
        max: 999,
        min: 100
      })}-${faker.datatype.number({ max: 99, min: 10 })}`
  ),
  data_nascimento: factory.sequence(() => faker.datatype.datetime()),
  email: factory.sequence(() => `${faker.internet.email()}`),
  senha: factory.sequence(() => faker.internet.password()),
  habilitado: faker.random.arrayElement(['sim', 'não'])
});
export default factory;
