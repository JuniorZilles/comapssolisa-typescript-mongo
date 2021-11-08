import faker from 'faker';
import { factory } from 'factory-girl';
import Car from '@models/CarModel';

factory.define('Car', Car, {
  modelo: factory.sequence(() => faker.vehicle.model()),
  cor: factory.sequence(() => faker.vehicle.color()),
  ano: factory.sequence(() => faker.date.past().getFullYear()),
  acessorios: [{ descricao: factory.sequence(() => faker.vehicle.fuel()) }],
  quantidadePassageiros: factory.sequence(() => faker.datatype.number(5))
});
export default factory;
