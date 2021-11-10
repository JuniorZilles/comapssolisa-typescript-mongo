import CarService from '@services/CarService';
import InvalidField from '@errors/InvalidField';
import CarModel from '@models/CarModel';
import NotFound from '@errors/NotFound';
import Car from '@interfaces/Car';
import InvalidValue from '@errors/InvalidValue';
import factory from '../utils/CarFactory';
import MongoDatabase from '../../src/infra/mongo/index';

MongoDatabase.connect();
const carData = {
  modelo: 'GM S10 2.8',
  cor: 'Verde',
  ano: 2021,
  acessorios: [{ descricao: 'Ar-condicionado' }],
  quantidadePassageiros: 5
};

describe('src :: api :: services :: car', () => {
  beforeAll(async () => {
    await CarModel.deleteMany();
  });
  afterAll(async () => {
    await MongoDatabase.disconect();
  });
  afterEach(async () => {
    await CarModel.deleteMany();
  });

  /**
   * POST CREATE
   */

  test('should create a car', async () => {
    const car = await CarService.create(carData);
    expect(car.id).toBeDefined();
    expect(car.ano).toBe(carData.ano);
    expect(car.cor).toBe(carData.cor);
    expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros);
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

  /**
   * GET LIST
   */

  test('should get all cars by modelo', async () => {
    const car = await factory.create<Car>('Car');
    const result = await CarService.list({ modelo: car.modelo });

    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(100);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('offsets');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(1);
    expect(result.veiculos.length).toBeGreaterThan(0);
    result.veiculos.forEach((element) => {
      expect(element.modelo).toBe(car.modelo);
    });
  });

  test('should get all cars', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5);

    const result = await CarService.list({ offset: '0', limit: carTemp.length.toString() });

    expect(result).toHaveProperty('limit');
    expect(result.limit).toEqual(5);
    expect(result).toHaveProperty('offset');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('offsets');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(5);
    expect(result.veiculos.length).toEqual(carTemp.length);
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
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('offsets');
    expect(result.offset).toEqual(0);
    expect(result).toHaveProperty('total');
    expect(result.total).toEqual(2);
    result.veiculos.forEach((element) => {
      expect(element.acessorios[0].descricao).toBe(car[0].acessorios[0].descricao);
    });
  });

  /**
   * GET BY ID
   */

  test("should get a car by it's ID", async () => {
    const car = await factory.create<Car>('Car');

    if (car.id) {
      const result = await CarService.getById(car.id);
      expect(result.id).toBe(car.id);
      expect(result.modelo).toBe(car.modelo);
      expect(result.ano).toBe(car.ano);
      expect(result.cor).toBe(car.cor);
    } else {
      expect(car.id).toBeDefined();
    }
  });

  test("should not get a car by it's ID and throw a InvalidField error", async () => {
    try {
      await CarService.getById('12');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'id' is out of the standard format");
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

  /**
   * DELETE BY ID
   */

  test("should remove a car by it's ID", async () => {
    const car = await factory.create<Car>('Car');

    if (car.id) {
      const result = await CarService.delete(car.id);
      expect(result.id).toBe(car.id);
      expect(result.acessorios.length).toEqual(car.acessorios.length);
      expect(result.ano).toBe(car.ano);
      expect(result.cor).toBe(car.cor);
      expect(result.modelo).toBe(car.modelo);
      expect(result.quantidadePassageiros).toBe(car.quantidadePassageiros);
    } else {
      expect(car.id).toBeDefined();
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

  /**
   * PUT BY ID
   */

  test('should update a car', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'Abacaxi',
      cor: 'Verde',
      ano: 2021,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5
    };
    if (car.id) {
      const result = await CarService.update(car.id, tempData);

      expect(result.id).toBe(car.id);
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
      if (car.id) {
        await CarService.update(car.id, tempData);
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
      if (car.id) {
        await CarService.update(car.id, tempData);
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
      if (car.id) {
        await CarService.update(car.id, tempData);
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

      if (car.id) {
        await CarService.update(car.id, tempData);
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

  /**
   * PATCH BY ID ACCESSORIES BY ID
   */

  test('should update a car accessory by its ID', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: 'Ar-condicionado' };

    const carResult = await CarService.updateAccessory(car.id as string, car.acessorios[0].id as string, tempData);

    expect(carResult.id).toBe(car.id);
    expect(carResult.ano).toBe(car.ano);
    expect(carResult.cor).toBe(car.cor);
    expect(carResult.modelo).toBe(car.modelo);
    expect(carResult.quantidadePassageiros).toBe(car.quantidadePassageiros);
    expect(carResult.acessorios.length).toEqual(car.acessorios.length);
    expect(carResult.acessorios[0].descricao).toBe(tempData.descricao);
    expect(carResult.acessorios[0].id).toBe(car.acessorios[0].id);
    expect(carResult.acessorios[1].descricao).not.toBe(tempData.descricao);
  });

  test('should return 400 if the car id its invalid', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: car.acessorios[0].descricao };
    try {
      await CarService.updateAccessory('156', car.acessorios[0].id as string, tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'id' is out of the standard format");
    }
  });

  test('should throw InvalidValue if the car id its not found', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: car.acessorios[0].descricao };
    try {
      await CarService.updateAccessory('6171508962f47a7a91938d30', car.acessorios[0].id as string, tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('descricao');
      expect((<InvalidValue>e).name).toBe(
        `Value id: 6171508962f47a7a91938d30 - idAccessory: ${car.acessorios[0].id} - descricao: ${car.acessorios[0].descricao} not updated`
      );
    }
  });

  test('should throw InvalidField if the accessory id its invalid', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: car.acessorios[0].descricao };
    try {
      await CarService.updateAccessory(car.id as string, '125', tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).description).toBe('Bad Request');
      expect((<InvalidField>e).name).toBe("The field 'idAccessory' is out of the standard format");
    }
  });

  test('should throw InvalidValue if the accessory id its not found', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: car.acessorios[0].descricao };
    try {
      await CarService.updateAccessory(car.id as string, '6171508962f47a7a91938d30', tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('descricao');
      expect((<InvalidValue>e).name).toBe(
        `Value id: ${car.id} - idAccessory: 6171508962f47a7a91938d30 - descricao: ${car.acessorios[0].descricao} not updated`
      );
    }
  });

  test('should throw InvalidValue if the accessory description already exist', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = { descricao: car.acessorios[0].descricao };
    try {
      await CarService.updateAccessory(car.id as string, car.acessorios[0].id as string, tempData);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('descricao');
      expect((<InvalidValue>e).name).toBe(
        `Value id: ${car.id} - idAccessory: ${car.acessorios[0].id} - descricao: ${car.acessorios[0].descricao} not updated`
      );
    }
  });
});
