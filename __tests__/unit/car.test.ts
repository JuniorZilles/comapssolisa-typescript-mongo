import CarService from "@services/CarService"
import { InvalidField } from "@errors/InvalidField"
import CarModel, { Car } from "@models/CarModel"
import factory from '../utils/CarFactory'
import MongoDatabase from "../../src/infra/mongo/index"
import { NotFound } from "@errors/NotFound"

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
            const carData = await factory.create<Car>('Car', { acessorios: [] })
            const car = await CarService.create(carData)
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'acessorios' está fora do formato padrão")
        }
    })

    it("the year should not be greater than 2022", async () => {
        try {
            const carData = await factory.create<Car>('Car', { ano: 2023 })
            const car = await CarService.create(carData)
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'ano' está fora do formato padrão")
        }
    })

    it("the year should not be least than 1950", async () => {
        try {
            const carData = await factory.create<Car>('Car', { ano: 1949 })
            const car = await CarService.create(carData)
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'ano' está fora do formato padrão")
        }
    })

    it("should include just one if duplicated accessory", async () => {
        const carData = await factory.create<Car>('Car', { acessorios: [{ descricao: "Ar-condicionado" }, { descricao: "Ar-condicionado" }] })
        const car = await CarService.create(carData)

        expect(car.id).toBeDefined()
        expect(car.dataCriacao).toBeDefined()
        expect(car.ano).toBe(carData.ano)
        expect(car.cor).toBe(carData.cor)
        expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros)
        expect(car.acessorios.length).toEqual(1)
    })

    it("should remove duplicated accessory", async () => {
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

    it("should get all cars by modelo", async () => {
        const carData = await factory.create<Car>('Car')
        const car = await CarService.create(carData)
        const result = await CarService.list({ modelo: carData.modelo })

        expect(result.veiculos.length).toBeGreaterThan(0)
        result.veiculos.forEach(element => {
            expect(element.modelo).toBe(carData.modelo)
        });
    })

    it("should get all cars", async () => {
        const carData = await factory.createMany<Car>('Car', 5)
        carData.forEach(async (elemen) => {
            const car = await CarService.create(elemen)
        })

        const result = await CarService.list({}, 0, 1)

        expect(result.veiculos.length).toEqual(1)
    })

    it("should get all cars by accessory", async () => {
        const carData = await factory.createMany<Car>('Car', 5)
        carData.forEach(async (elemen) => {
            const car = await CarService.create(elemen)
        })
        const result = await CarService.list({ acessorio: carData[0].acessorios[0].descricao as string })

        result.veiculos.forEach(element => {
            expect(element.acessorios[0].descricao).toBe(carData[0].acessorios[0].descricao)
        });
    })

    it("should get a car by it's ID", async () => {
        const carData = await factory.create<Car>('Car')
        const car = await CarService.create(carData)
        if (car.id) {
            const result = await CarService.getById(car.id)
            expect(result.id).toBe(car.id)
            expect(result.modelo).toBe(car.modelo)
            expect(result.ano).toBe(car.ano)
            expect(result.cor).toBe(car.cor)
        } else {
            expect(car.id).toBeDefined()
        }
    })

    it("should not get a car by it's ID and throw a InvalidField error", async () => {
        try {
            const result = await CarService.getById("12")
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'id' está fora do formato padrão")
        }
    })

    it("should not get a car by it's ID and throw a NotFound error", async () => {
        try {
            const result = await CarService.getById("6171508962f47a7a91938d30")
        } catch (e) {
            expect(e).toBeInstanceOf(NotFound)
            expect((<NotFound>e).message).toBe("Valor 6171508962f47a7a91938d30 não encontrado")
        }
    })

    it("should remove a car by it's ID", async () => {
        const carData = await factory.create<Car>('Car')
        const car = await CarService.create(carData)
        if (car.id) {
            const result = await CarService.delete(car.id)
            expect(result).toBe(true)
        } else {
            expect(car.id).toBeDefined()
        }
    })

    it("should not remove a car by it's ID and throw a InvalidField error", async () => {
        try {
            const result = await CarService.delete("12")
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'id' está fora do formato padrão")
        }
    })

    it("should not remove a car by it's ID and throw a NotFound error", async () => {
        try {
            const result = await CarService.delete("6171508962f47a7a91938d30")
        } catch (e) {
            expect(e).toBeInstanceOf(NotFound)
            expect((<NotFound>e).message).toBe("Valor 6171508962f47a7a91938d30 não encontrado")
        }
    })

    it("should update a car", async () => {
        const carData = await factory.create<Car>('Car')
        const car = await CarService.create(carData)
        if(car.id){
            const result = await CarService.update(car.id,{modelo: 'Abacaxi'})
            expect(result).toBe(true)
            const resultCar = await CarService.getById(car.id)
            expect(resultCar.id).toBe(car.id)
            expect(resultCar.acessorios).toStrictEqual(car.acessorios)
            expect(resultCar.modelo).toBe('Abacaxi')
            expect(resultCar.ano).toBe(car.ano)
            expect(resultCar.cor).toBe(car.cor)
        }
    })

    it("should have at least one accessory if is updating this field", async () => {
        try {
            const carData = await factory.create<Car>('Car')
            const car = await CarService.create(carData)
            if(car.id){
                await CarService.update(car.id,{acessorios: []})
            }
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'acessorios' está fora do formato padrão")
        }
    })

    it("the year updated should not be greater than 2022 and throw a InvalidField error", async () => {
        try {
            const carData = await factory.create<Car>('Car')
            const car = await CarService.create(carData)
            if(car.id){
                await CarService.update(car.id,{ ano: 2023 })
            }
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'ano' está fora do formato padrão")
        }
    })

    it("the year updated should not be least than 1950 and throw a InvalidField error", async () => {
        try {
            const carData = await factory.create<Car>('Car')
            const car = await CarService.create(carData)
            if(car.id){
                await CarService.update(car.id,{ ano: 1949 })
            }
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'ano' está fora do formato padrão")
        }
    })

    it("should include just one if duplicated accessory", async () => {
        const carData = await factory.create<Car>('Car')
        const car = await CarService.create(carData)
        if(car.id){
            const result = await CarService.update(car.id,{ acessorios: [{ descricao: "Ar-condicionado" }, { descricao: "Ar-condicionado" }] })
            expect(result).toBe(true)
            const resultCar = await CarService.getById(car.id)
            expect(resultCar.id).toBe(car.id)
            expect(resultCar.acessorios).toStrictEqual([{ descricao: "Ar-condicionado" }])
            expect(resultCar.modelo).toBe(car.modelo)
            expect(resultCar.ano).toBe(car.ano)
            expect(resultCar.cor).toBe(car.cor)
            
        }
    })
})