export interface RentalReserve {
  _id?: string;
  id_user: string;
  data_inicio: string;
  data_fim: string;
  id_carro: string;
  id_locadora: string;
  valor_final?: number;
}
