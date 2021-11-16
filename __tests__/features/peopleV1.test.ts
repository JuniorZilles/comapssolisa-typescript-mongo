/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import moment from 'moment';
import PersonModel from '@models/PersonModel';
import { Person } from '@interfaces/Person';
import factory from '../utils/PeopleFactory';
import checkDefaultErrorFormat from '../utils/CheckErrorFormat';
import MongoDatabase from '../../src/infra/mongo/index';
import app from '../../src/app';

const PREFIX = '/api/v1/people';
const personData = {
  nome: 'joaozinho ciclano',
  cpf: '131.147.860-49',
  data_nascimento: '03/03/2000',
  email: 'joazinho@email.com',
  senha: '123456',
  habilitado: 'sim'
};

const checkDefaultPersonFormat = (body) => {
  expect(body).toEqual({
    _id: expect.any(String),
    cpf: expect.any(String),
    nome: expect.any(String),
    data_nascimento: expect.any(String),
    email: expect.any(String),
    habilitado: expect.any(String)
  });
};

const checkDefaultPeopleFormat = (body) => {
  expect(body).toEqual({
    pessoas: expect.arrayContaining([
      {
        _id: expect.any(String),
        cpf: expect.any(String),
        nome: expect.any(String),
        data_nascimento: expect.any(String),
        email: expect.any(String),
        habilitado: expect.any(String)
      }
    ]),
    total: expect.any(Number),
    limit: expect.any(Number),
    offset: expect.any(Number),
    offsets: expect.any(Number)
  });
};

describe('src :: api :: controllers :: people', () => {
  beforeAll(async () => {
    await PersonModel.deleteMany();
  });
  afterAll(async () => {
    await MongoDatabase.disconect();
  });
  afterEach(async () => {
    await PersonModel.deleteMany();
  });

  /**
   * POST CREATE
   */
  test('should create a person', async () => {
    const response = await request(app).post(PREFIX).send(personData);

    const { body } = response;
    expect(response.status).toBe(201);
    checkDefaultPersonFormat(body);
    expect(body.nome).toBe(personData.nome);
    expect(body.__v).toBeUndefined();
    expect(body.cpf).toBe(personData.cpf);
    expect(body.data_nascimento).toEqual(personData.data_nascimento);
    expect(body.email).toBe(personData.email);
    expect(body.habilitado).toBe(personData.habilitado);
  });

  test('should return 400 with errors if missing an attribute', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('habilitado');
    expect(body[0].name).toBe('"habilitado" is required');
  });

  test('should return 400 with errors if attribute is empty', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '',
      habilitado: 'sim'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('senha');
    expect(body[0].name).toBe('"senha" is not allowed to be empty');
  });

  test('should return 400 with errors if age is less than 18', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2010',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe("The field 'data_nascimento' is out of the standard format");
  });

  test('should return 400 with errors if cpf is invalid', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cpf');
    expect(body[0].name).toBe('"cpf" has a invalid format, it should be XXX.XXX.XXX-XX');
  });

  test('should return 400 with errors if cpf calculation is invalid', async () => {
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: '123.456.789-10',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    const response = await request(app).post(PREFIX).send(tempData);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe(`CPF ${tempData.cpf} is invalid`);
  });

  test('should return 400 with errors if senha has lenght less than 6 caracteres', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123',
      habilitado: 'sim'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('senha');
    expect(body[0].name).toBe('"senha" length must be at least 6 characters long');
  });

  test('should return 400 with errors if email is invalid', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho',
      senha: '123456',
      habilitado: 'sim'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('email');
    expect(body[0].name).toBe('"email" must be a valid email');
  });

  test('should return 400 with errors if habilitado has other option than sim or não', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '847.331.290-25',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'talvez'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('habilitado');
    expect(body[0].name).toBe('"habilitado" must be one of [sim, não]');
  });

  test('should return 400 with errors if cpf already exists', async () => {
    const peopleData = await factory.create<Person>('People', {
      cpf: '847.331.290-25'
    });
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: peopleData.cpf,
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Conflict');
    expect(body[0].name).toBe(`CPF ${peopleData.cpf} already in use`);
  });

  test('should return 400 with errors if email already exists', async () => {
    const peopleData = await factory.create<Person>('People');
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '847.331.290-25',
      data_nascimento: '03/03/2000',
      email: peopleData.email,
      senha: '123456',
      habilitado: 'sim'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Conflict');
    expect(body[0].name).toBe(`Email ${peopleData.email} already in use`);
  });

  test('should return 400 with errors if nome has withe spaces', async () => {
    const tempCreate = {
      nome: '  ',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'talvez'
    };
    const response = await request(app).post(PREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is not allowed to be empty');
  });

  /**
   * GET LIST
   */

  test('should get all people', async () => {
    const peopleData = await factory.createMany<Person>('People', 5);

    const response = await request(app).get(`${PREFIX}?offset=0&limit=${peopleData.length}`);
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

    const response = await request(app).get(`${PREFIX}?offset=1&limit=5&habilitado=sim`);
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

    const response = await request(app).get(`${PREFIX}?nome=${tempPerson.nome}`);
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

    const response = await request(app).get(`${PREFIX}?cpf=${tempPerson.cpf}`);
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

    const response = await request(app).get(`${PREFIX}?data_nascimento=${formatedDate}`);
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
    const response = await request(app).get(`${PREFIX}?cpf=123-789`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cpf');
    expect(body[0].name).toBe('"cpf" has a invalid format, it should be XXX.XXX.XXX-XX');
  });

  test('should return 400 and not get a person by data_nascimento if is invalid format', async () => {
    const response = await request(app).get(`${PREFIX}?data_nascimento=123-789`);
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

    const response = await request(app).get(`${PREFIX}?email=${tempPerson.email}`);
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
    const response = await request(app).get(`${PREFIX}?offset=1&limit=5&habilitado=sim`);
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

  /**
   * GET BY ID
   */

  test('should get a person by ID', async () => {
    const peopleData = await factory.create<Person>('People', {
      data_nascimento: '2020-10-30'
    });

    const response = await request(app).get(`${PREFIX}/${peopleData._id}`);

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
    const response = await request(app).get(`${PREFIX}/12`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when searching', async () => {
    const response = await request(app).get(`${PREFIX}/6171508962f47a7a91938d30`);
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

  test("should remove a person by it's ID", async () => {
    const peopleData = await factory.create<Person>('People');

    const response = await request(app).delete(`${PREFIX}/${peopleData._id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  test('should return 400 with errors if ID is invalid when removing', async () => {
    const response = await request(app).delete(`${PREFIX}/12`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when removing', async () => {
    const response = await request(app).delete(`${PREFIX}/6171508962f47a7a91938d30`);
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

  test('should update a person', async () => {
    const peopleData = await factory.create<Person>('People', {
      habilitado: 'não'
    });
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    const responseput = await request(app).put(`${PREFIX}/${peopleData._id}`).send(tempData);

    const { body } = responseput;

    expect(responseput.status).toBe(200);
    checkDefaultPersonFormat(body);
    expect(body._id).toBe(peopleData._id?.toString());
    expect(body.nome).toBe(tempData.nome);
    expect(body.cpf).toBe(tempData.cpf);
    expect(body.data_nascimento).toEqual(tempData.data_nascimento);
    expect(body.email).toBe(tempData.email);
    expect(body.habilitado).toBe('sim');
  });

  test('should return 400 with errors if missing an attribute when trying to update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app).put(`${PREFIX}/${peopleData._id}`).send({
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: ''
    });
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('habilitado');
    expect(body[0].name).toBe('"habilitado" must be one of [sim, não]');
  });

  test('should return 400 with errors if age is less than 18 on update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app).put(`${PREFIX}/${peopleData._id}`).send({
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2010',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    });
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe("The field 'data_nascimento' is out of the standard format");
  });

  test('should return 400 with errors if cpf is invalid on update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app).put(`${PREFIX}/${peopleData._id}`).send({
      nome: 'joaozinho ciclano',
      cpf: '131.147.',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    });
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cpf');
    expect(body[0].name).toBe('"cpf" has a invalid format, it should be XXX.XXX.XXX-XX');
  });

  test('should return 400 with errors if cpf calculation is invalid on update', async () => {
    const peopleData = await factory.create<Person>('People');
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.456-85',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    const response = await request(app).put(`${PREFIX}/${peopleData._id}`).send(tempData);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe(`CPF ${tempData.cpf} is invalid`);
  });

  test('should return 400 with errors if senha has lenght less than 6 caracteres on update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app).put(`${PREFIX}/${peopleData._id}`).send({
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '1234',
      habilitado: 'sim'
    });
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('senha');
    expect(body[0].name).toBe('"senha" length must be at least 6 characters long');
  });

  test('should return 400 with errors if email is invalid', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app).put(`${PREFIX}/${peopleData._id}`).send({
      nome: 'joaozinho ciclano',
      cpf: '847.331.290-25',
      data_nascimento: '03/03/2000',
      email: 'joazinho',
      senha: '123456',
      habilitado: 'sim'
    });
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('email');
    expect(body[0].name).toBe('"email" must be a valid email');
  });

  test('should return 400 with errors if habilitado has other option than sim or não', async () => {
    const peopleData = await factory.create<Person>('People');

    const response = await request(app).put(`${PREFIX}/${peopleData._id}`).send({
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'talvez'
    });
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('habilitado');
    expect(body[0].name).toBe('"habilitado" must be one of [sim, não]');
  });

  test('should return 400 with errors if cpf or email are already used by naother person', async () => {
    const peopleData1 = await factory.create<Person>('People');
    const peopleData2 = await factory.create<Person>('People', {
      cpf: '847.331.290-25'
    });
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: peopleData2.cpf,
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    const response = await request(app).put(`${PREFIX}/${peopleData1._id}`).send(tempData);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Conflict');
    expect(body[0].name).toBe(`CPF ${tempData.cpf} already in use`);
  });

  test('should return 400 with errors if nome is empty', async () => {
    const peopleData = await factory.create<Person>('People');

    const response = await request(app).put(`${PREFIX}/${peopleData._id}`).send({
      nome: '   ',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'talvez'
    });
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is not allowed to be empty');
  });
});
