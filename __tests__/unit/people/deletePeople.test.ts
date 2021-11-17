import InvalidField from '@errors/InvalidField';
import NotFound from '@errors/NotFound';
import { Person } from '@interfaces/Person';
import PeopleService from '@services/people';
import factory from '../../utils/factorys/PeopleFactory';

describe('src :: api :: services :: people :: delete', () => {
  test('should remove a person by ID', async () => {
    const personGenerated = await factory.create<Person>('People');
    if (personGenerated._id) {
      const person = await PeopleService.delete(personGenerated._id);

      expect(person._id).toEqual(personGenerated._id);
      expect(person.cpf).toBe(personGenerated.cpf);
      expect(person.email).toBe(personGenerated.email);
      expect(person.habilitado).toBe(personGenerated.habilitado);
      expect(person.nome).toBe(personGenerated.nome);
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
});
