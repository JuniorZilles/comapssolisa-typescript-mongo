import NotFound from '@errors/NotFound';
import RentalFleetService from '@services/rental/fleet/RentalFleetService';

describe('src :: api :: services :: rental :: reserve :: delete', () => {
  test('GIVEN existing fleet link WHEN called to remove THEN should return the removed register', async () => {
    await RentalFleetService.delete('');
  });

  test('GIVEN existing fleet link WHEN called to remove with a nonexistent ID THEN throws a not found error', async () => {
    try {
      await RentalFleetService.delete('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
