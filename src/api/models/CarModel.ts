import Car from '@interfaces/car/Car';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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
    immutable: true
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
});
CarSchema.plugin(mongoosePaginate);
CarSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});

export default mongoose.model<Car>('Car', CarSchema);
