import request from 'supertest';
import Car from '@interfaces/Car';
import app from '../../../src/app';
import factory from '../../utils/factorys/CarFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { CARPREFIX, TOKEN } from '../../utils/Constants';
import { checkDefaultVehiclesFormat } from '../../utils/formats/CarFormat';

describe('src :: api :: controllers :: car :: getAll', () => {
  test('should get all cars', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5);

    const response = await request(app).get(`${CARPREFIX}?offset=0&limit=${carTemp.length}`).set(TOKEN);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultVehiclesFormat(body);
    expect(body.veiculos).toHaveLength(carTemp.length);
  });

  test('should get all two cars by accessory', async () => {
    await factory.createMany<Car>('Car', 5, {
      acessorios: [{ descricao: 'Ar-condicionado' }]
    });

    const response = await request(app).get(`${CARPREFIX}?offset=0&limit=2&descricao=Ar-condicionado`).set(TOKEN);
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
    const response = await request(app).get(`${CARPREFIX}?modelo=${carTemp[0].modelo}`).set(TOKEN);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultVehiclesFormat(body);
    expect(body.veiculos.length).toEqual(5);
    body.veiculos.forEach((element: Car) => {
      expect(element.modelo).toBe('GM S10 2.8');
    });
  });

  test('should get all cars by ano', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5, {
      ano: 2004
    });
    const response = await request(app).get(`${CARPREFIX}?ano=${carTemp[0].ano}`).set(TOKEN);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultVehiclesFormat(body);
    expect(body.veiculos.length).toEqual(5);
    body.veiculos.forEach((element: Car) => {
      expect(element.ano).toBe(2004);
    });
  });

  test('should get all cars by quantidadePassageiros', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5, {
      quantidadePassageiros: 5
    });
    const response = await request(app)
      .get(`${CARPREFIX}?quantidadePassageiros=${carTemp[0].quantidadePassageiros}`)
      .set(TOKEN);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultVehiclesFormat(body);
    expect(body.veiculos.length).toEqual(5);
    body.veiculos.forEach((element: Car) => {
      expect(element.quantidadePassageiros).toBe(5);
    });
  });

  test('should get all cars by cor', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5, {
      cor: 'verde'
    });
    const response = await request(app).get(`${CARPREFIX}?cor=${carTemp[0].cor}`).set(TOKEN);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultVehiclesFormat(body);
    expect(body.veiculos.length).toEqual(5);
    body.veiculos.forEach((element: Car) => {
      expect(element.cor).toBe('verde');
    });
  });

  test('should not get any cars when doesnt have any register for the query', async () => {
    await factory.createMany<Car>('Car', 5);
    const response = await request(app).get(`${CARPREFIX}?modelo=Chevy`).set(TOKEN);
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

  test('should return 400 with errors and not get a car if year least than 1950', async () => {
    const response = await request(app).get(`${CARPREFIX}?ano=1930`).set(TOKEN);

    const { body } = response;
    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('ano');
    expect(body[0].name).toBe('"ano" must be greater than or equal to 1950');
  });

  test('should return 400 with errors and not get a car if modelo is empty', async () => {
    const response = await request(app).get(`${CARPREFIX}?modelo=`).set(TOKEN);

    const { body } = response;
    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('modelo');
    expect(body[0].name).toBe('"modelo" is not allowed to be empty');
  });
});
