import request from 'supertest';
import { Person } from '@interfaces/people/Person';
import app from '../../../src/app';
import factory from '../../utils/factorys/PeopleFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { PERSONPREFIX, PERSONDATA } from '../../utils/Constants';
import { checkDefaultPersonFormat } from '../../utils/formats/PeopleFormat';

describe('src :: api :: controllers :: people :: create', () => {
  test('should create a person', async () => {
    const response = await request(app).post(PERSONPREFIX).send(PERSONDATA);

    const { body } = response;
    expect(response.status).toBe(201);
    checkDefaultPersonFormat(body);
    expect(body.nome).toBe(PERSONDATA.nome);
    expect(body.__v).toBeUndefined();
    expect(body.cpf).toBe(PERSONDATA.cpf);
    expect(body.data_nascimento).toEqual(PERSONDATA.data_nascimento);
    expect(body.email).toBe(PERSONDATA.email);
    expect(body.habilitado).toBe(PERSONDATA.habilitado);
  });

  test('should return 400 with errors if missing an attribute', async () => {
    const tempCreate = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456'
    };
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempData);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
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
    const response = await request(app).post(PERSONPREFIX).send(tempCreate);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is not allowed to be empty');
  });
});
