import NotFound from '@errors/NotFound';
import Car from '@interfaces/car/Car';
import CarService from '@services/car';
import factory from '../../utils/factorys/CarFactory';

describe('src :: api :: services :: car :: getById', () => {
  test("should get a car by it's ID", async () => {
    const car = await factory.create<Car>('Car');

    if (car._id) {
      const result = await CarService.getById(car._id);
      expect(result._id).toEqual(car._id);
      expect(result.modelo).toBe(car.modelo);
      expect(result.ano).toBe(car.ano);
      expect(result.cor).toBe(car.cor);
    }
  });

  test("should not get a car by it's ID and throw a NotFound error", async () => {
    try {
      await CarService.getById('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
