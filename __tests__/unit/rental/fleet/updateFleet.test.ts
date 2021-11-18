import InvalidValue from '@errors/InvalidValue';
import RentalFleetService from '@services/rental/fleet/RentalFleetService';
import { RENTALFLEETDATA } from '__tests__/utils/Constants';

describe('src :: api :: services :: rental :: reserve :: update', () => {
  test('GIVEN existing fleet link WHEN all conditions are met THEN results the entry data with a id', async () => {
    RentalFleetService.update(RENTALFLEETDATA, '');
  });

  test('GIVEN existing fleet link WHEN nonexisting id_listagem THEN should throw a invalid value', async () => {
    try {
      RentalFleetService.update(RENTALFLEETDATA, '');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN existing fleet link WHEN nonexisting id_locadora THEN should throw a invalid value', async () => {
    try {
      RentalFleetService.update(RENTALFLEETDATA, '');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });
});
