import InvalidField from '@errors/InvalidField';
import CarService from '@services/CarService';
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
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'acessorios' is out of the standard format");
    }
  });

  test('the year should not be greater than 2022', async () => {
    try {
      const temp = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2023,
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5
      };
      await CarService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'ano' is out of the standard format");
    }
  });

  test('the year should not be least than 1950', async () => {
    try {
      const temp = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 1949,
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5
      };
      await CarService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'ano' is out of the standard format");
    }
  });

  test('should include just one if duplicated accessory', async () => {
    try {
      const temp = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2021,
        acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5
      };
      await CarService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'acessorios' is out of the standard format");
    }
  });
});
