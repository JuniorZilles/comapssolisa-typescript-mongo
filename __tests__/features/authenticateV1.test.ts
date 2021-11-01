import request from 'supertest';
import PersonModel from '@models/PersonModel';
import { PersonCreateModel } from '@models/PersonCreateModel';
import factory from '../utils/PeopleFactory';
import MongoDatabase from '../../src/infra/mongo/index';
import app from '../../src/app';

const PREFIX = '/api/v1/authenticate';

describe('src :: api :: controllers :: authenticate', () => {
  beforeAll(async () => {
    await PersonModel.deleteMany();
  });
  afterAll(async () => {
    await MongoDatabase.disconect();
  });
  afterEach(async () => {
    await PersonModel.deleteMany();
  });

  it('Should authenticate and return token, email, habilitado', async () => {
    const personData = await factory.create<PersonCreateModel>('People', { senha: '123456' });
    const response = await request(app)
      .post(PREFIX)
      .send({ email: personData.email as string, senha: '123456' });

    const header = response.headers;

    expect(response.status).toBe(204);
    expect(header.token).toBeDefined();
  });

  it('Should not authenticate and return status 400 with invalid field', async () => {
    const personData = await factory.create<PersonCreateModel>('People');
    const response = await request(app)
      .post(PREFIX)
      .send({ email: personData.email, senha: '123456' });

    const person = response.body;

    expect(response.status).toBe(400);
    expect(person.length).toEqual(1);
    expect(person[0].description).toBe('senha');
    expect(person[0].name).toBe('The value ****** for senha is invalid');
  });

  it('Should not authenticate and return status 404 with not found value', async () => {
    const response = await request(app)
      .post(PREFIX)
      .send({ email: 'joazinho@mail.com', senha: '123456' });

    const person = response.body;

    expect(response.status).toBe(404);
    expect(person.length).toEqual(1);
    expect(person[0].description).toBe('Not Found');
    expect(person[0].name).toBe('Value joazinho@mail.com not found');
  });

  it('Should return 400 with validation details for missing email', async () => {
    const response = await request(app)
      .post(PREFIX)
      .send({ senha: '123456' });

    const person = response.body;

    expect(response.status).toBe(400);
    expect(person).toHaveProperty('details');
    expect(person.details.length).toEqual(1);
    expect(person.details[0].message).toBe('"email" is required');
  });

  it('Should return 400 with validation details for missing password', async () => {
    const response = await request(app)
      .post(PREFIX)
      .send({ email: 'joazinho@mail.com' });

    const person = response.body;

    expect(response.status).toBe(400);
    expect(person).toHaveProperty('details');
    expect(person.details.length).toEqual(1);
    expect(person.details[0].message).toBe('"senha" is required');
  });

  it('Should return 400 with validation details for password that is empty', async () => {
    const response = await request(app)
      .post(PREFIX)
      .send({ email: 'joazinho@mail.com', senha: '' });

    const person = response.body;

    expect(response.status).toBe(400);
    expect(person).toHaveProperty('details');
    expect(person.details.length).toEqual(1);
    expect(person.details[0].message).toBe('"senha" is not allowed to be empty');
  });

  it('Should return 400 with validation details for password that has less than 6 characters', async () => {
    const response = await request(app)
      .post(PREFIX)
      .send({ email: 'joazinho@mail.com', senha: '125' });

    const person = response.body;

    expect(response.status).toBe(400);
    expect(person).toHaveProperty('details');
    expect(person.details.length).toEqual(1);
    expect(person.details[0].message).toBe('"senha" length must be at least 6 characters long');
  });

  it('Should return 400 with validation details for invalid email', async () => {
    const response = await request(app)
      .post(PREFIX)
      .send({ email: 'joazinho', senha: '123456' });

    const person = response.body;

    expect(response.status).toBe(400);
    expect(person).toHaveProperty('details');
    expect(person.details.length).toEqual(1);
    expect(person.details[0].message).toBe('"email" must be a valid email');
  });
});
