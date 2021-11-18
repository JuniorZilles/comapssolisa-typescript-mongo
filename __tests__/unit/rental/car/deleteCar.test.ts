import NotFound from '@errors/NotFound';
import RentalCarService from '@services/rental/car/RentalCarService';

describe('src :: api :: services :: rental :: car :: delete', () => {
  test('GIVEN existing rental car WHEN called to remove THEN should return the removed register', async () => {
    await RentalCarService.delete('');
  });

  test('GIVEN existing rental car WHEN called to remove with a nonexistent ID THEN throws a not found error', async () => {
    try {
      await RentalCarService.delete('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
