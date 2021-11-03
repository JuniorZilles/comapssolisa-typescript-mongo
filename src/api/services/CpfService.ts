const validateCPF = (cpf: string): boolean => {
  const cpfClean = cpf.replace(/[.-]/g, '');
  const cpfSplited = cpfClean.split('');
  let somaDigito10 = 0;
  let somaDigito11 = 0;
  let multiplicador = 10;
  for (let i = 0; i < 10; i += 1) {
    if (multiplicador >= 2) {
      somaDigito10 += parseInt(cpfSplited[i], 10) * multiplicador;
    }
    somaDigito11 += parseInt(cpfSplited[i], 10) * (multiplicador + 1);
    multiplicador -= 1;
  }
  let restoDigito10 = (somaDigito10 * 10) % 11;
  let restoDigito11 = (somaDigito11 * 10) % 11;
  if (restoDigito10 === 10 || restoDigito11 === 10) {
    restoDigito10 = 0;
    restoDigito11 = 0;
  }
  if (
    restoDigito10 === parseInt(cpfSplited[9], 10) &&
    restoDigito11 === parseInt(cpfSplited[10], 10)
  ) {
    return true;
  }
  return false;
};

export default validateCPF;
