import InvalidField from '@errors/InvalidField';
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { Person } from '@interfaces/Person';
import PeopleService from '@services/PeopleService';
import factory from '../../utils/factorys/PeopleFactory';

describe('src :: api :: services :: people :: update', () => {
  test('should update a person by ID', async () => {
    const personGenerated = await factory.create<Person>('People');
    if (personGenerated._id) {
      const tempData = {
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: 'não'
      };
      const person = await PeopleService.update(personGenerated._id, tempData);

      expect(person._id).toEqual(personGenerated._id);
      expect(person.cpf).toBe(tempData.cpf);
      expect(person.data_nascimento).toEqual(new Date(tempData.data_nascimento));
      expect(person.email).toBe(tempData.email);
      expect(person.nome).toBe(tempData.nome);
      expect(person.habilitado).toBe('não');
    }
  });

  test('should not update a person by ID and throw a InvalidField error', async () => {
    try {
      const tempData = {
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: 'não'
      };
      await PeopleService.update('12', tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'id' is out of the standard format");
    }
  });

  test('should not update a person if exists another with the same email or cpf', async () => {
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'não'
    };
    try {
      await factory.create<Person>('People', {
        email: 'joazinho@email.com',
        cpf: '131.147.860-49'
      });
      const personGenerated = await factory.create<Person>('People');
      if (personGenerated._id) {
        await PeopleService.update(personGenerated._id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Conflict');
      expect((<InvalidValue>e).name).toBe(`CPF ${tempData.cpf} already in use`);
    }
  });

  test('should not update a person if CPF is not valid', async () => {
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-',
      data_nascimento: '03/03/2000',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'não'
    };
    try {
      const personWithEmail = await factory.create<Person>('People', {
        email: 'joazinho@email.com',
        cpf: '131.147.860-49'
      });

      if (personWithEmail._id) {
        await PeopleService.update(personWithEmail._id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).name).toBe(`CPF ${tempData.cpf} is invalid`);
    }
  });

  test('should not update a person by ID and throw a NotFound error', async () => {
    try {
      const tempData = {
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: 'não'
      };
      await PeopleService.update('6171508962f47a7a91938d30', tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });

  test('should not update a person data_nascimento if not 18 years old by ID', async () => {
    const personGenerated = await factory.create<Person>('People');
    const tempData = {
      nome: 'joaozinho ciclano',
      cpf: '131.147.860-49',
      data_nascimento: '12/12/2020',
      email: 'joazinho@email.com',
      senha: '123456',
      habilitado: 'não'
    };
    if (personGenerated._id) {
      try {
        await PeopleService.update(personGenerated._id, tempData);
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidField);
        expect((<InvalidField>e).description).toBe('Bad Request');
        expect((<InvalidField>e).name).toBe("The field 'data_nascimento' is out of the standard format");
      }
    }
  });
});
