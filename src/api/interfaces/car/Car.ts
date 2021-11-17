import Accessory from './Accessory';

export default interface Car {
  _id?: string;
  modelo: string;
  cor: string;
  ano: number;
  acessorios: Accessory[];
  quantidadePassageiros: number;
}
