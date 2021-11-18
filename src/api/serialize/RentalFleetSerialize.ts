import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import RentalFleets from '@interfaces/rental/fleet/RentalFleets';
import { Paginate } from '@interfaces/Paginate';

export const serializeRentalCar = ({
  _id,
  id_carro,
  status,
  valor_diaria,
  id_locadora,
  placa
}: RentalFleet): RentalFleet => {
  return {
    _id,
    id_carro,
    status,
    valor_diaria,
    id_locadora,
    placa
  };
};

export const paginateRentalCar = ({ docs, offsets, total, offset, limit }: Paginate<RentalFleet>): RentalFleets => {
  return {
    frota: docs.map(serializeRentalCar),
    offsets,
    total,
    offset,
    limit
  };
};
