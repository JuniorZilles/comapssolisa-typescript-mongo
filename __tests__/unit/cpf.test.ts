import validateCPF from '@utils/CpfValidation';

describe('src :: api :: services :: cpf', () => {
  test('should return true for a valid cpf', async () => {
    const isValid = validateCPF('530.533.730-50');
    expect(isValid).toBe(true);
  });

  test('should not pass verification of invalid cpf', async () => {
    const isValid = validateCPF('123.456.789-10');
    expect(isValid).toBe(false);
  });
});
