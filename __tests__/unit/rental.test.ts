import InvalidValue from '@errors/InvalidValue';
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

  it('should create a rental place with two addresses', async () => {
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

  it('should not have a invalid CNPJ and throw invalid field error', async () => {
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

  it('should not have a duplicated CNPJ and throw invalid value error', async () => {
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

  it('should not have more than one isFilial equals to false and throw invalid value error', async () => {
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

  /**
   * GET BY ID
   */

  /**
   * DELETE BY ID
   */

  /**
   * UPDATE BY ID
   */

  /**
   * GET LIST
   */
});
