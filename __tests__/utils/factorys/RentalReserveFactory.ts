import faker from 'faker';
import { factory } from 'factory-girl';
import RentalReserveModel from '@models/RentalReserveModel';

factory.define('RentalReserve', RentalReserveModel, {
  id_user: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  id_carro: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  valor_final: factory.sequence(() => faker.random.alphaNumeric()),
  id_locadora: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  data_inicio: factory.sequence(() => faker.datatype.datetime()),
  data_fim: factory.sequence(() => faker.datatype.datetime())
});
export default factory;
