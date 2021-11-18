import InvalidValue from '@errors/InvalidValue';
import RentalCarService from '@services/rental/car/RentalCarService';
import { RENTALCARDATA } from '__tests__/utils/Constants';

describe('src :: api :: services :: rental :: car :: create', () => {
  test('GIVEN a new rental car  WHEN all conditions are met THEN results the entry data with a id', async () => {
    RENTALCARDATA.id_carro = '1';
    RENTALCARDATA.id_locadora = '1';
    RENTALCARDATA.id_locacao = '1';
    await RentalCarService.create(RENTALCARDATA);
  });

  test('GIVEN a new rental car WHEN placa already used by another car THEN should throw a invalid value', async () => {
    try {
      RENTALCARDATA.id_carro = '1';
      RENTALCARDATA.id_locadora = '1';
      RENTALCARDATA.id_locacao = '1';
      await RentalCarService.create(RENTALCARDATA);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });
});
