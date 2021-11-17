import NotFound from '@errors/NotFound';
import RentalFleetService from '@services/rental/fleet/RentalFleetService';

describe('src :: api :: services :: rental :: reserve :: getById', () => {
  test('GIVEN existing fleet link WHEN searched with a existing ID THEN results the matching item', async () => {
    await RentalFleetService.getById();
  });

  test('GIVEN existing fleet link WHEN searched with a nonexistent ID THEN throws a not found error', async () => {
    try {
      await RentalFleetService.getById();
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
