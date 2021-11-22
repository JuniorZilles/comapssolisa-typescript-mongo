import NotFound from '@errors/NotFound';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import CarModel from './CarModel';
import RentalModel from './RentalModel';

const RentalFleetSchema = new mongoose.Schema({
  id_carro: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  id_locadora: { type: Schema.Types.ObjectId, ref: 'Rental', required: true },
  status: { type: String, required: true, enum: ['disponível', 'indisponível'] },
  placa: { type: String, required: true, unique: true },
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
RentalFleetSchema.plugin(mongoosePaginate);
RentalFleetSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});

RentalFleetSchema.path('id_carro').validate(async (value) => {
  const result = await CarModel.findById(value);
  if (result) {
    return true;
  }
  throw new NotFound(`id_carro: ${value}`);
});

RentalFleetSchema.path('id_locadora').validate(async (value) => {
  const result = await RentalModel.findById(value);
  if (result) {
    return true;
  }
  throw new NotFound(`id_locadora: ${value}`);
});

export default mongoose.model<RentalFleet>('RentalFleet', RentalFleetSchema);
