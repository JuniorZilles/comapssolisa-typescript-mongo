/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const checkDefaultCarFormat = (body): void => {
  expect(body).toEqual({
    _id: expect.any(String),
    acessorios: expect.arrayContaining([
      {
        _id: expect.any(String),
        descricao: expect.any(String)
      }
    ]),
    ano: expect.any(Number),
    modelo: expect.any(String),
    cor: expect.any(String),
    quantidadePassageiros: expect.any(Number)
  });
};

export const checkDefaultVehiclesFormat = (body): void => {
  expect(body).toEqual({
    veiculos: expect.arrayContaining([
      {
        _id: expect.any(String),
        acessorios: expect.arrayContaining([
          {
            _id: expect.any(String),
            descricao: expect.any(String)
          }
        ]),
        modelo: expect.any(String),
        cor: expect.any(String),
        quantidadePassageiros: expect.any(Number),
        ano: expect.any(Number)
      }
    ]),
    total: expect.any(Number),
    limit: expect.any(Number),
    offset: expect.any(Number),
    offsets: expect.any(Number)
  });
};
