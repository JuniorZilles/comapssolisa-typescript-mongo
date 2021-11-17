import request from 'supertest';
import { Rental } from '@interfaces/rental/Rental';
import app from '../../../src/app';
import factory from '../../utils/factorys/RentalFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { RENTALPREFIX } from '../../utils/Constants';
import { checkDefaultRentalFormat } from '../../utils/formats/RentalFormat';

describe('src :: api :: controllers :: rental :: getById', () => {
  test('should get a rental company by ID', async () => {
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).get(`${RENTALPREFIX}/${tempData._id}`);

    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultRentalFormat(body);
    expect(body.endereco.length).toEqual(tempData.endereco.length);
    expect(body.nome).toBe(tempData.nome);
    expect(body.cnpj).toBe(tempData.cnpj);
    expect(body.atividades).toBe(tempData.atividades);
    body.endereco.forEach((endereco, index) => {
      expect(endereco.cep).toBe(tempData.endereco[index].cep);
      expect(endereco.number).toBe(tempData.endereco[index].number);
      expect(endereco.isFilial).toBe(tempData.endereco[index].isFilial);
    });
  });

  test('should return 400 with errors if ID is invalid when searching', async () => {
    const response = await request(app).get(`${RENTALPREFIX}/12`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when searching', async () => {
    const response = await request(app).get(`${RENTALPREFIX}/6171508962f47a7a91938d30`);
    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });
});
