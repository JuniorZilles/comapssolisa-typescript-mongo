import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { Endereco } from '@interfaces/rental/Endereco';
import { Rental } from '@interfaces/rental/Rental';
import RentalService from '@services/rental';
import { RENTALDATA } from '../../utils/Constants';
import factory from '../../utils/factorys/RentalFactory';

describe('src :: api :: services :: rental :: create', () => {
  test('should create a rental place with two addresses', async () => {
    const rental = await RentalService.create(RENTALDATA);

    expect(rental).toHaveProperty('_id');
    expect(rental._id).toBeDefined();
    expect(rental).toHaveProperty('nome');
    expect(rental.nome).toBe(RENTALDATA.nome);
    expect(rental).toHaveProperty('cnpj');
    expect(rental.cnpj).toBe(RENTALDATA.cnpj);
    expect(rental).toHaveProperty('atividades');
    expect(rental.atividades).toBe(RENTALDATA.atividades);
    expect(rental).toHaveProperty('endereco');
    expect(rental.endereco).toHaveLength(2);
    rental.endereco.forEach((endereco: Endereco) => {
      expect(endereco._id).toBeDefined();
      const index = RENTALDATA.endereco.findIndex(function get(enderecoData) {
        return enderecoData.cep === endereco.cep;
      });
      expect(endereco.cep).toBe(RENTALDATA.endereco[index].cep);
      expect(endereco.number).toBe(RENTALDATA.endereco[index].number);
      expect(endereco.isFilial).toBe(RENTALDATA.endereco[index].isFilial);
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
          isFilial: false
        }
      ]
    };
    try {
      await RentalService.create(rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).message).toBe('CNPJ 16.670.085/0001-57 is invalid');
    }
  });

  test('should not have a duplicated CNPJ and throw invalid value error', async () => {
    const rentalAuto = await factory.create<Rental>('Rental', {
      cnpj: '08.450.508/0001-01'
    });
    const rentalTemp = {
      nome: 'Localiza Rent a Car',
      cnpj: rentalAuto.cnpj,
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false
        }
      ]
    };
    try {
      await RentalService.create(rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Conflict');
      expect((<InvalidValue>e).message).toBe('CNPJ 08.450.508/0001-01 already in use');
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
          isFilial: false
        },
        {
          cep: '93950-000',
          number: '61',
          isFilial: false
        }
      ]
    };
    try {
      await RentalService.create(rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValue);
      expect((<InvalidValue>e).description).toBe('Bad Request');
      expect((<InvalidValue>e).name).toBe('isFilial has more than one headquarters');
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
          isFilial: false
        },
        {
          cep: '93950-999',
          number: '61',
          isFilial: true
        }
      ]
    };
    try {
      await RentalService.create(rentalTemp);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value CEP 93950-999 not found');
    }
  });
});
