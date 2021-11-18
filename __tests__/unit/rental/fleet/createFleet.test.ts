import InvalidValue from '@errors/InvalidValue';
import RentalFleetService from '@services/rental/fleet/RentalFleetService';
import { RENTALFLEETDATA } from '__tests__/utils/Constants';

describe('src :: api :: services :: rental :: reserve :: create', () => {
  test('GIVEN existing rental car and rental company WHEN all conditions are met THEN results the entry data with a id', async () => {
    RentalFleetService.create(RENTALFLEETDATA);
  });

  test('GIVEN existing rental car and rental company WHEN nonexisting id_listagem THEN should throw a invalid value', async () => {
    try {
      RentalFleetService.create(RENTALFLEETDATA);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN existing rental car and rental company WHEN nonexisting id_locadora THEN should throw a invalid value', async () => {
    try {
      RentalFleetService.create();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });
});
