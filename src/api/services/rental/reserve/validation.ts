import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { UserInfo } from '@interfaces/UserInfo';
import RentalFleetRepository from '@repositories/RentalFleetRepository';
import RentalReserveRepository from '@repositories/RentalReserveRepository';
import RentalRepository from '@repositories/RentalRepository';
import moment from 'moment';

const checkIfValidRental = async ({ id_locadora }: RentalReserve) => {
  const result = await RentalRepository.findById(id_locadora as string);
  if (result) {
    return true;
  }
  throw new NotFound(`id_locadora: ${id_locadora}`);
};

const checkIfValidCar = async ({ id_carro }: RentalReserve) => {
  const result = await RentalFleetRepository.findById(id_carro);
  if (result) {
    return true;
  }
  throw new NotFound(`id_carro: ${id_carro}`);
};

const checkDays = ({ data_inicio, data_fim }: RentalReserve): void => {
  const before = moment(data_inicio).isBefore(data_fim, 'days');
  if (!before) {
    throw new InvalidValue('data_inicio', 'The field data_inicio should be before data_fim');
  }
};

const checkIfAlreadyReserved = async (
  { id_locadora, id_carro, id_user, data_inicio, data_fim }: RentalReserve,
  idReserve?: string
) => {
  const result = await RentalReserveRepository.findCarByRentalCarAndDate(
    id_locadora as string,
    id_carro,
    data_inicio as Date,
    data_fim as Date,
    idReserve
  );
  if (result && result._id?.toString() !== idReserve && result.id_user?.toString() !== id_user) {
    throw new InvalidValue('Conflict', `Car: ${id_carro} is already reserved in this date`);
  } else if (result && result._id?.toString() !== idReserve && result.id_user?.toString() === id_user) {
    throw new InvalidValue('Conflict', `User: ${id_user} is already reserved in this date`);
  }
};

const checkIfHabilitado = ({ habilitado, email }: UserInfo) => {
  if (habilitado === 'não') {
    throw new InvalidValue('Bad Request', `User: ${email} is not allowed to reserve a car`);
  }
};

export const validateOnCreateRentalReserve = async (fleet: RentalReserve, userInfo: UserInfo): Promise<void> => {
  checkDays(fleet);
  checkIfHabilitado(userInfo);
  await checkIfValidRental(fleet);
  await checkIfValidCar(fleet);
  await checkIfAlreadyReserved(fleet);
};
export const validateOnUpdateRentalReserve = async (
  idReserve: string,
  fleet: RentalReserve,
  userInfo: UserInfo
): Promise<void> => {
  checkDays(fleet);
  checkIfHabilitado(userInfo);
  await checkIfValidRental(fleet);
  await checkIfValidCar(fleet);
  await checkIfAlreadyReserved(fleet, idReserve);
};
