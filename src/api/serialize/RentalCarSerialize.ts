import { RentalCar } from '@interfaces/rental/car/RentalCar';
import RentalCars from '@interfaces/rental/car/RentalCars';
import { Paginate } from '@interfaces/Paginate';

export const serializeRentalCar = ({
  _id,
  id_carro,
  status,
  id_locacao,
  valor_diaria,
  id_locadora,
  placa
}: RentalCar): RentalCar => {
  return {
    _id,
    id_carro,
    status,
    id_locacao,
    valor_diaria,
    id_locadora,
    placa
  };
};

export const paginateRentalCar = ({ docs, offsets, total, offset, limit }: Paginate<RentalCar>): RentalCars => {
  return {
    frota: docs.map(serializeRentalCar),
    offsets,
    total,
    offset,
    limit
  };
};
