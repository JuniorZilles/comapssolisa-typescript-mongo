import InvalidValue from '@errors/InvalidValue';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import RentalFleetRepository from '@repositories/RentalFleetRepository';

const checkIfIsValidPlate = (result: RentalFleet, plate: string): void => {
  if (result.placa === plate) {
    throw new InvalidValue('Conflict', `placa ${plate} already in use`);
  }
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
  await checkIfExistsPlate(fleet, fleet.id_locadora as string);
};
export const validateOnUpdateRentalFleet = async (idFleet: string, fleet: RentalFleet): Promise<void> => {
  await checkIfExistsPlate(fleet, fleet.id_locadora as string, idFleet);
};
