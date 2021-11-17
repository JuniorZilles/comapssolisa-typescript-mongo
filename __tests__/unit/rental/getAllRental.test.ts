import { Endereco } from '@interfaces/Endereco';
import { Rental } from '@interfaces/Rental';
import RentalService from '@services/RentalService';
import factory from '../../utils/factorys/RentalFactory';

describe('src :: api :: services :: rental :: getAll', () => {
  test('should get 10 paginated rental companies', async () => {
    await factory.createMany<Rental>('Rental', 25);
    const rentalP0 = await RentalService.getAll({ offset: '0', limit: '5' });

    expect(rentalP0.docs.length).toEqual(5);
    expect(rentalP0.offset).toEqual(1);
    expect(rentalP0.limit).toEqual(5);
    expect(rentalP0.total).toEqual(25);
    expect(rentalP0.offsets).toEqual(5);

    const rentalP1 = await RentalService.getAll({ offset: '1', limit: '5' });
    expect(rentalP1.docs.length).toEqual(5);
    expect(rentalP1.offset).toEqual(1);
    expect(rentalP1.limit).toEqual(5);
    expect(rentalP1.total).toEqual(25);
    expect(rentalP1.offsets).toEqual(5);
  });

  test('should get a rental company by cnpj', async () => {
    const tempData = await factory.createMany<Rental>('Rental', 5);
    const rental = await RentalService.getAll({ cnpj: tempData[0].cnpj });

    expect(rental).toHaveProperty('limit');
    expect(rental.limit).toEqual(100);
    expect(rental).toHaveProperty('offset');
    expect(rental.offset).toEqual(1);
    expect(rental).toHaveProperty('offsets');
    expect(rental.offsets).toEqual(1);
    expect(rental).toHaveProperty('total');
    expect(rental.total).toEqual(1);
    expect(rental.docs.length).toEqual(1);
    const { docs } = rental;
    expect(docs[0]).toHaveProperty('_id');
    expect(docs[0]._id).toBeDefined();
    expect(docs[0]).toHaveProperty('nome');
    expect(docs[0].nome).toBe(tempData[0].nome);
    expect(docs[0]).toHaveProperty('cnpj');
    expect(docs[0].cnpj).toBe(tempData[0].cnpj);
    expect(docs[0]).toHaveProperty('atividades');
    expect(docs[0].atividades).toBe(tempData[0].atividades);
    expect(docs[0]).toHaveProperty('endereco');
    expect(docs[0].endereco).toHaveLength(2);
    docs[0].endereco.forEach((endereco: Endereco) => {
      expect(endereco._id).toBeDefined();
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
          isFilial: false
        }
      ]
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
          isFilial: false
        }
      ]
    });

    const rental = await RentalService.getAll({ uf: 'RS' });

    expect(rental).toHaveProperty('limit');
    expect(rental.limit).toEqual(100);
    expect(rental).toHaveProperty('offset');
    expect(rental.offset).toEqual(1);
    expect(rental).toHaveProperty('offsets');
    expect(rental.offsets).toEqual(1);
    expect(rental).toHaveProperty('total');
    expect(rental.total).toEqual(5);
    expect(rental.docs.length).toEqual(5);
    rental.docs.forEach((locadora: Rental) => {
      locadora.endereco.forEach((endereco: Endereco) => {
        expect(endereco.uf).toBe('RS');
      });
    });
  });

  test('should return nothing if doesnt match a rental company by uf', async () => {
    await factory.createMany<Rental>('Rental', 5);

    const rental = await RentalService.getAll({ uf: 'RS' });

    expect(rental).toHaveProperty('limit');
    expect(rental.limit).toEqual(100);
    expect(rental).toHaveProperty('offset');
    expect(rental.offset).toEqual(1);
    expect(rental).toHaveProperty('offsets');
    expect(rental.offsets).toEqual(1);
    expect(rental).toHaveProperty('total');
    expect(rental.total).toEqual(0);
    expect(rental.docs.length).toEqual(0);
  });
});
