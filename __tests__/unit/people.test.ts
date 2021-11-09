import InvalidField from '@errors/InvalidField';
import PersonModel from '@models/PersonModel';
import PeopleService from '@services/PeopleService';
import { Person } from '@interfaces/Person';
import NotFound from '@errors/NotFound';
import InvalidValue from '@errors/InvalidValue';
import MongoDatabase from '../../src/infra/mongo/index';
import factory from '../utils/PeopleFactory';

MongoDatabase.connect();

const personData = {
  nome: 'joaozinho ciclano',
  cpf: '131.147.860-49',
  data_nascimento: '03/03/2000',
  email: 'joazinho@email.com',
  senha: '123456',
  habilitado: 'sim'
};

describe('src :: api :: services :: people', () => {
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
   * INSERT CREATE
   */

  test('should create a person', async () => {
    const person = await PeopleService.create(personData);
    expect(person.id).toBeDefined();
    expect(person.cpf).toBe(personData.cpf);
    expect(person.data_nascimento).toEqual(new Date(personData.data_nascimento));
    expect(person.email).toBe(personData.email);
    expect(person.nome).toBe(personData.nome);
    expect(person.senha).toBeUndefined();
    expect(person.habilitado).toBe(personData.habilitado);
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
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'data_nascimento' is out of the standard format");
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

  /**
   * GET LIST
   */

  test('should get all people', async () => {
    const temp = await factory.createMany<Person>('People', 5);
    const result = await PeopleService.list({});
    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(100);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('offsets');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(5);
    expect(result.pessoas.length).toEqual(temp.length);
  });

  test('should get all by nome people', async () => {
    const temp = await factory.createMany<Person>('People', 5);
    const result = await PeopleService.list({ habilitado: temp[0].habilitado });

    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(100);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('offsets');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(5);
    expect(result.pessoas.length).toBeGreaterThanOrEqual(1);
    result.pessoas.forEach((element) => {
      expect(element.habilitado).toEqual(temp[0].habilitado);
    });
  });

  test('should get not get all people by password', async () => {
    const temp = await factory.create<Person>('People');
    const result = await PeopleService.list({ senha: temp.senha });

    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(100);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('offsets');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(1);
    expect(result.pessoas.length).toEqual(1);
  });

  /**
   * GET BY ID
   */

  test('should get a person by ID', async () => {
    const personGenerated = await factory.create<Person>('People');
    if (personGenerated.id) {
      const person = await PeopleService.getById(personGenerated.id);
      expect(person.id).toBe(personGenerated.id);
      expect(person.cpf).toBe(personGenerated.cpf);
      expect(person.data_nascimento).toEqual(personGenerated.data_nascimento);
      expect(person.email).toBe(personGenerated.email);
      expect(person.nome).toBe(personGenerated.nome);
      expect(person.habilitado).toBe(personGenerated.habilitado);
    }
  });

  test('should not get a person by ID and throw a InvalidField error', async () => {
    try {
      await PeopleService.getById('12');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'id' is out of the standard format");
    }
  });

  test('should not get a person by ID and throw a NotFound error', async () => {
    try {
      await PeopleService.getById('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });

  /**
   * DELETE BY ID
   */

  test('should remove a person by ID', async () => {
    const personGenerated = await factory.create<Person>('People');
    if (personGenerated.id) {
      const person = await PeopleService.delete(personGenerated.id);

      expect(person.id).toBe(personGenerated.id);
      expect(person.cpf).toBe(personGenerated.cpf);
      expect(person.email).toBe(personGenerated.email);
      expect(person.habilitado).toBe(personGenerated.habilitado);
      expect(person.nome).toBe(personGenerated.nome);
    }
  });

  test('should not remove a person by ID and throw a InvalidField error', async () => {
    try {
      await PeopleService.delete('12');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'id' is out of the standard format");
    }
  });

  test('should not remove a person by ID and throw a NotFound error', async () => {
    try {
      await PeopleService.delete('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });

  /**
   * UPDATE BY ID
   */

  test('should update a person by ID', async () => {
    const personGenerated = await factory.create<Person>('People');
    if (personGenerated.id) {
      const tempData = {
        nome: 'joaozinho ciclano',
        cpf: '131.147.860-49',
        data_nascimento: '03/03/2000',
        email: 'joazinho@email.com',
        senha: '123456',
        habilitado: 'não'
      };
      const person = await PeopleService.update(personGenerated.id, tempData);

      expect(person.id).toBe(personGenerated.id);
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
      expect((<InvalidValue>e).description).toBe('Bad Request');
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
      if (personGenerated.id) {
        await PeopleService.update(personGenerated.id, tempData);
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

      if (personWithEmail.id) {
        await PeopleService.update(personWithEmail.id, tempData);
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
    if (personGenerated.id) {
      try {
        await PeopleService.update(personGenerated.id, tempData);
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidField);
        expect((<InvalidValue>e).description).toBe('Bad Request');
        expect((<InvalidField>e).name).toBe("The field 'data_nascimento' is out of the standard format");
      }
    }
  });
});
