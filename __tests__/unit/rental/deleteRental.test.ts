import NotFound from '@errors/NotFound';
import { Rental } from '@interfaces/rental/Rental';
import RentalService from '@services/rental';
import factory from '../../utils/factorys/RentalFactory';

describe('src :: api :: services :: rental :: delete', () => {
  test('should delete a rental by id', async () => {
    const generated = await factory.create<Rental>('Rental');
    if (generated._id) {
      const rental = await RentalService.delete(generated._id);
      expect(rental._id).toEqual(generated._id);
      expect(rental.cnpj).toBe(generated.cnpj);
      expect(rental.nome).toBe(generated.nome);
      expect(rental.atividades).toBe(generated.atividades);
    }
  });

  test('should not delete a rental by a nonexistent id and throw a not found', async () => {
    try {
      await RentalService.delete('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
