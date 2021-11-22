import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
// check habilitacao
// calculate price
// check if car is available
// check dates
export const validateOnCreateRentalReserve = async (fleet: RentalReserve): Promise<void> => {
  // await checkIfExistsPlate(fleet, fleet.id_locadora as string);
};
export const validateOnUpdateRentalReserve = async (idReserve: string, fleet: RentalReserve): Promise<void> => {
  // await checkIfExistsPlate(fleet, fleet.id_locadora as string, idReserve);
};
