import request from 'supertest';
import Car from '@interfaces/Car';
import app from '../../../src/app';
import factory from '../../utils/factorys/CarFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { CARPREFIX, CARDATA, TOKEN } from '../../utils/Constants';
import { checkDefaultCarFormat } from '../../utils/formats/CarFormat';

describe('src :: api :: controllers :: car :: create', () => {
  test('should create a car', async () => {
    const response = await request(app).post(CARPREFIX).set(TOKEN).send(CARDATA);

    const { body } = response;

    expect(response.status).toBe(201);
    checkDefaultCarFormat(body);
    expect(body._id).toBeDefined();
    expect(body.acessorios).toHaveLength(1);
    expect(body.__v).toBeUndefined();
    expect(body.ano).toBe(CARDATA.ano);
    expect(body.modelo).toBe(CARDATA.modelo);
    expect(body.cor).toBe(CARDATA.cor);
    expect(body.quantidadePassageiros).toBe(CARDATA.quantidadePassageiros);
  });

  test('should return 400 with errors if missing an attribute', async () => {
    const temp = {
      modelo: 'GM S10 2.8',
      ano: 2021,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    const response = await request(app).post(CARPREFIX).set(TOKEN).send(temp);
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
      .post(CARPREFIX)
      .set(TOKEN)
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
    const response = await request(app).post(CARPREFIX).set(TOKEN).send(temp);
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
    const response = await request(app).post(CARPREFIX).set(TOKEN).send(temp);

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
    const response = await request(app).post(CARPREFIX).set(TOKEN).send(temp);

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
    const response = await request(app).post(CARPREFIX).set(TOKEN).send(temp);

    const { body } = response;
    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('acessorios.1');
    expect(body[0].name).toBe('"acessorios[1]" contains a duplicate value');
  });
});
