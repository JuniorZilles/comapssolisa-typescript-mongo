/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import moment from 'moment';
import PersonModel from '@models/PersonModel';
import { Person } from '@interfaces/Person';
import factory from '../utils/PeopleFactory';
import MongoDatabase from '../../src/infra/mongo/index';
import app from '../../src/app';

const PREFIX = '/api/v1/people';
const personData = {
  nome: 'joaozinho ciclano',
  cpf: '131.147.860-49',
  data_nascimento: '03/03/2000',
  email: 'joazinho@email.com',
  senha: '123456',
  habilitado: 'sim',
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
  it('should create a person', async () => {
    const response = await request(app)
      .post(PREFIX)
      .send(personData);

    const person = response.body;
    expect(response.status).toBe(201);
    expect(person._id).toBeDefined();
    expect(person.nome).toBe(personData.nome);
    expect(person.senha).toBeUndefined();
    expect(person.cpf).toBe(personData.cpf);
    expect(person.data_nascimento).toEqual(personData.data_nascimento);
    expect(person.email).toBe(personData.email);
    expect(person.habilitado).toBe(personData.habilitado);
  });

  it('should return 400 with errors if missing an attribute', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('habilitado');
    expect(value[0].name).toBe('"habilitado" is required');
  });

  it('should return 400 with errors if attribute is empty', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '',
      habilitado: 'sim',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('senha');
    expect(value[0].name).toBe('"senha" is not allowed to be empty');
  });

  it('should return 400 with errors if age is less than 18', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2010',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toEqual(1);
    expect(value[0].description).toBe('data_nascimento');
    expect(value[0].name).toBe("The field 'data_nascimento' is out of the standard format");
  });

  it('should return 400 with errors if cpf is invalid', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('cpf');
    expect(value[0].name).toBe('Invalid CPF');
  });

  it('should return 400 with errors if senha has lenght less than 6 caracteres', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123',
      habilitado: 'sim',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('senha');
    expect(value[0].name).toBe('"senha" length must be at least 6 characters long');
  });

  it('should return 400 with errors if email is invalid', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho',
      senha: '123456',
      habilitado: 'sim',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('email');
    expect(value[0].name).toBe('"email" must be a valid email');
  });

  it('should return 400 with errors if habilitado has other option than sim or não', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'talvez',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('habilitado');
    expect(value[0].name).toBe('"habilitado" must be one of [sim, não]');
  });

  it('should return 400 with errors if cpf or email already exists', async () => {
    const peopleData = await factory.create<Person>('People');
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: peopleData.cpf,
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toEqual(1);
    expect(value[0].description).toBe('conflict');
    expect(value[0].name).toBe(`CPF ${peopleData.cpf} already in use`);
  });

  it('should return 400 with errors if nome has withe spaces', async () => {
    const tempCreate = {
      nome: '  ',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'talvez',
    };
    const response = await request(app)
      .post(PREFIX)
      .send(tempCreate);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('nome');
    expect(value[0].name).toBe('"nome" is not allowed to be empty');
  });

  /**
     * GET LIST
     */

  it('should get all people', async () => {
    const peopleData = await factory.createMany<Person>('People', 5);

    const response = await request(app)
      .get(`${PREFIX}?offset=0&limit=${peopleData.length}`);
    const people = response.body;

    expect(response.status).toBe(200);
    expect(people).toHaveProperty('pessoas');
    expect(people).toHaveProperty('total');
    expect(people).toHaveProperty('limit');
    expect(people).toHaveProperty('offset');
    expect(people).toHaveProperty('offsets');
    expect(people.pessoas.length).toEqual(peopleData.length);
  });

  it('should get all people that by habilitado', async () => {
    const peopleNoData = await factory.createMany<Person>('People', 5, { habilitado: 'sim', nome: 'joaozinho' });
    const peopleYesData = await factory.createMany<Person>('People', 5, { habilitado: 'sim' });

    const response = await request(app)
      .get(`${PREFIX}?offset=1&limit=5&habilitado=sim`);
    const people = response.body;

    expect(response.status).toBe(200);
    expect(people).toHaveProperty('pessoas');
    expect(people).toHaveProperty('total');
    expect(people).toHaveProperty('limit');
    expect(people).toHaveProperty('offset');
    expect(people).toHaveProperty('offsets');
    expect(people.pessoas.length).toEqual(5);
  });

  it('should not get any people', async () => {
    const response = await request(app)
      .get(`${PREFIX}?offset=1&limit=5&habilitado=sim`);
    const people = response.body;

    expect(response.status).toBe(200);
    expect(people).toHaveProperty('pessoas');
    expect(people).toHaveProperty('total');
    expect(people).toHaveProperty('limit');
    expect(people).toHaveProperty('offset');
    expect(people).toHaveProperty('offsets');
    expect(people.pessoas.length).toEqual(0);
  });

  /**
     * GET BY ID
     */

  it('should get a person by ID', async () => {
    const peopleData = await factory.create<Person>('People', { data_nascimento: '2020-10-30' });

    const response = await request(app)
      .get(`${PREFIX}/${peopleData.id}`);

    const person = response.body;
    expect(response.status).toBe(200);
    expect(person.nome).toBe(peopleData.nome);
    expect(person.cpf).toBe(peopleData.cpf);
    const date = new Date(peopleData.data_nascimento);
    expect(person.data_nascimento).toEqual(moment(date, 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY',
    ));
    expect(person.email).toBe(peopleData.email);
    expect(person.habilitado).toBe(peopleData.habilitado);
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
    const person = response.body;

    expect(response.status).toBe(404);
    expect(person.length).toEqual(1);
    expect(person[0].description).toBe('Not Found');
    expect(person[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
     * DELETE BY ID
     */

  it("should remove a person by it's ID", async () => {
    const peopleData = await factory.create<Person>('People');

    const response = await request(app)
      .delete(`${PREFIX}/${peopleData.id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
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

  it('should return 404 with error if ID is not found when removing', async () => {
    const response = await request(app)
      .delete(`${PREFIX}/6171508962f47a7a91938d30`);
    const person = response.body;

    expect(response.status).toBe(404);
    expect(person.length).toEqual(1);
    expect(person[0].description).toBe('Not Found');
    expect(person[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
     * PUT BY ID
     */

  it('should update a person', async () => {
    const peopleData = await factory.create<Person>('People', { habilitado: 'não' });
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim',
    };
    const responseput = await request(app)
      .put(`${PREFIX}/${peopleData.id}`)
      .send(tempData);

    const personput = responseput.body;

    expect(responseput.status).toBe(200);

    expect(personput._id).toBe(peopleData.id);
    expect(personput.nome).toBe(tempData.nome);
    expect(personput.cpf).toBe(tempData.cpf);
    expect(personput.data_nascimento).toEqual(tempData.data_nascimento);
    expect(personput.email).toBe(tempData.email);
    expect(personput.habilitado).toBe('sim');
  });

  it('should return 400 with errors if missing an attribute when trying to update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app)
      .put(`${PREFIX}/${peopleData.id}`)
      .send({
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: '',
      });
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('habilitado');
    expect(value[0].name).toBe('"habilitado" must be one of [sim, não]');
  });

  it('should return 400 with errors if age is less than 18 on update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app)
      .put(`${PREFIX}/${peopleData.id}`)
      .send({
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2010',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: 'sim',
      });
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toEqual(1);
    expect(value[0].description).toBe('data_nascimento');
    expect(value[0].name).toBe("The field 'data_nascimento' is out of the standard format");
  });

  it('should return 400 with errors if cpf is invalid on update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app)
      .put(`${PREFIX}/${peopleData.id}`)
      .send({
        nome: 'joaozinho ciclano',
        cpf: '131.147.',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: 'sim',
      });
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('cpf');
    expect(value[0].name).toBe('Invalid CPF');
  });

  it('should return 400 with errors if senha has lenght less than 6 caracteres on update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app)
      .put(`${PREFIX}/${peopleData.id}`)
      .send({
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '1234',
        habilitado: 'sim',
      });
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('senha');
    expect(value[0].name).toBe('"senha" length must be at least 6 characters long');
  });

  it('should return 400 with errors if email is invalid', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app)
      .put(`${PREFIX}/${peopleData.id}`)
      .send({
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho',
        senha: '123456',
        habilitado: 'sim',
      });
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('email');
    expect(value[0].name).toBe('"email" must be a valid email');
  });

  it('should return 400 with errors if habilitado has other option than sim or não', async () => {
    const peopleData = await factory.create<Person>('People');

    const response = await request(app)
      .put(`${PREFIX}/${peopleData.id}`)
      .send({
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: 'talvez',
      });
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('habilitado');
    expect(value[0].name).toBe('"habilitado" must be one of [sim, não]');
  });

  it('should return 400 with errors if cpf or email are already used by naother person', async () => {
    const peopleData1 = await factory.create<Person>('People');
    const peopleData2 = await factory.create<Person>('People');
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: peopleData2.cpf,
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim',
    };
    const response = await request(app)
      .put(`${PREFIX}/${peopleData1.id}`)
      .send(tempData);
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toEqual(1);
    expect(value[0].description).toBe('conflict');
    expect(value[0].name).toBe(`CPF ${tempData.cpf} already in use`);
  });

  it('should return 400 with errors if nome is empty', async () => {
    const peopleData = await factory.create<Person>('People');

    const response = await request(app)
      .put(`${PREFIX}/${peopleData.id}`)
      .send({
        nome: '   ',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: 'talvez',
      });
    const value = response.body;

    expect(response.status).toBe(400);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value[0].description).toBe('nome');
    expect(value[0].name).toBe('"nome" is not allowed to be empty');
  });
});
