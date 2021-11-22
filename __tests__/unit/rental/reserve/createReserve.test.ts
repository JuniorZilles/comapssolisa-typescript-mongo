import InvalidValue from '@errors/InvalidValue';
import RentalReserveService from '@services/rental/reserve/RentalReserveService';
import { RENTALRESERVEDATA } from '__tests__/utils/Constants';

describe('src :: api :: services :: rental :: reserve :: create', () => {
  test('GIVEN a new reserve WHEN all conditions are met THEN results the entry data with a id', async () => {
    RENTALRESERVEDATA.id_carro = '1';
    RENTALRESERVEDATA.id_locadora = '1';
    RENTALRESERVEDATA.id_user = '1';
    await RentalReserveService.create(RENTALRESERVEDATA);
  });

  test('GIVEN a new reserve WHEN a user is not habilitado THEN should throw a invalid value', async () => {
    try {
      RENTALRESERVEDATA.id_carro = '1';
      RENTALRESERVEDATA.id_locadora = '1';
      RENTALRESERVEDATA.id_user = '1';
      await RentalReserveService.create(RENTALRESERVEDATA);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN a new reserve WHEN a car is already reserved THEN should throw a invalid value', async () => {
    try {
      RENTALRESERVEDATA.id_carro = '1';
      RENTALRESERVEDATA.id_locadora = '1';
      RENTALRESERVEDATA.id_user = '1';
      await RentalReserveService.create(RENTALRESERVEDATA);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN a new reserve WHEN initial and final date conflict with an already existing renserve from same user THEN throw a invalid value', async () => {
    try {
      RENTALRESERVEDATA.id_carro = '1';
      RENTALRESERVEDATA.id_locadora = '1';
      RENTALRESERVEDATA.id_user = '1';
      await RentalReserveService.create(RENTALRESERVEDATA);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });
});
