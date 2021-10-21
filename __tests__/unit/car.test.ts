import CarService from "@services/CarService"
import { InvalidField } from "@errors/InvalidField"
import CarModel, { Car } from "@models/CarModel"
import factory from '../utils/CarFactory'
import MongoDatabase from "../../src/infra/mongo/index"

MongoDatabase.connect()

describe("src :: api :: services :: car", () => {
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
        const carData = await factory.create<Car>('Car')
        const car = await CarService.create(carData)
        expect(car.id).toBeDefined()
        expect(car.dataCriacao).toBeDefined()
        expect(car.ano).toBe(carData.ano)
        expect(car.cor).toBe(carData.cor)
        expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros)
    })

    it("should have at least one accessory", async () => {
        try {
            const carData = await factory.create<Car>('Car', {acessorios: []})
            const car = await CarService.create(carData)
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'acessorios' está fora do formato padrão")
        }
    })

    it("the year should not be greater than 2022", async () => {
        try {
            const carData = await factory.create<Car>('Car', {ano: 2023})
            const car = await CarService.create(carData)
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'ano' está fora do formato padrão")
        }
    })

    it("the year should not be least than 1950", async () => {
        try {
            const carData = await factory.create<Car>('Car', {ano: 1949})
            const car = await CarService.create(carData)
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'ano' está fora do formato padrão")
        }
    })

    it("should include just one if duplicated accessory", async () => {
        const carData = await factory.create<Car>('Car', {acessorios: [{ descricao: "Ar-condicionado" }, { descricao: "Ar-condicionado" }]})
        const car = await CarService.create(carData)

        expect(car.id).toBeDefined()
        expect(car.dataCriacao).toBeDefined()
        expect(car.ano).toBe(carData.ano)
        expect(car.cor).toBe(carData.cor)
        expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros)
        expect(car.acessorios.length).toEqual(1)
    })

    it("should include just one if duplicated accessory", async () => {
        const accessories = [
            { descricao: "Ar-condicionado" },
            { descricao: "Dir. Hidráulica" },
            { descricao: "Cabine Dupla" },
            { descricao: "Tração 4x4" },
            { descricao: "4 portas" },
            { descricao: "Diesel" },
            { descricao: "Air bag" },
            { descricao: "ABS" },
            { descricao: "4 portas" }
        ]

        const list = CarService.deDuplicate(accessories)

        expect(list.length).toEqual(8)
        expect(list).toMatchObject([
            { descricao: "Ar-condicionado" },
            { descricao: "Dir. Hidráulica" },
            { descricao: "Cabine Dupla" },
            { descricao: "Tração 4x4" },
            { descricao: "4 portas" },
            { descricao: "Diesel" },
            { descricao: "Air bag" },
            { descricao: "ABS" }
        ])
    })

    it("should get all cars by modelo", async () =>{
        const carData = await factory.create<Car>('Car')
        const car = await CarService.create(carData)
        const result = await CarService.list({modelo:carData.modelo})

        expect(result.veiculos.length).toBeGreaterThan(0)
        result.veiculos.forEach(element => {
            expect(element.modelo).toBe(carData.modelo)
        });
    })

    it("should get all cars", async () =>{
        const carData = await factory.createMany<Car>('Car', 5)
        carData.forEach(async (elemen) =>{
            const car = await CarService.create(elemen)
        })
        
        const result = await CarService.list({}, 0, 1)

        console.log(JSON.stringify(result))
        

        expect(result.veiculos.length).toEqual(1)
    })
})