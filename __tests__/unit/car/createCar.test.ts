import InvalidValue from '@errors/InvalidValue';
import CarService from '@services/car';
import { CARDATA } from '../../utils/Constants';

describe('src :: api :: services :: car :: create', () => {
  test('should create a car', async () => {
    const car = await CarService.create(CARDATA);
    expect(car._id).toBeDefined();
    expect(car.ano).toBe(CARDATA.ano);
    expect(car.cor).toBe(CARDATA.cor);
    expect(car.quantidadePassageiros).toBe(CARDATA.quantidadePassageiros);
  });

  test('should have at least one accessory', async () => {
    try {
      const temp = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2021,
        acessorios: [],
        quantidadePassageiros: 5
      };
      await CarService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).name).toBe("The field 'acessorios' is out of the standard format");
    }
  });
});
