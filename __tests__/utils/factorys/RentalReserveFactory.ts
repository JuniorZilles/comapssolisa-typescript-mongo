import faker from 'faker';
import { factory } from 'factory-girl';
import RentalReserveModel from '@models/RentalReserveModel';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { Rental } from '@interfaces/rental/Rental';
import { Person } from '@interfaces/people/Person';
import rentalFactory from './RentalFactory';
import personFactory from './PeopleFactory';
import fleetFactory from './RentalFleetFactory';

factory.define('RentalReserve', RentalReserveModel, {
  id_user: factory.sequence(async () => {
    const user = await personFactory.create<Person>('People');
    return user._id?.toString() as string;
  }),
  id_carro: factory.sequence(async () => {
    const generatedCar = await fleetFactory.create<RentalFleet>('Car');
    return generatedCar._id?.toString() as string;
  }),
  valor_final: factory.sequence(() => faker.datatype.float({ max: 300, min: 50 })),
  id_locadora: factory.sequence(async () => {
    const generatedRental = await rentalFactory.create<Rental>('Rental');
    return generatedRental._id?.toString() as string;
  }),
  data_inicio: factory.sequence(() => faker.datatype.datetime()),
  data_fim: factory.sequence(() => faker.datatype.datetime())
});
export default factory;
