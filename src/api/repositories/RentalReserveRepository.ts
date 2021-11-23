import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { RentalReserveSearch } from '@interfaces/rental/reserve/RentalReserveSearch';
import rentalReserveModel from '@models/RentalReserveModel';
import Repository from './Repository';

class RentalReserveRepository extends Repository<RentalReserveSearch, RentalReserve> {
  constructor() {
    super(rentalReserveModel);
  }

  async findCarByRentalCarAndDate(
    id_locadora: string,
    id_carro: string,
    data_inicio: Date,
    data_fim: Date,
    idReserve?: string
  ): Promise<RentalReserve> {
    let query = {
      id_locadora,
      $or: [
        { id_carro },
        { data_inicio: { $lte: data_inicio }, data_fim: { $gte: data_fim } },
        { data_inicio: { $lte: data_inicio }, data_fim: { $lte: data_fim } },
        { data_inicio: { $lte: data_inicio }, data_fim },
        { data_inicio: { $gte: data_inicio }, data_fim: { $gte: data_fim } },
        { data_inicio: { $gte: data_inicio }, data_fim: { $lte: data_fim } },
        { data_inicio: { $gte: data_inicio }, data_fim },
        { data_inicio, data_fim: { $gte: data_fim } },
        { data_inicio, data_fim: { $lte: data_fim } },
        { data_inicio, data_fim }
      ]
    };
    if (idReserve) {
      query = Object.assign(query, { _id: { $ne: idReserve } });
    }
    const result = await rentalReserveModel.findOne(query);
    return result as RentalReserve;
  }
}

export default new RentalReserveRepository();
