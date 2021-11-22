import faker from 'faker';
import { factory } from 'factory-girl';
import RentalCarModel from '@models/RentalFleetModel';
import { Rental } from '@interfaces/rental/Rental';
import Car from '@interfaces/car/Car';
import rentalFactory from './RentalFactory';
import carFactory from './CarFactory';

factory.define('RentalFleet', RentalCarModel, {
  id_carro: factory.sequence(async () => {
    const generatedCar = await carFactory.create<Car>('Car');
    return generatedCar._id?.toString() as string;
  }),
  status: factory.sequence(() => faker.random.arrayElement(['disponível', 'indisponível'])),
  valor_diaria: factory.sequence(() => faker.datatype.float({ max: 300, min: 50 })),
  id_locadora: factory.sequence(async () => {
    const generatedRental = await rentalFactory.create<Rental>('Rental');
    return generatedRental._id?.toString() as string;
  }),
  placa: factory.sequence(() => faker.vehicle.vrm())
});
export default factory;
