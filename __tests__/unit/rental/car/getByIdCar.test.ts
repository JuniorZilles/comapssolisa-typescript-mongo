import NotFound from '@errors/NotFound';
import RentalCarService from '@services/rental/car/RentalCarService';

describe('src :: api :: services :: rental :: car :: getById', () => {
  test('GIVEN existing rental car WHEN searched with a existing ID THEN results the matching item', async () => {
    await RentalCarService.getById();
  });

  test('GIVEN existing rental car WHEN searched with a nonexistent ID THEN throws a not found error', async () => {
    try {
      await RentalCarService.getById();
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
