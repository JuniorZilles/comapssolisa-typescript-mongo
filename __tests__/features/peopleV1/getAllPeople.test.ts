import request from 'supertest';
import moment from 'moment';
import { Person } from '@interfaces/Person';
import app from '../../../src/app';
import factory from '../../utils/factorys/PeopleFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { PERSONPREFIX } from '../../utils/Constants';
import { checkDefaultPeopleFormat } from '../../utils/formats/PeopleFormat';

describe('src :: api :: controllers :: people :: getAll', () => {
  test('should get all people', async () => {
    const peopleData = await factory.createMany<Person>('People', 5);

    const response = await request(app).get(`${PERSONPREFIX}?offset=0&limit=${peopleData.length}`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultPeopleFormat(body);
    expect(body.total).toEqual(5);
    expect(body.limit).toEqual(5);
    expect(body.offset).toEqual(1);
    expect(body.offsets).toEqual(1);
    expect(body.pessoas.length).toEqual(peopleData.length);
  });

  test('should get all people that by habilitado', async () => {
    await factory.createMany<Person>('People', 5, {
      habilitado: 'sim',
      nome: 'joaozinho'
    });
    await factory.createMany<Person>('People', 5, {
      habilitado: 'sim'
    });

    const response = await request(app).get(`${PERSONPREFIX}?offset=1&limit=5&habilitado=sim`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultPeopleFormat(body);
    expect(body.total).toEqual(10);
    expect(body.limit).toEqual(5);
    expect(body.offset).toEqual(1);
    expect(body.offsets).toEqual(2);
    expect(body.pessoas.length).toEqual(5);
  });

  test('should get a person by nome', async () => {
    const tempPerson = await factory.create<Person>('People', {
      nome: 'joaozinho'
    });
    await factory.createMany<Person>('People', 2);

    const response = await request(app).get(`${PERSONPREFIX}?nome=${tempPerson.nome}`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultPeopleFormat(body);
    expect(body.total).toEqual(1);
    expect(body.limit).toEqual(100);
    expect(body.offset).toEqual(1);
    expect(body.offsets).toEqual(1);
    expect(body.pessoas.length).toEqual(1);
    const date = new Date(tempPerson.data_nascimento);
    expect(body.pessoas[0]).toEqual({
      _id: tempPerson._id?.toString(),
      cpf: tempPerson.cpf,
      data_nascimento: moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      email: tempPerson.email,
      habilitado: tempPerson.habilitado,
      nome: tempPerson.nome
    });
  });

  test('should get a person by cpf', async () => {
    const tempPerson = await factory.create<Person>('People', {
      cpf: '758.889.300-16'
    });
    await factory.createMany<Person>('People', 2);

    const response = await request(app).get(`${PERSONPREFIX}?cpf=${tempPerson.cpf}`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultPeopleFormat(body);
    expect(body.total).toEqual(1);
    expect(body.limit).toEqual(100);
    expect(body.offset).toEqual(1);
    expect(body.offsets).toEqual(1);
    expect(body.pessoas.length).toEqual(1);
    const date = new Date(tempPerson.data_nascimento);
    expect(body.pessoas[0]).toEqual({
      _id: tempPerson._id?.toString(),
      cpf: tempPerson.cpf,
      data_nascimento: moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      email: tempPerson.email,
      habilitado: tempPerson.habilitado,
      nome: tempPerson.nome
    });
  });

  test('should get a person by data_nascimento', async () => {
    const tempPerson = await factory.create<Person>('People', {
      data_nascimento: '2000-10-12 00:00:00'
    });
    const date = new Date(tempPerson.data_nascimento);
    const formatedDate = moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
    await factory.createMany<Person>('People', 2);

    const response = await request(app).get(`${PERSONPREFIX}?data_nascimento=${formatedDate}`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultPeopleFormat(body);
    expect(body.total).toEqual(1);
    expect(body.limit).toEqual(100);
    expect(body.offset).toEqual(1);
    expect(body.offsets).toEqual(1);
    expect(body.pessoas.length).toEqual(1);
    expect(body.pessoas[0]).toEqual({
      _id: tempPerson._id?.toString(),
      cpf: tempPerson.cpf,
      data_nascimento: formatedDate,
      email: tempPerson.email,
      habilitado: tempPerson.habilitado,
      nome: tempPerson.nome
    });
  });

  test('should return 400 and not get a person by cpf if is invalid format', async () => {
    const response = await request(app).get(`${PERSONPREFIX}?cpf=123-789`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cpf');
    expect(body[0].name).toBe('"cpf" has a invalid format, it should be XXX.XXX.XXX-XX');
  });

  test('should return 400 and not get a person by data_nascimento if is invalid format', async () => {
    const response = await request(app).get(`${PERSONPREFIX}?data_nascimento=123-789`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('data_nascimento');
    expect(body[0].name).toBe('"data_nascimento" must be in DD/MM/YYYY format');
  });

  test('should get a person by email', async () => {
    const tempPerson = await factory.create<Person>('People');
    const date = new Date(tempPerson.data_nascimento);
    await factory.createMany<Person>('People', 2);

    const response = await request(app).get(`${PERSONPREFIX}?email=${tempPerson.email}`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultPeopleFormat(body);
    expect(body.total).toEqual(1);
    expect(body.limit).toEqual(100);
    expect(body.offset).toEqual(1);
    expect(body.offsets).toEqual(1);
    expect(body.pessoas).toHaveLength(1);
    expect(body.pessoas[0]).toEqual({
      _id: tempPerson._id?.toString(),
      cpf: tempPerson.cpf,
      data_nascimento: moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
      email: tempPerson.email,
      habilitado: tempPerson.habilitado,
      nome: tempPerson.nome
    });
  });

  test('should not get any people', async () => {
    const response = await request(app).get(`${PERSONPREFIX}?offset=1&limit=5&habilitado=sim`);
    const { body } = response;

    expect(response.status).toBe(200);
    expect(body).toEqual({
      pessoas: expect.any(Array),
      total: expect.any(Number),
      limit: expect.any(Number),
      offset: expect.any(Number),
      offsets: expect.any(Number)
    });
    expect(body.total).toEqual(0);
    expect(body.limit).toEqual(5);
    expect(body.offset).toEqual(1);
    expect(body.offsets).toEqual(1);
    expect(body.pessoas.length).toEqual(0);
  });
});
