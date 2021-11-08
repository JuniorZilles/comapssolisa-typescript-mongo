/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { Model } from './Model';

const CarSchema = new mongoose.Schema({
  modelo: { type: String, required: true },
  cor: { type: String, required: true },
  ano: { type: Number, min: 1950, max: 2022, required: true },
  acessorios: [
    {
      descricao: {
        type: String,
        required: true
      }
    }
  ],
  quantidadePassageiros: { type: Number, required: true },
  dataCriacao: {
    type: Date,
    default: Date.now,
    immutable: true,
    transform: () => undefined
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now,
    transform: () => undefined
  },
  __v: { type: Number, select: false, transform: () => undefined }
});

CarSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});

export default Model('Car', CarSchema);
