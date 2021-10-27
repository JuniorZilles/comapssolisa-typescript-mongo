/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import moment from 'moment';
import PersonModel from '@models/PersonModel';
import { PersonCreateModel } from '@models/PersonCreateModel';
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
    expect(person.dataCriacao).toBeDefined();
    expect(person.nome).toBe(personData.nome);
    expect(person.senha).toBeUndefined();
    expect(person.cpf).toBe(personData.cpf);
    expect(person.data_nascimento).toEqual(personData.data_nascimento);
    expect(person.email).toBe(personData.email);
    expect(person.habilitado).toBe(personData.habilitado);
  });

  it('should return 400 with details if missing an attribute', async () => {
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toEqual(1);
    expect(value.details[0].message).toBe('"habilitado" is required');
  });

  it('should return 400 with details if attribute is empty', async () => {
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toEqual(1);
    expect(value.details[0].message).toBe('"senha" is not allowed to be empty');
  });

  it('should return 400 with message if age is less than 18', async () => {
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
    expect(value).toHaveProperty('message');
    expect(value.message).toBe("O campo 'data_nascimento' está fora do formato padrão");
  });

  it('should return 400 with details if cpf is invalid', async () => {
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toEqual(1);
    expect(value.details[0].message).toBe(`"cpf" with value "${tempCreate.cpf}" fails to match the required pattern: /[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}\\-?[0-9]{2}/`);
  });

  it('should return 400 with details if senha has lenght less than 6 caracteres', async () => {
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toEqual(1);
    expect(value.details[0].message).toBe('"senha" length must be at least 6 characters long');
  });

  it('should return 400 with details if email is invalid', async () => {
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toEqual(1);
    expect(value.details[0].message).toBe('"email" must be a valid email');
  });

  it('should return 400 with details if habilitado has other option than sim or não', async () => {
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toEqual(1);
    expect(value.details[0].message).toBe('"habilitado" must be one of [sim, não]');
  });

  /**
     * GET LIST
     */

  it('should get all people', async () => {
    const peopleData = await factory.createMany<PersonCreateModel>('People', 5);

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
    const peopleNoData = await factory.createMany<PersonCreateModel>('People', 5, { habilitado: 'sim', nome: 'joaozinho' });
    const peopleYesData = await factory.createMany<PersonCreateModel>('People', 5, { habilitado: 'sim' });

    const response = await request(app)
      .get(`${PREFIX}?offset=5&limit=5&habilitado=sim`);
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
    const peopleData = await factory.create<PersonCreateModel>('People');

    const response = await request(app)
      .get(`${PREFIX}/${peopleData.id}`);
    const person = response.body;
    expect(response.status).toBe(200);
    expect(person.nome).toBe(peopleData.nome);
    expect(person.cpf).toBe(peopleData.cpf);
    expect(person.data_nascimento).toEqual(moment(peopleData.data_nascimento).format(
      'DD/MM/YYYY',
    ));
    expect(person.email).toBe(peopleData.email);
    expect(person.habilitado).toBe(peopleData.habilitado);
  });

  it('should return 400 with message if ID is invalid when searching', async () => {
    const response = await request(app)
      .get(`${PREFIX}/12`);
    const person = response.body;

    expect(response.status).toBe(400);
    expect(person).toHaveProperty('message');
    expect(person.message).toBe("O campo 'id' está fora do formato padrão");
  });

  it('should return 404 with message if ID is not found when searching', async () => {
    const response = await request(app)
      .get(`${PREFIX}/6171508962f47a7a91938d30`);
    const person = response.body;

    expect(response.status).toBe(404);
    expect(person).toHaveProperty('message');
    expect(person.message).toBe('Valor 6171508962f47a7a91938d30 não encontrado');
  });

  /**
     * DELETE BY ID
     */

  it("should remove a person by it's ID", async () => {
    const peopleData = await factory.create<PersonCreateModel>('People');

    const response = await request(app)
      .delete(`${PREFIX}/${peopleData.id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('should return 400 with message if ID is invalid when removing', async () => {
    const response = await request(app)
      .delete(`${PREFIX}/12`);
    const person = response.body;

    expect(response.status).toBe(400);
    expect(person).toHaveProperty('message');
    expect(person.message).toBe("O campo 'id' está fora do formato padrão");
  });

  it('should return 404 with message if ID is not found when removing', async () => {
    const response = await request(app)
      .delete(`${PREFIX}/6171508962f47a7a91938d30`);
    const person = response.body;

    expect(response.status).toBe(404);
    expect(person).toHaveProperty('message');
    expect(person.message).toBe('Valor 6171508962f47a7a91938d30 não encontrado');
  });

  /**
     * PUT BY ID
     */

  it('should update a person', async () => {
    const peopleData = await factory.create<PersonCreateModel>('People', { habilitado: 'não' });
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
    expect(new Date(personput.dataCriacao)).toEqual(peopleData.dataCriacao);
    expect(personput.nome).toBe(tempData.nome);
    expect(personput.cpf).toBe(tempData.cpf);
    expect(personput.data_nascimento).toEqual(tempData.data_nascimento);
    expect(personput.email).toBe(tempData.email);
    expect(personput.habilitado).toBe('sim');
  });

  it('should return 400 with details if missing an attribute when trying to update', async () => {
    const peopleData = await factory.create<PersonCreateModel>('People');
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toBeGreaterThanOrEqual(1);
    expect(value.details[0].message).toBe('"habilitado" must be one of [sim, não]');
  });

  it('should return 400 with message if age is less than 18 on update', async () => {
    const peopleData = await factory.create<PersonCreateModel>('People');
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
    expect(value).toHaveProperty('message');
    expect(value.message).toBe("O campo 'data_nascimento' está fora do formato padrão");
  });

  it('should return 400 with details if cpf is invalid on update', async () => {
    const peopleData = await factory.create<PersonCreateModel>('People');
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toBeGreaterThanOrEqual(1);
    expect(value.details[0].message).toBe('"cpf" with value "131.147." fails to match the required pattern: /[0-9]{3}\\.?[0-9]{3}\\.?[0-9]{3}\\-?[0-9]{2}/');
  });

  it('should return 400 with details if senha has lenght less than 6 caracteres on update', async () => {
    const peopleData = await factory.create<PersonCreateModel>('People');
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toBeGreaterThanOrEqual(1);
    expect(value.details[0].message).toBe('"senha" length must be at least 6 characters long');
  });

  it('should return 400 with details if email is invalid', async () => {
    const peopleData = await factory.create<PersonCreateModel>('People');
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toBeGreaterThanOrEqual(1);
    expect(value.details[0].message).toBe('"email" must be a valid email');
  });

  it('should return 400 with details if habilitado has other option than sim or não', async () => {
    const peopleData = await factory.create<PersonCreateModel>('People');
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
    expect(value).toHaveProperty('details');
    expect(value.details.length).toBeGreaterThanOrEqual(1);
    expect(value.details[0].message).toBe('"habilitado" must be one of [sim, não]');
  });
});
