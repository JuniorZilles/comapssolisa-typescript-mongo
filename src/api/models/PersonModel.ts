import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Person } from '@interfaces/Person';
import mongoosePaginate from 'mongoose-paginate-v2';

const PersonSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  data_nascimento: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  senha: { type: String, required: true, select: false },
  habilitado: { type: String, required: true, enum: ['sim', 'não'] },
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
PersonSchema.plugin(mongoosePaginate);
PersonSchema.pre('save', async function onSave(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

PersonSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});

export default mongoose.model<Person>('Person', PersonSchema);
