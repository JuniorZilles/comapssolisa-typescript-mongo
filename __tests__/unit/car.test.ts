/* eslint-disable @typescript-eslint/no-unused-vars */
import CarService from '@services/CarService';
import InvalidField from '@errors/InvalidField';
import CarModel, { Car } from '@models/CarModel';
import NotFound from '@errors/NotFound';
import factory from '../utils/CarFactory';
import MongoDatabase from '../../src/infra/mongo/index';

MongoDatabase.connect();
const carData = {
  modelo: 'GM S10 2.8',
  cor: 'Verde',
  ano: 2021,
  acessorios: [{ descricao: 'Ar-condicionado' }],
  quantidadePassageiros: 5,
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

  it('should create a car', async () => {
    const car = await CarService.create(carData);
    expect(car.id).toBeDefined();
    expect(car.dataCriacao).toBeDefined();
    expect(car.ano).toBe(carData.ano);
    expect(car.cor).toBe(carData.cor);
    expect(car.quantidadePassageiros).toBe(carData.quantidadePassageiros);
  });

  it('should have at least one accessory', async () => {
    try {
      const temp = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2021,
        acessorios: [],
        quantidadePassageiros: 5,
      };
      const car = await CarService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'acessorios' is out of the standard format");
    }
  });

  it('the year should not be greater than 2022', async () => {
    try {
      const temp = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2023,
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5,
      };
      const car = await CarService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'ano' is out of the standard format");
    }
  });

  it('the year should not be least than 1950', async () => {
    try {
      const temp = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 1949,
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5,
      };
      const car = await CarService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'ano' is out of the standard format");
    }
  });

  it('should include just one if duplicated accessory', async () => {
    try {
      const temp = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2021,
        acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5,
      };
      const car = await CarService.create(temp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'acessorios' is out of the standard format");
    }
  });

  /**
     * GET LIST
     */

  it('should get all cars by modelo', async () => {
    const car = await factory.create<Car>('Car');
    const result = await CarService.list({ modelo: car.modelo });

    expect(result.veiculos.length).toBeGreaterThan(0);
    result.veiculos.forEach((element) => {
      expect(element.modelo).toBe(car.modelo);
    });
  });

  it('should get all cars', async () => {
    const carTemp = await factory.createMany<Car>('Car', 5);

    const result = await CarService.list({ limit: `${carTemp.length}`, offset: '0' });

    expect(result.veiculos.length).toEqual(carTemp.length);
  });

  it('should get all cars by accessory', async () => {
    const car = await factory.createMany<Car>('Car', 5);

    const result = await CarService.list({ descricao: car[0].acessorios[0].descricao as string });

    result.veiculos.forEach((element) => {
      expect(element.acessorios[0].descricao).toBe(car[0].acessorios[0].descricao);
    });
  });

  /**
     * GET BY ID
     */

  it("should get a car by it's ID", async () => {
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

  it("should not get a car by it's ID and throw a InvalidField error", async () => {
    try {
      const result = await CarService.getById('12');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'id' is out of the standard format");
    }
  });

  it("should not get a car by it's ID and throw a NotFound error", async () => {
    try {
      const result = await CarService.getById('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).message).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });

  /**
     * DELETE BY ID
     */

  it("should remove a car by it's ID", async () => {
    const car = await factory.create<Car>('Car');

    if (car.id) {
      const result = await CarService.delete(car.id);
      expect(result).toBe(true);
    } else {
      expect(car.id).toBeDefined();
    }
  });

  it("should not remove a car by it's ID and throw a InvalidField error", async () => {
    try {
      const result = await CarService.delete('12');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'id' is out of the standard format");
    }
  });

  it("should not remove a car by it's ID and throw a NotFound error", async () => {
    try {
      const result = await CarService.delete('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).message).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });

  /**
     * PUT BY ID
     */

  it('should update a car', async () => {
    const car = await factory.create<Car>('Car');
    const tempData = {
      modelo: 'Abacaxi',
      cor: 'Verde',
      ano: 2021,
      acessorios: [{ descricao: 'Ar-condicionado' }],
      quantidadePassageiros: 5,
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

  it('should have at least one accessory if is updating this field', async () => {
    try {
      const car = await factory.create<Car>('Car');
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2023,
        acessorios: [],
        quantidadePassageiros: 5,
      };
      if (car.id) {
        await CarService.update(car.id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'acessorios' is out of the standard format");
    }
  });

  it('the year updated should not be greater than 2022 and throw a InvalidField error', async () => {
    try {
      const car = await factory.create<Car>('Car');
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2023,
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5,
      };
      if (car.id) {
        await CarService.update(car.id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'ano' is out of the standard format");
    }
  });

  it('the year updated should not be least than 1950 and throw a InvalidField error', async () => {
    try {
      const car = await factory.create<Car>('Car');
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 1949,
        acessorios: [{ descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5,
      };
      if (car.id) {
        await CarService.update(car.id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'ano' is out of the standard format");
    }
  });

  it('should update and include just one if duplicated accessory', async () => {
    const car = await factory.create<Car>('Car');
    try {
      const tempData = {
        modelo: 'GM S10 2.8',
        cor: 'Verde',
        ano: 2021,
        acessorios: [{ descricao: 'Ar-condicionado' }, { descricao: 'Ar-condicionado' }],
        quantidadePassageiros: 5,
      };

      if (car.id) {
        const result = await CarService.update(car.id, tempData);
      }
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).message).toBe("The field 'acessorios' is out of the standard format");
    }
  });
});
