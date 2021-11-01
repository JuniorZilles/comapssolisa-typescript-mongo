/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import CarModel, { Car } from '@models/CarModel';
import factory from '../utils/CarFactory';
import MongoDatabase from '../../src/infra/mongo/index';
import app from '../../src/app';

const PREFIX = '/api/v1/car';
const carData = {
  modelo: 'GM S10 2.8',
  cor: 'Verde',
  ano: 2021,
  acessorios: [{ descricao: 'Ar-condicionado' }],
  quantidadePassageiros: 5,
};
describe('src :: api :: controllers :: car', () => {
  beforeAll(async () => {
    await CarModel.deleteMany();
  });
  afterAll(async () => {
    await MongoDatabase.disconect();
  });
  afterEach(async () => {
    await CarModel.deleteMany();
  });

  /**
     * POST CREATE
     */

  it('should create a car', async () => {
    const response = await request(app)
      .post(PREFIX)
      .send(carData);

    const car = response.body;

    expect(response.status).toBe(201);
    expect(car._id).toBeDefined();
    expect(car.dataCriacao).toBeDefined();
    expect(car.acessorios.length).toEqual(1);
    expect(car.ano).toBe(carData.ano);
    expect(car.modelo).toBe(carData.modelo);
    expect(car.cor).toBe(carData.cor);
    expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros);
  });

  it('should return 400 with errors if missing an attribute', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      ano: 2021,
      acessorios: [],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .post(PREFIX)
      .send(temp);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('cor');
    expect(value[0].name).toBe('"cor" is required');
  });

  it('should return 400 with errors, if has no accessory', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2021,
      acessorios: [],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .post(PREFIX)
      .send(temp);
    const value = response.body;
    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('acessorios');
    expect(value[0].name).toBe('"acessorios" must contain at least 1 items');
  });

  it('should return 400 with errors if year greater than 2022', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2023,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .post(PREFIX)
      .send(temp);

    const value = response.body;
    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('ano');
    expect(value[0].name).toBe('"ano" must be less than or equal to 2022');
  });

  it('should return 400 with errors if year least than 1950', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 1949,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .post(PREFIX)
      .send(temp);

    const value = response.body;
    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('ano');
    expect(value[0].name).toBe('"ano" must be greater than or equal to 1950');
  });

  it('should not include if duplicated accessory', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2021,
      acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .post(PREFIX)
      .send(temp);

    const value = response.body;
    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('acessorios.1');
    expect(value[0].name).toBe('"acessorios[1]" contains a duplicate value');
  });

  /**
     * GET LIST
     */

  it('should get all cars', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5);

    const response = await request(app)
      .get(`${PREFIX}?offset=0&limit=${carTemp.length}`);
    const vehicles = response.body;

    expect(response.status).toBe(200);
    expect(vehicles).toHaveProperty('veiculos');
    expect(vehicles.veiculos.length).toEqual(carTemp.length);
  });

  it('should get all cars by accessory', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5, { acessorios: [{ descricao: 'Ar-condicionado' }] });

    const response = await request(app)
      .get(`${PREFIX}?offset=0&limit=${carTemp.length}&descricao=Ar-condicionado`);
    const vehicles = response.body;

    expect(response.status).toBe(200);
    expect(vehicles).toHaveProperty('veiculos');
    expect(vehicles).toHaveProperty('total');
    expect(vehicles).toHaveProperty('limit');
    expect(vehicles).toHaveProperty('offset');
    expect(vehicles).toHaveProperty('offsets');
    expect(vehicles.veiculos.length).toEqual(carTemp.length);
    vehicles.veiculos.forEach((element: Car) => {
      expect(element.acessorios).toEqual([{ descricao: 'Ar-condicionado' }]);
    });
  });

  it('should get all cars by modelo', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5);
    const response = await request(app)
      .get(`${PREFIX}?modelo=${carTemp[0].modelo}`);
    const vehicles = response.body;

    expect(response.status).toBe(200);
    expect(vehicles).toHaveProperty('veiculos');
    expect(vehicles).toHaveProperty('total');
    expect(vehicles).toHaveProperty('limit');
    expect(vehicles).toHaveProperty('offset');
    expect(vehicles).toHaveProperty('offsets');
    expect(vehicles.veiculos.length).toEqual(5);
  });

  it('should not get any cars when doesnt have any register for the query', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5);
    const response = await request(app)
      .get(`${PREFIX}?modelo=Chevy`);
    const vehicles = response.body;

    expect(response.status).toBe(200);
    expect(vehicles).toHaveProperty('veiculos');
    expect(vehicles).toHaveProperty('total');
    expect(vehicles).toHaveProperty('limit');
    expect(vehicles).toHaveProperty('offset');
    expect(vehicles).toHaveProperty('offsets');
    expect(vehicles.veiculos.length).toEqual(0);
  });

  /**
     * GET BY ID
     */

  it("should get a car by it's ID", async () => {
    const carUsed = await factory.create<Car>('Car');

    if (carUsed.id) {
      const response = await request(app)
        .get(`${PREFIX}/${carUsed.id}`);
      const car = response.body;

      expect(response.status).toBe(200);
      expect(car._id).toBe(carUsed.id);
      expect(car.modelo).toBe(carUsed.modelo);
      expect(car.ano).toBe(carUsed.ano);
      expect(car.cor).toBe(carUsed.cor);
    } else {
      expect(carUsed.id).toBeDefined();
    }
  });

  it('should return 400 with errors if ID is invalid when searching', async () => {
    const response = await request(app)
      .get(`${PREFIX}/12`);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('id');
    expect(value[0].name).toBe('"id" length must be 24 characters long');
  });

  it('should return 404 with error if ID is not found when searching', async () => {
    const response = await request(app)
      .get(`${PREFIX}/6171508962f47a7a91938d30`);
    const car = response.body;

    expect(response.status).toBe(404);
    expect(car.length).toEqual(1);
    expect(car[0].description).toBe('Not Found');
    expect(car[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
     * DELETE BY ID
     */

  it("should remove a car by it's ID", async () => {
    const carUsed = await factory.create<Car>('Car');

    if (carUsed.id) {
      const response = await request(app)
        .delete(`${PREFIX}/${carUsed.id}`);
      const car = response.body;

      expect(response.status).toBe(204);
      expect(car).toEqual({});
    } else {
      expect(carUsed.id).toBeDefined();
    }
  });

  it('should return 400 with errors if ID is invalid when removing', async () => {
    const response = await request(app)
      .delete(`${PREFIX}/12`);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('id');
    expect(value[0].name).toBe('"id" length must be 24 characters long');
  });

  it('should return 404 with error if ID is notfound when removing', async () => {
    const response = await request(app)
      .delete(`${PREFIX}/6171508962f47a7a91938d30`);
    const car = response.body;

    expect(response.status).toBe(404);
    expect(car.length).toEqual(1);
    expect(car[0].description).toBe('Not Found');
    expect(car[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
     * PUT BY ID
     */

  it('should update a car', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .put(`${PREFIX}/${temp.id}`)
      .send(carData);
    const result = response.body;

    expect(response.status).toBe(200);
    expect(carData.acessorios).toEqual(result.acessorios);
    expect(carData.ano).toBe(result.ano);
    expect(carData.modelo).toBe(result.modelo);
    expect(carData.cor).toBe(result.cor);
    expect(carData.acessorios).toEqual(result.acessorios);
    expect(carData.quantidadePassageiros).toBe(result.quantidadePassageiros);
  });

  it('should return 400 with errors if no accessory item exists when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2021,
      acessorios: [],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .put(`${PREFIX}/${temp.id}`)
      .send(tempData);

    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('acessorios');
    expect(value[0].name).toBe('"acessorios" must contain at least 1 items');
  });

  it('should return 400 with errors if year greater than 2022 when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2023,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .put(`${PREFIX}/${temp.id}`)
      .send(tempData);

    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('ano');
    expect(value[0].name).toBe('"ano" must be less than or equal to 2022');
  });

  it('should return 400 with errors if year least than 1950 when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 1949,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .put(`${PREFIX}/${temp.id}`)
      .send(tempData);

    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('ano');
    expect(value[0].name).toBe('"ano" must be greater than or equal to 1950');
  });

  it('should not update if accessory has duplicated item when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2018,
      acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5,
    };
    const response = await request(app)
      .put(`${PREFIX}/${temp.id}`)
      .send(tempData);

    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('acessorios.1');
    expect(value[0].name).toBe('"acessorios[1]" contains a duplicate value');
  });

  it('should return 400 with errors if empty body when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .put(`${PREFIX}/${temp.id}`)
      .send({});

    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('modelo');
    expect(value[0].name).toBe('"modelo" is required');
  });
});
