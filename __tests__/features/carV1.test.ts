/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import CarModel from '@models/CarModel';

import { generateToken } from '@services/TokenService';
import Car from '@interfaces/Car';
import Accessory from '@interfaces/Accessory';
import factory from '../utils/CarFactory';
import checkDefaultErrorFormat from '../utils/CheckErrorFormat';
import MongoDatabase from '../../src/infra/mongo/index';
import app from '../../src/app';

const PREFIX = '/api/v1/car';
const carData = {
  modelo: 'GM S10 2.8',
  cor: 'Verde',
  ano: 2021,
  acessorios: [{ descricao: 'Ar-condicionado' }],
  quantidadePassageiros: 5
};
let token = {};

describe('src :: api :: controllers :: car', () => {
  beforeAll(async () => {
    await CarModel.deleteMany();
    const key = generateToken({
      email: 'joazinho@email.com',
      habilitado: 'sim',
      id: '6171508962f47a7a91938d30'
    });

    token = { authorization: `Bearer ${key}` };
  });
  afterAll(async () => {
    await MongoDatabase.disconect();
  });
  afterEach(async () => {
    await CarModel.deleteMany();
  });

  const checkDefaultCarFormat = (body) => {
    expect(body).toEqual({
      _id: expect.any(String),
      acessorios: expect.any(Array),
      ano: expect.any(Number),
      modelo: expect.any(String),
      cor: expect.any(String),
      quantidadePassageiros: expect.any(Number)
    });
    body.acessorios.forEach((accessory: Accessory) => {
      expect(accessory).toEqual({
        _id: expect.any(String),
        descricao: expect.any(String)
      });
    });
  };

  const checkDefaultVehiclesFormat = (body) => {
    expect(body).toEqual({
      veiculos: expect.arrayContaining([
        {
          _id: expect.any(String),
          acessorios: expect.arrayContaining([
            {
              _id: expect.any(String),
              descricao: expect.any(String)
            }
          ]),
          modelo: expect.any(String),
          cor: expect.any(String),
          quantidadePassageiros: expect.any(Number),
          ano: expect.any(Number)
        }
      ]),
      total: expect.any(Number),
      limit: expect.any(Number),
      offset: expect.any(Number),
      offsets: expect.any(Number)
    });
  };

  /**
   * POST CREATE
   */

  test('should create a car', async () => {
    const response = await request(app).post(PREFIX).set(token).send(carData);

    const { body } = response;

    expect(response.status).toBe(201);
    checkDefaultCarFormat(body);
    expect(body._id).toBeDefined();
    expect(body.acessorios).toHaveLength(1);
    expect(body.__v).toBeUndefined();
    expect(body.ano).toBe(carData.ano);
    expect(body.modelo).toBe(carData.modelo);
    expect(body.cor).toBe(carData.cor);
    expect(body.quantidadePassageiros).toBe(carData.quantidadePassageiros);
  });

  test('should return 400 with errors if missing an attribute', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      ano: 2021,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    const response = await request(app).post(PREFIX).set(token).send(temp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cor');
    expect(body[0].name).toBe('"cor" is required');
  });

  test('should return 400 when white spaces on descricao', async () => {
    await factory.create<Car>('Car');
    const response = await request(app)
      .post(PREFIX)
      .set(token)
      .send({
        modelo: '  ',
        ano: 2021,
        cor: 'Verde',
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5
      });

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('modelo');
    expect(body[0].name).toBe('"modelo" is not allowed to be empty');
  });

  test('should return 400 with errors, if has no accessory', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2021,
      acessorios: [],
      quantidadePassageiros: 5
    };
    const response = await request(app).post(PREFIX).set(token).send(temp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('acessorios');
    expect(body[0].name).toBe('"acessorios" must contain at least 1 items');
  });

  test('should return 400 with errors if year greater than 2022', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2023,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    const response = await request(app).post(PREFIX).set(token).send(temp);

    const { body } = response;
    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('ano');
    expect(body[0].name).toBe('"ano" must be less than or equal to 2022');
  });

  test('should return 400 with errors if year least than 1950', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 1949,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    const response = await request(app).post(PREFIX).set(token).send(temp);

    const { body } = response;
    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('ano');
    expect(body[0].name).toBe('"ano" must be greater than or equal to 1950');
  });

  test('should not include if duplicated accessory', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2021,
      acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    const response = await request(app).post(PREFIX).set(token).send(temp);

    const { body } = response;
    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('acessorios.1');
    expect(body[0].name).toBe('"acessorios[1]" contains a duplicate value');
  });

  /**
   * GET LIST
   */

  test('should get all cars', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5);

    const response = await request(app).get(`${PREFIX}?offset=0&limit=${carTemp.length}`).set(token);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultVehiclesFormat(body);
    expect(body.veiculos).toHaveLength(carTemp.length);
  });

  test('should get all two cars by accessory', async () => {
    await factory.createMany<Car>('Car', 5, {
      acessorios: [{ descricao: 'Ar-condicionado' }]
    });

    const response = await request(app).get(`${PREFIX}?offset=0&limit=2&descricao=Ar-condicionado`).set(token);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultVehiclesFormat(body);
    expect(body.veiculos).toHaveLength(2);
    body.veiculos.forEach((element: Car) => {
      expect(element.acessorios[0].descricao).toBe('Ar-condicionado');
    });
  });

  test('should get all cars by modelo', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5, {
      modelo: 'GM S10 2.8'
    });
    const response = await request(app).get(`${PREFIX}?modelo=${carTemp[0].modelo}`).set(token);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultVehiclesFormat(body);
    expect(body.veiculos.length).toEqual(5);
    body.veiculos.forEach((element: Car) => {
      expect(element.modelo).toBe('GM S10 2.8');
    });
  });

  test('should not get any cars when doesnt have any register for the query', async () => {
    await factory.createMany<Car>('Car', 5);
    const response = await request(app).get(`${PREFIX}?modelo=Chevy`).set(token);
    const { body } = response;

    expect(response.status).toBe(200);
    expect(body).toEqual({
      veiculos: expect.any(Array),
      total: expect.any(Number),
      limit: expect.any(Number),
      offset: expect.any(Number),
      offsets: expect.any(Number)
    });
    expect(body.veiculos).toHaveLength(0);
  });

  /**
   * GET BY ID
   */

  test("should get a car by it's ID", async () => {
    const carUsed = await factory.create<Car>('Car');

    if (carUsed._id) {
      const response = await request(app).get(`${PREFIX}/${carUsed._id}`).set(token);
      const { body } = response;

      expect(response.status).toBe(200);
      checkDefaultCarFormat(body);
      expect(body._id).toBe(carUsed._id?.toString());
      expect(body.modelo).toBe(carUsed.modelo);
      expect(body.__v).toBeUndefined();
      expect(body.ano).toBe(carUsed.ano);
      expect(body.cor).toBe(carUsed.cor);
    } else {
      expect(carUsed._id).toBeDefined();
    }
  });

  test('should return 400 with errors if ID is invalid when searching', async () => {
    const response = await request(app).get(`${PREFIX}/12`).set(token);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when searching', async () => {
    const response = await request(app).get(`${PREFIX}/6171508962f47a7a91938d30`).set(token);
    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
   * DELETE BY ID
   */

  test("should remove a car by it's ID", async () => {
    const carUsed = await factory.create<Car>('Car');

    if (carUsed._id) {
      const response = await request(app).delete(`${PREFIX}/${carUsed._id}`).set(token);
      const { body } = response;

      expect(response.status).toBe(204);
      expect(body).toEqual({});
    } else {
      expect(carUsed._id).toBeDefined();
    }
  });

  test('should return 400 with errors if ID is invalid when removing', async () => {
    const response = await request(app).delete(`${PREFIX}/12`).set(token);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is notfound when removing', async () => {
    const response = await request(app).delete(`${PREFIX}/6171508962f47a7a91938d30`).set(token);

    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
   * PUT BY ID
   */

  test('should update a car', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app).put(`${PREFIX}/${temp._id}`).set(token).send(carData);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultCarFormat(body);
    expect(body.acessorios[0].descricao).toEqual(carData.acessorios[0].descricao);
    expect(body.__v).toBeUndefined();
    expect(body.ano).toBe(carData.ano);
    expect(body.modelo).toBe(carData.modelo);
    expect(body.cor).toBe(carData.cor);
    expect(body.quantidadePassageiros).toBe(carData.quantidadePassageiros);
  });

  test('should return 400 with errors if no accessory item exists when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2021,
      acessorios: [],
      quantidadePassageiros: 5
    };
    const response = await request(app).put(`${PREFIX}/${temp._id}`).set(token).send(tempData);

    const { body } = response;

    expect(response.status).toBe(400);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].description).toBe('acessorios');
    expect(body[0].name).toBe('"acessorios" must contain at least 1 items');
  });

  test('should return 400 with errors if year greater than 2022 when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2023,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    const response = await request(app).put(`${PREFIX}/${temp._id}`).set(token).send(tempData);

    const { body } = response;

    expect(response.status).toBe(400);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].description).toBe('ano');
    expect(body[0].name).toBe('"ano" must be less than or equal to 2022');
  });

  test('should return 400 with errors if year least than 1950 when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 1949,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    const response = await request(app).put(`${PREFIX}/${temp._id}`).set(token).send(tempData);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('ano');
    expect(body[0].name).toBe('"ano" must be greater than or equal to 1950');
  });

  test('should not update if accessory has duplicated item when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'GM S10 2.8',
      cor: 'Verde',
      ano: 2018,
      acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    const response = await request(app).put(`${PREFIX}/${temp._id}`).set(token).send(tempData);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('acessorios.1');
    expect(body[0].name).toBe('"acessorios[1]" contains a duplicate value');
  });

  test('should return 400 with errors if empty body when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app).put(`${PREFIX}/${temp._id}`).set(token).send({});

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].description).toBe('modelo');
    expect(body[0].name).toBe('"modelo" is required');
  });

  /**
   * PATCH BY ID ACCESSORIES BY ID
   */

  test('should update a car accessory by its ID', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${PREFIX}/${temp._id}/acessorios/${temp.acessorios[0]._id}`)
      .set(token)
      .send({ descricao: 'Ar-condicionado' });

    const { body } = response;

    expect(response.status).toBe(200);
    expect(body._id).toBe(temp._id?.toString());
    expect(body.ano).toBe(temp.ano);
    expect(body.cor).toBe(temp.cor);
    expect(body.modelo).toBe(temp.modelo);
    expect(body.__v).toBeUndefined();
    expect(body.quantidadePassageiros).toBe(temp.quantidadePassageiros);
    expect(body.acessorios.length).toEqual(temp.acessorios.length);
    expect(body.acessorios[0].descricao).toBe('Ar-condicionado');
    expect(body.acessorios[1].descricao).not.toBe('Ar-condicionado');
  });

  test('should return 400 when missing body', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${PREFIX}/${temp._id}/acessorios/${temp.acessorios[0]._id}`)
      .set(token)
      .send({});

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].description).toBe('descricao');
    expect(body[0].name).toBe('"descricao" is required');
  });

  test('should return 400 when white spaces on descricao', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${PREFIX}/${temp._id}/acessorios/${temp.acessorios[0]._id}`)
      .set(token)
      .send({ descricao: '   ' });

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('descricao');
    expect(body[0].name).toBe('"descricao" is not allowed to be empty');
  });

  test('should return 400 when invalid car ID on patch', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${PREFIX}/125/acessorios/${temp.acessorios[0]._id}`)
      .set(token)
      .send({ descricao: 'vidro eletrico' });

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 200 when invalid accessory description on patch', async () => {
    const temp = await factory.create<Car>('Car', {
      acessorios: [{ descricao: 'vidro eletrico' }, { descricao: 'Ar-condicionado' }]
    });
    const response = await request(app)
      .patch(`${PREFIX}/${temp._id}/acessorios/${temp.acessorios[0]._id}`)
      .set(token)
      .send({ descricao: 'vidro eletrico' });

    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultCarFormat(body);
    expect(body._id).toBe(temp._id?.toString());
    expect(body.ano).toBe(temp.ano);
    expect(body.cor).toBe(temp.cor);
    expect(body.modelo).toBe(temp.modelo);
    expect(body.__v).toBeUndefined();
    expect(body.quantidadePassageiros).toBe(temp.quantidadePassageiros);
    expect(body.acessorios.length).toEqual(temp.acessorios.length);
    expect(body.acessorios[0].descricao).toBe('vidro eletrico');
    expect(body.acessorios[0]._id).toBe(temp.acessorios[0]._id?.toString());
    expect(body.acessorios[1].descricao).toBe('Ar-condicionado');
    expect(body.acessorios[1]._id).toBe(temp.acessorios[1]._id?.toString());
  });

  test('should return 400 when invalid accessory ID on patch', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${PREFIX}/${temp._id}/acessorios/789asd`)
      .set(token)
      .send({ descricao: 'vidro eletrico' });

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('idAccessory');
    expect(body[0].name).toBe('"idAccessory" length must be 24 characters long');
  });
});
