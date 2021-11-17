import faker from 'faker';
import { factory } from 'factory-girl';
import Rental from '@models/RentalModel';

factory.define('Rental', Rental, {
  nome: factory.sequence(() => `${faker.company.companyName()}`),
  cnpj: factory.sequence(
    () =>
      `${faker.datatype.number({
        max: 99,
        min: 10
      })}.${faker.datatype.number({
        max: 999,
        min: 100
      })}.${faker.datatype.number({
        max: 999,
        min: 100
      })}/${faker.datatype.number({
        max: 9999,
        min: 1000
      })}-${faker.datatype.number({ max: 99, min: 10 })}`
  ),
  atividades: factory.sequence(() => `${faker.company.catchPhrase()}`),
  endereco: [
    {
      cep: factory.sequence(
        () =>
          `${faker.datatype.number({
            max: 99999,
            min: 10000
          })}-${faker.datatype.number({ max: 999, min: 100 })}`
      ),
      number: factory.sequence(() => `${faker.random.alpha()}`),
      logradouro: factory.sequence(() => `${faker.address.streetName()}`),
      complemento: factory.sequence(() => `${faker.address.zipCode()}`),
      uf: factory.sequence(() => `${faker.address.stateAbbr()}`),
      bairro: factory.sequence(() => `${faker.address.secondaryAddress()}`),
      localidade: factory.sequence(() => `${faker.address.cityName()}`),
      isFilial: factory.sequence(() => `${!Math.round(Math.random())}`)
    },
    {
      cep: factory.sequence(
        () =>
          `${faker.datatype.number({
            max: 99999,
            min: 10000
          })}-${faker.datatype.number({ max: 999, min: 100 })}`
      ),
      logradouro: factory.sequence(() => `${faker.address.streetName()}`),
      uf: factory.sequence(() => `${faker.address.stateAbbr()}`),
      bairro: factory.sequence(() => `${faker.address.secondaryAddress()}`),
      complemento: factory.sequence(() => `${faker.address.zipCode()}`),
      localidade: factory.sequence(() => `${faker.address.cityName()}`),
      number: factory.sequence(() => `${faker.random.alpha()}`),
      isFilial: factory.sequence(() => `${!Math.round(Math.random())}`)
    }
  ]
});
export default factory;
