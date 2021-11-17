import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { Paginate } from '@interfaces/Paginate';
import RentalReserves from '@interfaces/rental/reserve/RentalReserves';

export const serializeRentalReserve = ({
  _id,
  id_user,
  data_inicio,
  data_fim,
  id_carro,
  id_locadora,
  valor_final
}: RentalReserve): RentalReserve => {
  return {
    _id,
    id_user,
    data_inicio,
    data_fim,
    id_carro,
    id_locadora,
    valor_final
  };
};

export const paginateRentalReserve = ({
  docs,
  offsets,
  total,
  offset,
  limit
}: Paginate<RentalReserve>): RentalReserves => {
  return {
    reservas: docs.map(serializeRentalReserve),
    offsets,
    total,
    offset,
    limit
  };
};
