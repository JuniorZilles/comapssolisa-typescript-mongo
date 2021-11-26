import InvalidValue from '@errors/InvalidValue';
import PeopleService from '@services/people';
import { PERSONDATA } from '../../utils/Constants';

describe('src :: api :: services :: people :: create', () => {
  test('should create a person', async () => {
    const person = await PeopleService.create(PERSONDATA);
    expect(person._id).toBeDefined();
    expect(person.cpf).toBe(PERSONDATA.cpf);
    expect(person.data_nascimento).toEqual(new Date(PERSONDATA.data_nascimento));
    expect(person.email).toBe(PERSONDATA.email);
    expect(person.nome).toBe(PERSONDATA.nome);
    expect(person.habilitado).toBe(PERSONDATA.habilitado);
  });

  test('should not create a person if data_nascimento is less tan 18 years', async () => {
    const temp = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2021',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    try {
      await PeopleService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('data_nascimento');
      expect((<InvalidValue>e).name).toBe('Age is less than 18');
    }
  });

  test('should not create a person with same email or cpf', async () => {
    const temp = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    try {
      await PeopleService.create(temp);
      await PeopleService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Conflict');
      expect((<InvalidValue>e).name).toBe('CPF 131.147.860-49 already in use');
    }
  });

  test('should not create a person if CPF is not valid', async () => {
    const temp = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'sim'
    };
    try {
      await PeopleService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).name).toBe(`CPF ${temp.cpf} is invalid`);
    }
  });
});
