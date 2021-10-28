/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { PersonCreateModel } from './PersonCreateModel';

const PersonSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true },
  data_nascimento: {
    type: Date,
    required: true,
    transform: (val:Date) => moment(val).format('DD/MM/YYYY'),
  },
  email: {
    type: String, required: true, lowercase: true,
  },
  senha: { type: String, required: true, select: false },
  habilitado: { type: String, required: true, enum: ['sim', 'não'] },
  dataCriacao: { type: Date, default: Date.now, immutable: true },
  dataAtualizacao: { type: Date, default: Date.now, immutable: true },
});

PersonSchema.pre('save', async function onSave(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

PersonSchema.pre('findOneAndUpdate', async function onSave(next) {
  const docToUpdate = this._update;
  docToUpdate.senha = await bcrypt.hash(docToUpdate.senha, 10);
  docToUpdate.dataAtualizacao = new Date();
  next();
});

const PersonModel = mongoose.model<PersonCreateModel>('People', PersonSchema);

export const isValid = (id: string) => mongoose.isValidObjectId(id);

export default PersonModel;
