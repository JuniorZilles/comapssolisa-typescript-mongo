import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { Paginate } from '@interfaces/Paginate';
import RentalReserves from '@interfaces/rental/reserve/RentalReserves';
import moment from 'moment';

export const serializeRentalReserve = ({
  _id,
  id_user,
  data_inicio,
  data_fim,
  id_carro,
  id_locadora,
  valor_final
}: RentalReserve): RentalReserve => {
  const value = new Intl.NumberFormat('pt-BR').format(valor_final as number);
  return {
    _id,
    id_user,
    data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
    data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
    id_carro,
    id_locadora,
    valor_final: value
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
