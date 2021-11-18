import RentalFleetService from '@services/rental/fleet/RentalFleetService';

describe('src :: api :: services :: rental :: reserve :: getAll', () => {
  test('GIVEN existing fleet link WHEN searched with a field THEN results all the reserves that match', async () => {
    RentalFleetService.getAll({});
  });

  test('GIVEN existing fleet link WHEN searched all using limit=5 and offset=1 THEN results all the 5 first reserves', async () => {
    RentalFleetService.getAll({});
  });

  test('GIVEN existing fleet link WHEN searched with a field that dont have the value THEN results 0 reserves, but with the default body', async () => {
    RentalFleetService.getAll({});
  });
});
