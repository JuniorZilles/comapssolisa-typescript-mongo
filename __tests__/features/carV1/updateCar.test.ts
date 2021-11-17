import request from 'supertest';
import Car from '@interfaces/Car';
import app from '../../../src/app';
import factory from '../../utils/factorys/CarFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { CARPREFIX, CARDATA, TOKEN } from '../../utils/Constants';
import { checkDefaultCarFormat } from '../../utils/formats/CarFormat';

describe('src :: api :: controllers :: car :: update', () => {
  test('should update a car', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app).put(`${CARPREFIX}/${temp._id}`).set(TOKEN).send(CARDATA);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultCarFormat(body);
    expect(body.acessorios[0].descricao).toEqual(CARDATA.acessorios[0].descricao);
    expect(body.__v).toBeUndefined();
    expect(body.ano).toBe(CARDATA.ano);
    expect(body.modelo).toBe(CARDATA.modelo);
    expect(body.cor).toBe(CARDATA.cor);
    expect(body.quantidadePassageiros).toBe(CARDATA.quantidadePassageiros);
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
    const response = await request(app).put(`${CARPREFIX}/${temp._id}`).set(TOKEN).send(tempData);

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
    const response = await request(app).put(`${CARPREFIX}/${temp._id}`).set(TOKEN).send(tempData);

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
    const response = await request(app).put(`${CARPREFIX}/${temp._id}`).set(TOKEN).send(tempData);

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
    const response = await request(app).put(`${CARPREFIX}/${temp._id}`).set(TOKEN).send(tempData);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('acessorios.1');
    expect(body[0].name).toBe('"acessorios[1]" contains a duplicate value');
  });

  test('should return 400 with errors if empty body when updating', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app).put(`${CARPREFIX}/${temp._id}`).set(TOKEN).send({});

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].description).toBe('modelo');
    expect(body[0].name).toBe('"modelo" is required');
  });
});
