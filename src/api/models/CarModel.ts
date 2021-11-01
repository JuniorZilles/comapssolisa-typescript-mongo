/* eslint-disable no-underscore-dangle */
import Car from '@interfaces/Car';
import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  modelo: { type: String, required: true },
  cor: { type: String, required: true },
  ano: { type: Number, required: true },
  acessorios: [{
    descricao: {
      type: String,
      required: true,
    },
  }],
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
