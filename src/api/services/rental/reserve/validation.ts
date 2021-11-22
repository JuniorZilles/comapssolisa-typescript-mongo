import InvalidValue from '@errors/InvalidValue';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import moment from 'moment';

const checkDays = ({ data_inicio, data_fim }): void => {
  const before = moment(data_inicio).isBefore(data_fim, 'days');
  if (!before) {
    throw new InvalidValue('data_inicio', 'The field data_inicio should be before data_fim');
  }
};

// check habilitacao
// calculate price
// check if car is available
// check dates
export const validateOnCreateRentalReserve = async (fleet: RentalReserve): Promise<void> => {
  checkDays(fleet);
  // await checkIfExistsPlate(fleet, fleet.id_locadora as string);
};
export const validateOnUpdateRentalReserve = async (idReserve: string, fleet: RentalReserve): Promise<void> => {
  checkDays(fleet);
  // await checkIfExistsPlate(fleet, fleet.id_locadora as string, idReserve);
};
