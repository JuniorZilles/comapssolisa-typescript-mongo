import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import RentalReserveService from '@services/rental/reserve/RentalReserveService';
import { RENTALRESERVEDATA } from '__tests__/utils/Constants';

describe('src :: api :: services :: rental :: reserve :: update', () => {
  test('GIVEN a existing reserve WHEN all conditions are met THEN results the entry data with a id', async () => {
    RentalReserveService.update(RENTALRESERVEDATA, '');
  });

  test('GIVEN a existing reserve WHEN a user is not habilitado THEN should throw a invalid value', async () => {
    try {
      RentalReserveService.update(RENTALRESERVEDATA, '');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN a existing reserve WHEN a car is already reserved THEN should throws a invalid value', async () => {
    try {
      RentalReserveService.update(RENTALRESERVEDATA, '');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN a existing reserve WHEN initial and final date conflict with an already existing renserve from same user THEN throws a invalid value', async () => {
    try {
      RentalReserveService.update(RENTALRESERVEDATA, '');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN a existing reserve WHEN the initial date is set to next day THEN throws a invalid value', async () => {
    try {
      RentalReserveService.update(RENTALRESERVEDATA, '');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN existing reserve WHEN alled to remove with a nonexistent ID THEN throws a not found error', async () => {
    try {
      await RentalReserveService.update(RENTALRESERVEDATA, '6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
