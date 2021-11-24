import faker from 'faker';
import { factory } from 'factory-girl';
import RentalReserveModel from '@models/RentalReserveModel';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { Rental } from '@interfaces/rental/Rental';
import { Person } from '@interfaces/people/Person';
import moment from 'moment';
import rentalFactory from './RentalFactory';
import personFactory from './PeopleFactory';
import fleetFactory from './RentalFleetFactory';

factory.define('RentalReserve', RentalReserveModel, {
  id_user: factory.sequence(async () => {
    const user = await personFactory.create<Person>('People');
    return user._id?.toString() as string;
  }),
  id_locadora: factory.sequence(async () => {
    const generatedRental = await rentalFactory.create<Rental>('Rental');
    return generatedRental._id?.toString() as string;
  }),
  id_carro: factory.sequence(async () => {
    const generatedCar = await fleetFactory.create<RentalFleet>('RentalFleet');
    return generatedCar._id?.toString() as string;
  }),
  valor_final: factory.sequence(() => faker.datatype.float({ max: 300, min: 50 })),
  data_inicio: factory.sequence(() => moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss')),
  data_fim: factory.sequence(() =>
    moment()
      .add(faker.datatype.number({ max: 50, min: 4 }), 'days')
      .format('YYYY-MM-DD HH:mm:ss')
  )
});
export default factory;
