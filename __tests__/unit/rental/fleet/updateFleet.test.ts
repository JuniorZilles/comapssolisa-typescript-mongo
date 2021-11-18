import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import RentalCarService from '@services/rental/fleet/RentalFleetService';
import { RENTALFLEETDATA } from '__tests__/utils/Constants';

describe('src :: api :: services :: rental :: car :: update', () => {
  test('GIVEN a existing rental car WHEN all conditions are met THEN results the entry data with a id', async () => {
    RentalCarService.update(RENTALFLEETDATA, '');
  });

  test('GIVEN a existing rental car WHEN placa already used by another car THEN should throw a invalid value', async () => {
    try {
      RentalCarService.update(RENTALFLEETDATA, '');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN existing rental car WHEN alled to remove with a nonexistent ID THEN throws a not found error', async () => {
    try {
      await RentalCarService.update(RENTALFLEETDATA, '6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
