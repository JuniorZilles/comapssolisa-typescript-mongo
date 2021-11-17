import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { Person } from '@interfaces/people/Person';
import AuthenticateService from '@services/AuthenticateService';
import { verifyToken } from '@services/TokenService';
import { JwtPayload } from 'jsonwebtoken';
import factory from '../utils/factorys/PeopleFactory';

describe('src :: api :: services :: authenticate', () => {
  test('should authenticate', async () => {
    const temp = await factory.create<Person>('People', { senha: '123456' });

    const result = await AuthenticateService.authenticate(temp.email, '123456');

    expect(result).toBeDefined();
    const content = verifyToken(result) as JwtPayload;

    const tempContent = content.content;

    expect(tempContent.id).toEqual(temp._id?.toString());
    expect(tempContent.email).toBe(temp.email);
    expect(tempContent.habilitado).toBe(temp.habilitado);
  });

  test('should throw invalid value error when trying to authenticate', async () => {
    const temp = await factory.create<Person>('People');
    try {
      await AuthenticateService.authenticate(temp.email, '123456');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('senha');
      expect((<InvalidValue>e).name).toBe('The value ****** for senha is invalid');
    }
  });

  test('should throw invalid value error when trying to authenticate', async () => {
    try {
      await AuthenticateService.authenticate('Joazinho@mail.com', '123456');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value Joazinho@mail.com not found');
    }
  });
});
