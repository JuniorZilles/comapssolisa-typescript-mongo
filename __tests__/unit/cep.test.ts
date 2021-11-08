import NotFound from '@errors/NotFound';
import getCEP from '@services/CepService';

describe('src :: api :: services :: cep', () => {
  test('should return CEP info', async () => {
    const cepInfo = await getCEP('96200-200');
    expect(cepInfo.cep).toBe('96200-200');
    expect(cepInfo.logradouro).toBe('Rua General Canabarro');
    expect(cepInfo.complemento).toBe('');
    expect(cepInfo.bairro).toBe('Centro');
    expect(cepInfo.localidade).toBe('Rio Grande');
    expect(cepInfo.uf).toBe('RS');
  });

  test('should return not found error', async () => {
    try {
      await getCEP('93950-001');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFound);
      expect((<NotFound>e).name).toBe('Value CEP 93950-001 not found');
    }
  });
});
