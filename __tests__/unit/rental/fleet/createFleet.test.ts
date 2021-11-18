import InvalidValue from '@errors/InvalidValue';
import RentalCarService from '@services/rental/fleet/RentalFleetService';
import { RENTALFLEETDATA } from '__tests__/utils/Constants';

describe('src :: api :: services :: rental :: car :: create', () => {
  test('GIVEN a new rental car  WHEN all conditions are met THEN results the entry data with a id', async () => {
    RENTALFLEETDATA.id_carro = '1';
    RENTALFLEETDATA.id_locadora = '1';
    RENTALFLEETDATA.id_locacao = '1';
    await RentalCarService.create(RENTALFLEETDATA);
  });

  test('GIVEN a new rental car WHEN placa already used by another car THEN should throw a invalid value', async () => {
    try {
      RENTALFLEETDATA.id_carro = '1';
      RENTALFLEETDATA.id_locadora = '1';
      RENTALFLEETDATA.id_locacao = '1';
      await RentalCarService.create(RENTALFLEETDATA);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });
});
