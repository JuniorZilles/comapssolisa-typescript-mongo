import RentalCarService from '@services/rental/car/RentalCarService';

describe('src :: api :: services :: rental :: car :: getAll', () => {
  test('GIVEN existing rental car WHEN searched with a field THEN results all the reserves that match', async () => {
    RentalCarService.getAll();
  });

  test('GIVEN existing rental car WHEN searched all using limit=5 and offset=1 THEN results all the 5 first reserves', async () => {
    RentalCarService.getAll();
  });

  test('GIVEN existing rental car WHEN searched with a field that dont have the value THEN results 0 reserves, but with the default body', async () => {
    RentalCarService.getAll();
  });
});
