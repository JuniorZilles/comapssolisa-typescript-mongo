import InvalidValue from '@errors/InvalidValue';
import { Person } from '@interfaces/Person';
import PeopleRepository from '@repositories/PeopleRepository';
import validateCPF from '@utils/CpfValidation';

const checkCpf = ({ cpf }): void => {
  if (!validateCPF(cpf)) {
    throw new InvalidValue('Bad Request', `CPF ${cpf} is invalid`, true);
  }
};

const checkIfIsValid = (result: Person, cpf: string, email: string): void => {
  if (result.cpf === cpf) {
    throw new InvalidValue('Conflict', `CPF ${cpf} already in use`, true);
  } else if (result.email === email) {
    throw new InvalidValue('Conflict', `Email ${email} already in use`, true);
  }
};

const checkIfExistsEmailOrCpf = async (
  email: string,
  cpf: string,
  id: string | undefined = undefined
): Promise<void> => {
  const result = await PeopleRepository.getUserEmailOrCpf(email, cpf, id);
  if (result) {
    if (result.id !== id) {
      checkIfIsValid(result, cpf, email);
    }
  }
};

export const validateOnCreatePerson = async (person: Person): Promise<void> => {
  checkCpf(person);
  await checkIfExistsEmailOrCpf(person.email, person.cpf);
};
export const validateOnUpdatePerson = async (person: Person, id: string): Promise<void> => {
  checkCpf(person);
  await checkIfExistsEmailOrCpf(person.email, person.cpf, id);
};
