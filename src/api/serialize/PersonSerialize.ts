import { Paginate } from '@interfaces/Paginate';
import People from '@interfaces/people/People';
import { Person } from '@interfaces/people/Person';
import moment from 'moment';

export const serializePerson = ({
  _id,
  nome,
  cpf,
  data_nascimento,
  email,
  habilitado
}: Person): {
  _id: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  email: string;
  habilitado: string;
} => {
  return {
    _id: _id as string,
    nome,
    cpf,
    data_nascimento: moment(data_nascimento).format('DD/MM/YYYY'),
    email,
    habilitado
  };
};

export const paginatePerson = ({ docs, offsets, total, offset, limit }: Paginate<Person>): People => {
  return {
    pessoas: docs.map(serializePerson),
    offsets,
    total,
    offset,
    limit
  };
};
