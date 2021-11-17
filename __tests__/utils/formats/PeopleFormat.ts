/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const checkDefaultPersonFormat = (body): void => {
  expect(body).toEqual({
    _id: expect.any(String),
    cpf: expect.any(String),
    nome: expect.any(String),
    data_nascimento: expect.any(String),
    email: expect.any(String),
    habilitado: expect.any(String)
  });
};

export const checkDefaultPeopleFormat = (body): void => {
  expect(body).toEqual({
    pessoas: expect.arrayContaining([
      {
        _id: expect.any(String),
        cpf: expect.any(String),
        nome: expect.any(String),
        data_nascimento: expect.any(String),
        email: expect.any(String),
        habilitado: expect.any(String)
      }
    ]),
    total: expect.any(Number),
    limit: expect.any(Number),
    offset: expect.any(Number),
    offsets: expect.any(Number)
  });
};
