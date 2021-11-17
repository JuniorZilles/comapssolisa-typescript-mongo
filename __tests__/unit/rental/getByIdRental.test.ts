import NotFound from '@errors/NotFound';
import { Endereco } from '@interfaces/rental/Endereco';
import { Rental } from '@interfaces/rental/Rental';
import RentalService from '@services/rental';
import factory from '../../utils/factorys/RentalFactory';

describe('src :: api :: services :: rental :: getById', () => {
  test('should get a rental by id', async () => {
    const generated = await factory.create<Rental>('Rental');
    if (generated._id) {
      const rental = await RentalService.getById(generated._id);
      expect(rental).toHaveProperty('_id');
      expect(rental._id).toBeDefined();
      expect(rental).toHaveProperty('nome');
      expect(rental.nome).toBe(generated.nome);
      expect(rental).toHaveProperty('cnpj');
      expect(rental.cnpj).toBe(generated.cnpj);
      expect(rental).toHaveProperty('atividades');
      expect(rental.atividades).toBe(generated.atividades);
      expect(rental).toHaveProperty('endereco');
      expect(rental.endereco).toHaveLength(2);
      rental.endereco.forEach((endereco: Endereco) => {
        expect(endereco._id).toBeDefined();
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

  test('should not get a rental by a nonexistent id and throw a not found', async () => {
    try {
      await RentalService.getById('6171508962f47a7a91938d30');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).description).toBe('Not Found');
      expect((<NotFound>e).name).toBe('Value 6171508962f47a7a91938d30 not found');
    }
  });
});
