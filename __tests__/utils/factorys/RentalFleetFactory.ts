import faker from 'faker';
import { factory } from 'factory-girl';
import RentalFleetModel from '@models/RentalFleetModel';

factory.define('RentalFleet', RentalFleetModel, {
  id_listagem: factory.sequence(() => faker.datatype.hexaDecimal(24)),
  id_locadora: factory.sequence(() => faker.datatype.hexaDecimal(24))
});
export default factory;
