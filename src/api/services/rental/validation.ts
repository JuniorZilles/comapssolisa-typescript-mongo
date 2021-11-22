import InvalidValue from '@errors/InvalidValue';
import { Endereco } from '@interfaces/rental/Endereco';
import { Rental } from '@interfaces/rental/Rental';
import RentalRepository from '@repositories/RentalRepository';
import validateCNPJ from '@utils/CnpjValidation';

export const checkIfExistsMoreThanOneFilial = (addresses: Endereco[]): void => {
  const indexes = addresses.filter((address) => {
    return address.isFilial === false;
  });
  if (indexes.length > 1) {
    throw new InvalidValue('Bad Request', `isFilial has more than one headquarters`);
  }
};

const checkIfIsValidCNPJ = (result: Rental, cnpj: string): void => {
  if (result.cnpj === cnpj) {
    throw new InvalidValue('Conflict', `CNPJ ${cnpj} already in use`);
  }
};

export const checkIfExistsCNPJ = async (cnpj: string, id: string | undefined = undefined): Promise<void> => {
  const result = await RentalRepository.getRentalByCNPJ(cnpj, id);
  if (result) {
    if (result.id !== id) {
      checkIfIsValidCNPJ(result, cnpj);
    }
  }
};

const checkIfValidCNPJ = ({ cnpj }: { cnpj: string }): void => {
  if (!validateCNPJ(cnpj)) {
    throw new InvalidValue('Bad Request', `CNPJ ${cnpj} is invalid`);
  }
};

export const validateOnCreateRental = async (rental: Rental): Promise<void> => {
  checkIfValidCNPJ(rental);
  await checkIfExistsCNPJ(rental.cnpj);
  await checkIfExistsMoreThanOneFilial(rental.endereco);
};
export const validateOnUpdateRental = async (rental: Rental, id: string): Promise<void> => {
  checkIfValidCNPJ(rental);
  await checkIfExistsCNPJ(rental.cnpj, id);
  await checkIfExistsMoreThanOneFilial(rental.endereco);
};
