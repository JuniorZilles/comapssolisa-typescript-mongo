import { Rental } from '@interfaces/rental/Rental';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
    immutable: true
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
});
RentalSchema.plugin(mongoosePaginate);
RentalSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});
export default mongoose.model<Rental>('Rental', RentalSchema);
