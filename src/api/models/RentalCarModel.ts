import { RentalCar } from '@interfaces/rental/car/RentalCar';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const RentalCarSchema = new mongoose.Schema({
  id_carro: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  id_locadora: { type: Schema.Types.ObjectId, ref: 'Rental', required: true },
  id_locacao: { type: Schema.Types.ObjectId, ref: 'Rental', required: true },
  status: { type: String, required: true },
  placa: { type: String, required: true },
  valor_diaria: { type: Number, required: true },
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
RentalCarSchema.plugin(mongoosePaginate);
RentalCarSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});
export default mongoose.model<RentalCar>('RentalCar', RentalCarSchema);
