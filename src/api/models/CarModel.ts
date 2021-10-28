/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

export interface Accessory {
  descricao: String
}

export interface Car {
  id?: string
  modelo: string
  cor: string
  ano: Number
  acessorios: Accessory[]
  quantidadePassageiros: Number
  dataCriacao?: Date
  dataAtualizacao?: Date
}

const CarSchema = new mongoose.Schema({
  modelo: { type: String, required: true },
  cor: { type: String, required: true },
  ano: { type: Number, required: true },
  acessorios: { type: Array, required: true },
  quantidadePassageiros: { type: Number, required: true },
  dataCriacao: { type: Date, default: Date.now, immutable: true },
  dataAtualizacao: { type: Date, default: Date.now },
});

CarSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});

const CarModel = mongoose.model<Car>('Car', CarSchema);

export const isValid = (id: string) => mongoose.isValidObjectId(id);

export default CarModel;
