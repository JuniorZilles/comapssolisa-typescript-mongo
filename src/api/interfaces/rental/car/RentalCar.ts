export interface RentalCar {
  _id?: string;
  id_carro: string;
  status: string;
  id_locacao: string;
  valor_diaria: number | string;
  id_locadora: string;
  placa: string;
}
