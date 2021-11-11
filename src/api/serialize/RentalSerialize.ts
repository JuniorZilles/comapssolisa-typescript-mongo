import { Endereco } from '@interfaces/Endereco';
import { Paginate } from '@interfaces/Paginate';
import { Rental } from '@interfaces/Rental';
import Rentals from '@interfaces/Rentals';

export const serializeAddress = ({
  _id,
  number,
  isFilial,
  cep,
  logradouro,
  complemento,
  bairro,
  localidade,
  uf
}: Endereco): Endereco => {
  return {
    _id,
    number,
    isFilial,
    cep,
    logradouro,
    complemento,
    bairro,
    localidade,
    uf
  };
};

export const serializeRental = ({ _id, nome, cnpj, atividades, endereco }: Rental): Rental => {
  return {
    _id,
    nome,
    cnpj,
    atividades,
    endereco: endereco.map(serializeAddress)
  };
};

export const paginateRental = ({ docs, offsets, total, offset, limit }: Paginate<Rental>): Rentals => {
  return {
    locadoras: docs.map(serializeRental),
    offsets,
    total,
    offset,
    limit
  };
};
