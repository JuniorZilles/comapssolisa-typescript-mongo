import mongoose from 'mongoose'

export interface Accessory {
    descricao: String
}

export interface CarUpdateModel {
    modelo?: string
    cor?: string
    ano?: Number
    acessorios?: Accessory[]
    quantidadePassageiros?: Number
}

export interface Car {
    id?: string
    modelo: string
    cor: string
    ano: Number
    acessorios: Accessory[]
    quantidadePassageiros: Number
    dataCriacao?: Date
}

const CarSchema = new mongoose.Schema({
    modelo: {type: String, required:true },
    cor: {type: String, required:true },
    ano: {type: Number, required:true },
    acessorios: {type: Array, required:true },
    quantidadePassageiros:  {type: Number, required:true },
    dataCriacao: { type: Date, default: Date.now }
})

const CarModel = mongoose.model<Car>('Car', CarSchema)

export const isValid = (id: string) => {
    return mongoose.isValidObjectId(id)
}

export default CarModel

