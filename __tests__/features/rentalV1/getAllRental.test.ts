import request from 'supertest';
import { Rental } from '@interfaces/Rental';
import app from '../../../src/app';
import factory from '../../utils/factorys/RentalFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { RENTALPREFIX } from '../../utils/Constants';
import { checkDefaultRentalsFormat } from '../../utils/formats/RentalFormat';

describe('src :: api :: controllers :: rental :: getAll', () => {
  test('should get 5 each rental companys with pagination', async () => {
    await factory.createMany<Rental>('Rental', 25);

    const responseP0 = await request(app).get(`${RENTALPREFIX}?offset=0&limit=5`);
    const rentalP0 = responseP0.body;

    expect(responseP0.status).toBe(200);
    checkDefaultRentalsFormat(rentalP0);
    expect(rentalP0.locadoras.length).toEqual(5);
    expect(rentalP0.offset).toEqual(1);
    expect(rentalP0.limit).toEqual(5);
    expect(rentalP0.total).toEqual(25);
    expect(rentalP0.offsets).toEqual(5);

    const responseP1 = await request(app).get(`${RENTALPREFIX}?offset=1&limit=5`);
    const rentalP1 = responseP1.body;
    expect(responseP1.status).toBe(200);
    checkDefaultRentalsFormat(rentalP1);
    expect(rentalP1.locadoras.length).toEqual(5);
    expect(rentalP1.offset).toEqual(1);
    expect(rentalP1.limit).toEqual(5);
    expect(rentalP1.total).toEqual(25);
    expect(rentalP1.offsets).toEqual(5);
  });

  test('should get all rental company by nome', async () => {
    const locadora = await factory.create<Rental>('Rental', {
      nome: 'Trevor Rental'
    });
    await factory.createMany<Rental>('Rental', 5);

    const response = await request(app).get(`${RENTALPREFIX}?offset=0&limit=10&nome=Trevor Rental`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultRentalsFormat(body);
    expect(body.locadoras.length).toEqual(1);
    expect(body.locadoras[0].__v).toBeUndefined();
    expect(body.locadoras[0]._id).toBe(locadora._id?.toString());
    expect(body.locadoras[0].atividades).toBe(locadora.atividades);
    expect(body.locadoras[0].cnpj).toBe(locadora.cnpj);
    expect(body.locadoras[0].nome).toBe(locadora.nome);
    expect(body.locadoras[0].endereco.length).toEqual(locadora.endereco.length);
  });

  test('should return 400 and not get a rental company by cnpj', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?cnpj=123456`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cnpj');
    expect(body[0].name).toBe('"cnpj" has a invalid format, it should be XX.XXX.XXX/XXXX-XX');
  });

  test('should return 400 and not get a rental company by nome if empty', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?nome=`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is not allowed to be empty');
  });

  test('should return 400 and not get a rental company by atividades if empty', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?atividades=`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('atividades');
    expect(body[0].name).toBe('"atividades" is not allowed to be empty');
  });

  test('should return 400 and not get a rental company by number if empty', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?number=`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('number');
    expect(body[0].name).toBe('"number" is not allowed to be empty');
  });

  test('should return 400 and not get a rental company by complemento if empty', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?complemento=`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('complemento');
    expect(body[0].name).toBe('"complemento" is not allowed to be empty');
  });

  test('should return 400 and not get a rental company by logradouro if empty', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?logradouro=`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('logradouro');
    expect(body[0].name).toBe('"logradouro" is not allowed to be empty');
  });

  test('should return 400 and not get a rental company by bairro if empty', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?bairro=`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('bairro');
    expect(body[0].name).toBe('"bairro" is not allowed to be empty');
  });

  test('should return 400 and not get a rental company by uf if has length more than 2', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?uf=abc`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('uf');
    expect(body[0].name).toBe('"uf" length must be 2 characters long');
  });

  test('should return 400 and not get a rental company by cep if is invalid format', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?cep=123-789`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cep');
    expect(body[0].name).toBe('"cep" with incorrect format, it should be XXXXX-XXX');
  });

  test('should get all rental company that by bairro', async () => {
    const locadora = await factory.create<Rental>('Rental', {
      endereco: [
        {
          cep: '96200-200',
          logradouro: 'Rua General Canabarro',
          complemento: '',
          bairro: 'Centro',
          number: '1234',
          localidade: 'Rio Grande',
          uf: 'SP',
          isFilial: false
        }
      ]
    });
    await factory.createMany<Rental>('Rental', 5);

    const response = await request(app).get(`${RENTALPREFIX}?offset=0&limit=10&bairro=Centro`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultRentalsFormat(body);
    expect(body.locadoras.length).toEqual(1);
    expect(body.locadoras[0].__v).toBeUndefined();
    expect(body.locadoras[0]._id).toBe(locadora._id?.toString());
    expect(body.locadoras[0].atividades).toBe(locadora.atividades);
    expect(body.locadoras[0].cnpj).toBe(locadora.cnpj);
    expect(body.locadoras[0].nome).toBe(locadora.nome);
    expect(body.locadoras[0].endereco.length).toEqual(locadora.endereco.length);
  });

  test('should not get any rental company', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?offset=0&limit=10&nome=Trevor Rental`);
    const { body } = response;

    expect(response.status).toBe(200);
    expect(body).toEqual({
      locadoras: expect.any(Array),
      total: expect.any(Number),
      limit: expect.any(Number),
      offset: expect.any(Number),
      offsets: expect.any(Number)
    });
    expect(body.locadoras.length).toEqual(0);
  });

  test('should not get any rental company when inputed CNPJ is invalid', async () => {
    const response = await request(app).get(`${RENTALPREFIX}?offset=0&limit=10&cnpj=16670085000155`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cnpj');
    expect(body[0].name).toBe('"cnpj" has a invalid format, it should be XX.XXX.XXX/XXXX-XX');
  });
});
