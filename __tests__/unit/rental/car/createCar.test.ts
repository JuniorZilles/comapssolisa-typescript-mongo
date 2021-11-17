import InvalidValue from '@errors/InvalidValue';
import RentalCarService from '@services/rental/car/RentalCarService';

describe('src :: api :: services :: rental :: car :: create', () => {
  test('GIVEN a new rental car  WHEN all conditions are met THEN results the entry data with a id', async () => {
    RentalCarService.create();
  });

  test('GIVEN a new rental car WHEN placa already used by another car THEN should throw a invalid value', async () => {
    try {
      RentalCarService.create();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });
});
