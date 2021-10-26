import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import {PersonCreateModel} from './PersonCreateModel'

const PersonSchema = new mongoose.Schema({
    nome: {type: String, required:true },
    cpf: {type: String, required:true},
    data_nascimento: {type: Date, required:true },
    email: {type: String, required:true,  lowercase: true },
    senha:  {type: String, required:true, select:false },
    habilitado:  {type: String, required:true,  enum: ['sim', 'não'] },
    dataCriacao: { type: Date, default: Date.now }
})
//unique: true,
PersonSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.senha, 10)
    this.senha = hash
    next()
})

const PersonModel = mongoose.model<PersonCreateModel>('People', PersonSchema)

export const isValid = (id: string) => {
    return mongoose.isValidObjectId(id)
}

export default PersonModel