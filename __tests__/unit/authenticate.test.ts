/* eslint-disable @typescript-eslint/no-unused-vars */
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { Person } from '@interfaces/Person';
import PersonModel from '@models/PersonModel';
import AuthenticateService from '@services/AuthenticateService';
import { verifyToken } from '@services/TokenService';
import { JwtPayload } from 'jsonwebtoken';
import MongoDatabase from '../../src/infra/mongo/index';
import factory from '../utils/PeopleFactory';

MongoDatabase.connect();

describe('src :: api :: services :: authenticate', () => {
  beforeAll(async () => {
    await PersonModel.deleteMany();
  });
  afterAll(async () => {
    await MongoDatabase.disconect();
  });
  afterEach(async () => {
    await PersonModel.deleteMany();
  });

  it('should authenticate', async () => {
    const temp = await factory.create<Person>('People', { senha: '123456' });

    const result = await AuthenticateService.authenticate(temp.email, '123456');

    expect(result).toBeDefined();
    const content = verifyToken(result) as JwtPayload;

    const tempContent = content.content;

    expect(tempContent.id).toBe(temp.id);
    expect(tempContent.email).toBe(temp.email);
    expect(tempContent.habilitado).toBe(temp.habilitado);
  });

  it('should throw invalid value error when trying to authenticate', async () => {
    const temp = await factory.create<Person>('People');
    try {
      const result = await AuthenticateService.authenticate(temp.email, '123456');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).message).toBe('The value ****** for senha is invalid');
    }
  });

  it('should throw invalid value error when trying to authenticate', async () => {
    try {
      const result = await AuthenticateService.authenticate('Joazinho@mail.com', '123456');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).message).toBe('Value Joazinho@mail.com not found');
    }
  });
});
