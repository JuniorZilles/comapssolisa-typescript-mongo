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
    acessorios: [{ descricao: "Ar-condicionado" }],
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

    /**
     * POST CREATE
     */

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
        expect(car.modelo).toBe(carData.modelo)
        expect(car.cor).toBe(carData.cor)
        expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros)
    })

    it("should return 400 with message if missing an attribute", async () => {
        const temp = {
            modelo: "GM S10 2.8",
            ano: 2021,
            acessorios: [],
            quantidadePassageiros: 5
        }
        const response = await request(app)
            .post(PREFIX)
            .send(temp)
        const value = response.body

        expect(response.status).toBe(400)
        expect(value).toHaveProperty('details')
        expect(value.details.length).toEqual(1)
    })

    it("should return 400 with details, if has no accessory", async () => {
        const temp = {
            modelo: "GM S10 2.8",
            cor: "Verde",
            ano: 2021,
            acessorios: [],
            quantidadePassageiros: 5
        }
        const response = await request(app)
            .post(PREFIX)
            .send(temp)
        const value = response.body
        expect(response.status).toBe(400)
        expect(value).toHaveProperty('details')
        expect(value.details.length).toEqual(1)
    })

    it("should return 400 with details if year greater than 2022", async () => {
        const temp = {
            modelo: "GM S10 2.8",
            cor: "Verde",
            ano: 2023,
            acessorios: [{ descricao: "Ar-condicionado" }],
            quantidadePassageiros: 5
        }
        const response = await request(app)
            .post(PREFIX)
            .send(temp)


        const value = response.body
        expect(response.status).toBe(400)
        expect(value).toHaveProperty('details')
        expect(value.details.length).toEqual(1)
    })

    it("should return 400 with message if year least than 1950", async () => {
        const temp = {
            modelo: "GM S10 2.8",
            cor: "Verde",
            ano: 1949,
            acessorios: [{ descricao: "Ar-condicionado" }],
            quantidadePassageiros: 5
        }
        const response = await request(app)
            .post(PREFIX)
            .send(temp)


        const value = response.body
        expect(response.status).toBe(400)
        expect(value).toHaveProperty('details')
        expect(value.details.length).toEqual(1)
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

    /**
     * GET LIST
     */

    it("should get all cars", async () => {
        const carData = await factory.createMany<Car>('Car', 5)

        const response = await request(app)
            .get(`${PREFIX}?start=0&size=${carData.length}`)
        const vehicles = response.body

        expect(response.status).toBe(200)
        expect(vehicles).toHaveProperty('veiculos')
        expect(vehicles.veiculos.length).toEqual(carData.length)
    })

    it("should get all cars by accessory", async () => {
        const carData = await factory.createMany<Car>('Car', 5, { acessorios: [{ descricao: "Ar-condicionado" }] })

        const response = await request(app)
            .get(`${PREFIX}?start=0&size=${carData.length}&acessorio=Ar-condicionado`)
        const vehicles = response.body

        expect(response.status).toBe(200)
        expect(vehicles).toHaveProperty('veiculos')
        expect(vehicles).toHaveProperty('total')
        expect(vehicles).toHaveProperty('limit')
        expect(vehicles).toHaveProperty('offset')
        expect(vehicles).toHaveProperty('offsets')
        expect(vehicles.veiculos.length).toEqual(carData.length)
        vehicles.veiculos.forEach((element: Car) => {
            expect(element.acessorios).toEqual([{ descricao: "Ar-condicionado" }])
        });
    })

    it("should get all cars by modelo", async () => {

        const response = await request(app)
            .get(`${PREFIX}?modelo=${carData.modelo}`)
        const vehicles = response.body

        expect(response.status).toBe(200)
        expect(vehicles).toHaveProperty('veiculos')
        expect(vehicles).toHaveProperty('total')
        expect(vehicles).toHaveProperty('limit')
        expect(vehicles).toHaveProperty('offset')
        expect(vehicles).toHaveProperty('offsets')
        expect(vehicles.veiculos.length).toEqual(0)
    })

    /**
     * GET BY ID
     */

    it("should get a car by it's ID", async () => {
        const carUsed = await factory.create<Car>('Car')

        if (carUsed.id) {
            const response = await request(app)
                .get(`${PREFIX}/${carUsed.id}`)
            const car = response.body

            expect(response.status).toBe(200)
            expect(car._id).toBe(carUsed.id)
            expect(car.modelo).toBe(carUsed.modelo)
            expect(car.ano).toBe(carUsed.ano)
            expect(car.cor).toBe(carUsed.cor)
        } else {
            expect(carUsed.id).toBeDefined()
        }
    })

    it("should return 400 with message if ID is invalid when searching", async () => {
        const response = await request(app)
            .get(`${PREFIX}/12`)
        const car = response.body

        expect(response.status).toBe(400)
        expect(car.message).toBe("O campo 'id' está fora do formato padrão")
    })

    it("should return 400 with message if ID is not found when searching", async () => {
        const response = await request(app)
            .get(`${PREFIX}/6171508962f47a7a91938d30`)
        const car = response.body

        expect(response.status).toBe(404)
        expect(car.message).toBe("Valor 6171508962f47a7a91938d30 não encontrado")
    })

    /**
     * DELETE BY ID
     */

    it("should remove a car by it's ID", async () => {
        const carUsed = await factory.create<Car>('Car')

        if (carUsed.id) {
            const response = await request(app)
                .delete(`${PREFIX}/${carUsed.id}`)
            const car = response.body

            expect(response.status).toBe(204)
            expect(car).toEqual({})
        } else {
            expect(carUsed.id).toBeDefined()
        }
    })

    it("should return 400 with message if ID is invalid when removing", async () => {
        const response = await request(app)
            .delete(`${PREFIX}/12`)
        const car = response.body

        expect(response.status).toBe(400)
        expect(car.message).toBe("O campo 'id' está fora do formato padrão")
    })

    it("should return 404 with message if ID is notfound when removing", async () => {
        const response = await request(app)
            .delete(`${PREFIX}/6171508962f47a7a91938d30`)
        const car = response.body

        expect(response.status).toBe(404)
        expect(car.message).toBe("Valor 6171508962f47a7a91938d30 não encontrado")
    })

    /**
     * PUT BY ID
     */

    it("should update a car", async () => {
        const temp = await factory.create<Car>('Car')
        const response = await request(app)
            .put(`${PREFIX}/${temp.id}`)
            .send({ modelo: 'Abacaxi' })

        const responseget = await request(app)
            .get(`${PREFIX}/${temp.id}`)
        const carget = responseget.body        

        expect(response.status).toBe(204)
        expect(temp.acessorios).toEqual(carget.acessorios)
        expect(temp.ano).toBe(carget.ano)
        expect(carget.modelo).toBe('Abacaxi')
        expect(temp.cor).toBe(carget.cor)
        expect(temp.quantidadePassageiros).toBe(carget.quantidadePassageiros)
    })

    it("should return 400 with details if no accessory item exists when updating", async () => {
        const temp = await factory.create<Car>('Car')
        const response = await request(app)
            .put(`${PREFIX}/${temp.id}`)
            .send({acessorios: []})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('details')
        expect(response.body.details.length).toEqual(1)
    })

    it("should return 400 with details if year greater than 2022 when updating", async () => {
        const temp = await factory.create<Car>('Car')
        const response = await request(app)
            .put(`${PREFIX}/${temp.id}`)
            .send({ano: 2023})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('details')
        expect(response.body.details.length).toEqual(1)
    })

    it("should return 400 with details if year least than 1950 when updating", async () => {
        const temp = await factory.create<Car>('Car')
        const response = await request(app)
            .put(`${PREFIX}/${temp.id}`)
            .send({ano: 1949})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('details')
        expect(response.body.details.length).toEqual(1)
    })

    it("should update if accessory has duplicated item but include just one when updating", async () => {
        const temp = await factory.create<Car>('Car')
        const response = await request(app)
            .put(`${PREFIX}/${temp.id}`)
            .send({acessorios: [{ descricao: "Ar-condicionado" }, { descricao: "Ar-condicionado" }]})

        const responseget = await request(app)
            .get(`${PREFIX}/${temp.id}`)
        const carget = responseget.body        

        expect(response.status).toBe(204)
        expect(carget.acessorios).toEqual([ { descricao: "Ar-condicionado" }])
        expect(temp.ano).toBe(carget.ano)
        expect(temp.modelo).toBe(carget.modelo)
        expect(temp.cor).toBe(carget.cor)
        expect(temp.quantidadePassageiros).toBe(carget.quantidadePassageiros)
    })

    it("should return 400 with message if empty body when updating", async () => {
        const temp = await factory.create<Car>('Car')
        const response = await request(app)
            .put(`${PREFIX}/${temp.id}`)
            .send({})
        console.log(response.body);
        
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Corpo da requisição incompleto")
    })
})