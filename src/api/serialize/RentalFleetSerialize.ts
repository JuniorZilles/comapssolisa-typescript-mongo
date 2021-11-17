import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { Paginate } from '@interfaces/Paginate';
import RentalFleets from '@interfaces/rental/fleet/RentalFleets';

export const serializeRentalFleet = ({ _id, id_listagem, id_locadora }: RentalFleet): RentalFleet => {
  return {
    _id,
    id_listagem,
    id_locadora
  };
};

export const paginateRentalFleet = ({ docs, offsets, total, offset, limit }: Paginate<RentalFleet>): RentalFleets => {
  return {
    reservas: docs.map(serializeRentalFleet),
    offsets,
    total,
    offset,
    limit
  };
};
