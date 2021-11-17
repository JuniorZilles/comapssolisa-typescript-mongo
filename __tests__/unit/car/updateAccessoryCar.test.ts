import NotFound from '@errors/NotFound';
import Car from '@interfaces/Car';
import CarService from '@services/car';
import factory from '../../utils/factorys/CarFactory';

describe('src :: api :: services :: car :: update :: accessory', () => {
  test('should update a car accessory by its ID', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: 'Ar-condicionado' };

    const carResult = await CarService.updateAccessory(car._id as string, car.acessorios[0]._id as string, tempData);

    expect(carResult._id).toEqual(car._id);
    expect(carResult.ano).toBe(car.ano);
    expect(carResult.cor).toBe(car.cor);
    expect(carResult.modelo).toBe(car.modelo);
    expect(carResult.quantidadePassageiros).toBe(car.quantidadePassageiros);
    expect(carResult.acessorios.length).toEqual(car.acessorios.length);
    expect(carResult.acessorios[0].descricao).toBe(tempData.descricao);
    expect(carResult.acessorios[0]._id).toEqual(car.acessorios[0]._id);
    expect(carResult.acessorios[1].descricao).not.toBe(tempData.descricao);
  });

  test('should throw InvalidValue if the car id its not found', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: car.acessorios[0].descricao };
    try {
      await CarService.updateAccessory('6171508962f47a7a91938d30', car.acessorios[0]._id as string, tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe(
        `Value id: 6171508962f47a7a91938d30 - idAccessory: ${car.acessorios[0]._id} - descricao: ${car.acessorios[0].descricao} not found`
      );
    }
  });

  test('should throw InvalidValue if the accessory id its not found', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: car.acessorios[0].descricao };
    try {
      await CarService.updateAccessory(car._id as string, '6171508962f47a7a91938d30', tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe(
        `Value id: ${car._id} - idAccessory: 6171508962f47a7a91938d30 - descricao: ${car.acessorios[0].descricao} not found`
      );
    }
  });

  test('should throw InvalidValue if the accessory description already exist', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: car.acessorios[0].descricao };
    try {
      await CarService.updateAccessory(car._id as string, car.acessorios[0]._id as string, tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe(
        `Value id: ${car._id} - idAccessory: ${car.acessorios[0]._id} - descricao: ${car.acessorios[0].descricao} not found`
      );
    }
  });
});
