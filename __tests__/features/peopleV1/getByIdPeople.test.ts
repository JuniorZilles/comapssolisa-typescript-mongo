import request from 'supertest';
import moment from 'moment';
import { Person } from '@interfaces/people/Person';
import app from '../../../src/app';
import factory from '../../utils/factorys/PeopleFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { PERSONPREFIX } from '../../utils/Constants';
import { checkDefaultPersonFormat } from '../../utils/formats/PeopleFormat';

describe('src :: api :: controllers :: people :: getById', () => {
  test('should get a person by ID', async () => {
    const peopleData = await factory.create<Person>('People', {
      data_nascimento: '2020-10-30'
    });

    const response = await request(app).get(`${PERSONPREFIX}/${peopleData._id}`);

    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultPersonFormat(body);
    expect(body.nome).toBe(peopleData.nome);
    expect(body.cpf).toBe(peopleData.cpf);
    const date = new Date(peopleData.data_nascimento);
    expect(body.data_nascimento).toEqual(moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
    expect(body.email).toBe(peopleData.email);
    expect(body.habilitado).toBe(peopleData.habilitado);
  });

  test('should return 400 with errors if ID is invalid when searching', async () => {
    const response = await request(app).get(`${PERSONPREFIX}/12`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when searching', async () => {
    const response = await request(app).get(`${PERSONPREFIX}/6171508962f47a7a91938d30`);
    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });
});
