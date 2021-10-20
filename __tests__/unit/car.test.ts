import CarService from "@services/CarService"
import { InvalidField } from "@errors/InvalidField"
import CarModel, { Car } from "@models/CarModel"
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
        const carData = {
            modelo: "GM S10 2.8",
            cor: "branco",
            ano: 2021,
            acessorios: [
                { descricao: "Ar-condicionado" },
                { descricao: "Dir. Hidráulica" },
                { descricao: "Cabine Dupla" },
                { descricao: "Tração 4x4" },
                { descricao: "4 portas" },
                { descricao: "Diesel" },
                { descricao: "Air bag" },
                { descricao: "ABS" }
            ],
            quantidadePassageiros: 5
        } as Car
        const car = await CarService.create(carData)
        expect(car.id).toBeDefined()
        expect(car.dataCriacao).toBeDefined()
        expect(car.ano).toBe(carData.ano)
        expect(car.cor).toBe(carData.cor)
        expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros)
    })

    it("should have at least one accessory", async () => {
        try {
            const car = await CarService.create({
                modelo: "GM S10 2.8",
                cor: "branco",
                ano: 2021,
                acessorios: [],
                quantidadePassageiros: 5
            })
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'acessorios' está fora do formato padrão")
        }
    })

    it("the year should not be greater than 2022", async () => {
        try {
            const car = await CarService.create({
                modelo: "GM S10 2.8",
                cor: "branco",
                ano: 2023,
                acessorios: [{ descricao: "Ar-condicionado" }],
                quantidadePassageiros: 5
            })
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'ano' está fora do formato padrão")
        }
    })

    it("the year should not be least than 1950", async () => {
        try {
            const car = await CarService.create({
                modelo: "GM S10 2.8",
                cor: "branco",
                ano: 1949,
                acessorios: [{ descricao: "Ar-condicionado" }],
                quantidadePassageiros: 5
            })
            expect(car.id).toBeUndefined()
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidField)
            expect((<InvalidField>e).message).toBe("O campo 'ano' está fora do formato padrão")
        }
    })

    it("should include just one if duplicated accessory", async () => {
        const carData = {
            modelo: "GM S10 2.8",
            cor: "branco",
            ano: 2019,
            acessorios: [{ descricao: "Ar-condicionado" }, { descricao: "Ar-condicionado" }],
            quantidadePassageiros: 5
        }
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
})