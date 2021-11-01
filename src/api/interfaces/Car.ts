import Accessory from './Accessory';

export default interface Car {
  id?: string
  modelo: string
  cor: string
  ano: Number
  acessorios: Accessory[]
  quantidadePassageiros: Number
  dataCriacao?: Date
  dataAtualizacao?: Date
}
