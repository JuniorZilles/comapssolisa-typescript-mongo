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
})