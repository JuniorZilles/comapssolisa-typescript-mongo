import InvalidField from '@errors/InvalidField';
import NotFound from '@errors/NotFound';
import Car from '@interfaces/Car';
import CarService from '@services/CarService';
import factory from '../../utils/factorys/CarFactory';

describe('src :: api :: services :: car :: update', () => {
  test("should remove a car by it's ID", async () => {
    const car = await factory.create<Car>('Car');

    if (car._id) {
      const result = await CarService.delete(car._id);
      expect(result._id).toEqual(car._id);
      expect(result.acessorios.length).toEqual(car.acessorios.length);
      expect(result.ano).toBe(car.ano);
      expect(result.cor).toBe(car.cor);
      expect(result.modelo).toBe(car.modelo);
      expect(result.quantidadePassageiros).toBe(car.quantidadePassageiros);
    } else {
      expect(car._id).toBeDefined();
    }
  });

  test("should not remove a car by it's ID and throw a InvalidField error", async () => {
    try {
      await CarService.delete('12');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'id' is out of the standard format");
    }
  });

  test("should not remove a car by it's ID and throw a NotFound error", async () => {
    try {
      await CarService.delete('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
