import { Person } from '@interfaces/Person';
import PeopleService from '@services/people';
import factory from '../../utils/factorys/PeopleFactory';

describe('src :: api :: services :: people :: getAll', () => {
  test('should get all people', async () => {
    const temp = await factory.createMany<Person>('People', 5);
    const result = await PeopleService.list({});
    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(100);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(1);
    expect(result).toHaveProperty('offsets');
    expect(result.offsets).toEqual(1);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(5);
    expect(result.docs.length).toEqual(temp.length);
  });

  test('should get all by nome people', async () => {
    const temp = await factory.createMany<Person>('People', 5);
    const result = await PeopleService.list({ habilitado: temp[0].habilitado });

    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(100);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(1);
    expect(result).toHaveProperty('offsets');
    expect(result.offsets).toEqual(1);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(5);
    expect(result.docs.length).toBeGreaterThanOrEqual(1);
    result.docs.forEach((element) => {
      expect(element.habilitado).toEqual(temp[0].habilitado);
    });
  });
});
