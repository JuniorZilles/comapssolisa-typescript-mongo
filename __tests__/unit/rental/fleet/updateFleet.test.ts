import InvalidValue from '@errors/InvalidValue';
import RentalFleetService from '@services/rental/fleet/RentalFleetService';

describe('src :: api :: services :: rental :: reserve :: update', () => {
  test('GIVEN existing fleet link WHEN all conditions are met THEN results the entry data with a id', async () => {
    RentalFleetService.create();
  });

  test('GIVEN existing fleet link WHEN nonexisting id_listagem THEN should throw a invalid value', async () => {
    try {
      RentalFleetService.create();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });

  test('GIVEN existing fleet link WHEN nonexisting id_locadora THEN should throw a invalid value', async () => {
    try {
      RentalFleetService.create();
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe(' is invalid');
    }
  });
});
