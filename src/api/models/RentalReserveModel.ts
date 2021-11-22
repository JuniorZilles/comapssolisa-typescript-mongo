import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const RentalReserveSchema = new mongoose.Schema({
  id_user: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  id_carro: { type: Schema.Types.ObjectId, ref: 'RentalCar', required: true },
  id_locadora: { type: Schema.Types.ObjectId, ref: 'Rental', required: true },
  data_fim: {
    type: Date,
    required: true
  },
  data_inicio: {
    type: Date,
    required: true
  },
  valor_final: { type: Number, required: true },
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
RentalReserveSchema.plugin(mongoosePaginate);
RentalReserveSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});
export default mongoose.model<RentalReserve>('RentalReserve', RentalReserveSchema);
