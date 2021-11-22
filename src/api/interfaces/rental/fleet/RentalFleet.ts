export interface RentalFleet {
  _id?: string;
  id_carro: string;
  status: string;
  valor_diaria: number | string;
  id_locadora: string;
  placa: string;
}
