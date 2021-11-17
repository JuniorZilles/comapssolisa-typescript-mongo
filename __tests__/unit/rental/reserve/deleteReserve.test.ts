import NotFound from '@errors/NotFound';
import RentalReserveService from '@services/rental/reserve/RentalReserveService';

describe('src :: api :: services :: rental :: reserve :: delete', () => {
  test('GIVEN existing reserve WHEN called to remove THEN should return the removed register', async () => {
    await RentalReserveService.delete();
  });

  test('GIVEN existing reserve WHEN called to remove with a nonexistent ID THEN throws a not found error', async () => {
    try {
      await RentalReserveService.delete();
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
