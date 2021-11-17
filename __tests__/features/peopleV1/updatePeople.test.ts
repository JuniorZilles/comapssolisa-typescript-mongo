import request from 'supertest';
import { Person } from '@interfaces/people/Person';
import app from '../../../src/app';
import factory from '../../utils/factorys/PeopleFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { PERSONPREFIX } from '../../utils/Constants';
import { checkDefaultPersonFormat } from '../../utils/formats/PeopleFormat';

describe('src :: api :: controllers :: people :: update', () => {
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
    const responseput = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send(tempData);

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
    const response = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send({
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
    const response = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send({
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
    const response = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send({
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
    const response = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send(tempData);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe(`CPF ${tempData.cpf} is invalid`);
  });

  test('should return 400 with errors if senha has lenght less than 6 caracteres on update', async () => {
    const peopleData = await factory.create<Person>('People');
    const response = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send({
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
    const response = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send({
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

    const response = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send({
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
    const response = await request(app).put(`${PERSONPREFIX}/${peopleData1._id}`).send(tempData);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Conflict');
    expect(body[0].name).toBe(`CPF ${tempData.cpf} already in use`);
  });

  test('should return 400 with errors if nome is empty', async () => {
    const peopleData = await factory.create<Person>('People');

    const response = await request(app).put(`${PERSONPREFIX}/${peopleData._id}`).send({
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
