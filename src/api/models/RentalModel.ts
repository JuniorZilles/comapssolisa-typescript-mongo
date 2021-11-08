import mongoose from 'mongoose';
import { Model } from './Model';

const RentalSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cnpj: { type: String, required: true, unique: true },
  atividades: { type: String, required: true },
  endereco: [
    {
      cep: {
        type: String,
        required: true
      },
      number: {
        type: String,
        required: true
      },
      complemento: {
        type: String,
        required: false
      },
      bairro: {
        type: String,
        required: true
      },
      localidade: {
        type: String,
        required: true
      },
      logradouro: {
        type: String,
        required: true
      },
      uf: {
        type: String,
        required: true
      },
      isFilial: {
        type: Boolean,
        required: true
      }
    }
  ],
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

export default Model('Rental', RentalSchema);
