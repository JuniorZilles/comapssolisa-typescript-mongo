export interface RentalReserve {
  _id?: string;
  id_user?: string;
  data_inicio: string | Date;
  data_fim: string | Date;
  id_carro: string;
  id_locadora?: string;
  valor_final?: number | string;
}
