import validateCPF from '@services/CpfService';

describe('src :: api :: services :: cpf', () => {
  it('should return true for a valid cpf', async () => {
    const isValid = validateCPF('967.056.960-52');
    expect(isValid).toBe(true);
  });

  it('should not pass verification of invalid cpf', async () => {
    const isValid = validateCPF('123.456.789-10');
    expect(isValid).toBe(false);
  });
});
