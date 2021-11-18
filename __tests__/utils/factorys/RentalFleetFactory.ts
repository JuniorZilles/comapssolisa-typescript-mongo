import faker from 'faker';
import { factory } from 'factory-girl';
import RentalCarModel from '@models/RentalFleetModel';

factory.define('RentalFleet', RentalCarModel, {
  id_carro: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  status: factory.sequence(() => faker.random.arrayElement(['disponível', 'indisponível'])),
  valor_diaria: factory.sequence(() => faker.random.alphaNumeric()),
  id_locadora: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  placa: factory.sequence(() => faker.vehicle.vrm())
});
export default factory;
