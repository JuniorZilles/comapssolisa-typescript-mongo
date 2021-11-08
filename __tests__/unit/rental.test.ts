import InvalidField from '@errors/InvalidField';
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { Endereco } from '@interfaces/Endereco';
import { Rental } from '@interfaces/Rental';
import RentalModel from '@models/RentalModel';
import RentalService from '@services/RentalService';
import MongoDatabase from '../../src/infra/mongo/index';
import factory from '../utils/RentalFactory';

MongoDatabase.connect();

const rentalData = {
  nome: 'Localiza Rent a Car',
  cnpj: '16.670.085/0001-55',
  atividades: 'Aluguel de Carros E Gestão de Frotas',
  endereco: [
    {
      cep: '96200-200',
      number: '1234',
      isFilial: false,
    },
    {
      cep: '96200-500',
      number: '5678',
      complemento: 'Muro A',
      isFilial: true,
    },
  ],
};

describe('src :: api :: services :: rental', () => {
  beforeAll(async () => {
    await RentalModel.deleteMany();
  });
  afterAll(async () => {
    await MongoDatabase.disconect();
  });
  afterEach(async () => {
    await RentalModel.deleteMany();
  });

  /**
   * INSERT CREATE
   */

  test('should create a rental place with two addresses', async () => {
    const rental = await RentalService.create(rentalData);

    expect(rental).toHaveProperty('_id');
    expect(rental.id).toBeDefined();
    expect(rental).toHaveProperty('nome');
    expect(rental.nome).toBe(rentalData.nome);
    expect(rental).toHaveProperty('cnpj');
    expect(rental.cnpj).toBe(rentalData.cnpj);
    expect(rental).toHaveProperty('atividades');
    expect(rental.atividades).toBe(rentalData.atividades);
    expect(rental).toHaveProperty('endereco');
    expect(rental.endereco).toHaveLength(2);
    rental.endereco.forEach((endereco: Endereco) => {
      expect(endereco.id).toBeDefined();
      const index = rentalData.endereco.findIndex(function get(enderecoData) {
        return enderecoData.cep === endereco.cep;
      });
      expect(endereco.cep).toBe(rentalData.endereco[index].cep);
      expect(endereco.number).toBe(rentalData.endereco[index].number);
      expect(endereco.isFilial).toBe(rentalData.endereco[index].isFilial);
      expect(endereco.localidade).toBeDefined();
      expect(endereco).toHaveProperty('bairro');
      expect(endereco).toHaveProperty('localidade');
      expect(endereco).toHaveProperty('uf');
    });
  });

  test('should not have a invalid CNPJ and throw invalid field error', async () => {
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: '16.670.085/0001-57',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false,
        },
      ],
    };
    try {
      await RentalService.create(rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('invalid');
      expect((<InvalidValue>e).message).toBe(
        'CNPJ 16.670.085/0001-57 is invalid'
      );
    }
  });

  test('should not have a duplicated CNPJ and throw invalid value error', async () => {
    const rentalAuto = await factory.create<Rental>('Rental', {
      cnpj: '08.450.508/0001-01',
    });
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: rentalAuto.cnpj,
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false,
        },
      ],
    };
    try {
      await RentalService.create(rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('conflict');
      expect((<InvalidValue>e).message).toBe(
        'CNPJ 08.450.508/0001-01 already in use'
      );
    }
  });

  test('should not have more than one isFilial equals to false and throw invalid value error', async () => {
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: '16.670.085/0001-55',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false,
        },
        {
          cep: '93950-000',
          number: '61',
          isFilial: false,
        },
      ],
    };
    try {
      await RentalService.create(rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('invalid');
      expect((<InvalidValue>e).name).toBe(
        'isFilial has more than one headquarters'
      );
    }
  });

  test('should not create with invalid cep and throw NotFound error', async () => {
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: '16.670.085/0001-55',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false,
        },
        {
          cep: '93950-999',
          number: '61',
          isFilial: true,
        },
      ],
    };
    try {
      await RentalService.create(rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value CEP 93950-999 not found');
    }
  });

  /**
   * GET BY ID
   */

  test('should get a rental by id', async () => {
    const generated = await factory.create<Rental>('Rental');
    if (generated.id) {
      const rental = await RentalService.getById(generated.id);
      expect(rental).toHaveProperty('_id');
      expect(rental.id).toBeDefined();
      expect(rental).toHaveProperty('nome');
      expect(rental.nome).toBe(generated.nome);
      expect(rental).toHaveProperty('cnpj');
      expect(rental.cnpj).toBe(generated.cnpj);
      expect(rental).toHaveProperty('atividades');
      expect(rental.atividades).toBe(generated.atividades);
      expect(rental).toHaveProperty('endereco');
      expect(rental.endereco).toHaveLength(2);
      rental.endereco.forEach((endereco: Endereco) => {
        expect(endereco.id).toBeDefined();
        const index = generated.endereco.findIndex(function get(enderecoData) {
          return enderecoData.cep === endereco.cep;
        });
        expect(endereco.cep).toBe(generated.endereco[index].cep);
        expect(endereco.number).toBe(generated.endereco[index].number);
        expect(endereco.isFilial).toBe(generated.endereco[index].isFilial);
        expect(endereco.localidade).toBeDefined();
        expect(endereco).toHaveProperty('bairro');
        expect(endereco).toHaveProperty('localidade');
        expect(endereco).toHaveProperty('uf');
      });
    }
  });

  test('should not get a rental by a invalid id and throw invalid field', async () => {
    try {
      await RentalService.getById('12');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).name).toBe(
        "The field 'id' is out of the standard format"
      );
    }
  });

  test('should not get a rental by a nonexistent id and throw a not found', async () => {
    try {
      await RentalService.getById('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).name).toBe(
        'Value 6171508962f47a7a91938d30 not found'
      );
    }
  });

  /**
   * DELETE BY ID
   */

  test('should delete a rental by id', async () => {
    const generated = await factory.create<Rental>('Rental');
    if (generated.id) {
      const rental = await RentalService.delete(generated.id);
      expect(rental).toBe(true);
    }
  });

  test('should not delete a rental by a invalid id and throw invalid field', async () => {
    try {
      await RentalService.delete('12');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).name).toBe(
        "The field 'id' is out of the standard format"
      );
    }
  });

  test('should not delete a rental by a nonexistent id and throw a not found', async () => {
    try {
      await RentalService.delete('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).name).toBe(
        'Value 6171508962f47a7a91938d30 not found'
      );
    }
  });

  /**
   * UPDATE BY ID
   */

  test('should update a rental place with two addresses', async () => {
    const generated = await factory.create<Rental>('Rental');
    const rental = await RentalService.update(
      generated.id as string,
      rentalData
    );

    expect(rental).toHaveProperty('_id');
    expect(rental.id).toBeDefined();
    expect(rental).toHaveProperty('nome');
    expect(rental.nome).toBe(rentalData.nome);
    expect(rental).toHaveProperty('cnpj');
    expect(rental.cnpj).toBe(rentalData.cnpj);
    expect(rental).toHaveProperty('atividades');
    expect(rental.atividades).toBe(rentalData.atividades);
    expect(rental).toHaveProperty('endereco');
    expect(rental.endereco).toHaveLength(2);
    rental.endereco.forEach((endereco: Endereco) => {
      expect(endereco.id).toBeDefined();
      const index = rentalData.endereco.findIndex(function get(enderecoData) {
        return enderecoData.cep === endereco.cep;
      });
      expect(endereco.cep).toBe(rentalData.endereco[index].cep);
      expect(endereco.number).toBe(rentalData.endereco[index].number);
      expect(endereco.isFilial).toBe(rentalData.endereco[index].isFilial);
      expect(endereco.localidade).toBeDefined();
      expect(endereco).toHaveProperty('bairro');
      expect(endereco).toHaveProperty('localidade');
      expect(endereco).toHaveProperty('uf');
    });
  });

  test('should not have a invalid CNPJ and throw invalid field error on update', async () => {
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: '16.670.085/0001-57',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false,
        },
      ],
    };
    try {
      const generated = await factory.create<Rental>('Rental');
      await RentalService.update(generated.id as string, rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('invalid');
      expect((<InvalidValue>e).message).toBe(
        'CNPJ 16.670.085/0001-57 is invalid'
      );
    }
  });

  test('should not have a duplicated CNPJ and throw invalid value error on update', async () => {
    const rentalAuto0 = await factory.create<Rental>('Rental', {
      cnpj: '08.450.508/0001-01',
    });
    const rentalAuto1 = await factory.create<Rental>('Rental', {
      cnpj: '07.450.508/0001-01',
    });
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: rentalAuto0.cnpj,
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false,
        },
      ],
    };
    try {
      await RentalService.update(rentalAuto1.id as string, rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('conflict');
      expect((<InvalidValue>e).message).toBe(
        'CNPJ 08.450.508/0001-01 already in use'
      );
    }
  });

  test('should not have more than one isFilial equals to false and throw invalid value error on update', async () => {
    const generated = await factory.create<Rental>('Rental');
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: '16.670.085/0001-55',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false,
        },
        {
          cep: '93950-000',
          number: '61',
          isFilial: false,
        },
      ],
    };
    try {
      await RentalService.update(generated.id as string, rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('invalid');
      expect((<InvalidValue>e).name).toBe(
        'isFilial has more than one headquarters'
      );
    }
  });

  test('should not create with invalid cep and throw NotFound error', async () => {
    const generated = await factory.create<Rental>('Rental');
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: '16.670.085/0001-55',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false,
        },
        {
          cep: '93950-999',
          number: '61',
          isFilial: true,
        },
      ],
    };
    try {
      await RentalService.update(generated.id as string, rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value CEP 93950-999 not found');
    }
  });

  test('should not update a rental by a invalid id and throw invalid field', async () => {
    try {
      const rentalTemp = {
        nome: 'Localiza Rent a Car',
        cnpj: '16.670.085/0001-55',
        atividades: 'Aluguel de Carros E Gestão de Frotas',
        endereco: [
          {
            cep: '96200-200',
            number: '1234',
            isFilial: false,
          },
          {
            cep: '93950-000',
            number: '61',
            isFilial: true,
          },
        ],
      };
      await RentalService.update('12', rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidField);
      expect((<InvalidField>e).name).toBe(
        "The field 'id' is out of the standard format"
      );
    }
  });

  test('should not update a rental by a nonexistent id and throw a not found', async () => {
    try {
      const rentalTemp = {
        nome: 'Localiza Rent a Car',
        cnpj: '16.670.085/0001-55',
        atividades: 'Aluguel de Carros E Gestão de Frotas',
        endereco: [
          {
            cep: '96200-200',
            number: '1234',
            isFilial: false,
          },
          {
            cep: '93950-000',
            number: '61',
            isFilial: true,
          },
        ],
      };
      await RentalService.update('6171508962f47a7a91938d30', rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).name).toBe(
        'Value 6171508962f47a7a91938d30 not found'
      );
    }
  });

  /**
   * GET LIST
   */

  test('should get 10 paginated rental companies', async () => {
    await factory.createMany<Rental>('Rental', 25);
    const rentalP0 = await RentalService.getAll({ limit: '5', offset: '0' });

    expect(rentalP0.locadoras.length).toEqual(5);
    expect(rentalP0.offset).toEqual(0);
    expect(rentalP0.limit).toEqual(5);
    expect(rentalP0.total).toEqual(25);
    expect(rentalP0.offsets).toEqual(5);

    const rentalP1 = await RentalService.getAll({ limit: '5', offset: '1' });
    expect(rentalP1.locadoras.length).toEqual(5);
    expect(rentalP1.offset).toEqual(1);
    expect(rentalP1.limit).toEqual(5);
    expect(rentalP1.total).toEqual(25);
    expect(rentalP1.offsets).toEqual(5);
  });

  test('should get a rental company by cnpj', async () => {
    const tempData = await factory.createMany<Rental>('Rental', 5);
    const rental = await RentalService.getAll({ cnpj: tempData[0].cnpj });

    expect(rental).toHaveProperty('limit');
    expect(rental.limit).toEqual(10);
    expect(rental).toHaveProperty('offset');
    expect(rental.offset).toEqual(0);
    expect(rental).toHaveProperty('offsets');
    expect(rental.offset).toEqual(0);
    expect(rental).toHaveProperty('total');
    expect(rental.total).toEqual(1);
    expect(rental.locadoras.length).toEqual(1);
    const { locadoras } = rental;
    expect(locadoras[0]).toHaveProperty('_id');
    expect(locadoras[0].id).toBeDefined();
    expect(locadoras[0]).toHaveProperty('nome');
    expect(locadoras[0].nome).toBe(tempData[0].nome);
    expect(locadoras[0]).toHaveProperty('cnpj');
    expect(locadoras[0].cnpj).toBe(tempData[0].cnpj);
    expect(locadoras[0]).toHaveProperty('atividades');
    expect(locadoras[0].atividades).toBe(tempData[0].atividades);
    expect(locadoras[0]).toHaveProperty('endereco');
    expect(locadoras[0].endereco).toHaveLength(2);
    locadoras[0].endereco.forEach((endereco: Endereco) => {
      expect(endereco.id).toBeDefined();
      const index = tempData[0].endereco.findIndex(function get(enderecoData) {
        return enderecoData.cep === endereco.cep;
      });
      expect(endereco.cep).toBe(tempData[0].endereco[index].cep);
      expect(endereco.number).toBe(tempData[0].endereco[index].number);
      expect(endereco.isFilial).toBe(tempData[0].endereco[index].isFilial);
      expect(endereco.localidade).toBeDefined();
      expect(endereco).toHaveProperty('bairro');
      expect(endereco).toHaveProperty('localidade');
      expect(endereco).toHaveProperty('uf');
    });
  });

  test('should get all a rental company by uf', async () => {
    await factory.createMany<Rental>('Rental', 5, {
      endereco: [
        {
          cep: '96200-200',
          logradouro: 'Rua General Canabarro',
          complemento: '',
          bairro: 'Centro',
          number: '1234',
          localidade: 'Rio Grande',
          uf: 'SP',
          isFilial: false,
        },
      ],
    });
    await factory.createMany<Rental>('Rental', 5, {
      endereco: [
        {
          cep: '96200-200',
          logradouro: 'Rua General Canabarro',
          complemento: '',
          bairro: 'Centro',
          number: '1234',
          localidade: 'Rio Grande',
          uf: 'RS',
          isFilial: false,
        },
      ],
    });

    const rental = await RentalService.getAll({ uf: 'RS' });

    expect(rental).toHaveProperty('limit');
    expect(rental.limit).toEqual(10);
    expect(rental).toHaveProperty('offset');
    expect(rental.offset).toEqual(0);
    expect(rental).toHaveProperty('offsets');
    expect(rental.offset).toEqual(0);
    expect(rental).toHaveProperty('total');
    expect(rental.total).toEqual(5);
    expect(rental.locadoras.length).toEqual(5);
    rental.locadoras.forEach((locadora: Rental) => {
      locadora.endereco.forEach((endereco: Endereco) => {
        expect(endereco.uf).toBe('RS');
      });
    });
  });

  test('should return nothing if doesnt match a rental company by uf', async () => {
    await factory.createMany<Rental>('Rental', 5);

    const rental = await RentalService.getAll({ uf: 'RS' });

    expect(rental).toHaveProperty('limit');
    expect(rental.limit).toEqual(10);
    expect(rental).toHaveProperty('offset');
    expect(rental.offset).toEqual(0);
    expect(rental).toHaveProperty('offsets');
    expect(rental.offset).toEqual(0);
    expect(rental).toHaveProperty('total');
    expect(rental.total).toEqual(0);
    expect(rental.locadoras.length).toEqual(0);
  });
});
