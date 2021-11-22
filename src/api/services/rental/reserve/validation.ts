import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { UserInfo } from '@interfaces/UserInfo';
import RentalFleetRepository from '@repositories/RentalFleetRepository';
import RentalRepository from '@repositories/RentalRepository';
import moment from 'moment';

const checkIfValidRental = async ({ id_locadora }) => {
  const result = await RentalRepository.findById(id_locadora);
  if (result) {
    return true;
  }
  throw new NotFound(`id_locadora: ${id_locadora}`);
};

const checkIfValidCar = async ({ id_carro }) => {
  const result = await RentalFleetRepository.findById(id_carro);
  if (result) {
    return true;
  }
  throw new NotFound(`id_carro: ${id_carro}`);
};

const checkDays = ({ data_inicio, data_fim }): void => {
  const before = moment(data_inicio).isBefore(data_fim, 'days');
  if (!before) {
    throw new InvalidValue('data_inicio', 'The field data_inicio should be before data_fim');
  }
};

const checkIfHabilitado = async ({ habilitado, email }) => {
  if (habilitado === 'não') {
    throw new InvalidValue('Bad Request', `user: ${email} is not allowed to reserve a car`);
  }
};

// check if car is available
// check dates
export const validateOnCreateRentalReserve = async (fleet: RentalReserve, userInfo: UserInfo): Promise<void> => {
  checkDays(fleet);
  checkIfHabilitado(userInfo);
  await checkIfValidRental(fleet as { id_locadora: string });
  await checkIfValidCar(fleet);
  // await checkIfExistsPlate(fleet, fleet.id_locadora as string);
};
export const validateOnUpdateRentalReserve = async (
  idReserve: string,
  fleet: RentalReserve,
  userInfo: UserInfo
): Promise<void> => {
  checkDays(fleet);
  checkIfHabilitado(userInfo);

  await checkIfValidRental(fleet as { id_locadora: string });
  await checkIfValidCar(fleet);
  // await checkIfExistsPlate(fleet, fleet.id_locadora as string, idReserve);
};
