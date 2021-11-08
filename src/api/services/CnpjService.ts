const validateCNPJ = (cnpj: string): boolean => {
  const cnpjClean = cnpj.replace(/[.\-/]/g, '');
  if (cnpjClean.length !== 14) {
    return false;
  }
  const cnpjSplited = cnpjClean.split('');
  let somaDigito12 = 0;
  let somaDigito13 = 0;
  let multiplicador12 = 6;
  let multiplicador13 = 5;
  for (let i = 0; i < 13; i += 1) {
    if (multiplicador12 < 10 && i < 12) {
      somaDigito12 += parseInt(cnpjSplited[i], 10) * multiplicador12;
    }
    if (multiplicador13 < 10) {
      somaDigito13 += parseInt(cnpjSplited[i], 10) * multiplicador13;
    }
    multiplicador13 += 1;
    multiplicador12 += 1;
    if (multiplicador12 >= 10) {
      multiplicador12 = 2;
    }
    if (multiplicador13 >= 10) {
      multiplicador13 = 2;
    }
  }
  let restoDigito12 = somaDigito12 % 11;
  let restoDigito13 = somaDigito13 % 11;
  if (restoDigito12 === 10) {
    restoDigito12 = 0;
  }
  if (restoDigito13 === 10) {
    restoDigito13 = 0;
  }
  if (restoDigito12 === parseInt(cnpjSplited[12], 10) && restoDigito13 === parseInt(cnpjSplited[13], 10)) {
    return true;
  }
  return false;
};

export default validateCNPJ;
