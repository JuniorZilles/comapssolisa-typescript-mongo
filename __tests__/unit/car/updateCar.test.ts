import InvalidField from '@errors/InvalidField';
import NotFound from '@errors/NotFound';
import Car from '@interfaces/Car';
import CarService from '@services/CarService';
import factory from '../../utils/factorys/CarFactory';

describe('src :: api :: services :: car :: update', () => {
  test('should update a car', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'Abacaxi',
      cor: 'Verde',
      ano: 2021,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    if (car._id) {
      const result = await CarService.update(car._id, tempData);

      expect(result._id).toEqual(car._id);
      expect(result.acessorios[0].descricao).toBe(tempData.acessorios[0].descricao);
      expect(result.modelo).toBe('Abacaxi');
      expect(result.ano).toBe(tempData.ano);
      expect(result.cor).toBe(tempData.cor);
    }
  });

  test('should have at least one accessory if is updating this field', async () => {
    try {
      const car = await factory.create<Car>('Car');
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2023,
        acessorios: [],
        quantidadePassageiros: 5
      };
      if (car._id) {
        await CarService.update(car._id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'acessorios' is out of the standard format");
    }
  });

  test('the year updated should not be greater than 2022 and throw a InvalidField error', async () => {
    try {
      const car = await factory.create<Car>('Car');
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2023,
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5
      };
      if (car._id) {
        await CarService.update(car._id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'ano' is out of the standard format");
    }
  });

  test('the year updated should not be least than 1950 and throw a InvalidField error', async () => {
    try {
      const car = await factory.create<Car>('Car');
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 1949,
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5
      };
      if (car._id) {
        await CarService.update(car._id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'ano' is out of the standard format");
    }
  });

  test('should update and include just one if duplicated accessory', async () => {
    const car = await factory.create<Car>('Car');
    try {
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2021,
        acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5
      };

      if (car._id) {
        await CarService.update(car._id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'acessorios' is out of the standard format");
    }
  });

  test('should not update if doesnt match ID', async () => {
    try {
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2021,
        acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5
      };
      await CarService.update('6171508962f47a7a91938d30', tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
