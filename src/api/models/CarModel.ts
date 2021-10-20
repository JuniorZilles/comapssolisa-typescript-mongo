import mongoose from 'mongoose'

export interface Accessory {
    descricao: String
}

export interface Car {
    id?:String
    modelo: String
    cor: String
    ano: Number
    acessorios: Accessory[]
    quantidadePassageiros: Number,
    dataCriacao?:Date
        
}

const CarSchema = new mongoose.Schema({
    modelo: String,
    cor: String,
    ano: Number,
    acessorios: Array,
    quantidadePassageiros: Number,
    dataCriacao: {type: Date, default: Date.now}
})

const CarModel = mongoose.model<Car>('Car', CarSchema);

export default CarModel;
