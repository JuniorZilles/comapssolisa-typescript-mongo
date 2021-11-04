import faker from 'faker';
import { factory } from 'factory-girl';
import Rental from '@models/RentalModel';

factory.define('Rental', Rental, {
  nome: factory.sequence(() => `nome${faker.company.companyName()}`),
  cnpj: factory.sequence(
    () =>
      `cnpj${faker.datatype.number({
        max: 99,
        min: 10,
      })}.${faker.datatype.number({
        max: 999,
        min: 100,
      })}.${faker.datatype.number({
        max: 999,
        min: 100,
      })}/${faker.datatype.number({
        max: 9999,
        min: 1000,
      })}-${faker.datatype.number({ max: 99, min: 10 })}`
  ),
  atividades: factory.sequence(
    () => `atividades${faker.company.catchPhrase()}`
  ),
  endereco: [
    {
      cep: factory.sequence(
        () =>
          `cep${faker.datatype.number({
            max: 99999,
            min: 10000,
          })}-${faker.datatype.number({ max: 999, min: 100 })}`
      ),
      number: factory.sequence(() => `number${faker.random.alpha()}`),
      isFilial: factory.sequence(() => `isFilial${!Math.round(Math.random())}`),
    },
    {
      cep: factory.sequence(
        () =>
          `cep${faker.datatype.number({
            max: 99999,
            min: 10000,
          })}-${faker.datatype.number({ max: 999, min: 100 })}`
      ),
      number: factory.sequence(() => `number${faker.random.alpha()}`),
      isFilial: factory.sequence(() => `isFilial${!Math.round(Math.random())}`),
    },
  ],
});
export default factory;
