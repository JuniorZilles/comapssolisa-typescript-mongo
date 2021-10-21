import request from "supertest"
import CarModel, { Car } from "@models/CarModel"
import factory from '../utils/CarFactory'
import MongoDatabase from "../../src/infra/mongo/index"
import app from '../../src/app'

const PREFIX = '/api/v1/car'
const carData = {
    modelo: "GM S10 2.8",
    cor: "Verde",
    ano: 2021, 
    acessorios: [ { descricao: "Ar-condicionado" }],
    quantidadePassageiros: 5
}
describe("src :: api :: controllers :: car", () => {
    beforeAll(async () => {
        await CarModel.deleteMany()
    })
    afterAll(async () => {
        await MongoDatabase.disconect()
    })
    afterEach(async () => {
        await CarModel.deleteMany()
    })

    it("should create a car", async () => {
        const response = await request(app)
            .post(PREFIX)
            .send(carData)

        const car = response.body
        
        expect(response.status).toBe(201)
        expect(car._id).toBeDefined()
        expect(car.dataCriacao).toBeDefined()
        expect(car.acessorios.length).toEqual(1)
        expect(car.ano).toBe(carData.ano)
        expect(car.cor).toBe(carData.cor)
        expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros)
    })

    it("should have at least one accessory", async () => {
            const temp = {
                modelo: "GM S10 2.8",
                cor: "Verde",
                ano: 2021, 
                acessorios: [ ],
                quantidadePassageiros: 5
            }
            const response = await request(app)
            .post(PREFIX)
            .send(temp)
            const value = response.body
            expect(response.status).toBe(400)
            expect(value.message).toBe("O campo 'acessorios' está fora do formato padrão")  
    })

    it("the year should not be greater than 2022", async () => {
        const temp = {
            modelo: "GM S10 2.8",
            cor: "Verde",
            ano: 2023, 
            acessorios: [ { descricao: "Ar-condicionado" }],
            quantidadePassageiros: 5
        }
        const response = await request(app)
        .post(PREFIX)
        .send(temp)
        
        
        const value = response.body
        expect(response.status).toBe(400)
        expect(value.message).toBe("O campo 'ano' está fora do formato padrão")
    })

    it("the year should not be least than 1950", async () => {
        const temp = {
            modelo: "GM S10 2.8",
            cor: "Verde",
            ano: 1949, 
            acessorios: [ { descricao: "Ar-condicionado" }],
            quantidadePassageiros: 5
        }
        const response = await request(app)
        .post(PREFIX)
        .send(temp)
        
        
        const value = response.body
        expect(response.status).toBe(400)
        expect(value.message).toBe("O campo 'ano' está fora do formato padrão")
    })

    it("should include just one if duplicated accessory", async () => {
        const temp = {
            modelo: "GM S10 2.8",
            cor: "Verde",
            ano: 2021, 
            acessorios: [{ descricao: "Ar-condicionado" }, { descricao: "Ar-condicionado" }],
            quantidadePassageiros: 5
        }
        const response = await request(app)
        .post(PREFIX)
        .send(temp)
        
        const car = response.body
        expect(response.status).toBe(201)
        expect(car._id).toBeDefined()
        expect(car.dataCriacao).toBeDefined()
        expect(car.acessorios.length).toEqual(1)
        expect(car.ano).toBe(carData.ano)
        expect(car.cor).toBe(carData.cor)
        expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros)
    })

    
})