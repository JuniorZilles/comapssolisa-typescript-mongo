import validateCNPJ from '@services/CnpjService';

describe('src :: api :: services :: cnpj', () => {
  it('should return true for a valid cnpj', async () => {
    const isValid = validateCNPJ('07.508.188/0001-22');
    expect(isValid).toBe(true);
  });

  it('should not pass verification of invalid cnpj', async () => {
    const isValid = validateCNPJ('16.670.085/0001-52');
    expect(isValid).toBe(false);
  });
});
