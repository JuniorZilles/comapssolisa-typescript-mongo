/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const checkDefaultRentalFormat = (body): void => {
  expect(body).toEqual({
    _id: expect.any(String),
    atividades: expect.any(String),
    cnpj: expect.any(String),
    endereco: expect.arrayContaining([
      {
        _id: expect.any(String),
        bairro: expect.any(String),
        cep: expect.any(String),
        complemento: expect.any(String),
        isFilial: expect.any(Boolean),
        localidade: expect.any(String),
        logradouro: expect.any(String),
        number: expect.any(String),
        uf: expect.any(String)
      }
    ]),
    nome: expect.any(String)
  });
};

export const checkDefaultRentalsFormat = (body): void => {
  expect(body).toEqual({
    limit: expect.any(Number),
    locadoras: expect.arrayContaining([
      {
        _id: expect.any(String),
        atividades: expect.any(String),
        cnpj: expect.any(String),
        endereco: expect.arrayContaining([
          {
            _id: expect.any(String),
            bairro: expect.any(String),
            cep: expect.any(String),
            complemento: expect.any(String),
            isFilial: expect.any(Boolean),
            localidade: expect.any(String),
            logradouro: expect.any(String),
            number: expect.any(String),
            uf: expect.any(String)
          }
        ]),
        nome: expect.any(String)
      }
    ]),
    offset: expect.any(Number),
    offsets: expect.any(Number),
    total: expect.any(Number)
  });
};
