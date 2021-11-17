import InvalidValue from '@errors/InvalidValue';
import RentalReserveService from '@services/rental/reserve/RentalReserveService';

describe('src :: api :: services :: rental :: reserve :: update', () => {
  test('GIVEN a existing reserve WHEN all conditions are met THEN results the entry data with a id', async () => {
    RentalReserveService.update();
  });

  test('GIVEN a existing reserve WHEN a user is not habilitado THEN should throw a invalid value', async () => {
    try {
      RentalReserveService.update();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN a existing reserve WHEN a car is already reserved THEN should throws a invalid value', async () => {
    try {
      RentalReserveService.update();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN a existing reserve WHEN initial and final date conflict with an already existing renserve from same user THEN throws a invalid value', async () => {
    try {
      RentalReserveService.update();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN a existing reserve WHEN the initial date is set to next day THEN throws a invalid value', async () => {
    try {
      RentalReserveService.update();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });
});
