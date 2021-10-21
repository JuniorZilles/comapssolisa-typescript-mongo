import mongoose from 'mongoose'
import {PersonCreateModel} from './PersonCreateModel'

const PersonSchema = new mongoose.Schema({
    nome: {type: String, required:true },
    cpf: {type: String, required:true },
    data_nascimento: {type: Date, required:true },
    email: {type: String, required:true },
    senha:  {type: String, required:true },
    habilitado:  {type: String, required:true },
    dataCriacao: { type: Date, default: Date.now }
})

const PersonModel = mongoose.model<PersonCreateModel>('People', PersonSchema)

export const isValid = (id: string) => {
    return mongoose.isValidObjectId(id)
}

export default PersonModel