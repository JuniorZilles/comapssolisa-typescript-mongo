import NotFound from '@errors/NotFound';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { RentalReserveSearch } from '@interfaces/rental/reserve/RentalReserveSearch';
import { UserInfo } from '@interfaces/UserInfo';
import RentalFleetRepository from '@repositories/RentalFleetRepository';
import RentalReserveRepository from '@repositories/RentalReserveRepository';
import { toDate, toISOString, toNumber } from '@utils/transform';
import moment from 'moment';
import { validateOnCreateRentalReserve, validateOnUpdateRentalReserve } from './validation';

class RentalReserveService {
  async create(id: string, payload: RentalReserve, userInfo: UserInfo) {
    payload.id_locadora = id;
    payload.id_user = userInfo.id;
    payload.data_inicio = toDate(payload.data_inicio as string);
    payload.data_fim = toDate(payload.data_fim as string);
    await validateOnCreateRentalReserve(payload, userInfo);
    payload.valor_final = await this.calculatePrice(id, payload);
    const result = await RentalReserveRepository.create(payload);
    return result;
  }

  private async calculatePrice(id: string, payload: RentalReserve): Promise<number> {
    const car = await RentalFleetRepository.getByIdFleet(id, payload.id_carro);
    return (car.valor_diaria as number) * this.getReserveDays(payload.data_inicio as Date, payload.data_fim as Date);
  }

  private getReserveDays(ini: Date, fim: Date): number {
    return moment(ini).diff(fim, 'days', false);
  }

  async update(id: string, idReserve: string, payload: RentalReserve, userInfo: UserInfo) {
    payload.id_locadora = id;
    payload.id_user = userInfo.id;
    payload.data_inicio = toDate(payload.data_inicio as string);
    payload.data_fim = toDate(payload.data_fim as string);
    await validateOnUpdateRentalReserve(idReserve, payload, userInfo);
    payload.valor_final = await this.calculatePrice(id, payload);
    const result = await RentalReserveRepository.updateReserve(id, idReserve, payload);
    this.checkIfIsDefined(result, id, idReserve);
    return result;
  }

  private checkIfIsDefined(result: RentalReserve, id: string, idReserve: string): void {
    if (!result) {
      throw new NotFound(`id: ${id} - idReserve: ${idReserve}`);
    }
  }

  async delete(id: string, idReserve: string) {
    const result = await RentalReserveRepository.deleteReserve(id, idReserve);
    this.checkIfIsDefined(result, id, idReserve);
    return result;
  }

  async getById(id: string, idReserve: string) {
    const result = await RentalReserveRepository.findReserveById(id, idReserve);
    this.checkIfIsDefined(result, id, idReserve);
    return result;
  }

  async getAll(id: string, payload: RentalReserveSearch) {
    payload.id_locadora = id;
    if (payload.data_fim) {
      payload.data_fim = toISOString(payload.data_fim as string);
    }
    if (payload.data_inicio) {
      payload.data_inicio = toISOString(payload.data_inicio as string);
    }
    if (payload.valor_final) {
      payload.valor_final = toNumber(payload.valor_final as string);
    }
    const result = await RentalReserveRepository.findAll(payload);
    return result;
  }
}

export default new RentalReserveService();
