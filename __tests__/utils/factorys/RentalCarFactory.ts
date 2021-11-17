import faker from 'faker';
import { factory } from 'factory-girl';
import RentalCarModel from '@models/RentalCarModel';

factory.define('RentalCar', RentalCarModel, {
  id_carro: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  status: factory.sequence(() => faker.random.arrayElement(['disponível', 'indisponível'])),
  id_locacao: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  valor_diaria: factory.sequence(() => faker.random.alphaNumeric()),
  id_locadora: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  placa: factory.sequence(() => faker.vehicle.vrm())
});
export default factory;
