import Car from '@interfaces/Car';
import CarService from '@services/car';
import factory from '../../utils/factorys/CarFactory';

describe('src :: api :: services :: car :: getAll', () => {
  test('should get all cars by modelo', async () => {
    const car = await factory.create<Car>('Car');
    const result = await CarService.list({ modelo: car.modelo });

    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(100);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(1);
    expect(result).toHaveProperty('offsets');
    expect(result.offset).toEqual(1);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(1);
    expect(result.docs.length).toBeGreaterThan(0);
    result.docs.forEach((element) => {
      expect(element.modelo).toBe(car.modelo);
    });
  });

  test('should get all cars', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5);

    const result = await CarService.list({ offset: '0', limit: carTemp.length.toString() });

    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(5);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(1);
    expect(result).toHaveProperty('offsets');
    expect(result.offsets).toEqual(1);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(5);
    expect(result.docs.length).toEqual(carTemp.length);
  });

  test('should get all cars by accessory', async () => {
    await factory.createMany<Car>('Car', 5);
    const car = await factory.createMany<Car>('Car', 2, { acessorios: [{ descricao: 'Ar-condicionado' }] });

    const result = await CarService.list({
      descricao: car[0].acessorios[0].descricao as string
    });
    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(100);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(1);
    expect(result).toHaveProperty('offsets');
    expect(result.offsets).toEqual(1);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(2);
    result.docs.forEach((element) => {
      expect(element.acessorios[0].descricao).toBe(car[0].acessorios[0].descricao);
    });
  });
});
