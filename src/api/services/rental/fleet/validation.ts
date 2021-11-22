import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import CarRepository from '@repositories/CarRepository';
import RentalFleetRepository from '@repositories/RentalFleetRepository';
import RentalRepository from '@repositories/RentalRepository';

const checkIfIsValidPlate = (result: RentalFleet, plate: string): void => {
  if (result.placa === plate) {
    throw new InvalidValue('Conflict', `placa ${plate} already in use`);
  }
};

const checkifValidRental = async ({ id_locadora }) => {
  const result = await RentalRepository.findById(id_locadora);
  if (result) {
    return true;
  }
  throw new NotFound(`id_locadora: ${id_locadora}`);
};

const checkifValidCar = async ({ id_carro }) => {
  const result = await CarRepository.findById(id_carro);
  if (result) {
    return true;
  }
  throw new NotFound(`id_carro: ${id_carro}`);
};

const checkIfExistsPlate = async (
  { placa }: { placa: string },
  id: string,
  idFleet: string | undefined = undefined
): Promise<void> => {
  const result = await RentalFleetRepository.validatePlate(placa);
  if (result && result.id_locadora !== id && result._id !== idFleet) {
    checkIfIsValidPlate(result, placa);
  }
};

export const validateOnCreateRentalFleet = async (fleet: RentalFleet): Promise<void> => {
  await checkifValidRental(fleet as { id_locadora: string });
  await checkifValidCar(fleet);
  await checkIfExistsPlate(fleet, fleet.id_locadora as string);
};
export const validateOnUpdateRentalFleet = async (idFleet: string, fleet: RentalFleet): Promise<void> => {
  await checkifValidCar(fleet);
  await checkIfExistsPlate(fleet, fleet.id_locadora as string, idFleet);
};
