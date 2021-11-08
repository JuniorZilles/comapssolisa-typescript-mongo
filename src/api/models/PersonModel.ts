import mongoose from 'mongoose';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { Person } from '@interfaces/Person';
import { Model } from './Model';

const PersonSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  data_nascimento: {
    type: Date,
    required: true,
    transform: (val: Date) => moment(val).format('DD/MM/YYYY')
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
    immutable: true,
    transform: () => undefined
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now,
    transform: () => undefined
  },
  __v: { type: Number, transform: () => undefined }
});

PersonSchema.pre('save', async function onSave(next) {
  const hash = await bcrypt.hash(this.senha, 10);
  this.senha = hash;
  next();
});

PersonSchema.pre('findOneAndUpdate', async function onSave(next) {
  this.set('dataAtualizacao', new Date());
  next();
});

export default Model('People', PersonSchema) as mongoose.Model<Person>;
